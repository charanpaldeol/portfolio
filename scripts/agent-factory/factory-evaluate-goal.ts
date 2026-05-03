import { spawn } from "node:child_process"
import { readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { z } from "zod"

import { AgentFactoryQueueSchema } from "@/lib/agent-factory/queue"
import {
  FactoryGoalSpecSchema,
  FactoryGoalStateSchema,
  evaluateFactoryGoalStatus,
  parseGoalAcceptanceCommands,
} from "@/lib/agent-factory/goal-spec"
import { writeJsonFile } from "@/lib/agent-factory/storage"

const RoadmapItemsSchema = z.object({
  version: z.literal(1),
  items: z.array(z.object({ id: z.string().min(1), title: z.string().min(1) })),
})

function nowIso() {
  return new Date().toISOString()
}

async function runBashRoot(args: { bashCommand: string; cwd: string; logLabel: string }) {
  return await new Promise<number>((resolve) => {
    const child = spawn("bash", ["-lc", args.bashCommand], { cwd: args.cwd, shell: false, env: process.env })
    const prefix = `[goal-acceptance] ${args.logLabel}\n`
    process.stdout.write(prefix)
    child.stdout?.on("data", (c) => process.stdout.write(c.toString("utf8")))
    child.stderr?.on("data", (c) => process.stderr.write(c.toString("utf8")))
    child.on("close", (c) => resolve(c ?? 1))
  })
}

async function main() {
  const root = process.cwd()
  const goalPath = path.join(root, "agents", "factory-goal-spec.json")
  const roadmapPath = path.join(root, "agents", "factory-roadmap.json")
  const queuePath = path.join(root, "agents", "factory-queue.json")
  const statePath = path.join(root, "agents", "factory-goal-state.json")

  let goal: z.output<typeof FactoryGoalSpecSchema>
  try {
    goal = FactoryGoalSpecSchema.parse(JSON.parse(await readFile(goalPath, "utf8")) as unknown)
  } catch {
    const state = FactoryGoalStateSchema.parse({
      version: 1,
      status: "unknown",
      statement: "",
      evaluated_at: nowIso(),
      summary: "Missing or invalid agents/factory-goal-spec.json",
      roadmap_not_done: [],
      roadmap_item_count: 0,
      queue_done: 0,
      queue_failed: 0,
      queue_inflight: 0,
      goal_acceptance_ok: null,
    })
    await writeJsonFile(statePath, state)
    console.log("factory: evaluate-goal: no valid factory-goal-spec.json; wrote unknown state")
    return
  }

  const roadmapRaw = await readFile(roadmapPath, "utf8")
  const roadmap = RoadmapItemsSchema.parse(JSON.parse(roadmapRaw) as unknown)
  const roadmapItems = roadmap.items.map((i) => ({ id: i.id, title: i.title.trim() || i.id }))

  const queue = AgentFactoryQueueSchema.parse(JSON.parse(await readFile(queuePath, "utf8")) as unknown)
  const byId = new Map(queue.items.map((i) => [i.id, { status: i.status }] as const))

  const progress = evaluateFactoryGoalStatus({
    statement: goal.statement,
    roadmapItems,
    queue: { byId },
  })

  let status = progress.status
  let summary = progress.summary
  let goalAcceptanceOk: boolean | null = null

  const acceptanceCommands = parseGoalAcceptanceCommands(goal)

  if (status === "met" && acceptanceCommands.length > 0) {
    let i = 0
    for (const cmd of acceptanceCommands) {
      const code = await runBashRoot({ bashCommand: cmd, cwd: root, logLabel: `${i}: ${cmd}` })
      if (code !== 0) {
        status = "blocked"
        summary = `Goal-level acceptance failed (exit ${code}): ${cmd}`
        goalAcceptanceOk = false
        break
      }
      i += 1
    }
    if (status === "met") goalAcceptanceOk = true
  }

  const roadmapNotDoneForState = goalAcceptanceOk === false ? [] : progress.roadmap_not_done

  const state = FactoryGoalStateSchema.parse({
    version: 1,
    status,
    statement: goal.statement,
    evaluated_at: nowIso(),
    summary,
    roadmap_not_done: roadmapNotDoneForState.length ? roadmapNotDoneForState : undefined,
    roadmap_item_count: roadmapItems.length,
    queue_done: progress.queue_done,
    queue_failed: progress.queue_failed,
    queue_inflight: progress.queue_inflight,
    goal_acceptance_ok: goalAcceptanceOk,
  })

  await writeJsonFile(statePath, state)
  console.log(`factory: evaluate-goal: status=${status}`)
  console.log(`  summary: ${summary}`)
  if (roadmapNotDoneForState.length) {
    console.log("  roadmap not done (id — title [queue]):")
    for (const row of roadmapNotDoneForState) {
      console.log(`    - ${row.id} — ${row.title} [${row.queue_status}]`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
