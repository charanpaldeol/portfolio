import { appendFile, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { FactoryGoalMetaSchema } from "@/lib/agent-factory/goal-spec"
import { readGoalRevisionFromRoot } from "@/lib/agent-factory/goal-io"
import { AgentFactoryQueueItemSchema, AgentFactoryQueueSchema, type AgentFactoryQueueItem } from "@/lib/agent-factory/queue"
import { readJsonFile, withFileLock, writeJsonFile } from "@/lib/agent-factory/storage"

function nowIso() {
  return new Date().toISOString()
}

const ACTIVE: Array<AgentFactoryQueueItem["status"]> = ["queued", "in_progress", "blocked"]

function isActiveStatus(s: AgentFactoryQueueItem["status"]): boolean {
  return ACTIVE.includes(s)
}

async function readMeta(metaPath: string): Promise<ReturnType<typeof FactoryGoalMetaSchema.parse> | null> {
  try {
    const raw = await readFile(metaPath, "utf8")
    return FactoryGoalMetaSchema.parse(JSON.parse(raw) as unknown)
  } catch {
    return null
  }
}

async function writeMeta(metaPath: string, revision: string) {
  const payload = FactoryGoalMetaSchema.parse({
    version: 1,
    last_seen_goal_revision: revision,
    updated_at: nowIso(),
  })
  await writeFile(metaPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8")
}

async function appendPivotLog(repoRoot: string, entry: { pivoted_at: string; from: string | null; to: string; cancelled_ids: string[] }) {
  const logPath = path.join(repoRoot, "agents", "factory-pivot-log.jsonl")
  await appendFile(logPath, `${JSON.stringify(entry)}\n`, "utf8")
}

async function main() {
  const root = process.cwd()
  const queuePath = path.join(root, "agents", "factory-queue.json")
  const metaPath = path.join(root, "agents", "factory-goal-meta.json")
  const workerId = (process.env.FACTORY_WORKER_ID ?? "").trim() || `goal_pivot_${process.pid}`

  let currentRev: string
  try {
    currentRev = await readGoalRevisionFromRoot(root)
  } catch {
    console.error("factory:goal-pivot: missing or invalid agents/factory-goal-spec.json")
    process.exitCode = 1
    return
  }
  const meta = await readMeta(metaPath)

  await withFileLock({
    lockPath: `${queuePath}.lock`,
    workerId,
    fn: async () => {
      const queue = await readJsonFile(queuePath, AgentFactoryQueueSchema)

      if (!meta) {
        let backfilled = 0
        const items = queue.items.map((item) => {
          if (!isActiveStatus(item.status) || item.goal_revision != null) return item
          backfilled += 1
          return AgentFactoryQueueItemSchema.parse({
            ...item,
            goal_revision: currentRev,
            updated_at: nowIso(),
          })
        })
        const next = AgentFactoryQueueSchema.parse({ ...queue, items })
        await writeJsonFile(queuePath, next)
        await writeMeta(metaPath, currentRev)
        console.log(
          `factory:goal-pivot: initialized agents/factory-goal-meta.json (revision ${currentRev}); backfilled goal_revision on ${backfilled} active item(s)`,
        )
        return
      }

      if (meta.last_seen_goal_revision === currentRev) {
        let repaired = 0
        const items = queue.items.map((item) => {
          if (!isActiveStatus(item.status) || item.goal_revision != null) return item
          repaired += 1
          return AgentFactoryQueueItemSchema.parse({
            ...item,
            goal_revision: currentRev,
            updated_at: nowIso(),
          })
        })
        if (repaired > 0) {
          const next = AgentFactoryQueueSchema.parse({ ...queue, items })
          await writeJsonFile(queuePath, next)
          console.log(`factory:goal-pivot: aligned ${repaired} active item(s) missing goal_revision to ${currentRev}`)
        } else {
          console.log(`factory:goal-pivot: no change (already at revision ${currentRev})`)
        }
        await writeMeta(metaPath, currentRev)
        return
      }

      const cancelled: string[] = []
      const items = queue.items.map((item) => {
        if (!isActiveStatus(item.status)) return item
        if (item.goal_revision === currentRev) return item
        cancelled.push(item.id)
        return AgentFactoryQueueItemSchema.parse({
          ...item,
          status: "cancelled",
          cancel_reason: "goal_pivot",
          claimed_by: null,
          claimed_at: null,
          updated_at: nowIso(),
        })
      })

      const next = AgentFactoryQueueSchema.parse({ ...queue, items })
      await writeJsonFile(queuePath, next)
      await writeMeta(metaPath, currentRev)
      console.log(
        `factory:goal-pivot: goal changed ${meta.last_seen_goal_revision} → ${currentRev}; cancelled ${cancelled.length} active item(s)`,
      )
      if (cancelled.length > 0) {
        await appendPivotLog(root, {
          pivoted_at: nowIso(),
          from: meta.last_seen_goal_revision,
          to: currentRev,
          cancelled_ids: cancelled,
        })
      }
    },
  })
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
