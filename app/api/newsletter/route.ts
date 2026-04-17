import { Resend } from "resend"
import { z } from "zod"

import { env } from "@/env.mjs"
import { getDb } from "@/lib/db"

const isDev = process.env.NODE_ENV !== "production"

const subscribeSchema = z.object({
  email: z.string().trim().email().max(255),
  source: z.enum(["footer", "inline"]).optional().default("inline"),
})

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const parsed = subscribeSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ error: "Invalid email address" }, { status: 400 })
    }

    const { email, source } = parsed.data
    const emailNormalized = email.toLowerCase()

    const sql = getDb()
    if (sql) {
      try {
        await sql`
          INSERT INTO newsletter_subscriptions (email, email_normalized, source)
          VALUES (${email}, ${emailNormalized}, ${source})
          ON CONFLICT (email_normalized) DO NOTHING
        `
      } catch (dbErr) {
        console.error("Newsletter DB error:", dbErr)
        if (isDev) {
          console.warn(
            "[newsletter] Dev: continuing without DB. Create the table with portfolio/db/newsletter_subscriptions.sql if you want local persistence.",
          )
        } else {
          return Response.json(
            { error: "Could not save your subscription. Please try again." },
            { status: 503 },
          )
        }
      }
    }

    const audienceId = env.RESEND_AUDIENCE_ID?.trim()

    if (audienceId) {
      const apiKey = env.RESEND_API_KEY
      if (!apiKey) {
        return Response.json(
          { error: "Email service is not configured" },
          { status: 503 },
        )
      }

      const resend = new Resend(apiKey)
      const { error } = await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      })

      if (error) {
        console.error("Resend newsletter error:", error)
        if (isDev) {
          console.warn(
            "[newsletter] Dev: Resend audience sync failed; signup still accepted locally. Check RESEND_API_KEY / RESEND_AUDIENCE_ID or leave RESEND_AUDIENCE_ID unset.",
          )
        } else {
          return Response.json({ error: "Something went wrong." }, { status: 500 })
        }
      }
    } else {
      console.info("Newsletter signup (no RESEND_AUDIENCE_ID):", email)
    }

    return Response.json({
      success: true,
      message: "You're on the list.",
    })
  } catch (err) {
    console.error("Newsletter API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}
