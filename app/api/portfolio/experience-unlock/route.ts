import { z } from "zod"

import { getDb } from "@/lib/db"

const bodySchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
})

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const parsed = bodySchema.safeParse(body)

    if (!parsed.success) {
      const first = parsed.error.errors[0]?.message ?? "Invalid request"
      return Response.json({ error: first }, { status: 400 })
    }

    const email = parsed.data.email.toLowerCase()

    const sql = getDb()
    if (!sql) {
      console.error("experience-unlock: DATABASE_URL is not configured")
      return Response.json(
        { error: "This feature is temporarily unavailable. Please try again later." },
        { status: 503 },
      )
    }

    try {
      await sql`
        INSERT INTO experience_unlocks (email)
        VALUES (${email})
      `
    } catch (dbErr) {
      console.error("experience-unlock DB error:", dbErr)
      return Response.json(
        { error: "Could not save your email. Please try again." },
        { status: 503 },
      )
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error("experience-unlock API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}
