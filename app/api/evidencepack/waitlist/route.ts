import { z } from "zod"

import { env } from "@/env.mjs"
import { getDb } from "@/lib/db"

const isDev = process.env.NODE_ENV !== "production"

const waitlistSchema = z.object({
  email: z.string().trim().email().max(255),
  name: z.string().trim().min(1).max(120).optional(),
  company: z.string().trim().min(1).max(160).optional(),
})

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const parsed = waitlistSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ error: "Invalid signup details" }, { status: 400 })
    }

    const { email, name, company } = parsed.data
    const emailNormalized = email.toLowerCase()

    const sql = getDb()
    if (sql) {
      try {
        await sql`
          INSERT INTO evidencepack_waitlist (email, email_normalized, name, company)
          VALUES (${email}, ${emailNormalized}, ${name ?? null}, ${company ?? null})
          ON CONFLICT (email_normalized) DO UPDATE SET
            name = COALESCE(EXCLUDED.name, evidencepack_waitlist.name),
            company = COALESCE(EXCLUDED.company, evidencepack_waitlist.company),
            updated_at = NOW()
        `
      } catch (dbErr) {
        console.error("EvidencePack waitlist DB error:", dbErr)
        if (isDev) {
          console.warn(
            "[evidencepack] Dev: continuing without DB. Create the table with db/evidencepack_waitlist.sql if you want persistence.",
          )
        } else {
          return Response.json({ error: "Could not save your request. Please try again." }, { status: 503 })
        }
      }
    }

    const apiKey = env.RESEND_API_KEY
    const toEmail = env.RESEND_TO_EMAIL
    const fromEmail = env.RESEND_FROM_EMAIL

    if (apiKey && toEmail && fromEmail) {
      const { Resend } = await import("resend")
      const resend = new Resend(apiKey)

      const subject = "EvidencePack pilot request"
      const text = [`Email: ${email}`, name ? `Name: ${name}` : null, company ? `Company: ${company}` : null]
        .filter(Boolean)
        .join("\n")

      const { error } = await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        subject,
        text,
      })

      if (error) {
        console.error("EvidencePack waitlist email error:", error)
      }
    }

    return Response.json({ success: true, message: "Request received. I’ll follow up soon." })
  } catch (err) {
    console.error("EvidencePack waitlist API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

