import { put } from "@vercel/blob"
import { cookies } from "next/headers"
import { z } from "zod"

import { getDb } from "@/lib/db"
import { getEvidencePackSessionCookieName, verifyEvidencePackToken } from "@/lib/evidencepack-auth"

const querySchema = z.object({
  kind: z.enum(["doc", "questionnaire"]),
})

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const parsedQuery = querySchema.safeParse({ kind: url.searchParams.get("kind") })
    if (!parsedQuery.success) {
      return Response.json({ error: "Invalid upload request" }, { status: 400 })
    }

    const cookieJar = await cookies()
    const token = cookieJar.get(getEvidencePackSessionCookieName())?.value ?? null
    const session = token ? verifyEvidencePackToken(token) : null
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const form = await request.formData()
    const file = form.get("file")
    if (!(file instanceof File)) {
      return Response.json({ error: "Missing file" }, { status: 400 })
    }

    const safeBase = file.name.trim().replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 120) || "upload"
    const key = `evidencepack/${session.email}/${Date.now()}-${safeBase}`

    const blob = await put(key, file, {
      access: "private",
      addRandomSuffix: false,
    })

    const sql = getDb()
    if (sql) {
      try {
        await sql`
          INSERT INTO evidencepack_files (owner_email, kind, filename, content_type, byte_size, blob_url)
          VALUES (${session.email}, ${parsedQuery.data.kind}, ${file.name}, ${file.type || null}, ${file.size}, ${blob.url})
        `
      } catch (dbErr) {
        console.error("EvidencePack files DB error:", dbErr)
      }
    }

    return Response.json({
      success: true,
      url: blob.url,
      filename: file.name,
      contentType: file.type,
      byteSize: file.size,
    })
  } catch (err) {
    console.error("EvidencePack upload API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

