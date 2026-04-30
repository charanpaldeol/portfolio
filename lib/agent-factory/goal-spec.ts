import { z } from "zod"

export const FactoryRoadmapItemShapeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  priority: z.number().int().min(0),
  spec: z.unknown().optional(),
})

export const FactoryGoalSpecSchema = z.object({
  version: z.literal(1),
  statement: z.string(),
  goal_acceptance: z.union([z.string(), z.array(z.string())]).nullable().optional(),
  roadmap_items: z.array(FactoryRoadmapItemShapeSchema).default([]),
})

export type FactoryGoalSpec = z.output<typeof FactoryGoalSpecSchema>

export function parseGoalAcceptanceCommands(spec: FactoryGoalSpec): string[] {
  const g = spec.goal_acceptance
  if (g == null) return []
  if (typeof g === "string" && g.trim()) return [g.trim()]
  if (Array.isArray(g)) return g.map((s) => (typeof s === "string" ? s.trim() : "")).filter(Boolean)
  return []
}

export const FactoryGoalStateSchema = z.object({
  version: z.literal(1),
  status: z.enum(["active", "met", "blocked", "unknown"]),
  statement: z.string(),
  evaluated_at: z.string(),
  summary: z.string().optional(),
  roadmap_item_count: z.number().int().min(0),
  queue_done: z.number().int().min(0),
  queue_failed: z.number().int().min(0),
  queue_inflight: z.number().int().min(0),
  goal_acceptance_ok: z.boolean().nullable(),
})

export type FactoryGoalState = z.output<typeof FactoryGoalStateSchema>

export type GoalQueueSnapshot = {
  byId: Map<string, { status: string }>
}

export function evaluateFactoryGoalStatus(args: {
  statement: string
  roadmapItemIds: string[]
  queue: GoalQueueSnapshot
}): {
  status: "active" | "met" | "blocked" | "unknown"
  summary: string
  queue_done: number
  queue_failed: number
  queue_inflight: number
} {
  const statement = args.statement.trim()
  if (!statement) {
    return {
      status: "unknown",
      summary: "No goal statement configured (agents/factory-goal-spec.json).",
      queue_done: 0,
      queue_failed: 0,
      queue_inflight: 0,
    }
  }

  const ids = args.roadmapItemIds
  if (!ids.length) {
    return {
      status: "unknown",
      summary: "Roadmap has no items; nothing to evaluate against.",
      queue_done: 0,
      queue_failed: 0,
      queue_inflight: 0,
    }
  }

  let done = 0
  let failed = 0
  let inflight = 0
  let missing = 0

  for (const id of ids) {
    const row = args.queue.byId.get(id)
    if (!row) {
      missing += 1
      continue
    }
    const s = row.status
    if (s === "done") done += 1
    else if (s === "failed") failed += 1
    else if (s === "cancelled") done += 1
    else inflight += 1
  }

  if (failed > 0) {
    return {
      status: "blocked",
      summary: `${failed} roadmap-linked queue item(s) failed; replan or fix, then re-queue.`,
      queue_done: done,
      queue_failed: failed,
      queue_inflight: inflight,
    }
  }

  if (missing > 0 || inflight > 0) {
    return {
      status: "active",
      summary:
        missing > 0
          ? `${missing} roadmap item(s) not yet in queue; ${inflight} still in flight.`
          : `${inflight} roadmap-linked item(s) still queued or in progress.`,
      queue_done: done,
      queue_failed: failed,
      queue_inflight: inflight + missing,
    }
  }

  if (done === ids.length) {
    return {
      status: "met",
      summary: "All roadmap items are done (or cancelled); run goal-level acceptance if configured.",
      queue_done: done,
      queue_failed: failed,
      queue_inflight: 0,
    }
  }

  return {
    status: "active",
    summary: "Roadmap/queue state is inconsistent with expectations.",
    queue_done: done,
    queue_failed: failed,
    queue_inflight: inflight,
  }
}
