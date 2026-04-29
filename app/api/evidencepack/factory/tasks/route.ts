import { z } from "zod"

import { addFactoryTask } from "@/lib/agent-factory/mutate"
import { requireEvidencePackFactorySession } from "@/lib/evidencepack-factory-auth"

const bodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  priority: z.number().int().min(0).max(10).default(0),
  spec: z.unknown().optional().default({}),
})

export async function POST(request: Request) {
  try {
    const auth = await requireEvidencePackFactorySession()
    if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status })

    const body: unknown = await request.json()
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) return Response.json({ error: "Invalid task" }, { status: 400 })

    const item = await addFactoryTask(parsed.data)
    return Response.json({ success: true, item })
  } catch (err) {
    console.error("EvidencePack factory task create API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

