"use client"

import { useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"

type BillingStatus = {
  email: string
  invited: boolean
  subscribed: boolean
  subscription: { status: string | null; currentPeriodEnd: string | null }
  stripeCustomerId: string | null
}

type State =
  | { type: "idle" }
  | { type: "starting" }
  | { type: "error"; message: string }
  | { type: "success"; message: string }

function getStringField(payload: unknown, key: string): string | null {
  if (typeof payload !== "object" || payload === null) return null
  const record = payload as Record<string, unknown>
  const value = record[key]
  return typeof value === "string" ? value : null
}

export function EvidencePackBillingClient() {
  const [state, setState] = useState<State>({ type: "idle" })
  const [statusState, setStatusState] = useState<
    | { type: "loading" }
    | { type: "ready"; status: BillingStatus }
    | { type: "error"; message: string }
  >({ type: "loading" })

  const helperText = useMemo(() => {
    if (state.type === "error") return state.message
    if (state.type === "success") return state.message
    return "Checkout is hosted by Stripe."
  }, [state])

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch("/api/evidencepack/billing/status", { cache: "no-store" })
        const json: unknown = await res.json().catch(() => null)
        if (!res.ok) throw new Error(getStringField(json, "error") ?? "Could not load billing status")
        if (typeof json !== "object" || json === null) throw new Error("Invalid response")
        const record = json as Record<string, unknown>
        const status = record["email"] ? (record as unknown as BillingStatus) : null
        if (!status) throw new Error("Invalid response")
        if (!alive) return
        setStatusState({ type: "ready", status })
      } catch (e) {
        if (!alive) return
        setStatusState({ type: "error", message: e instanceof Error ? e.message : "Could not load billing status" })
      }
    }
    load()
    return () => {
      alive = false
    }
  }, [])

  async function onUpgrade() {
    if (state.type === "starting") return
    setState({ type: "starting" })
    try {
      const res = await fetch("/api/evidencepack/billing/create-checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      })
      const json: unknown = await res.json().catch(() => null)
      if (!res.ok) throw new Error(getStringField(json, "error") ?? "Could not start checkout")
      const url = getStringField(json, "url")
      if (!url) throw new Error("Missing checkout URL")
      window.location.href = url
    } catch (e) {
      setState({ type: "error", message: e instanceof Error ? e.message : "Could not start checkout" })
    }
  }

  async function onManageBilling() {
    if (state.type === "starting") return
    setState({ type: "starting" })
    try {
      const res = await fetch("/api/evidencepack/billing/create-portal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      })
      const json: unknown = await res.json().catch(() => null)
      if (!res.ok) throw new Error(getStringField(json, "error") ?? "Could not open customer portal")
      const url = getStringField(json, "url")
      if (!url) throw new Error("Missing portal URL")
      window.location.href = url
    } catch (e) {
      setState({ type: "error", message: e instanceof Error ? e.message : "Could not open customer portal" })
    }
  }

  const subscriptionLabel = (() => {
    if (statusState.type !== "ready") return "—"
    return statusState.status.subscription.status ?? "none"
  })()

  const subscriptionPeriodEnd = (() => {
    if (statusState.type !== "ready") return null
    const raw = statusState.status.subscription.currentPeriodEnd
    if (!raw) return null
    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) return raw
    return d.toLocaleDateString()
  })()

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10" aria-label="Status">
        <h2 className="font-sans text-lg font-semibold tracking-normal text-on-surface">Status</h2>
        <p className="mt-2 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant">
          Subscription: <span className="font-semibold text-on-surface">{subscriptionLabel}</span>
          {subscriptionPeriodEnd ? (
            <>
              {" "}
              <span className="font-sans text-sm font-normal text-on-surface-variant">(renews {subscriptionPeriodEnd})</span>
            </>
          ) : null}
        </p>
        {statusState.type === "error" ? (
          <p className="mt-4 font-sans text-sm font-semibold text-destructive">{statusState.message}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onManageBilling}
            disabled={state.type === "starting" || statusState.type !== "ready" || !statusState.status.stripeCustomerId}
            className={cn(
              "inline-flex h-11 items-center justify-center rounded-xl bg-surface px-5 font-sans text-sm font-semibold text-on-surface shadow-editorial",
              "ring-1 ring-outline-variant/15 hover:bg-surface-container-low disabled:opacity-60"
            )}
          >
            Manage billing
          </button>
        </div>
        <p className={cn("mt-5 font-sans text-xs font-normal leading-relaxed", state.type === "error" ? "text-destructive" : "text-on-surface-variant")} aria-live="polite">
          {helperText}
        </p>
      </section>

      <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10" aria-label="Upgrade">
        <h2 className="font-sans text-lg font-semibold tracking-normal text-on-surface">Upgrade</h2>
        <p className="mt-2 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant">
          Start a subscription to continue using EvidencePack beyond the pilot.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onUpgrade}
            disabled={state.type === "starting"}
            className={cn(
              "inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground shadow-editorial",
              "hover:brightness-[1.02] disabled:opacity-60"
            )}
          >
            {state.type === "starting" ? "Redirecting…" : "Go to Stripe checkout"}
          </button>
        </div>
      </section>
    </div>
  )
}

