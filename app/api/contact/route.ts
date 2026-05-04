import { Resend } from "resend"
import { z } from "zod"

import { env } from "@/env.mjs"
import { getDb } from "@/lib/db"

const FROM_EMAIL = env.RESEND_FROM_EMAIL ?? "Contact <onboarding@resend.dev>"
const TO_EMAIL = env.RESEND_TO_EMAIL ?? "cpdeol@outlook.com"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  message: z.string().min(1, "Message is required").max(5000),
})

export async function POST(request: Request) {
  try {
    const apiKey = env.RESEND_API_KEY
    if (!apiKey) {
      return Response.json(
        { error: "Email service is not configured" },
        { status: 503 }
      )
    }

    const resend = new Resend(apiKey)

    const body: unknown = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Invalid request"
      return Response.json({ error: firstError }, { status: 400 })
    }

    const { name, email, message } = parsed.data

    const sql = getDb()
    if (sql) {
      try {
        await sql`
          INSERT INTO contact_submissions (name, email, message)
          VALUES (${name}, ${email}, ${message})
        `
      } catch (dbErr) {
        console.error("Contact DB error:", dbErr)
        return Response.json(
          { error: "Could not save your message. Please try again or email directly." },
          { status: 503 }
        )
      }
    }

    const subject = `Contact from cpdeol.com – ${name}`
    const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `.trim()

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: [email],
      subject,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return Response.json({ error: "Failed to send message. Please try again." }, { status: 500 })
    }

    return Response.json({ id: data?.id })
  } catch (err) {
    console.error("Contact API error:", err)
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
