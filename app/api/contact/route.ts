import { Resend } from "resend"

import { env } from "@/env.mjs"

const FROM_EMAIL = env.RESEND_FROM_EMAIL ?? "Contact <onboarding@resend.dev>"
const TO_EMAIL = env.RESEND_TO_EMAIL ?? "hello@cpdeol.com"

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

    const body = (await request.json()) as { name?: unknown; email?: unknown; message?: unknown }
  const name = String(body.name ?? "").trim()
  const email = String(body.email ?? "").trim()
  const message = String(body.message ?? "").trim()

  if (!name || !email || !message) {
    return Response.json(
      { error: "Name, email, and message are required" },
      { status: 400 }
    )
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
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ id: data?.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("Contact API error:", err)
    return Response.json({ error: message }, { status: 500 })
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
