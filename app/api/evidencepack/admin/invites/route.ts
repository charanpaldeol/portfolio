import { z } from "zod"

import { getDb } from "@/lib/db"
import { requireEvidencePackFactorySession } from "@/lib/evidencepack-factory-auth"

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

const createInviteSchema = z.object({
  email: z.string().trim().email().max(320),
  note: z.string().trim().max(500).optional(),
})

export async function GET() {
  try {
    const auth = await requireEvidencePackFactorySession()
    if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status })

    const sql = getDb()
    if (!sql) return Response.json({ error: "Database is not configured" }, { status: 503 })

    const rows: unknown = await sql`
      SELECT id, invited_email, note, created_at
      FROM evidencepack_invites
      ORDER BY created_at DESC
      LIMIT 200
    `

    return Response.json({ success: true, items: rows })
  } catch (err) {
    console.error("EvidencePack invites list API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireEvidencePackFactorySession()
    if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status })

    const body: unknown = await request.json()
    const parsed = createInviteSchema.safeParse(body)
    if (!parsed.success) return Response.json({ error: "Invalid invite" }, { status: 400 })

    const sql = getDb()
    if (!sql) return Response.json({ error: "Database is not configured" }, { status: 503 })

    const invitedEmail = parsed.data.email.trim()
    const invitedEmailNormalized = normalizeEmail(invitedEmail)
    const note = parsed.data.note?.trim() ? parsed.data.note.trim() : null

    const rows: unknown = await sql`
      INSERT INTO evidencepack_invites (invited_email, invited_email_normalized, note)
      VALUES (${invitedEmail}, ${invitedEmailNormalized}, ${note})
      ON CONFLICT (invited_email_normalized)
      DO UPDATE SET note = EXCLUDED.note
      RETURNING id, invited_email, note, created_at
    `

    const item = Array.isArray(rows) && rows.length > 0 ? rows[0] : null
    return Response.json({ success: true, item })
  } catch (err) {
    console.error("EvidencePack invite create API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

