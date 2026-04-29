import { spawn } from "node:child_process"
import { chmod, mkdir, readFile, readdir, writeFile } from "node:fs/promises"
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
  recent_incident_ended_at: string[]
  last_stabilize_at: string | null
  last_class_heal_at: Record<string, string>
}

function parseIsoMs(iso: string | null | undefined) {
  if (!iso) return null
  const ms = Date.parse(iso)
  return Number.isFinite(ms) ? ms : null
}

function formatAge(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h${m % 60}m`
  if (m > 0) return `${m}m${s % 60}s`
  return `${s}s`
}

function nowIso() {
  return new Date().toISOString()
}

function parseMs(value: string | undefined, fallbackMs: number) {
  const n = Number(value ?? "")
  return Number.isFinite(n) && n >= 0 ? n : fallbackMs
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

async function ensureTsxShim(root: string) {
  const shimPath = path.join(root, "node_modules", ".bin", "tsx")
  if (await fileExists(shimPath)) return { ok: true as const, changed: false as const }

  const pnpmDir = path.join(root, "node_modules", ".pnpm")
  if (!(await fileExists(pnpmDir))) return { ok: false as const, reason: "missing node_modules/.pnpm" }

  const entries = await readdir(pnpmDir)
  const candidates = entries.filter((e) => e.startsWith("tsx@")).sort()
  const latest = candidates.at(-1)
  if (!latest) return { ok: false as const, reason: "missing tsx@* in node_modules/.pnpm" }

  const cliPath = path.join(pnpmDir, latest, "node_modules", "tsx", "dist", "cli.mjs")
  if (!(await fileExists(cliPath))) return { ok: false as const, reason: `missing ${cliPath}` }

  await mkdir(path.dirname(shimPath), { recursive: true })
  const shim = `#!/usr/bin/env bash
set -euo pipefail
node "${cliPath}" "$@"
`
  await writeFile(shimPath, shim, "utf8")
  await chmod(shimPath, 0o755)
  return { ok: true as const, changed: true as const, cliPath }
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

async function readIncidentLogText(incident: Incident) {
  const logPath = incident.log_path
  if (!logPath) return ""
  try {
    return await readFile(logPath, "utf8")
  } catch {
    return ""
  }
}

function classifyIncident(args: { incidentPath: string; incident: Incident; logText: string }) {
  const base = path.basename(args.incidentPath)
  const log = args.logText

  if (/tsx:\s*command\s+not\s+found/i.test(log)) {
    return { classKey: "missing_tsx", priority: 1000, title: `Auto-heal: missing tsx (${base})`, command: "pnpm -s factory:stabilize" }
  }
  if (/uv_cwd|process\.cwd\s+failed/i.test(log)) {
    return { classKey: "cwd_removed", priority: 950, title: `Auto-heal: worker cwd removed (${base})`, command: "pnpm -s factory:stabilize" }
  }
  if (/locked working tree|cannot remove a locked working tree/i.test(log)) {
    return { classKey: "worktree_locked", priority: 900, title: `Auto-heal: locked worktree (${base})`, command: "pnpm -s factory:stabilize" }
  }
  if (/Directory not empty|ENOTEMPTY/i.test(log)) {
    return { classKey: "worktree_not_empty", priority: 850, title: `Auto-heal: worktree cleanup failed (${base})`, command: "pnpm -s factory:stabilize" }
  }

  // Default path: enqueue the normal maintenance workflow for this specific incident.
  return {
    classKey: "generic_incident",
    priority: 700,
    title: `Auto-maintenance for incident: ${base}`,
    command: `pnpm -s factory:maintenance ${JSON.stringify(args.incidentPath)}`,
  }
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

async function enqueueHealJob(args: {
  root: string
  id: string
  title: string
  priority: number
  spec: unknown
  maxQueuedAutoHeal: number
}) {
  const { root, id, title, priority, spec, maxQueuedAutoHeal } = args
  const queuePath = path.join(root, "agents", "factory-queue.json")

  await withFileLock({
    lockPath: `${queuePath}.lock`,
    workerId: "issue-swarm",
    fn: async () => {
      const queue = await readJsonFile(queuePath, AgentFactoryQueueSchema)
      const existing = queue.items.find((i) => i.id === id)
      if (existing && existing.status !== "cancelled") return

      const item = toQueueItem({ id, title, priority, spec })
      let nextItems = [item, ...queue.items]

      // Cap queued auto-heal items to avoid incident storms starving real work.
      const queuedAuto = nextItems.filter(
        (it) => it.status === "queued" && typeof it.spec === "object" && it.spec !== null && (it.spec as { kind?: unknown }).kind === "auto_heal"
      )
      if (queuedAuto.length > maxQueuedAutoHeal) {
        const toCancel = queuedAuto
          .slice()
          .sort((a, b) => a.created_at.localeCompare(b.created_at))
          .slice(0, queuedAuto.length - maxQueuedAutoHeal)
          .map((it) => it.id)
        nextItems = nextItems.map((it) => {
          if (!toCancel.includes(it.id)) return it
          return { ...it, status: "cancelled" as const, updated_at: nowIso() }
        })
      }

      const nextQueue = AgentFactoryQueueSchema.parse({ ...queue, items: nextItems })
      await writeJsonFile(queuePath, nextQueue)
    },
  })
}

async function main() {
  const root = process.cwd()
  const intervalMs = Number(process.env.FACTORY_ISSUE_SWARM_INTERVAL_MS ?? "5000")
  const statusIntervalMs = Number(process.env.FACTORY_ISSUE_SWARM_STATUS_INTERVAL_MS ?? "60000")
  const healCooldownMs = parseMs(process.env.FACTORY_ISSUE_SWARM_HEAL_COOLDOWN_MS, 10 * 60 * 1000)
  const circuitWindowMs = parseMs(process.env.FACTORY_ISSUE_SWARM_CIRCUIT_WINDOW_MS, 2 * 60 * 1000)
  const circuitTripCount = Math.floor(Number(process.env.FACTORY_ISSUE_SWARM_CIRCUIT_TRIP_COUNT ?? "5"))
  const stabilizeCooldownMs = parseMs(process.env.FACTORY_ISSUE_SWARM_STABILIZE_COOLDOWN_MS, 15 * 60 * 1000)
  const maxQueuedAutoHeal = Math.floor(Number(process.env.FACTORY_ISSUE_SWARM_MAX_QUEUED_AUTO_HEAL ?? "5"))
  const statePath = path.join(root, "agents", "factory-issue-swarm-state.json")
  const queuePath = path.join(root, "agents", "factory-queue.json")

  const rawState = await readJson<State>(statePath)
  const state: State = {
    last_seen_incident_path: rawState?.last_seen_incident_path ?? null,
    incident_count: typeof rawState?.incident_count === "number" ? rawState.incident_count : 0,
    last_remediation_at: rawState?.last_remediation_at ?? null,
    recent_incident_ended_at: Array.isArray(rawState?.recent_incident_ended_at)
      ? rawState.recent_incident_ended_at.filter((v): v is string => typeof v === "string")
      : [],
    last_stabilize_at: rawState?.last_stabilize_at ?? null,
    last_class_heal_at:
      rawState?.last_class_heal_at && typeof rawState.last_class_heal_at === "object"
        ? (rawState.last_class_heal_at as Record<string, string>)
        : {},
  }

  console.log(`factory:issue-swarm: watching incidents (interval=${intervalMs}ms)`)
  console.log(`factory:issue-swarm: queue status checks every ${statusIntervalMs}ms`)

  let lastStatusAt = 0

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const now = Date.now()

    const tsxHeal = await ensureTsxShim(root)
    if (tsxHeal.ok && tsxHeal.changed) {
      console.warn(`factory:issue-swarm: auto-heal: restored tsx shim (node_modules/.bin/tsx)`)
    }

    const last = await readLastIncident(root)
    if (last && last.path !== state.last_seen_incident_path) {
      state.last_seen_incident_path = last.path
      state.incident_count += 1
      state.last_remediation_at = nowIso()
      await writeJson(statePath, state)

      const endedAtMs = parseIsoMs(last.incident.ended_at) ?? now
      state.recent_incident_ended_at = [...state.recent_incident_ended_at, new Date(endedAtMs).toISOString()].filter((iso) => {
        const t = parseIsoMs(iso)
        return t !== null && now - t <= circuitWindowMs
      })

      const logText = await readIncidentLogText(last.incident)
      const cls = classifyIncident({ incidentPath: last.path, incident: last.incident, logText })
      const lastHealAt = parseIsoMs(state.last_class_heal_at[cls.classKey]) ?? 0
      const canHealClass = now - lastHealAt >= healCooldownMs

      const recentCount = state.recent_incident_ended_at.length
      const tripped = Number.isFinite(circuitTripCount) && circuitTripCount > 0 && recentCount >= circuitTripCount
      const lastStabilizeMs = parseIsoMs(state.last_stabilize_at) ?? 0
      const canStabilize = now - lastStabilizeMs >= stabilizeCooldownMs

      if (tripped && canStabilize) {
        const id = safeId(`FACTORY_STABILIZE_${nowIso()}`)
        const title = `Factory stabilize (circuit breaker: ${recentCount} incidents/${Math.round(circuitWindowMs / 1000)}s)`
        const spec = { kind: "auto_heal", class_key: "circuit_breaker", command: "pnpm -s factory:stabilize", window_ms: circuitWindowMs, incident_count: recentCount }
        console.warn(`factory:issue-swarm: circuit breaker tripped (${recentCount} incidents) -> enqueuing factory:stabilize`)
        await enqueueHealJob({ root, id, title, priority: 1100, spec, maxQueuedAutoHeal })
        state.last_stabilize_at = nowIso()
        state.last_class_heal_at["circuit_breaker"] = nowIso()
        await writeJson(statePath, state)
      } else if (canHealClass) {
        const base = path.basename(last.path).replace(/\.json$/i, "")
        const id = safeId(`AUTO_HEAL_${cls.classKey}_${base}`)
        const spec = {
          kind: "auto_heal",
          class_key: cls.classKey,
          source_incident_path: last.path,
          incident: {
            kind: last.incident.kind,
            worker_id: last.incident.worker_id,
            exit_code: last.incident.exit_code,
            ended_at: last.incident.ended_at,
            log_path: last.incident.log_path,
          },
          command: cls.command,
        }

        console.warn(`factory:issue-swarm: new incident -> enqueue heal (${cls.classKey}): ${path.basename(last.path)}`)
        await enqueueHealJob({ root, id, title: cls.title, priority: cls.priority, spec, maxQueuedAutoHeal })
        state.last_class_heal_at[cls.classKey] = nowIso()
        await writeJson(statePath, state)
      } else {
        console.warn(`factory:issue-swarm: new incident -> suppressed (cooldown) class=${cls.classKey}: ${path.basename(last.path)}`)
      }
    }

    if (now - lastStatusAt >= statusIntervalMs) {
      lastStatusAt = now
      try {
        const queue = await readJsonFile(queuePath, AgentFactoryQueueSchema)
        const counts = queue.items.reduce(
          (acc, it) => {
            acc[it.status] = (acc[it.status] ?? 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )

        const staleInProgress = queue.items
          .filter((it) => it.status === "in_progress")
          .map((it) => {
            const updatedAt = parseIsoMs(it.updated_at) ?? parseIsoMs(it.claimed_at) ?? parseIsoMs(it.created_at) ?? now
            return { it, updatedAt }
          })
          .sort((a, b) => a.updatedAt - b.updatedAt)

        const oldest = staleInProgress.at(0)
        const oldestAge = oldest ? formatAge(now - oldest.updatedAt) : null

        const queued = queue.items.filter((it) => it.status === "queued").slice(0, 5)
        const queuedSummary = queued.map((it) => it.id).join(", ")

        console.log(
          [
            `factory:issue-swarm: queue status`,
            `queued=${counts.queued ?? 0}`,
            `in_progress=${counts.in_progress ?? 0}`,
            `failed=${counts.failed ?? 0}`,
            `done=${counts.done ?? 0}`,
            `cancelled=${counts.cancelled ?? 0}`,
            oldestAge ? `oldest_in_progress=${oldestAge} (${oldest?.it.id})` : null,
            queued.length > 0 ? `next_queued=[${queuedSummary}]` : null,
          ]
            .filter(Boolean)
            .join(" · "),
        )
      } catch (err) {
        console.warn(`factory:issue-swarm: queue status check failed: ${(err as Error).message}`)
      }
    }

    await sleep(intervalMs)
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

