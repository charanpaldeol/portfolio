import path from "node:path"
import process from "node:process"

import { AgentFactoryQueueSchema, AgentFactoryRunsFileSchema } from "@/lib/agent-factory/queue"
import { readJsonFile, withFileLock, writeJsonFile } from "@/lib/agent-factory/storage"

function nowIso() {
  return new Date().toISOString()
}

function ageMs(iso: string) {
  const t = new Date(iso).getTime()
  if (!Number.isFinite(t)) return Number.POSITIVE_INFINITY
  return Date.now() - t
}

function parseMs(value: string | undefined, fallbackMs: number) {
  const n = Number(value ?? "")
  return Number.isFinite(n) && n >= 0 ? n : fallbackMs
}

async function reclaimQueue(args: { root: string; workerId: string; staleClaimMs: number }) {
  const queuePath = path.join(args.root, "agents", "factory-queue.json")

  return await withFileLock({
    lockPath: `${queuePath}.lock`,
    workerId: args.workerId,
    fn: async () => {
      const queue = await readJsonFile(queuePath, AgentFactoryQueueSchema)
      const nextItems = queue.items.map((it) => {
        const claimed_at = typeof it.claimed_at === "string" ? it.claimed_at : null
        if (it.status !== "in_progress") return it
        if (!claimed_at) return it
        if (ageMs(claimed_at) < args.staleClaimMs) return it
        return { ...it, status: "queued" as const, claimed_by: null, claimed_at: null, updated_at: nowIso() }
      })

      const reclaimedCount = nextItems.reduce((n, it, idx) => {
        const prev = queue.items[idx]
        if (prev?.status === "in_progress" && it.status === "queued") return n + 1
        return n
      }, 0)

      await writeJsonFile(queuePath, AgentFactoryQueueSchema.parse({ ...queue, items: nextItems }))
      return { reclaimedCount }
    },
  })
}

async function reclaimRuns(args: { root: string; workerId: string; staleRunMs: number }) {
  const runsPath = path.join(args.root, "agents", "factory-runs.json")

  return await withFileLock({
    lockPath: `${runsPath}.lock`,
    workerId: args.workerId,
    fn: async () => {
      const runsFile = await readJsonFile(runsPath, AgentFactoryRunsFileSchema)
      const finishedAt = nowIso()
      let updatedCount = 0

      const nextRuns = runsFile.runs.map((run) => {
        if (run.status !== "started") return run
        if (ageMs(run.started_at) < args.staleRunMs) return run
        updatedCount += 1
        return {
          ...run,
          status: "failed" as const,
          finished_at: finishedAt,
          error: run.error ?? `Reclaimed stale run after ${Math.round(args.staleRunMs / 1000)}s`,
        }
      })

      await writeJsonFile(runsPath, AgentFactoryRunsFileSchema.parse({ ...runsFile, runs: nextRuns }))
      return { updatedCount }
    },
  })
}

async function main() {
  const root = process.cwd()
  const workerId = (process.env.FACTORY_WORKER_ID ?? "").trim() || `reclaimer_${process.pid}`

  const staleClaimMs = parseMs(process.env.FACTORY_STALE_CLAIM_MS, 15 * 60 * 1000)
  const staleRunMs = parseMs(process.env.FACTORY_STALE_RUN_MS, 60 * 60 * 1000)

  const [queueResult, runsResult] = await Promise.all([
    reclaimQueue({ root, workerId, staleClaimMs }),
    reclaimRuns({ root, workerId, staleRunMs }),
  ])

  const total = queueResult.reclaimedCount + runsResult.updatedCount
  if (total > 0) {
    console.log(
      `factory:reclaim: reclaimed queue=${queueResult.reclaimedCount}, runs=${runsResult.updatedCount} (staleClaim=${Math.round(
        staleClaimMs / 1000
      )}s, staleRun=${Math.round(staleRunMs / 1000)}s)`
    )
  } else {
    console.log("factory:reclaim: nothing to reclaim")
  }
}

main().catch((err) => {
  console.error("factory:reclaim failed:", err)
  process.exitCode = 1
})

