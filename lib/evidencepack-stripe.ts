import Stripe from "stripe"

import { env } from "@/env.mjs"

let stripe: Stripe.Stripe | null = null

export function getStripe() {
  const key = env.STRIPE_SECRET_KEY
  if (!key) return null
  if (!stripe) {
    stripe = new Stripe(key, {
      apiVersion: "2026-04-22.dahlia",
    })
  }
  return stripe
}

