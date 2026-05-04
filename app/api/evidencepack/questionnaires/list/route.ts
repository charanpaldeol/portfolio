import { cookies } from "next/headers"
import { z } from "zod"

import { getDb } from "@/lib/db"
import { getEvidencePackSessionCookieName, verifyEvidencePackToken } from "@/lib/evidencepack-auth"

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional(),
})

export async function GET(request: Request) {
  try {
    const cookieJar = await cookies()
    const token = cookieJar.get(getEvidencePackSessionCookieName())?.value ?? null
    const session = token ? verifyEvidencePackToken(token) : null
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const url = new URL(request.url)
    const parsedQuery = querySchema.safeParse({ limit: url.searchParams.get("limit") })
    if (!parsedQuery.success) return Response.json({ error: "Invalid request" }, { status: 400 })
    const limit = parsedQuery.data.limit ?? 20

    const sql = getDb()
    if (!sql) return Response.json({ error: "Database is not configured" }, { status: 503 })

    const rows: unknown = await sql`SELECT id, title, created_at
      FROM evidencepack_questionnaires
      WHERE owner_email = ${session.email}
      ORDER BY created_at DESC
      LIMIT ${limit}`

    return Response.json({ success: true, items: rows })
  } catch (err) {
    console.error("EvidencePack questionnaire list API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

