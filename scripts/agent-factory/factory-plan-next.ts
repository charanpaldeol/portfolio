import { readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { z } from "zod"

import { AgentFactoryQueueItemSchema, AgentFactoryQueueSchema, type AgentFactoryQueueItem } from "@/lib/agent-factory/queue"
import { readJsonFile, withFileLock, writeJsonFile } from "@/lib/agent-factory/storage"
import { FactoryMetricsSchema, computeGoalProgress } from "@/lib/agent-factory/goals"

const RoadmapItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  priority: z.number().int().min(0),
  spec: z.unknown().optional(),
})

const RoadmapSchema = z.object({
  version: z.literal(1),
  items: z.array(RoadmapItemSchema),
})

function nowIso() {
  return new Date().toISOString()
}

async function readJson(filePath: string) {
  const raw = await readFile(filePath, "utf8")
  return JSON.parse(raw) as unknown
}

async function writeJson(filePath: string, value: unknown) {
  const next = `${JSON.stringify(value, null, 2)}\n`
  await writeJsonFile(filePath, value)
}

function toQueueItem(input: z.output<typeof RoadmapItemSchema>): AgentFactoryQueueItem {
  const ts = nowIso()
  return AgentFactoryQueueItemSchema.parse({
    id: input.id,
    title: input.title,
    spec: input.spec ?? {},
    status: "queued",
    priority: input.priority,
    created_at: ts,
    updated_at: ts,
    claimed_by: null,
    claimed_at: null,
  })
}

async function main() {
  const root = process.cwd()
  const queuePath = path.join(root, "agents", "factory-queue.json")
  const roadmapPath = path.join(root, "agents", "factory-roadmap.json")
  const backlogPath = path.join(root, "backlog.md")
  const goalPath = path.join(root, "agents", "FACTORY_GOAL.md")
  const metricsPath = path.join(root, "agents", "factory-metrics.json")
  const workerId = (process.env.FACTORY_WORKER_ID ?? "").trim() || `planner_${process.pid}`

  const roadmap = RoadmapSchema.parse(await readJson(roadmapPath))
  await readFile(backlogPath, "utf8")
  await readFile(goalPath, "utf8")
  const metrics = FactoryMetricsSchema.parse(await readJson(metricsPath))
  const progress = computeGoalProgress(metrics)
  if (progress.ratio >= 1) {
    console.log(`factory: plan-next: goal achieved (ARR ${progress.current_arr_usd} / ${progress.target_arr_usd}) — not enqueuing`)
    return
  }

  const targetSize = Number(process.env.FACTORY_QUEUE_TARGET_SIZE ?? String(5))

  await withFileLock({
    lockPath: `${queuePath}.lock`,
    workerId,
    fn: async () => {
      const queue = await readJsonFile(queuePath, AgentFactoryQueueSchema)
      const existingById = new Map(queue.items.map((i) => [i.id, i] as const))
      const queuedCount = queue.items.filter((i) => i.status === "queued").length

      const capacity = Math.max(0, targetSize - queuedCount)
      if (capacity === 0) {
        console.log(`factory: plan-next: queue already at target (queued=${queuedCount}, target=${targetSize})`)
        return
      }

      const candidates = roadmap.items.filter((item) => {
        const existing = existingById.get(item.id)
        if (!existing) return true
        return existing.status === "cancelled"
      })

      const revenueFirst = candidates
        .slice()
        .sort((a, b) => b.priority - a.priority)
        .slice(0, capacity)
      const toEnqueue = revenueFirst.map(toQueueItem)
      if (!toEnqueue.length) {
        console.log("factory: plan-next: no roadmap items to enqueue")
        return
      }

      const nextQueue = AgentFactoryQueueSchema.parse({
        ...queue,
        items: [...toEnqueue, ...queue.items.filter((i) => i.status !== "cancelled")],
      })

      await writeJson(queuePath, nextQueue)
      console.log(`factory: plan-next: enqueued ${toEnqueue.length} item(s) (queued=${queuedCount} → ${queuedCount + toEnqueue.length})`)
    },
  })
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

