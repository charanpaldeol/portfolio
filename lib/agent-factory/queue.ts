import { z } from "zod"

export const AgentFactoryItemStatusSchema = z.enum(["queued", "in_progress", "blocked", "done", "failed", "cancelled"])
export type AgentFactoryItemStatus = z.infer<typeof AgentFactoryItemStatusSchema>

export const AgentFactoryQueueItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  spec: z.unknown(),
  status: AgentFactoryItemStatusSchema,
  priority: z.number().int().min(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  claimed_by: z.preprocess((v) => (v === undefined ? null : v), z.string().min(1).nullable()) as z.ZodType<string | null>,
  claimed_at: z.preprocess((v) => (v === undefined ? null : v), z.string().datetime().nullable()) as z.ZodType<string | null>,
})
export type AgentFactoryQueueItem = z.output<typeof AgentFactoryQueueItemSchema>

export const AgentFactoryQueueSchema = z.object({
  version: z.literal(1),
  items: z.array(AgentFactoryQueueItemSchema),
})
export type AgentFactoryQueue = z.output<typeof AgentFactoryQueueSchema>

export const AgentFactoryRunStatusSchema = z.enum(["started", "succeeded", "failed"])
export type AgentFactoryRunStatus = z.infer<typeof AgentFactoryRunStatusSchema>

export const AgentFactoryRunSchema = z.object({
  run_id: z.string().min(1),
  item_id: z.string().min(1),
  title: z.string().min(1),
  branch: z.string().min(1),
  worktree_path: z.string().min(1),
  worker_id: z.preprocess((v) => (v === undefined ? null : v), z.string().min(1).nullable()) as z.ZodType<string | null>,
  status: AgentFactoryRunStatusSchema,
  started_at: z.string().datetime(),
  finished_at: z.string().datetime().nullable(),
  commit_sha: z.string().min(1).nullable(),
  error: z.string().nullable(),
})
export type AgentFactoryRun = z.output<typeof AgentFactoryRunSchema>

export const AgentFactoryRunsFileSchema = z.object({
  version: z.literal(1),
  runs: z.array(AgentFactoryRunSchema),
})
export type AgentFactoryRunsFile = z.output<typeof AgentFactoryRunsFileSchema>

export function pickNextFactoryItem<T extends { status: AgentFactoryItemStatus; priority: number; created_at: string }>(items: T[]) {
  return items
    .filter((item) => item.status === "queued")
    .slice()
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority
      return a.created_at.localeCompare(b.created_at)
    })[0]
}

