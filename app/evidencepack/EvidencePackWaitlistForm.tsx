"use client"

import { useMemo, useState } from "react"

import { cn } from "@/lib/utils"

type FormState =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success"; message: string }
  | { type: "error"; message: string }

function getStringField(payload: unknown, key: string): string | null {
  if (typeof payload !== "object" || payload === null) return null
  const record = payload as Record<string, unknown>
  const value = record[key]
  return typeof value === "string" ? value : null
}

export function EvidencePackWaitlistForm() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [state, setState] = useState<FormState>({ type: "idle" })

  const disabled = state.type === "submitting" || state.type === "success"

  const helperText = useMemo(() => {
    if (state.type === "success") return state.message
    if (state.type === "error") return state.message
    return "No spam. You can opt out anytime."
  }, [state])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (disabled) return

    setState({ type: "submitting" })

    try {
      const res = await fetch("/api/evidencepack/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, name, company }),
      })

      const json: unknown = await res.json().catch(() => null)

      if (!res.ok) {
        const msg = getStringField(json, "error") ?? "Something went wrong. Please try again."
        setState({ type: "error", message: msg })
        return
      }

      const msg = getStringField(json, "message") ?? "You’re on the list."

      setState({ type: "success", message: msg })
    } catch {
      setState({ type: "error", message: "Network error. Please try again." })
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="flex min-w-0 flex-col gap-2 md:col-span-1">
          <span className="font-sans text-xs font-semibold tracking-[0.15em] text-on-surface-variant uppercase">Name (optional)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={disabled}
            className={cn(
              "h-11 w-full rounded-xl bg-surface px-4 font-sans text-sm text-on-surface shadow-editorial outline-none",
              "ring-1 ring-outline-variant/15 focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            )}
            autoComplete="name"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-2 md:col-span-1">
          <span className="font-sans text-xs font-semibold tracking-[0.15em] text-on-surface-variant uppercase">Company (optional)</span>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={disabled}
            className={cn(
              "h-11 w-full rounded-xl bg-surface px-4 font-sans text-sm text-on-surface shadow-editorial outline-none",
              "ring-1 ring-outline-variant/15 focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            )}
            autoComplete="organization"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-2 md:col-span-1">
          <span className="font-sans text-xs font-semibold tracking-[0.15em] text-on-surface-variant uppercase">Work email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled}
            className={cn(
              "h-11 w-full rounded-xl bg-surface px-4 font-sans text-sm text-on-surface shadow-editorial outline-none",
              "ring-1 ring-outline-variant/15 focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            )}
            type="email"
            autoComplete="email"
            required
          />
        </label>
      </div>

      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <button
          type="submit"
          disabled={disabled}
          className={cn(
            "inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground shadow-editorial",
            "hover:brightness-[1.02] disabled:opacity-60"
          )}
        >
          {state.type === "submitting" ? "Submitting…" : state.type === "success" ? "Submitted" : "Request access"}
        </button>

        <p
          className={cn(
            "font-sans text-xs font-normal leading-relaxed",
            state.type === "error" ? "text-destructive" : "text-on-surface-variant"
          )}
          aria-live="polite"
        >
          {helperText}
        </p>
      </div>
    </form>
  )
}

