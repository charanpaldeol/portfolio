import { cookies } from "next/headers"
import { z } from "zod"

import { getDb } from "@/lib/db"
import { getEvidencePackSessionCookieName, verifyEvidencePackToken } from "@/lib/evidencepack-auth"

const querySchema = z.object({
  id: z.coerce.number().int().positive(),
})

function csvEscape(value: string) {
  if (value.includes("\"") || value.includes(",") || value.includes("\n") || value.includes("\r")) {
    return `"${value.replace(/"/g, "\"\"")}"`
  }
  return value
}

export async function GET(request: Request) {
  try {
    const cookieJar = await cookies()
    const token = cookieJar.get(getEvidencePackSessionCookieName())?.value ?? null
    const session = token ? verifyEvidencePackToken(token) : null
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const url = new URL(request.url)
    const parsedQuery = querySchema.safeParse({ id: url.searchParams.get("id") })
    if (!parsedQuery.success) return Response.json({ error: "Invalid request" }, { status: 400 })

    const sql = getDb()
    if (!sql) return Response.json({ error: "Database is not configured" }, { status: 503 })

    const result: unknown = await sql`SELECT title, headers, rows
      FROM evidencepack_questionnaires
      WHERE id = ${parsedQuery.data.id} AND owner_email = ${session.email}
      LIMIT 1`

    if (!Array.isArray(result) || result.length === 0) {
      return Response.json({ error: "Not found" }, { status: 404 })
    }

    const first = result[0]
    if (typeof first !== "object" || first === null) return Response.json({ error: "Invalid response" }, { status: 500 })
    const record = first as Record<string, unknown>

    const title = typeof record["title"] === "string" ? record["title"] : "questionnaire"
    const headers = Array.isArray(record["headers"]) ? (record["headers"] as unknown[]) : []
    const rows = Array.isArray(record["rows"]) ? (record["rows"] as unknown[]) : []

    const headerCells = headers.map((h) => (typeof h === "string" ? h : ""))
    const dataRows: string[][] = rows
      .slice(0, 5000)
      .map((row) => (Array.isArray(row) ? row.map((c) => (typeof c === "string" ? c : "")) : []))

    const csv = [headerCells, ...dataRows].map((r) => r.map(csvEscape).join(",")).join("\n")
    const safeName = title.trim().replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 80) || "questionnaire"

    return new Response(csv, {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="${safeName}.csv"`,
      },
    })
  } catch (err) {
    console.error("EvidencePack questionnaire export API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

