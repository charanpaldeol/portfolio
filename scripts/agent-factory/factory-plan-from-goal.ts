import { readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { z } from "zod"

import {
  FactoryGoalSpecSchema,
  FactoryGoalSpecV2Schema,
  FactoryRoadmapItemShapeSchema,
  flattenV2StoriesToRoadmapItems,
  validateGoalSpecV2,
  validateRoadmapItemsTraceToGoal,
} from "@/lib/agent-factory/goal-spec"
import { withFileLock, writeJsonFile } from "@/lib/agent-factory/storage"

const RoadmapFileSchema = z.object({
  version: z.literal(1),
  items: z.array(FactoryRoadmapItemShapeSchema),
})

async function mergeIntoRoadmap(args: {
  roadmapPath: string
  workerId: string
  incomingItems: z.output<typeof FactoryRoadmapItemShapeSchema>[]
}) {
  await withFileLock({
    lockPath: `${args.roadmapPath}.lock`,
    workerId: args.workerId,
    fn: async () => {
      const roadmap = RoadmapFileSchema.parse(JSON.parse(await readFile(args.roadmapPath, "utf8")) as unknown)
      const incoming = new Map(args.incomingItems.map((i) => [i.id, i] as const))
      const seenIncoming = new Set<string>()
      const nextItems = []
      for (const item of roadmap.items) {
        const rep = incoming.get(item.id)
        nextItems.push(rep ?? item)
        if (rep) seenIncoming.add(item.id)
      }
      for (const item of args.incomingItems) {
        if (!seenIncoming.has(item.id)) {
          nextItems.push(item)
          seenIncoming.add(item.id)
        }
      }
      await writeJsonFile(args.roadmapPath, { version: 1, items: nextItems })
    },
  })
}

async function bumpMeta(metaPath: string): Promise<number> {
  let seq = 1
  try {
    const raw = await readFile(metaPath, "utf8")
    const m = JSON.parse(raw) as { seq?: number }
    seq = (typeof m.seq === "number" ? m.seq : 0) + 1
  } catch {
    seq = 1
  }
  await writeJsonFile(metaPath, { version: 1, seq })
  return seq
}

async function main() {
  const root = process.cwd()
  const goalPath = path.join(root, "agents", "factory-goal-spec.json")
  const roadmapPath = path.join(root, "agents", "factory-roadmap.json")
  const metaPath = path.join(root, "agents", "factory-roadmap-meta.json")
  const workerId = (process.env.FACTORY_WORKER_ID ?? "").trim() || `plan_goal_${process.pid}`

  const raw = JSON.parse(await readFile(goalPath, "utf8")) as unknown

  // ── v2 path ────────────────────────────────────────────────────────────────
  const v2Result = FactoryGoalSpecV2Schema.safeParse(raw)
  if (v2Result.success) {
    const spec = v2Result.data
    if (!spec.roadmap_items.length) {
      console.log("factory: plan-from-goal: roadmap_items is empty; add items to agents/factory-goal-spec.json then re-run")
      return
    }

    const validation = validateGoalSpecV2(spec)
    if (!validation.ok) {
      for (const err of validation.errors) console.error(`factory: plan-from-goal: ${err}`)
      process.exitCode = 1
      return
    }

    const storyCount = spec.roadmap_items.reduce((n, ri) => n + ri.goals.reduce((m, g) => m + g.stories.length, 0), 0)
    const goalCount = spec.roadmap_items.reduce((n, ri) => n + ri.goals.length, 0)
    const incomingItems = flattenV2StoriesToRoadmapItems(spec)

    await mergeIntoRoadmap({ roadmapPath, workerId, incomingItems })
    const seq = await bumpMeta(metaPath)

    console.log(
      `factory: plan-from-goal: v2 — ${spec.roadmap_items.length} roadmap item(s), ${goalCount} goal(s), ${storyCount} story/stories → ${incomingItems.length} roadmap row(s) merged (meta seq=${seq})`,
    )
    return
  }

  // ── v1 path (unchanged behaviour) ─────────────────────────────────────────
  const goal = FactoryGoalSpecSchema.parse(raw)
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

  await mergeIntoRoadmap({ roadmapPath, workerId, incomingItems: goal.roadmap_items })
  const seq = await bumpMeta(metaPath)

  console.log(`factory: plan-from-goal: merged ${goal.roadmap_items.length} roadmap row(s) (meta seq=${seq})`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
