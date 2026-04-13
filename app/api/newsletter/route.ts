import { Resend } from "resend"
import { z } from "zod"

import { env } from "@/env.mjs"

const subscribeSchema = z.object({
  email: z.string().email().max(255),
})

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const parsed = subscribeSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ error: "Invalid email address" }, { status: 400 })
    }

    const { email } = parsed.data
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
        return Response.json({ error: "Something went wrong." }, { status: 500 })
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
