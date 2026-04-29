import { z } from "zod"

import { env } from "@/env.mjs"
import { getDb } from "@/lib/db"
import { getStripe } from "@/lib/evidencepack-stripe"

const querySchema = z.object({}).strict()

function toPeriodEndDate(seconds: unknown) {
  if (typeof seconds !== "number") return null
  if (!Number.isFinite(seconds)) return null
  return new Date(seconds * 1000).toISOString()
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const parsedQuery = querySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsedQuery.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 })
  }

  try {
    const stripe = getStripe()
    const secret = env.STRIPE_WEBHOOK_SECRET
    if (!stripe || !secret) {
      return Response.json({ error: "Webhook is not configured" }, { status: 503 })
    }

    const signature = request.headers.get("stripe-signature")
    if (!signature) return Response.json({ error: "Missing signature" }, { status: 400 })

    const raw = await request.text()
    const event = stripe.webhooks.constructEvent(raw, signature, secret)

    const sql = getDb()
    if (!sql) {
      console.error("EvidencePack billing webhook: DATABASE_URL missing")
      return Response.json({ error: "Database is not configured" }, { status: 503 })
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const ownerEmail = typeof session.metadata?.owner_email === "string" ? session.metadata.owner_email : null
        const customerId = typeof session.customer === "string" ? session.customer : null
        const subscriptionId = typeof session.subscription === "string" ? session.subscription : null

        if (ownerEmail && customerId) {
          await sql`
            INSERT INTO evidencepack_customers (owner_email, stripe_customer_id)
            VALUES (${ownerEmail}, ${customerId})
            ON CONFLICT (owner_email) DO UPDATE SET stripe_customer_id = EXCLUDED.stripe_customer_id
          `
        }

        if (ownerEmail && subscriptionId) {
          await sql`
            INSERT INTO evidencepack_subscriptions (owner_email, stripe_subscription_id, status)
            VALUES (${ownerEmail}, ${subscriptionId}, 'active')
            ON CONFLICT (owner_email) DO UPDATE SET
              stripe_subscription_id = EXCLUDED.stripe_subscription_id,
              status = EXCLUDED.status,
              updated_at = NOW()
          `
        }

        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object
        const subscriptionId = typeof sub.id === "string" ? sub.id : null
        const status = typeof sub.status === "string" ? sub.status : null
        const periodEndIso = (() => {
          const rawSub: unknown = sub
          if (typeof rawSub !== "object" || rawSub === null) return null
          const record = rawSub as Record<string, unknown>
          return toPeriodEndDate(record["current_period_end"])
        })()
        const ownerEmail = typeof sub.metadata?.owner_email === "string" ? sub.metadata.owner_email : null

        if (ownerEmail && subscriptionId && status) {
          await sql`
            INSERT INTO evidencepack_subscriptions (owner_email, stripe_subscription_id, status, current_period_end)
            VALUES (${ownerEmail}, ${subscriptionId}, ${status}, ${periodEndIso ? periodEndIso : null})
            ON CONFLICT (owner_email) DO UPDATE SET
              stripe_subscription_id = EXCLUDED.stripe_subscription_id,
              status = EXCLUDED.status,
              current_period_end = EXCLUDED.current_period_end,
              updated_at = NOW()
          `
        } else if (subscriptionId && status) {
          await sql`
            UPDATE evidencepack_subscriptions
            SET status = ${status}, current_period_end = ${periodEndIso ? periodEndIso : null}, updated_at = NOW()
            WHERE stripe_subscription_id = ${subscriptionId}
          `
        }

        break
      }
    }

    return Response.json({ received: true })
  } catch (err) {
    console.error("EvidencePack billing webhook error:", err)
    return Response.json({ error: "Webhook error" }, { status: 400 })
  }
}

