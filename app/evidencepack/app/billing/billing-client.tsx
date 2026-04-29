"use client"

import { useMemo, useState } from "react"

import { cn } from "@/lib/utils"

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

  const helperText = useMemo(() => {
    if (state.type === "error") return state.message
    if (state.type === "success") return state.message
    return "Checkout is hosted by Stripe."
  }, [state])

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

  return (
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

      <p className={cn("mt-5 font-sans text-xs font-normal leading-relaxed", state.type === "error" ? "text-destructive" : "text-on-surface-variant")} aria-live="polite">
        {helperText}
      </p>
    </section>
  )
}

