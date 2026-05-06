import { z } from "zod"
import { createHash } from "node:crypto"

// ─── v2 schemas ──────────────────────────────────────────────────────────────

export const AcceptanceCriteriaGWTSchema = z.object({
  given: z.string().min(1),
  when: z.string().min(1),
  then: z.string().min(1),
})

export type AcceptanceCriteriaGWT = z.output<typeof AcceptanceCriteriaGWTSchema>

export const ImpactMetricsSchema = z.object({
  user_value: z.enum(["critical", "high", "medium", "low"]),
  revenue_impact: z.number().int().min(0).optional(),
  user_count: z.number().int().min(0).optional(),
  strategic_importance: z.enum(["core", "important", "nice-to-have"]).optional(),
})

export type ImpactMetrics = z.output<typeof ImpactMetricsSchema>

export const StorySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(120),
  user_story: z.string().min(1),
  description: z.string().optional(),
  acceptance_criteria: z.array(AcceptanceCriteriaGWTSchema).min(1),
  priority: z.number().int().min(0).optional(),
  impact: ImpactMetricsSchema.optional(),
  spec: z.unknown().optional(),
})

export type Story = z.output<typeof StorySchema>

export const GoalSchema = z.object({
  id: z.string().min(1),
  user_story: z.string().min(1),
  acceptance_criteria: z.array(AcceptanceCriteriaGWTSchema).min(1),
  priority: z.number().int().min(0).optional(),
  impact: ImpactMetricsSchema.optional(),
  stories: z.array(StorySchema).min(1),
})

export type Goal = z.output<typeof GoalSchema>

export const RoadmapItemV2Schema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  goals: z.array(GoalSchema).min(1),
})

export type RoadmapItemV2 = z.output<typeof RoadmapItemV2Schema>

export const FactoryGoalSpecV2Schema = z.object({
  version: z.literal(2),
  statement: z.string(),
  goal_revision: z.string().min(1).optional(),
  goal_acceptance: z.union([z.string(), z.array(z.string())]).nullable().optional(),
  roadmap_items: z.array(RoadmapItemV2Schema).default([]),
})

export type FactoryGoalSpecV2 = z.output<typeof FactoryGoalSpecV2Schema>

/** Returns 0–1500 priority from impact metrics. Explicit `priority` field overrides this. */
export function calculatePriorityFromImpact(impact: ImpactMetrics): number {
  const base = { critical: 1000, high: 700, medium: 400, low: 100 }[impact.user_value]
  const revenueFactor = Math.min(200, Math.floor((impact.revenue_impact ?? 0) / 500))
  const userFactor = Math.min(100, Math.floor((impact.user_count ?? 0) / 1000))
  const strategicBonus = { core: 200, important: 100, "nice-to-have": 0 }[impact.strategic_importance ?? "important"]
  return base + revenueFactor + userFactor + strategicBonus
}

/** Flatten all stories from a v2 spec into roadmap item shape, suitable for factory-roadmap.json. */
export function flattenV2StoriesToRoadmapItems(spec: FactoryGoalSpecV2): z.output<typeof FactoryRoadmapItemShapeSchema>[] {
  const items: z.output<typeof FactoryRoadmapItemShapeSchema>[] = []
  for (const roadmapItem of spec.roadmap_items) {
    for (const goal of roadmapItem.goals) {
      for (const story of goal.stories) {
        const priority =
          story.priority ??
          (story.impact ? calculatePriorityFromImpact(story.impact) :
            goal.priority ??
            (goal.impact ? calculatePriorityFromImpact(goal.impact) : 500))
        items.push({
          id: story.id,
          title: story.title,
          priority,
          traces_goal: story.user_story,
          spec: {
            ...(story.spec != null && typeof story.spec === "object" ? (story.spec as Record<string, unknown>) : {}),
            parent_goal_id: goal.id,
            parent_roadmap_id: roadmapItem.id,
            user_story: story.user_story,
            acceptance_criteria: story.acceptance_criteria,
          },
        })
      }
    }
  }
  return items
}

/** Validates that every user_story in a v2 spec follows "As a X, I want Y so that Z" pattern. */
export function validateUserStoryFormat(text: string): boolean {
  const lower = text.toLowerCase().trimStart()
  return lower.startsWith("as a") && lower.includes("i want") && lower.includes("so that")
}

export type V2ValidationResult = { ok: true } | { ok: false; errors: string[] }

