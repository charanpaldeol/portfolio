"use client"

import { useState } from "react"

import { subscribeToNewsletter } from "@/lib/newsletter-subscribe"
import { cn } from "@/lib/utils"

type Props = {
  variant?: "inline" | "footer"
}

export function NewsletterSignup({ variant = "inline" }: Props) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === "submitting") return
    setStatus("submitting")
    try {
      const ok = await subscribeToNewsletter(email, { source: variant })
      if (!ok) {
        setStatus("error")
        return
      }
      setStatus("success")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <p
        className={cn(
          "font-sans font-semibold text-primary",
          variant === "footer" ? "text-sm" : "text-base",
        )}
        role="status"
      >
        You&apos;re on the list ✓
      </p>
    )
  }

  if (variant === "footer") {
    return (
      <div className="flex w-full max-w-xl flex-col gap-2">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-2 sm:flex-row sm:items-center"
        >
          <label className="sr-only" htmlFor="newsletter-email-footer">
            Email for newsletter
          </label>
          <input
            id="newsletter-email-footer"
            type="email"
            name="email"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="your@email.com"
            aria-label="Email address for newsletter"
            disabled={status === "submitting"}
            className={cn(
              "min-w-0 flex-1 rounded-lg bg-surface px-3 py-2 font-sans text-sm text-on-surface",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              status === "submitting" && "opacity-70",
            )}
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className={cn(
              "shrink-0 rounded-lg bg-primary px-4 py-2 font-sans text-sm font-semibold text-primary-foreground",
              "transition-opacity hover:opacity-90 disabled:opacity-60",
            )}
          >
            {status === "submitting" ? "Joining…" : "Subscribe"}
          </button>
        </form>
        {status === "error" ? (
          <p className="font-sans text-xs text-on-surface-variant" role="alert">
            Something went wrong — try again
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <section
      className="w-full rounded-2xl bg-surface-container-low px-6 py-8 md:px-10 md:py-10"
      aria-labelledby="newsletter-heading"
    >
      <p className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
        Stay in the loop
      </p>
      <h2
        id="newsletter-heading"
        className="mt-3 font-display text-2xl font-bold tracking-tight text-on-surface"
      >
        Get new articles when they drop
      </h2>
      <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-on-surface-variant md:text-base">
        Product design, AI workflows, and systems thinking — roughly once a month. No noise.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 md:flex-row md:items-stretch">
        <label className="sr-only" htmlFor="newsletter-email-inline">
          Email for newsletter
        </label>
        <input
          id="newsletter-email-inline"
          type="email"
          name="email"
          required
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder="your@email.com"
          aria-label="Email address for newsletter"
          disabled={status === "submitting"}
          className={cn(
            "min-w-0 flex-1 rounded-lg bg-surface px-4 py-3 font-sans text-on-surface",
            "focus:outline-none focus:ring-2 focus:ring-primary",
            status === "submitting" && "opacity-70",
          )}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className={cn(
            "shrink-0 rounded-lg bg-primary px-6 py-3 font-sans font-semibold text-primary-foreground",
            "transition-opacity hover:opacity-90 disabled:opacity-60 md:self-stretch",
          )}
        >
          {status === "submitting" ? "Joining…" : "Join the list"}
        </button>
      </form>
      {status === "error" ? (
        <p className="mt-3 font-sans text-sm text-on-surface-variant" role="alert">
          Something went wrong — try again
        </p>
      ) : null}
      <p className="mt-2 font-sans text-xs text-on-surface-variant">No spam. Unsubscribe any time.</p>
    </section>
  )
}
