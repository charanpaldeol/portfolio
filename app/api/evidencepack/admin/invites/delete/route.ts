import { z } from "zod"

import { getDb } from "@/lib/db"
import { requireEvidencePackFactorySession } from "@/lib/evidencepack-factory-auth"

const bodySchema = z.object({
  id: z.coerce.number().int().positive(),
})

export async function POST(request: Request) {
  try {
    const auth = await requireEvidencePackFactorySession()
    if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status })

    const body: unknown = await request.json()
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 })

    const sql = getDb()
    if (!sql) return Response.json({ error: "Database is not configured" }, { status: 503 })

    await sql`DELETE FROM evidencepack_invites WHERE id = ${parsed.data.id}`
    return Response.json({ success: true })
  } catch (err) {
    console.error("EvidencePack invite delete API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