/** Full validation of a v2 spec: user story format, GWT completeness, INVEST basics. */
export function validateGoalSpecV2(spec: FactoryGoalSpecV2): V2ValidationResult {
  const errors: string[] = []

  for (const ri of spec.roadmap_items) {
    for (const goal of ri.goals) {
      if (!validateUserStoryFormat(goal.user_story)) {
        errors.push(`Goal ${goal.id}: user_story must follow "As a X, I want Y so that Z" format.`)
      }
      for (const ac of goal.acceptance_criteria) {
        if (!ac.given.trim() || !ac.when.trim() || !ac.then.trim()) {
          errors.push(`Goal ${goal.id}: acceptance_criteria entry is missing given/when/then text.`)
        }
      }
      for (const story of goal.stories) {
        if (!validateUserStoryFormat(story.user_story)) {
          errors.push(`Story ${story.id}: user_story must follow "As a X, I want Y so that Z" format.`)
        }
        if (story.title.length > 120) {
          errors.push(`Story ${story.id}: title exceeds 120 chars (INVEST: keep stories Small and concise).`)
        }
        for (const ac of story.acceptance_criteria) {
          if (!ac.given.trim() || !ac.when.trim() || !ac.then.trim()) {
            errors.push(`Story ${story.id}: acceptance_criteria entry is missing given/when/then text.`)
          }
        }
      }
    }
  }

  return errors.length ? { ok: false, errors } : { ok: true }
}

// ─── v1 schemas (unchanged) ───────────────────────────────────────────────────

export const FactoryRoadmapItemShapeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  priority: z.number().int().min(0),
  /** How this row serves the current goal `statement` (preferred). */
  traces_goal: z.string().min(1).optional(),
  spec: z.unknown().optional(),
})

const TRACE_TOKEN_MIN = 4

function goalStatementTokens(statement: string): string[] {
  const s = statement.trim().toLowerCase()
  if (!s) return []
  return s.split(/\W+/).filter((t) => t.length >= TRACE_TOKEN_MIN)
}

function firstDefinitionOfDoneBullet(spec: unknown): string {
  if (!spec || typeof spec !== "object" || spec === null || !("definition_of_done" in spec)) return ""
  const dod = (spec as { definition_of_done?: unknown }).definition_of_done
  if (!Array.isArray(dod) || dod.length === 0) return ""
  const first = dod[0]
  return typeof first === "string" ? first.trim() : ""
}

/** Text used to prove this row references the current north star (`traces_goal` preferred, else first DoD bullet). */
export function resolveRoadmapItemTraceText(item: z.output<typeof FactoryRoadmapItemShapeSchema>): string {
  const tg = item.traces_goal?.trim()
  if (tg) return tg
  return firstDefinitionOfDoneBullet(item.spec)
}

/** True if the row explicitly ties work to the north star: `traces_goal` or a non-empty first `definition_of_done` bullet in `spec`. */
export function roadmapItemHasGoalTrace(item: z.output<typeof FactoryRoadmapItemShapeSchema>): boolean {
  return resolveRoadmapItemTraceText(item).length > 0
}

/**
 * Validates every goal-spec roadmap row traces the current `statement` (keyword overlap when the statement yields tokens).
 * Used by `factory:plan-from-goal` so no orphan ids land on the roadmap.
 */
export function validateRoadmapItemsTraceToGoal(args: {
  statement: string
  items: z.output<typeof FactoryRoadmapItemShapeSchema>[]
}): { ok: true } | { ok: false; errors: string[] } {
  const tokens = goalStatementTokens(args.statement)
  const errors: string[] = []

  for (const item of args.items) {
    const trace = resolveRoadmapItemTraceText(item)
    if (!trace) {
      errors.push(
        `Roadmap item ${item.id}: set traces_goal or spec.definition_of_done[0] so this row ties to agents/factory-goal-spec.json statement.`,
      )
      continue
    }
    if (tokens.length === 0) continue
    const lower = trace.toLowerCase()
    const linked = tokens.some((t) => lower.includes(t))
    if (!linked) {
      errors.push(
        `Roadmap item ${item.id}: trace must reference the current goal statement (no shared keyword of length ≥${TRACE_TOKEN_MIN}).`,
      )
    }
  }

  return errors.length ? { ok: false, errors } : { ok: true }
}

