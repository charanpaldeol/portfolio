import Link from "next/link"

import { cn } from "@/lib/utils"
import { whatIBringCards } from "@/lib/what-i-bring-cards"

/* ── Icons (Lucide-style) ── */
const cardIcons = [
  /* 0 — Problem Framing: compass */
  <svg key="i0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>,
  /* 1 — Solution Design: layers */
  <svg key="i1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
  /* 2 — AI-Native Delivery: zap */
  <svg key="i2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  /* 3 — Engineering Depth: terminal */
  <svg key="i3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>,
  /* 4 — Value Realization: target */
  <svg key="i4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
]

/* ── Per-card visual config ── */
const cardStyles = [
  { bg: "bg-surface-container-lowest", iconBg: "bg-secondary-fixed", iconColor: "text-on-secondary-fixed", hoverShadow: "hover:shadow-editorial" },
  { bg: "bg-secondary-fixed/35", iconBg: "bg-secondary/20", iconColor: "text-secondary", hoverShadow: "hover:shadow-editorial-lg" },
  { bg: "bg-primary-fixed/50", iconBg: "bg-primary/15", iconColor: "text-primary", hoverShadow: "hover:shadow-editorial-lg" },
  { bg: "bg-tertiary-fixed/45", iconBg: "bg-tertiary/15", iconColor: "text-tertiary", hoverShadow: "hover:shadow-editorial" },
  { bg: "bg-foreground", iconBg: "bg-background/10", iconColor: "text-background/80", hoverShadow: "hover:shadow-editorial-lg", dark: true },
]

/* ── Row layout: cards grouped into flex rows ── */
const rows = [
  [{ i: 0, w: "md:w-5/12" }, { i: 1, w: "md:w-7/12" }],
  [{ i: 2, w: "md:w-7/12" }, { i: 3, w: "md:w-5/12" }],
  [{ i: 4, w: "w-full" }],
]

export default function WhatIBring() {
  return (
    <section>
      <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
        What I bring
      </div>

      <div className="mt-6 flex flex-col gap-3 md:gap-4">
        {rows.map((row, ri) => (
          <div key={ri} className="flex flex-col md:flex-row gap-3 md:gap-4">
            {row.map(({ i: idx, w: width }) => {
              const card = whatIBringCards[idx]
              const style = cardStyles[idx]
              const icon = cardIcons[idx]
              if (!card || !style || !icon) {
                return null
              }
              const isDark = !!style.dark

              return (
                <Link
                  key={card.slug}
                  href={`/blog/${card.slug}`}
                  className={cn(
                    "group relative flex overflow-hidden rounded-2xl p-5 text-left no-underline shadow-editorial-float transition-shadow duration-300 md:p-6",
                    width,
                    style.bg,
                    style.hoverShadow,
                    isDark ? "text-background" : "",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isDark ? "flex-col md:flex-row md:items-center md:gap-10" : "flex-col",
                  )}
                >
                  {/* Decorative corner glow */}
                  <div
                    className={cn(
                      "pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full blur-2xl transition-transform duration-300 group-hover:scale-110",
                      isDark ? "bg-background/5" : "bg-muted/50",
                    )}
                  />

                  {/* Main content */}
                  <div className={cn("relative z-10 flex flex-col gap-3", isDark && "md:flex-1")}>
                    {/* Icon */}
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", style.iconBg)}>
                      <span className={cn("block h-5 w-5", style.iconColor)}>
                        {icon}
                      </span>
                    </div>

                    {/* Badge */}
                    <span
                      className={cn(
                        "w-fit rounded-full px-3 py-1 text-[11px] font-medium tracking-wide uppercase",
                        isDark ? "bg-background/10 text-background" : card.badgeClass,
                      )}
                    >
                      {card.badge}
                    </span>

                    {/* Title */}
                    <h3
                      className={cn(
                        "font-medium tracking-tight",
                        isDark ? "text-xl md:text-2xl text-background" : "text-lg md:text-xl text-foreground",
                      )}
                    >
                      {card.title}
                    </h3>

                    {/* Body */}
                    <p className={cn("text-sm leading-relaxed", isDark ? "text-background/75" : "text-muted-foreground")}>
                      {card.body}
                    </p>

                    {/* CTA — only on non-dark cards */}
                    {!isDark && (
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-foreground transition-transform duration-200 group-hover:translate-x-1">
                          Read more <span aria-hidden>→</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Dark card: right-side highlight + CTA */}
                  {isDark && (
                    <div className="relative z-10 mt-4 flex flex-col gap-3 md:mt-0 md:shrink-0 md:items-end">
                      <div className="rounded-xl bg-background/10 px-5 py-4">
                        <div className="text-lg font-semibold text-background">Discovery → Value</div>
                        <div className="mt-1 text-xs uppercase tracking-wider text-background/50">
                          End-to-end ownership
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-background transition-transform duration-200 group-hover:translate-x-1">
                        Read more <span aria-hidden>→</span>
                      </span>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}
