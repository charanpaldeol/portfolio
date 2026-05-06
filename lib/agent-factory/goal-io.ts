import { readFile } from "node:fs/promises"
import path from "node:path"

import {
  type FactoryGoalSpec,
  type FactoryGoalSpecV2,
  FactoryGoalSpecSchema,
  FactoryGoalSpecV2Schema,
  flattenV2StoriesToRoadmapItems,
  resolveGoalRevision,
} from "@/lib/agent-factory/goal-spec"

/**
 * Reads factory-goal-spec.json, accepting both v1 and v2 formats.
 * For v2, stories are flattened into roadmap_items so all existing callers work unchanged.
 */
export async function readFactoryGoalSpec(repoRoot: string): Promise<FactoryGoalSpec> {
  const raw = await readFile(path.join(repoRoot, "agents", "factory-goal-spec.json"), "utf8")
  const parsed = JSON.parse(raw) as unknown

  const v2 = FactoryGoalSpecV2Schema.safeParse(parsed)
  if (v2.success) {
    return {
      version: 1,
      statement: v2.data.statement,
      goal_revision: v2.data.goal_revision,
      goal_acceptance: v2.data.goal_acceptance,
      roadmap_items: flattenV2StoriesToRoadmapItems(v2.data),
    }
  }

  return FactoryGoalSpecSchema.parse(parsed)
}

/** Reads the raw spec preserving the original version (v1 or v2). Used by plan-from-goal for full validation. */
export async function readFactoryGoalSpecRaw(repoRoot: string): Promise<FactoryGoalSpec | FactoryGoalSpecV2> {
  const raw = await readFile(path.join(repoRoot, "agents", "factory-goal-spec.json"), "utf8")
  const parsed = JSON.parse(raw) as unknown

  const v2 = FactoryGoalSpecV2Schema.safeParse(parsed)
  if (v2.success) return v2.data

  return FactoryGoalSpecSchema.parse(parsed)
}

export async function readGoalRevisionFromRoot(repoRoot: string): Promise<string> {
  const spec = await readFactoryGoalSpec(repoRoot)
  return resolveGoalRevision(spec)
}
