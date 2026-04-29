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

export function EvidencePackLoginForm() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<FormState>({ type: "idle" })

  const disabled = state.type === "submitting" || state.type === "success"

  const helperText = useMemo(() => {
    if (state.type === "success") return state.message
    if (state.type === "error") return state.message
    return "Magic link expires in 15 minutes."
  }, [state])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (disabled) return
    setState({ type: "submitting" })

    try {
      const res = await fetch("/api/evidencepack/auth/request-link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const json: unknown = await res.json().catch(() => null)
      if (!res.ok) {
        setState({ type: "error", message: getStringField(json, "error") ?? "Could not send link. Try again." })
        return
      }

      setState({ type: "success", message: getStringField(json, "message") ?? "Check your inbox." })
    } catch {
      setState({ type: "error", message: "Network error. Please try again." })
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <label className="flex min-w-0 flex-col gap-2">
        <span className="font-sans text-xs font-semibold tracking-[0.15em] text-on-surface-variant uppercase">Email</span>
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

      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <button
          type="submit"
          disabled={disabled}
          className={cn(
            "inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground shadow-editorial",
            "hover:brightness-[1.02] disabled:opacity-60"
          )}
        >
          {state.type === "submitting" ? "Sending…" : state.type === "success" ? "Sent" : "Send magic link"}
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

