import { cookies } from "next/headers"
import { z } from "zod"

import { getDb } from "@/lib/db"
import { getEvidencePackAccess } from "@/lib/evidencepack-access"
import { getEvidencePackSessionCookieName, verifyEvidencePackToken } from "@/lib/evidencepack-auth"

const querySchema = z.object({}).strict()

function getStringField(row: unknown, key: string): string | null {
  if (typeof row !== "object" || row === null) return null
  const record = row as Record<string, unknown>
  const value = record[key]
  return typeof value === "string" ? value : null
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const parsedQuery = querySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsedQuery.success) return Response.json({ error: "Invalid request" }, { status: 400 })

  try {
    const cookieJar = await cookies()
    const token = cookieJar.get(getEvidencePackSessionCookieName())?.value ?? null
    const session = token ? verifyEvidencePackToken(token) : null
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const access = await getEvidencePackAccess(session.email)

    const sql = getDb()
    if (!sql) return Response.json({ error: "Database is not configured" }, { status: 503 })

    const subscriptionRows: unknown = await sql`
      SELECT status, current_period_end
      FROM evidencepack_subscriptions
      WHERE owner_email = ${session.email}
      LIMIT 1
    `
    const subscriptionRow = Array.isArray(subscriptionRows) && subscriptionRows.length > 0 ? subscriptionRows[0] : null
    const subscriptionStatus = subscriptionRow ? getStringField(subscriptionRow, "status") : null
    const currentPeriodEnd = subscriptionRow ? getStringField(subscriptionRow, "current_period_end") : null

    const customerRows: unknown = await sql`
      SELECT stripe_customer_id
      FROM evidencepack_customers
      WHERE owner_email = ${session.email}
      LIMIT 1
    `
    const customerRow = Array.isArray(customerRows) && customerRows.length > 0 ? customerRows[0] : null
    const stripeCustomerId = customerRow ? getStringField(customerRow, "stripe_customer_id") : null

    return Response.json({
      success: true,
      email: session.email,
      invited: access.invited,
      subscribed: access.subscribed,
      subscription: {
        status: subscriptionStatus,
        currentPeriodEnd,
      },
      stripeCustomerId,
    })
  } catch (err) {
    console.error("EvidencePack billing status API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

