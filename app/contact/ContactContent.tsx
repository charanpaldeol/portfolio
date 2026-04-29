"use client"

import { FormEvent, useState } from "react"

import { BlurFade } from "@/components/magicui/blur-fade"
import { EditorialPageHero } from "@/components/portfolio/EditorialPageHero"
import { RainbowButton } from "@/registry/magicui/rainbow-button"

export default function ContactContent() {
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

  const inputUnderline =
    "w-full border-0 border-b-2 border-outline-variant/20 bg-transparent px-0 py-3 text-base text-on-surface placeholder:text-on-surface-variant/60 outline-none transition-[border-color] duration-200 focus:border-primary focus:ring-0"

  return (
    <div className="w-full">
      <div className="pb-12 md:pb-16 lg:pb-20">
        <EditorialPageHero
          eyebrow="Contact"
          title={
            <>
              Let&apos;s start a <span className="text-editorial-gradient">conversation.</span>
            </>
          }
          description={
            <>
              Share a bit about your product, team, or decision you&apos;re trying to make. I read every message and
              usually reply within 1 business day from{" "}
              <a
                href="mailto:cpdeol@outlook.com"
                className="font-medium text-on-surface underline decoration-tertiary/40 underline-offset-[6px] transition hover:decoration-tertiary"
              >
                cpdeol@outlook.com
              </a>
              .
            </>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0 xl:gap-x-16">
        {/* Left column — tonal layers, no box borders */}
        <div className="flex flex-col gap-10 lg:col-span-7 lg:pr-4 xl:pr-12">
          <BlurFade delay={0.06}>
            <blockquote className="relative border-none pl-0">
              <div
                className="absolute top-1 bottom-1 left-0 w-1 rounded-full bg-tertiary"
                aria-hidden
              />
              <p className="pl-7 font-display text-2xl font-bold leading-snug tracking-tight text-on-surface md:text-3xl md:leading-tight">
                Clear framing, honest timelines, and work that actually ships.
              </p>
            </blockquote>
          </BlurFade>

          <BlurFade delay={0.1}>
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl bg-surface-container-low px-7 py-7 md:px-8 md:py-8">
                <h2 className="font-sans text-base font-medium text-on-surface">Typical engagements</h2>
                <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
                  Product strategy, AI-native UX, design systems, and fractional leadership from discovery through
                  measurable value.
                </p>
              </div>
              <div className="rounded-2xl bg-surface-container-low px-7 py-7 md:px-8 md:py-8">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-sans text-base font-medium text-on-surface">Availability</h2>
                  <span className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-semibold tracking-wide text-on-primary-fixed uppercase">
                    2026
                  </span>
                </div>
                <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
                  Limited consulting and advisory capacity. Early scope context helps me tell you quickly if there is
                  a fit.
                </p>
              </div>
              <div className="rounded-2xl bg-surface-container-low px-7 py-7 md:px-8 md:py-8">
                <h2 className="font-sans text-base font-medium text-on-surface">What happens next</h2>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-on-surface-variant">
                  <li>1) I reply with fit, constraints, and suggested next step.</li>
                  <li>2) If aligned, we run a short scoping call.</li>
                  <li>3) You get a clear first-milestone proposal.</li>
                </ul>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Right column — form on nested surface (card on section) */}
        <div className="lg:col-span-5 lg:pl-2 xl:pl-0">
          <BlurFade delay={0.12}>
            <div className="rounded-2xl bg-surface-container-low p-2 shadow-editorial md:p-2.5">
              <div className="rounded-[0.875rem] bg-surface-container-lowest px-6 py-8 md:px-8 md:py-10">
                <p className="font-sans text-base font-medium text-on-surface">Send a message</p>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                  A few lines is enough. Include your goal, timeline, and biggest risk.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className={inputUnderline}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className={inputUnderline}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase"
                    >
                      Project details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      placeholder="What are you working on? What does success look like?"
                      className="w-full resize-y rounded-xl bg-surface-container-low/80 px-4 py-3 text-base leading-relaxed text-on-surface placeholder:text-on-surface-variant/55 outline-none ring-0 transition-shadow focus:ring-2 focus:ring-primary focus:ring-offset-0"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive" role="alert">
                      {error}
                    </p>
                  )}
                  {success && (
                    <p className="text-sm font-medium text-primary" role="status">
                      Message sent — I&apos;ll reply within 1 business day.
                    </p>
                  )}

                  <div className="pt-1">
                    <RainbowButton
                      as="button"
                      type="submit"
                      className="w-full justify-center rounded-xl px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={submitting}
                    >
                      {submitting ? "Sending…" : "Send message"}
                    </RainbowButton>
                  </div>
                </form>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </div>
  )
}
