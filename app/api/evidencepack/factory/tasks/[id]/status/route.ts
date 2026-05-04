import { z } from "zod"

import { setFactoryTaskStatus } from "@/lib/agent-factory/mutate"
import { AgentFactoryItemStatusSchema } from "@/lib/agent-factory/queue"
import { requireEvidencePackFactorySession } from "@/lib/evidencepack-factory-auth"

const paramsSchema = z.object({
  id: z.string().min(1),
})

const bodySchema = z.object({
  status: AgentFactoryItemStatusSchema,
})

export async function PATCH(request: Request, ctx: unknown) {
  try {
    const auth = await requireEvidencePackFactorySession()
    if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status })

    const parsedParams = paramsSchema.safeParse((ctx as { params?: unknown } | null)?.params)
    if (!parsedParams.success) return Response.json({ error: "Invalid task id" }, { status: 400 })

    const body: unknown = await request.json()
    const parsedBody = bodySchema.safeParse(body)
    if (!parsedBody.success) return Response.json({ error: "Invalid status" }, { status: 400 })

    const item = await setFactoryTaskStatus({ id: parsedParams.data.id, status: parsedBody.data.status })
    if (!item) return Response.json({ error: "Not found" }, { status: 404 })

    return Response.json({ success: true, item })
  } catch (err) {
    console.error("EvidencePack factory task status API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

