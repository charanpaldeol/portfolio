import { z } from "zod"

import { appendFactoryRun } from "@/lib/agent-factory/mutate"
import { AgentFactoryRunStatusSchema } from "@/lib/agent-factory/queue"
import { requireEvidencePackFactorySession } from "@/lib/evidencepack-factory-auth"

const bodySchema = z.object({
  item_id: z.string().trim().min(1),
  title: z.string().trim().min(1).max(200),
  branch: z.string().trim().min(1).max(200),
  worktree_path: z.string().trim().min(1).max(500),
  worker_id: z.string().trim().min(1).nullable().optional().default(null),
  status: AgentFactoryRunStatusSchema,
  started_at: z
    .string()
    .datetime()
    .optional()
    .default(() => new Date().toISOString()),
  finished_at: z.string().datetime().nullable().optional().default(null),
  commit_sha: z.string().trim().min(1).nullable().optional().default(null),
  error: z.string().nullable().optional().default(null),
})

export async function POST(request: Request) {
  try {
    const auth = await requireEvidencePackFactorySession()
    if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status })

    const body: unknown = await request.json()
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) return Response.json({ error: "Invalid run" }, { status: 400 })

    const run = await appendFactoryRun({ ...parsed.data, worker_id: parsed.data.worker_id ?? null })
    return Response.json({ success: true, run })
  } catch (err) {
    console.error("EvidencePack factory run append API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

