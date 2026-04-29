import { cookies } from "next/headers"
import { z } from "zod"

import { env } from "@/env.mjs"
import { getDb } from "@/lib/db"
import { getEvidencePackSessionCookieName, verifyEvidencePackToken } from "@/lib/evidencepack-auth"
import { getStripe } from "@/lib/evidencepack-stripe"

const bodySchema = z.object({}).strict()

function getStringField(row: unknown, key: string): string | null {
  if (typeof row !== "object" || row === null) return null
  const record = row as Record<string, unknown>
  const value = record[key]
  return typeof value === "string" ? value : null
}

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

    const sql = getDb()
    if (!sql) return Response.json({ error: "Database is not configured" }, { status: 503 })

    const rows: unknown = await sql`SELECT stripe_customer_id FROM evidencepack_customers WHERE owner_email = ${session.email} LIMIT 1`
    const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : null
    const customerId = first ? getStringField(first, "stripe_customer_id") : null
    if (!customerId) return Response.json({ error: "No Stripe customer found yet" }, { status: 404 })

    const siteUrl = env.SITE_URL?.trim() || "https://cpdeol.com"
    const returnUrl = `${siteUrl}/evidencepack/app/billing`

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return Response.json({ success: true, url: portal.url })
  } catch (err) {
    console.error("EvidencePack billing portal API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

