import Link from "next/link"

import { cn } from "@/lib/utils"
import { whatIBringCards } from "@/lib/what-i-bring-cards"

/* ── Icons ── */
const cardIcons = [
  /* 0 — Problem Framing: compass */
  <svg key="i0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>,
  /* 1 — Solution Design: layers */
  <svg key="i1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
  /* 2 — AI-Native Delivery: zap */
  <svg key="i2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  /* 3 — Engineering Depth: terminal */
  <svg key="i3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>,
  /* 4 — Value Realization: target */
  <svg key="i4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
]

// Watermark icon (large, decorative) for the hero card
const WatermarkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-full w-full">
    <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
)

/* ── Small-card config (cards 1–4) ── */
const smallCardStyles = [
  { bg: "bg-surface-container-high",  iconBg: "bg-secondary/15", iconColor: "text-secondary" },
  { bg: "bg-primary-fixed/40",        iconBg: "bg-primary/15",   iconColor: "text-primary"   },
  { bg: "bg-tertiary-fixed/40",       iconBg: "bg-tertiary/15",  iconColor: "text-tertiary"  },
  { bg: "bg-secondary-fixed/40",      iconBg: "bg-secondary/15", iconColor: "text-secondary" },
]

export default function WhatIBring() {
  const [hero, ...rest] = whatIBringCards
  if (!hero) return null

  return (
    <section id="what-i-bring" className="scroll-mt-28">
      <div className="mb-6">
        <div className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
          What I bring
        </div>
        <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
          Scope, systems, and momentum
        </h2>
        <p className="mt-3 max-w-xl text-base font-light text-muted-foreground">
          The high-leverage problems I take on, and the patterns I use to turn ambiguity into a clear path.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[minmax(180px,auto)]">

        {/* Hero card — spans 2 cols × 2 rows */}
        <Link
          href={`/blog/${hero.slug}`}
          aria-label={`Read: ${hero.title}`}
          className="group relative col-span-1 flex flex-col justify-end overflow-hidden rounded-2xl bg-primary p-8 shadow-editorial-float transition-all duration-300 hover:shadow-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 md:col-span-2 md:row-span-2 md:p-10"
        >
          {/* Watermark icon */}
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 translate-x-12 -translate-y-12 text-on-primary/10 transition-transform duration-700 group-hover:translate-x-8 group-hover:-translate-y-8">
            <WatermarkIcon />
          </div>
          {/* Glow orb */}
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary-fixed/20 blur-3xl" />

          <div className="relative z-10">
            <span className="inline-flex items-center rounded-full bg-on-primary/10 px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-on-primary uppercase">
              {hero.badge}
            </span>
            <h3 className="font-display mt-4 text-2xl font-bold leading-snug tracking-tight text-on-primary md:text-3xl">
              {hero.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-on-primary/80 md:text-base">
              {hero.body}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-wide text-on-primary transition-transform duration-200 group-hover:translate-x-1">
              Read more <span aria-hidden>→</span>
            </span>
          </div>
        </Link>

        {/* Small cards — 4 cards in 2×2 on the right */}
        {rest.map((card, i) => {
          const style = smallCardStyles[i]
          const icon  = cardIcons[i + 1]
          if (!style || !icon) return null

          return (
            <Link
              key={card.slug}
              href={`/blog/${card.slug}`}
              aria-label={`Read: ${card.title}`}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl p-6 shadow-editorial-float transition-all duration-300 hover:shadow-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 md:col-span-1",
                style.bg
              )}
            >
              {/* Icon */}
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", style.iconBg)}>
                <span className={cn("block h-5 w-5", style.iconColor)}>
                  {icon}
                </span>
              </div>

              {/* Badge */}
              <span className={cn("mt-4 w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase", card.badgeClass)}>
                {card.badge}
              </span>

              {/* Title */}
              <h3 className="mt-2 text-base font-bold leading-snug tracking-tight text-foreground">
                {card.title}
              </h3>

              {/* Body */}
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                {card.body}
              </p>

              {/* CTA */}
              <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-foreground transition-transform duration-200 group-hover:translate-x-1">
                Read more <span aria-hidden>→</span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
