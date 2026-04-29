import { Resend } from "resend"
import { z } from "zod"

import { env } from "@/env.mjs"
import { createEvidencePackMagicLinkToken } from "@/lib/evidencepack-auth"

const reqSchema = z.object({
  email: z.string().trim().email().max(255),
})

export async function POST(request: Request) {
  try {
    const apiKey = env.RESEND_API_KEY
    const fromEmail = env.RESEND_FROM_EMAIL

    if (!apiKey || !fromEmail) {
      return Response.json({ error: "Email service is not configured" }, { status: 503 })
    }

    const secret = env.EVIDENCEPACK_AUTH_SECRET
    if (!secret) {
      return Response.json({ error: "Auth is not configured" }, { status: 503 })
    }

    const body: unknown = await request.json()
    const parsed = reqSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: "Invalid email address" }, { status: 400 })
    }

    const { email } = parsed.data
    const token = createEvidencePackMagicLinkToken(email, 15 * 60 * 1000)
    if (!token) {
      return Response.json({ error: "Auth is not configured" }, { status: 503 })
    }

    const url = new URL(request.url)
    const origin = `${url.protocol}//${url.host}`
    const callbackUrl = new URL("/api/evidencepack/auth/callback", origin)
    callbackUrl.searchParams.set("token", token)

    const resend = new Resend(apiKey)
    const subject = "Your EvidencePack magic link"
    const text = `Use this link to sign in (expires in 15 minutes):\n\n${callbackUrl.toString()}\n`

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject,
      text,
    })

    if (error) {
      console.error("EvidencePack auth email error:", error)
      return Response.json({ error: "Could not send link. Please try again." }, { status: 500 })
    }

    return Response.json({ success: true, message: "Magic link sent. Check your inbox." })
  } catch (err) {
    console.error("EvidencePack auth request-link API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

