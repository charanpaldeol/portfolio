"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { type Metric, metrics, tagStyles } from "@/lib/proof-metrics-data"
import { withAttribution } from "@/lib/ux-measurement"
import { cn } from "@/lib/utils"

// Stat number accent colors per card index — primary / secondary / tertiary
const statColors = [
  "text-primary",
  "text-secondary",
  "text-tertiary",
]

// ─── Card ──────────────────────────────────────────────────────────────────────

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  const { pill } = tagStyles[metric.tagColor]
  const statColor = statColors[index] ?? "text-foreground"

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.12 }}
      className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest p-8 transition-shadow duration-300 hover:shadow-editorial-float"
    >
      {/* Stat */}
      <div className={cn("font-display text-5xl font-extrabold tracking-tight", statColor)}>
        {metric.numericValue !== null ? (
          <NumberTicker
            value={metric.numericValue}
            suffix={metric.statSuffix ?? ""}
            delay={index * 0.15}
            className={cn("font-display text-5xl font-extrabold tracking-tight", statColor)}
          />
        ) : (
          <span>{metric.statDisplay}</span>
        )}
      </div>

      {/* Description */}
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        {metric.label}
      </p>
      {(metric.baseline || metric.timeframe || metric.measurementMethod) && (
        <ul className="mt-3 space-y-1 text-xs leading-relaxed text-muted-foreground">
          {metric.baseline ? <li><span className="font-medium text-foreground">Baseline:</span> {metric.baseline}</li> : null}
          {metric.timeframe ? <li><span className="font-medium text-foreground">Timeframe:</span> {metric.timeframe}</li> : null}
          {metric.measurementMethod ? (
            <li><span className="font-medium text-foreground">Method:</span> {metric.measurementMethod}</li>
          ) : null}
        </ul>
      )}

      {/* Tag */}
      <div className="mt-6">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide uppercase",
            pill
          )}
        >
          {metric.tag}
        </span>
      </div>
    </motion.div>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────────

export default function ProofMetrics() {
  return (
    <section id="proof-of-work" className="scroll-mt-28">
      <div className="-mx-6 bg-surface-container-low px-6 py-14 md:-mx-8 md:px-8 md:py-20">
        <header className="mb-12">
          <div className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Outcomes
          </div>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            What execution produced
          </h2>
          <p className="mt-3 max-w-xl text-base font-light leading-relaxed text-muted-foreground">
            After principles and execution, this is the result layer: anonymized engagement outcomes with clear measurement notes.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {metrics.map((metric, i) => (
            <div key={metric.tag}>
              <h3 className="sr-only">{metric.tag}</h3>
              <MetricCard metric={metric} index={i} />
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            More detail available on request — timelines, team size, constraints.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="#how-i-work" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
              Revisit execution model →
            </Link>
            <Link
              href={withAttribution("/contact", { from: "proof-metrics", intent: "scope" })}
              className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              Let&apos;s discuss your problem →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
