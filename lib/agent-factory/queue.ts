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
})
export type AgentFactoryQueueItem = z.infer<typeof AgentFactoryQueueItemSchema>

export const AgentFactoryQueueSchema = z.object({
  version: z.literal(1),
  items: z.array(AgentFactoryQueueItemSchema),
})
export type AgentFactoryQueue = z.infer<typeof AgentFactoryQueueSchema>

export const AgentFactoryRunStatusSchema = z.enum(["started", "succeeded", "failed"])
export type AgentFactoryRunStatus = z.infer<typeof AgentFactoryRunStatusSchema>

export const AgentFactoryRunSchema = z.object({
  run_id: z.string().min(1),
  item_id: z.string().min(1),
  title: z.string().min(1),
  branch: z.string().min(1),
  worktree_path: z.string().min(1),
  status: AgentFactoryRunStatusSchema,
  started_at: z.string().datetime(),
  finished_at: z.string().datetime().nullable(),
  commit_sha: z.string().min(1).nullable(),
  error: z.string().nullable(),
})
export type AgentFactoryRun = z.infer<typeof AgentFactoryRunSchema>

export const AgentFactoryRunsFileSchema = z.object({
  version: z.literal(1),
  runs: z.array(AgentFactoryRunSchema),
})
export type AgentFactoryRunsFile = z.infer<typeof AgentFactoryRunsFileSchema>

export function pickNextFactoryItem(items: AgentFactoryQueueItem[]) {
  return items
    .filter((item) => item.status === "queued")
    .slice()
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority
      return a.created_at.localeCompare(b.created_at)
    })[0]
}

