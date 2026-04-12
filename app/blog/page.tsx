import { Code2, Crosshair, Layers, type LucideIcon, TrendingUp, Zap } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

import { PageShell } from "@/components/layout/PageShell"
import { EditorialPageHero } from "@/components/portfolio/EditorialPageHero"
import { cn } from "@/lib/utils"
import { whatIBringCards } from "@/lib/what-i-bring-cards"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Ideas, frameworks, and practical thinking on problem framing, solution design, AI-native delivery, engineering depth, and value realization.",
  alternates: { canonical: "https://cpdeol.com/blog" },
  openGraph: {
    title: "Blog — Charan Deol",
    description:
      "Ideas, frameworks, and practical thinking on problem framing, solution design, AI-native delivery, engineering depth, and value realization.",
    url: "https://cpdeol.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Charan Deol",
    description:
      "Ideas, frameworks, and practical thinking on problem framing, solution design, AI-native delivery, engineering depth, and value realization.",
  },
}

/** Thumbnail accent config per slug — tonal surface shifts, no borders */
const thumbConfig: Record<string, { bg: string; text: string; icon: LucideIcon }> = {
  "problem-framing":    { bg: "bg-secondary-fixed", text: "text-on-secondary-fixed", icon: Crosshair   },
  "solution-design":    { bg: "bg-primary-fixed",   text: "text-on-primary-fixed",   icon: Layers      },
  "ai-native-delivery": { bg: "bg-tertiary-fixed",  text: "text-on-tertiary-fixed",  icon: Zap         },
  "engineering-depth":  { bg: "bg-secondary-fixed", text: "text-on-secondary-fixed", icon: Code2       },
  "value-realization":  { bg: "bg-primary-fixed",   text: "text-on-primary-fixed",   icon: TrendingUp  },
}

/** Approximate read time (words / 200 wpm) per slug */
const readMin: Record<string, number> = {
  "problem-framing":    5,
  "solution-design":    5,
  "ai-native-delivery": 6,
  "engineering-depth":  5,
  "value-realization":  6,
}

export default function BlogPage() {
  return (
    <PageShell>
      <div className="space-y-14 md:space-y-20">

        <EditorialPageHero
          eyebrow="Blog"
          title={
            <>
              Ideas that <span className="text-editorial-gradient">ship.</span>
            </>
          }
          description="Frameworks and practical thinking on problem framing, solution design, AI\u2011native delivery, engineering depth, and value realization."
        />

        {/* ── Article list ───────────────────────────────────────────── */}
        <ul className="m-0 list-none space-y-3 p-0">
          {whatIBringCards.map((card) => {
            const thumb = thumbConfig[card.slug] ?? { bg: "bg-surface-container", text: "text-on-surface", icon: Crosshair }
            const mins  = readMin[card.slug] ?? 5
            const excerpt = card.body.length > 160 ? `${card.body.slice(0, 160)}…` : card.body

            return (
              <li key={card.slug}>
                <Link
                  href={`/blog/${card.slug}`}
                  className="group flex items-center gap-5 rounded-2xl bg-surface-container-low px-6 py-5 no-underline transition-colors duration-200 hover:bg-surface-container md:gap-7 md:px-8 md:py-6"
                >
                  {/* Thumbnail — contextual icon block */}
                  <div
                    className={cn(
                      "shrink-0 rounded-xl flex items-center justify-center",
                      "w-16 h-16 md:w-20 md:h-20",
                      thumb.bg,
                    )}
                    aria-hidden
                  >
                    <thumb.icon className={cn("w-7 h-7 md:w-8 md:h-8", thumb.text)} strokeWidth={1.75} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    {/* Badge */}
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-[11px] font-semibold tracking-wide uppercase",
                        card.badgeClass,
                      )}
                    >
                      {card.badge}
                    </span>

                    {/* Title */}
                    <p className="mt-2 font-sans text-base font-medium tracking-tight text-on-surface md:text-lg">
                      {card.title}
                    </p>

                    {/* Excerpt — hidden on smallest screens */}
                    <p className="mt-1 hidden truncate font-sans text-sm font-normal leading-relaxed text-on-surface-variant sm:block">
                      {excerpt}
                    </p>

                    {/* Metadata */}
                    <p className="mt-2 font-sans text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
                      {mins}&nbsp;min read
                    </p>
                  </div>

                  {/* Arrow — nudges on hover */}
                  <span
                    aria-hidden
                    className="shrink-0 font-sans text-sm text-primary transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

      </div>
    </PageShell>
  )
}
