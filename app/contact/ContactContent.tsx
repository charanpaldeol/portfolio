"use client"

import { FormEvent, useState } from "react"

import { AnimatedGradientText } from "components/magicui/animated-gradient-text"
import { BlurFade } from "components/magicui/blur-fade"
import { ShimmerButton } from "components/magicui/shimmer-button"

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name")?.toString() ?? ""
    const email = formData.get("email")?.toString() ?? ""
    const message = formData.get("message")?.toString() ?? ""

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    })

    const data = (await res.json().catch(() => ({}))) as { error?: string }

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.")
      setSubmitting(false)
      return
    }

    setSuccess(true)
    setSubmitting(false)
    ;(event.target as HTMLFormElement).reset()
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex-1">
          <AnimatedGradientText className="mb-3">
            Contact
          </AnimatedGradientText>

          <BlurFade>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              Let&apos;s build something great together
            </h1>
          </BlurFade>

          <BlurFade delay={0.05}>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Tell me a bit about your project, team, or idea. I&apos;ll get back to you at{" "}
              <a href="mailto:hello@cpdeol.com" className="font-medium text-foreground underline decoration-tertiary/35 underline-offset-4 transition hover:decoration-tertiary">
                hello@cpdeol.com
              </a>{" "}
              as soon as I can.
            </p>
          </BlurFade>

          <BlurFade delay={0.1}>
            <dl className="mt-6 space-y-3 text-sm text-muted-foreground">
              <div>
                <dt className="font-medium text-foreground">Typical projects</dt>
                <dd>Product strategy, design systems, full-stack engineering, and technical leadership.</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Availability</dt>
                <dd>Limited consulting and advisory capacity for 2026.</dd>
              </div>
            </dl>
          </BlurFade>
        </div>

        <div className="w-full max-w-md">
          <BlurFade delay={0.12}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full border-0 border-b-2 border-input bg-surface-container-low/40 px-0 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-0"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full border-0 border-b-2 border-input bg-surface-container-low/40 px-0 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-0"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Project details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full rounded-md border-0 bg-surface-container-low/50 px-3 py-2 text-sm text-foreground outline-none ring-0 transition focus:ring-2 focus:ring-primary"
                  placeholder="What are you working on? What does success look like for you?"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-sm text-green-600" role="status">
                  Message sent! I&apos;ll get back to you soon.
                </p>
              )}
              <div className="pt-2">
                <ShimmerButton
                  as="button"
                  type="submit"
                  className="w-full justify-center rounded-xl px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
                  aria-disabled={submitting}
                >
                  {submitting ? "Sending…" : "Send message"}
                </ShimmerButton>
              </div>
            </form>
          </BlurFade>
        </div>
      </div>
  )
}

