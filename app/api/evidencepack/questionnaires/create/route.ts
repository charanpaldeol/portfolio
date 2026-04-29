import { cookies } from "next/headers"
import { z } from "zod"

import { getDb } from "@/lib/db"
import { getEvidencePackSessionCookieName, verifyEvidencePackToken } from "@/lib/evidencepack-auth"

const bodySchema = z.object({
  title: z.string().trim().min(1).max(120),
  headers: z.array(z.string().max(200)).min(1).max(200),
  rows: z.array(z.array(z.string().max(5000)).max(200)).max(2000),
})

export async function POST(request: Request) {
  try {
    const cookieJar = await cookies()
    const token = cookieJar.get(getEvidencePackSessionCookieName())?.value ?? null
    const session = token ? verifyEvidencePackToken(token) : null
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const body: unknown = await request.json()
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: "Invalid questionnaire" }, { status: 400 })
    }

    const sql = getDb()
    if (!sql) {
      return Response.json({ error: "Database is not configured" }, { status: 503 })
    }

    const { title, headers, rows } = parsed.data

    const result: unknown = await sql`INSERT INTO evidencepack_questionnaires (owner_email, title, headers, rows)
      VALUES (${session.email}, ${title}, ${JSON.stringify(headers)}::jsonb, ${JSON.stringify(rows)}::jsonb)
      RETURNING id`

    const id = (() => {
      if (!Array.isArray(result)) return null
      const first = result[0]
      if (typeof first !== "object" || first === null) return null
      const record = first as Record<string, unknown>
      return typeof record["id"] === "number" ? record["id"] : null
    })()
    return Response.json({ success: true, id })
  } catch (err) {
    console.error("EvidencePack questionnaire create API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

