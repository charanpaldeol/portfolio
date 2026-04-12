"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { type Metric, metrics, tagStyles } from "@/lib/proof-metrics-data"
import { cn } from "@/lib/utils"

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
      <div className={cn("h-1 w-full shrink-0", accent)} />

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
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide uppercase",
              pill
            )}
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
        <h2 className="font-display mt-2 text-xl font-bold tracking-tight text-foreground">
          Results that actually moved the needle
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Real outcomes from real engagements — anonymized, but measurable.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {metrics.map((metric, i) => (
          <div key={metric.tag}>
            <h3 className="sr-only">{metric.tag}</h3>
            <MetricCard metric={metric} index={i} />
          </div>
        ))}
      </div>

      {/* CTA row */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          More detail available on request — timelines, team size, constraints.
        </p>
        <Link
          href="/contact"
          className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Let&apos;s discuss your problem →
        </Link>
      </div>
    </section>
  )
}
