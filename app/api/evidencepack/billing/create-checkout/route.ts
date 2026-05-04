import { cookies } from "next/headers"
import { z } from "zod"

import { env } from "@/env.mjs"
import { getDb } from "@/lib/db"
import { getEvidencePackSessionCookieName, verifyEvidencePackToken } from "@/lib/evidencepack-auth"
import { getStripe } from "@/lib/evidencepack-stripe"

const bodySchema = z.object({}).strict()

export async function POST(request: Request) {
  try {
    const cookieJar = await cookies()
    const token = cookieJar.get(getEvidencePackSessionCookieName())?.value ?? null
    const session = token ? verifyEvidencePackToken(token) : null
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const body: unknown = await request.json().catch(() => ({}))
    const parsedBody = bodySchema.safeParse(body)
    if (!parsedBody.success) return Response.json({ error: "Invalid request" }, { status: 400 })

    const stripe = getStripe()
    if (!stripe) return Response.json({ error: "Billing is not configured" }, { status: 503 })

    const priceId = env.STRIPE_PRICE_ID?.trim()
    if (!priceId) return Response.json({ error: "Billing is not configured" }, { status: 503 })

    const siteUrl = env.SITE_URL?.trim() || "https://cpdeol.com"
    const successUrl = `${siteUrl}/evidencepack/app/billing?success=1`
    const cancelUrl = `${siteUrl}/evidencepack/app/billing?canceled=1`

    const sql = getDb()
    const customerId = await (async () => {
      if (!sql) return null
      try {
        const existing: unknown = await sql`SELECT stripe_customer_id FROM evidencepack_customers WHERE owner_email = ${session.email} LIMIT 1`
        if (Array.isArray(existing) && typeof existing[0] === "object" && existing[0]) {
          const record = existing[0] as Record<string, unknown>
          if (typeof record["stripe_customer_id"] === "string") return record["stripe_customer_id"]
        }
      } catch (e) {
        console.error("EvidencePack billing DB lookup error:", e)
      }
      return null
    })()

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId ?? undefined,
      customer_email: customerId ? undefined : session.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { owner_email: session.email },
      },
      metadata: { owner_email: session.email },
    })

    if (!checkout.url) return Response.json({ error: "Could not start checkout" }, { status: 500 })

    return Response.json({ success: true, url: checkout.url })
  } catch (err) {
    console.error("EvidencePack billing create-checkout API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

