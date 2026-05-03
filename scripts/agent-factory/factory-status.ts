import { spawn } from "node:child_process"
import { readdir, readFile, stat } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { AgentFactoryQueueSchema, AgentFactoryRunsFileSchema } from "@/lib/agent-factory/queue"
import { readJsonFile } from "@/lib/agent-factory/storage"

function nowIso() {
  return new Date().toISOString()
}

function parseMs(value: string | undefined, fallbackMs: number) {
  const raw = (value ?? "").trim()
  if (raw === "") return fallbackMs
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? n : fallbackMs
}

function envTruthy(key: string) {
  const v = (process.env[key] ?? "").trim().toLowerCase()
  return v === "1" || v === "true" || v === "yes"
}

async function fileExists(p: string) {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function formatAge(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h${m % 60}m`
  if (m > 0) return `${m}m${s % 60}s`
  return `${s}s`
}

function progressFingerprint(queue: { items: { id: string; status: string; updated_at: string }[] }, runs: { run_id: string; status: string; started_at: string }[]) {
  const q = queue.items
    .map((i) => `${i.id}:${i.status}:${i.updated_at}`)
    .slice()
    .sort()
    .join("\n")
  const r = runs
    .filter((x) => x.status === "started")
    .map((x) => `${x.run_id}:${x.started_at}`)
    .slice()
    .sort()
    .join("\n")
  return `${q}\n---\n${r}`
}

function statusCounts(items: { status: string }[]) {
  return items.reduce(
    (acc, it) => {
      acc[it.status] = (acc[it.status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
}

function asciiBars(counts: Record<string, number>, width: number) {
  const entries = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
  const total = entries.reduce((s, [, n]) => s + n, 0)
  if (total <= 0) return "  (empty queue)"
  const lines: string[] = []
  const labelW = 12
  for (const [label, count] of entries) {
    const filled = total > 0 ? Math.max(1, Math.round((width * count) / total)) : 0
    const bar = "#".repeat(filled) + ".".repeat(Math.max(0, width - filled))
    lines.push(`${label.padEnd(labelW)} |${bar}| ${count}`)
  }
  return lines.join("\n")
}

async function readRoadmapSeq(root: string): Promise<number | null> {
  const p = path.join(root, "agents", "factory-roadmap-meta.json")
  try {
    const raw = JSON.parse(await readFile(p, "utf8")) as { seq?: unknown }
    return typeof raw.seq === "number" ? raw.seq : null
  } catch {
    return null
  }
}

async function healthReport(root: string) {
  const incidentsDir = path.join(root, "agents", "factory-logs", "swarm-incidents")
  let incidentCount = 0
  let newestIncident: string | null = null
  if (await fileExists(incidentsDir)) {
    const files = (await readdir(incidentsDir)).filter((f) => f.endsWith(".json")).sort()
    incidentCount = files.length
    newestIncident = files.length > 0 ? (files.at(-1) ?? null) : null
  }

  const tsxPath = path.join(root, "node_modules", ".bin", "tsx")
  const tsxOk = await fileExists(tsxPath)

  const queueLock = path.join(root, "agents", "factory-queue.json.lock")
  const runsLock = path.join(root, "agents", "factory-runs.json.lock")
  const queueLockAge = (await fileExists(queueLock)) ? formatAge(Date.now() - (await stat(queueLock)).mtimeMs) : null
  const runsLockAge = (await fileExists(runsLock)) ? formatAge(Date.now() - (await stat(runsLock)).mtimeMs) : null

  console.warn("factory:status: health — no queue/run progress since last tick")
  console.warn(`factory:status: health · swarm incidents (json files)=${incidentCount}${newestIncident ? ` · newest=${newestIncident}` : ""}`)
  console.warn(`factory:status: health · node_modules/.bin/tsx ${tsxOk ? "ok" : "MISSING"}`)
  if (queueLockAge) console.warn(`factory:status: health · factory-queue.json.lock present (age ${queueLockAge})`)
  if (runsLockAge) console.warn(`factory:status: health · factory-runs.json.lock present (age ${runsLockAge})`)
  console.warn("factory:status: health · if workers are dead: pnpm factory:reclaim  ·  deeper repair: pnpm factory:stabilize")
}

function runReclaim(root: string): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn("pnpm", ["-s", "factory:reclaim"], { cwd: root, stdio: "inherit", shell: false })
    child.on("error", () => resolve(1))
    child.on("exit", (code) => resolve(code ?? 1))
  })
}

async function tick(args: { root: string; prevFingerprint: string | null; stallReclaim: boolean }): Promise<string | null> {
  const queuePath = path.join(args.root, "agents", "factory-queue.json")
  const runsPath = path.join(args.root, "agents", "factory-runs.json")

  const queue = await readJsonFile(queuePath, AgentFactoryQueueSchema)
  const runsFile = await readJsonFile(runsPath, AgentFactoryRunsFileSchema)
  const fp = progressFingerprint(queue, runsFile.runs)

  const counts = statusCounts(queue.items)
  const startedRuns = runsFile.runs.filter((r) => r.status === "started")
  const roadmapSeq = await readRoadmapSeq(args.root)

  const total = queue.items.length
  const activeWork =
    (counts.queued ?? 0) > 0 ||
    (counts.in_progress ?? 0) > 0 ||
    (counts.blocked ?? 0) > 0 ||
    (counts.failed ?? 0) > 0 ||
    startedRuns.length > 0

  console.log(`factory:status: ${nowIso()} · roadmap seq=${roadmapSeq ?? "?"} · queue items=${total} · runs started=${startedRuns.length}`)
  console.log(asciiBars(counts, 28))

  if (startedRuns.length > 0) {
    const now = Date.now()
    const oldest = startedRuns
      .map((r) => ({ r, t: Date.parse(r.started_at) }))
      .filter((x) => Number.isFinite(x.t))
      .sort((a, b) => a.t - b.t)[0]
    if (oldest) {
      console.log(`factory:status: oldest active run age=${formatAge(now - oldest.t)} · ${oldest.r.item_id} · ${oldest.r.worker_id ?? "?"}`)
    }
  }

  const stalled = args.prevFingerprint !== null && fp === args.prevFingerprint && activeWork
  if (stalled) {
    await healthReport(args.root)
    if (args.stallReclaim) {
      console.warn("factory:status: running pnpm factory:reclaim (FACTORY_STATUS_STALL_RECLAIM=1)")
      const code = await runReclaim(args.root)
      if (code !== 0) console.warn(`factory:status: reclaim exited ${code}`)
    }
  }

  return fp
}

async function main() {
  const root = process.cwd()
  const intervalMs = parseMs(process.env.FACTORY_STATUS_INTERVAL_MS, 30_000)
  const once = process.argv.includes("--once") || envTruthy("FACTORY_STATUS_ONCE")
  const stallReclaim = envTruthy("FACTORY_STATUS_STALL_RECLAIM")

  console.log(
    `factory:status: interval=${intervalMs}ms${once ? " (single tick)" : ""} · stall reclaim=${stallReclaim ? "on" : "off"} (set FACTORY_STATUS_STALL_RECLAIM=1 to auto-reclaim when stalled)`,
  )

  let prev: string | null = null
  let stopping = false

  const shutdown = () => {
    stopping = true
    console.log("factory:status: shutting down")
  }
  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)

  while (!stopping) {
    try {
      prev = await tick({ root, prevFingerprint: prev, stallReclaim })
    } catch (err) {
      console.error(`factory:status: tick failed: ${(err as Error).message}`)
    }
    if (once || stopping) break
    await sleep(intervalMs)
  }
}

main().catch((err) => {
  console.error("factory:status failed:", err)
  process.exitCode = 1
})