export const FactoryGoalSpecSchema = z.object({
  version: z.literal(1),
  statement: z.string(),
  /** Bump this (or rely on fallback hash of `statement`) whenever the north star changes so `factory:goal-pivot` can cancel stale queue work. */
  goal_revision: z.string().min(1).optional(),
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

/** Deterministic revision when `goal_revision` is omitted (changes if `statement` changes). */
export function computeFallbackGoalRevision(statement: string): string {
  return `h_${createHash("sha256").update(statement.trim(), "utf8").digest("hex").slice(0, 16)}`
}

export function resolveGoalRevision(spec: FactoryGoalSpec): string {
  const gr = spec.goal_revision
  if (typeof gr === "string" && gr.trim().length > 0) return gr.trim()
  return computeFallbackGoalRevision(spec.statement)
}

export const FactoryGoalMetaSchema = z.object({
  version: z.literal(1),
  last_seen_goal_revision: z.string().min(1),
  updated_at: z.string(),
})

export type FactoryGoalMeta = z.output<typeof FactoryGoalMetaSchema>

export const FactoryGoalStateSchema = z.object({
  version: z.literal(1),
  status: z.enum(["active", "met", "blocked", "unknown"]),
  statement: z.string(),
  evaluated_at: z.string(),
  summary: z.string().optional(),
  /** Roadmap rows not in terminal success (done/cancelled); id + title for quick scanning (Phase B3). */
  roadmap_not_done: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        queue_status: z.string().min(1),
      }),
    )
    .optional(),
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

export type RoadmapItemRef = { id: string; title: string }

function buildNotDoneList(args: { roadmapItems: RoadmapItemRef[]; queue: GoalQueueSnapshot }): Array<{ id: string; title: string; queue_status: string }> {
  const out: Array<{ id: string; title: string; queue_status: string }> = []
  for (const { id, title } of args.roadmapItems) {
    const row = args.queue.byId.get(id)
    if (!row) {
      out.push({ id, title, queue_status: "missing" })
      continue
    }
    const s = row.status
    if (s === "done" || s === "cancelled") continue
    out.push({ id, title, queue_status: s })
  }
  return out
}

function appendNotDoneToSummary(base: string, notDone: Array<{ id: string; title: string; queue_status: string }>): string {
  if (!notDone.length) return base
  const parts = notDone.map((n) => `${n.id}: ${n.title} [${n.queue_status}]`)
  return `${base} Not done: ${parts.join("; ")}.`
}

export function evaluateFactoryGoalStatus(args: {
  statement: string
  roadmapItems: RoadmapItemRef[]
  queue: GoalQueueSnapshot
}): {
  status: "active" | "met" | "blocked" | "unknown"
  summary: string
  roadmap_not_done: Array<{ id: string; title: string; queue_status: string }>
  queue_done: number
  queue_failed: number
  queue_inflight: number
} {
  const statement = args.statement.trim()
  if (!statement) {
    return {
      status: "unknown",
      summary: "No goal statement configured (agents/factory-goal-spec.json).",
      roadmap_not_done: [],
      queue_done: 0,
      queue_failed: 0,
      queue_inflight: 0,
    }
  }

  const roadmapItems = args.roadmapItems
  if (!roadmapItems.length) {
    return {
      status: "unknown",
      summary: "Roadmap has no items; nothing to evaluate against.",
      roadmap_not_done: [],
      queue_done: 0,
      queue_failed: 0,
      queue_inflight: 0,
    }
  }

  let done = 0
  let failed = 0
  let inflight = 0
  let missing = 0

  for (const { id } of roadmapItems) {
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

  const notDone = buildNotDoneList({ roadmapItems, queue: args.queue })

  if (failed > 0) {
    const base = `${failed} roadmap-linked queue item(s) failed; replan or fix, then re-queue.`
    return {
      status: "blocked",
      summary: appendNotDoneToSummary(base, notDone),
      roadmap_not_done: notDone,
      queue_done: done,
      queue_failed: failed,
      queue_inflight: inflight,
    }
  }

  if (missing > 0 || inflight > 0) {
    const base =
      missing > 0
        ? `${missing} roadmap item(s) not yet in queue; ${inflight} still in flight.`
        : `${inflight} roadmap-linked item(s) still queued or in progress.`
    return {
      status: "active",
      summary: appendNotDoneToSummary(base, notDone),
      roadmap_not_done: notDone,
      queue_done: done,
      queue_failed: failed,
      queue_inflight: inflight + missing,
    }
  }

  if (done === roadmapItems.length) {
    return {
      status: "met",
      summary: "All roadmap items are done (or cancelled); run goal-level acceptance if configured.",
      roadmap_not_done: [],
      queue_done: done,
      queue_failed: failed,
      queue_inflight: 0,
    }
  }

  const base = "Roadmap/queue state is inconsistent with expectations."
  return {
    status: "active",
    summary: appendNotDoneToSummary(base, notDone),
    roadmap_not_done: notDone,
    queue_done: done,
    queue_failed: failed,
    queue_inflight: inflight,
  }
}
