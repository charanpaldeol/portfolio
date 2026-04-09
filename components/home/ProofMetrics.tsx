"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { NumberTicker } from "@/components/magicui/number-ticker"

// ─── Data ─────────────────────────────────────────────────────────────────────
// To add or change a metric, edit this array only — no layout code to touch.

type TagColor = "emerald" | "violet" | "amber" | "sky" | "rose"

interface Metric {
  /**
   * Numeric value for the animated counter.
   * Set to null and use statDisplay for non-numeric stats (e.g. "4 → 1").
   */
  numericValue: number | null
  statSuffix?: string
  statDisplay?: string
  label: string
  tag: string
  tagColor: TagColor
}

const metrics: Metric[] = [
  {
    numericValue: 60,
    statSuffix: "%",
    label:
      "Reduction in manual reporting time after leading a BI tool selection and full implementation across a 200-person finance team.",
    tag: "SaaS implementation",
    tagColor: "emerald",
  },
  {
    numericValue: null,
    statDisplay: "4 → 1",
    label:
      "Consolidated four disconnected systems into a single platform, cutting onboarding time from 3 weeks to 4 days for a healthcare provider.",
    tag: "In-house build",
    tagColor: "violet",
  },
  {
    numericValue: 83,
    statSuffix: "%",
    label:
      "User adoption rate achieved within 60 days of go-live through structured change management — up from a projected 40%.",
    tag: "Change management",
    tagColor: "amber",
  },
]

// ─── Color maps (Tailwind-native, dark-mode safe) ──────────────────────────────

const tagStyles: Record<TagColor, { pill: string; accent: string }> = {
  emerald: {
    pill: "bg-primary-fixed text-on-primary-fixed",
    accent: "bg-primary",
  },
  violet: {
    pill: "bg-secondary-fixed text-on-secondary-fixed",
    accent: "bg-secondary",
  },
  amber: {
    pill: "bg-tertiary-fixed text-on-tertiary-fixed",
    accent: "bg-tertiary",
  },
  sky: {
    pill: "bg-secondary-fixed/80 text-on-secondary-fixed",
    accent: "bg-secondary",
  },
  rose: {
    pill: "bg-primary-fixed/90 text-on-primary-fixed",
    accent: "bg-primary",
  },
}

// ─── Card ──────────────────────────────────────────────────────────────────────

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  const { pill, accent } = tagStyles[metric.tagColor]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
      className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-editorial-float transition-shadow duration-300 hover:shadow-editorial"
    >
      {/* Colored accent bar */}
      <div className={`h-1 w-full shrink-0 ${accent}`} />

      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Stat */}
        <div className="text-4xl font-semibold tracking-tight text-foreground">
          {metric.numericValue !== null ? (
            <NumberTicker
              value={metric.numericValue}
              suffix={metric.statSuffix ?? ""}
              delay={index * 0.15}
              className="text-4xl font-semibold tracking-tight text-foreground"
            />
          ) : (
            <span>{metric.statDisplay}</span>
          )}
        </div>

        {/* Description */}
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {metric.label}
        </p>

        {/* Tag */}
        <div className="mt-auto pt-4">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide uppercase ${pill}`}
          >
            {metric.tag}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────────

export default function ProofMetrics() {
  return (
    <section id="proof-of-work">
      <header>
        <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Proof of work
        </div>
        <h2 className="mt-2 text-xl font-medium text-foreground">
          Results that actually moved the needle
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Real outcomes from real engagements — anonymized, but measurable.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {metrics.map((metric, i) => (
          <MetricCard key={metric.tag} metric={metric} index={i} />
        ))}
      </div>

      {/* CTA row */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          More detail available on request — timelines, team size, constraints.
        </p>
        <Link
          href="/portfolio/contact"
          className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Let&apos;s discuss your problem →
        </Link>
      </div>
    </section>
  )
}
