import { spawn } from "node:child_process"
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { AgentFactoryQueueItemSchema, AgentFactoryQueueSchema, type AgentFactoryQueueItem } from "@/lib/agent-factory/queue"
import { readJsonFile, withFileLock, writeJsonFile } from "@/lib/agent-factory/storage"

type Incident = {
  kind: "worker_error" | "worker_exit"
  worker_id: string
  pid: number | null
  started_at: string
  ended_at: string
  exit_code: number | null
  signal: string | null
  error?: { message: string } | null
  log_path: string
}

type State = {
  last_seen_incident_path: string | null
  incident_count: number
  last_remediation_at: string | null
}

function nowIso() {
  return new Date().toISOString()
}

function safeId(input: string) {
  const compact = input
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/(^_|_$)/g, "")
  return compact.slice(0, 60) || "AUTO_FIX"
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fileExists(p: string) {
  try {
    const { stat } = await import("node:fs/promises")
    await stat(p)
    return true
  } catch {
    return false
  }
}

async function readJson<T>(p: string): Promise<T | null> {
  try {
    const raw = await readFile(p, "utf8")
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

async function writeJson(p: string, v: unknown) {
  await mkdir(path.dirname(p), { recursive: true })
  await writeFile(p, `${JSON.stringify(v, null, 2)}\n`, "utf8")
}

async function spawnAndWait(cmd: string, argv: string[], cwd: string) {
  return await new Promise<number>((resolve) => {
    const child = spawn(cmd, argv, { cwd, stdio: "inherit", shell: false })
    child.on("close", (c) => resolve(c ?? 1))
  })
}

async function listIncidentFiles(root: string) {
  const dir = path.join(root, "agents", "factory-logs", "swarm-incidents")
  if (!(await fileExists(dir))) return []
  const entries = await readdir(dir)
  const full = entries
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dir, f))
    .sort()
  return full
}

async function readLastIncident(root: string): Promise<{ path: string; incident: Incident } | null> {
  const files = await listIncidentFiles(root)
  const last = files.at(-1)
  if (!last) return null
  const incident = await readJson<Incident>(last)
  if (!incident) return null
  return { path: last, incident }
}

function toQueueItem(input: { id: string; title: string; priority: number; spec: unknown }): AgentFactoryQueueItem {
  const ts = nowIso()
  return AgentFactoryQueueItemSchema.parse({
    id: input.id,
    title: input.title,
    spec: input.spec,
    status: "queued",
    priority: input.priority,
    created_at: ts,
    updated_at: ts,
    claimed_by: null,
    claimed_at: null,
  })
}

async function enqueueMaintenance(args: { root: string; incidentPath: string; incident: Incident }) {
  const { root, incidentPath, incident } = args
  const queuePath = path.join(root, "agents", "factory-queue.json")

  const base = path.basename(incidentPath).replace(/\.json$/i, "")
  const id = safeId(`AUTO_MAINT_${base}`)
  const title = `Auto-maintenance for incident: ${path.basename(incidentPath)}`

  const command = `pnpm -s factory:maintenance ${JSON.stringify(incidentPath)}`
  const spec = {
    kind: "auto_maintenance",
    source_incident_path: incidentPath,
    incident: {
      kind: incident.kind,
      worker_id: incident.worker_id,
      exit_code: incident.exit_code,
      ended_at: incident.ended_at,
      log_path: incident.log_path,
    },
    command,
  }

  await withFileLock({
    lockPath: `${queuePath}.lock`,
    workerId: "issue-swarm",
    fn: async () => {
      const queue = await readJsonFile(queuePath, AgentFactoryQueueSchema)
      const existing = queue.items.find((i) => i.id === id)
      if (existing && existing.status !== "cancelled") return

      const item = toQueueItem({ id, title, priority: 999, spec })
      const nextQueue = AgentFactoryQueueSchema.parse({ ...queue, items: [item, ...queue.items] })
      await writeJsonFile(queuePath, nextQueue)
    },
  })

  const outDir = path.join(root, "agents", "factory-logs", "issue-swarm")
  await mkdir(outDir, { recursive: true })
  const outPath = path.join(outDir, `${nowIso().replace(/[:.]/g, "-")}.enqueued.json`)
  await writeFile(outPath, `${JSON.stringify({ enqueued_item_id: id, incident_path: incidentPath, title }, null, 2)}\n`, "utf8")
}

async function main() {
  const root = process.cwd()
  const intervalMs = Number(process.env.FACTORY_ISSUE_SWARM_INTERVAL_MS ?? "5000")
  const statePath = path.join(root, "agents", "factory-issue-swarm-state.json")

  const state: State =
    (await readJson<State>(statePath)) ?? { last_seen_incident_path: null, incident_count: 0, last_remediation_at: null }

  console.log(`factory:issue-swarm: watching incidents (interval=${intervalMs}ms)`)

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const last = await readLastIncident(root)
    if (last && last.path !== state.last_seen_incident_path) {
      state.last_seen_incident_path = last.path
      state.incident_count += 1
      state.last_remediation_at = nowIso()
      await writeJson(statePath, state)

      console.warn(`factory:issue-swarm: new incident -> enqueuing maintenance: ${path.basename(last.path)}`)
      await enqueueMaintenance({ root, incidentPath: last.path, incident: last.incident })
    }

    await sleep(intervalMs)
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

