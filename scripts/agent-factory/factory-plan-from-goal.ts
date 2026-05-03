import { readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { z } from "zod"

import {
  FactoryGoalSpecSchema,
  FactoryRoadmapItemShapeSchema,
  validateRoadmapItemsTraceToGoal,
} from "@/lib/agent-factory/goal-spec"
import { withFileLock, writeJsonFile } from "@/lib/agent-factory/storage"

const RoadmapFileSchema = z.object({
  version: z.literal(1),
  items: z.array(FactoryRoadmapItemShapeSchema),
})

async function main() {
  const root = process.cwd()
  const goalPath = path.join(root, "agents", "factory-goal-spec.json")
  const roadmapPath = path.join(root, "agents", "factory-roadmap.json")
  const metaPath = path.join(root, "agents", "factory-roadmap-meta.json")
  const workerId = (process.env.FACTORY_WORKER_ID ?? "").trim() || `plan_goal_${process.pid}`

  const goal = FactoryGoalSpecSchema.parse(JSON.parse(await readFile(goalPath, "utf8")) as unknown)
  if (!goal.roadmap_items.length) {
    console.log("factory: plan-from-goal: roadmap_items is empty; add items to agents/factory-goal-spec.json then re-run")
    return
  }

  const trace = validateRoadmapItemsTraceToGoal({ statement: goal.statement, items: goal.roadmap_items })
  if (!trace.ok) {
    for (const err of trace.errors) console.error(`factory: plan-from-goal: ${err}`)
    process.exitCode = 1
    return
  }

  await withFileLock({
    lockPath: `${roadmapPath}.lock`,
    workerId,
    fn: async () => {
      const roadmap = RoadmapFileSchema.parse(JSON.parse(await readFile(roadmapPath, "utf8")) as unknown)
      const incoming = new Map(goal.roadmap_items.map((i) => [i.id, i] as const))
      const seenIncoming = new Set<string>()
      const nextItems = []
      for (const item of roadmap.items) {
        const rep = incoming.get(item.id)
        nextItems.push(rep ?? item)
        if (rep) seenIncoming.add(item.id)
      }
      for (const item of goal.roadmap_items) {
        if (!seenIncoming.has(item.id)) {
          nextItems.push(item)
          seenIncoming.add(item.id)
        }
      }
      await writeJsonFile(roadmapPath, { version: 1, items: nextItems })
    },
  })

  let seq = 1
  try {
    const raw = await readFile(metaPath, "utf8")
    const m = JSON.parse(raw) as { seq?: number }
    seq = (typeof m.seq === "number" ? m.seq : 0) + 1
  } catch {
    seq = 1
  }
  await writeJsonFile(metaPath, { version: 1, seq })

  console.log(`factory: plan-from-goal: merged ${goal.roadmap_items.length} roadmap row(s) (meta seq=${seq})`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
