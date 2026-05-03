import { readFile } from "node:fs/promises"
import path from "node:path"

import { type FactoryGoalSpec, FactoryGoalSpecSchema, resolveGoalRevision } from "@/lib/agent-factory/goal-spec"

export async function readFactoryGoalSpec(repoRoot: string): Promise<FactoryGoalSpec> {
  const raw = await readFile(path.join(repoRoot, "agents", "factory-goal-spec.json"), "utf8")
  return FactoryGoalSpecSchema.parse(JSON.parse(raw) as unknown)
}

export async function readGoalRevisionFromRoot(repoRoot: string): Promise<string> {
  const spec = await readFactoryGoalSpec(repoRoot)
  return resolveGoalRevision(spec)
}
