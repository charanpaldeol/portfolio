import { spawn } from "node:child_process"
import { readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { z } from "zod"

import { FactoryGoalStateSchema } from "@/lib/agent-factory/goal-spec"
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

function parseBool(value: string | undefined) {
  const v = (value ?? "").trim().toLowerCase()
  return v === "1" || v === "true" || v === "yes" || v === "on"
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

async function runRoadmapRefresh(root: string) {
  return await new Promise<number>((resolve) => {
    const child = spawn("pnpm", ["-s", "factory:roadmap:refresh"], { cwd: root, stdio: "inherit", shell: false })
    child.on("close", (code) => resolve(code ?? 1))
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

  await readFile(backlogPath, "utf8")
  await readFile(goalPath, "utf8")
  const metrics = FactoryMetricsSchema.parse(await readJson(metricsPath))
  const progress = computeGoalProgress(metrics)
  if (progress.ratio >= 1) {
    console.log(`factory: plan-next: goal achieved (ARR ${progress.current_arr_usd} / ${progress.target_arr_usd}) — not enqueuing`)
    return
  }

  if (parseBool(process.env.FACTORY_GOAL_STATE_CONTROLS_PLAN)) {
    try {
      const statePath = path.join(root, "agents", "factory-goal-state.json")
      const raw = await readFile(statePath, "utf8")
      const st = FactoryGoalStateSchema.parse(JSON.parse(raw) as unknown)
      if (st.status === "met") {
        console.log("factory: plan-next: factory-goal-state is met — not enqueuing (FACTORY_GOAL_STATE_CONTROLS_PLAN=1)")
        return
      }
    } catch {
      // no state file yet or invalid — continue planning
    }
  }

  const targetSize = Number(process.env.FACTORY_QUEUE_TARGET_SIZE ?? String(100))

  const attemptEnqueue = async (): Promise<{ enqueued: number; skippedFull: boolean; noRoadmapItems: boolean }> => {
    return await withFileLock({
      lockPath: `${queuePath}.lock`,
      workerId,
      fn: async () => {
        const queue = await readJsonFile(queuePath, AgentFactoryQueueSchema)
        const existingById = new Map(queue.items.map((i) => [i.id, i] as const))
        const queuedCount = queue.items.filter((i) => i.status === "queued").length
        const capacity = Math.max(0, targetSize - queuedCount)
        if (capacity === 0) {
          console.log(`factory: plan-next: queue already at target (queued=${queuedCount}, target=${targetSize})`)
          return { enqueued: 0, skippedFull: true, noRoadmapItems: false }
        }

        const roadmap = RoadmapSchema.parse(await readJson(roadmapPath))
        const candidates = roadmap.items.filter((item) => {
          const existing = existingById.get(item.id)
          if (!existing) return true
          return existing.status === "cancelled"
        })

        const revenueFirst = candidates.slice().sort((a, b) => b.priority - a.priority).slice(0, capacity)
        const toEnqueue = revenueFirst.map(toQueueItem)
        if (!toEnqueue.length) {
          console.log("factory: plan-next: no roadmap items to enqueue")
          return { enqueued: 0, skippedFull: false, noRoadmapItems: true }
        }

        const nextQueue = AgentFactoryQueueSchema.parse({
          ...queue,
          items: [...toEnqueue, ...queue.items.filter((i) => i.status !== "cancelled")],
        })

        await writeJson(queuePath, nextQueue)
        console.log(`factory: plan-next: enqueued ${toEnqueue.length} item(s) (queued=${queuedCount} → ${queuedCount + toEnqueue.length})`)
        return { enqueued: toEnqueue.length, skippedFull: false, noRoadmapItems: false }
      },
    })
  }

  const first = await attemptEnqueue()
  if (first.skippedFull) return

  if (first.noRoadmapItems) {
    console.log("factory: plan-next: triggering roadmap refresh (market → candidates → select → generate)")
    const code = await runRoadmapRefresh(root)
    if (code !== 0) console.warn(`factory: plan-next: factory:roadmap:refresh exited ${code}`)
    const second = await attemptEnqueue()
    if (second.noRoadmapItems && !second.skippedFull) {
      console.warn("factory: plan-next: still no roadmap items after refresh")
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
