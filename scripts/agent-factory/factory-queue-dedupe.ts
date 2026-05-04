import path from "node:path"
import process from "node:process"

import { AgentFactoryQueueItemSchema, AgentFactoryQueueSchema, type AgentFactoryQueueItem } from "@/lib/agent-factory/queue"
import { chooseDedupeKeepers } from "@/lib/agent-factory/queue-dedupe"
import { readJsonFile, withFileLock, writeJsonFile } from "@/lib/agent-factory/storage"

function nowIso() {
  return new Date().toISOString()
}

function parseBool(value: string | undefined) {
  const v = (value ?? "").trim().toLowerCase()
  return v === "1" || v === "true" || v === "yes" || v === "on"
}

async function main() {
  const root = process.cwd()
  const queuePath = path.join(root, "agents", "factory-queue.json")
  const workerId = (process.env.FACTORY_WORKER_ID ?? "").trim() || `dedupe_${process.pid}`
  const dryRun = parseBool(process.env.FACTORY_QUEUE_DEDUPE_DRY_RUN)

  await withFileLock({
    lockPath: `${queuePath}.lock`,
    workerId,
    fn: async () => {
      const queue = await readJsonFile(queuePath, AgentFactoryQueueSchema)
      const { cancelIds } = chooseDedupeKeepers(queue.items as AgentFactoryQueueItem[])
      if (cancelIds.length === 0) {
        console.log("factory:queue:dedupe: no duplicate queued rows (by title+goal_revision)")
        return
      }

      const cancelSet = new Set(cancelIds)
      const reason =
        (process.env.FACTORY_QUEUE_DEDUPE_REASON ?? "").trim() || "deduped: duplicate queued task (same title + goal_revision; kept highest _V##)"
      let cancelled = 0

      const nextItems = queue.items.map((it) => {
        if (!cancelSet.has(it.id) || it.status !== "queued") return it
        cancelled += 1
        return AgentFactoryQueueItemSchema.parse({
          ...it,
          status: "cancelled",
          cancel_reason: reason,
          claimed_by: null,
          claimed_at: null,
          updated_at: nowIso(),
        })
      })

      console.log(
        `factory:queue:dedupe: would cancel ${cancelled} queued duplicate(s): ${cancelIds.slice(0, 12).join(", ")}${cancelIds.length > 12 ? "…" : ""}`,
      )

      if (dryRun) {
        console.log("factory:queue:dedupe: FACTORY_QUEUE_DEDUPE_DRY_RUN=1 — no write")
        return
      }

      await writeJsonFile(queuePath, AgentFactoryQueueSchema.parse({ ...queue, items: nextItems }))
      console.log(`factory:queue:dedupe: updated ${queuePath} (${cancelled} cancelled)`)
    },
  })
}

main().catch((err) => {
  console.error("factory:queue:dedupe failed:", err)
  process.exitCode = 1
})
