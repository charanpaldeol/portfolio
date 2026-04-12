import Link from "next/link"

import { whatIBringCards } from "@/lib/what-i-bring-cards"
import { cn } from "@/lib/utils"

const badgeColors: Record<string, string> = {
  "problem-framing":    "bg-secondary-fixed text-on-secondary-fixed",
  "solution-design":    "bg-secondary-fixed text-on-secondary-fixed",
  "ai-native-delivery": "bg-primary-fixed text-on-primary-fixed",
  "engineering-depth":  "bg-tertiary-fixed text-on-tertiary-fixed",
  "value-realization":  "bg-secondary-fixed text-on-secondary-fixed",
}

const featuredSlugs = ["problem-framing", "ai-native-delivery", "value-realization"]
const featured = whatIBringCards.filter((c) => featuredSlugs.includes(c.slug))

export default function BlogTeaser() {
  return (
    <section id="writing" className="scroll-mt-28">

      {/* ── Section header ───────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Writing
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Thinking in writing
          </h2>
          <p className="mt-3 max-w-xl text-base font-light leading-relaxed text-muted-foreground">
            Frameworks and practical thinking on problem framing, AI-native delivery, and value realization.
          </p>
        </div>
        <Link
          href="/blog"
          className="shrink-0 pb-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          All articles →
        </Link>
      </div>

      {/* ── Article cards — surface-container-lowest on default surface bg, no borders ── */}
      <div className="mt-8 flex flex-col gap-3">
        {featured.map((card) => (
          <Link
            key={card.slug}
            href={`/blog/${card.slug}`}
            className="group flex cursor-pointer items-start justify-between gap-4 rounded-xl bg-surface-container-lowest p-5 transition-colors duration-200 hover:bg-surface-container md:p-6"
          >
            <div className="min-w-0">
              <span
                className={cn(
                  "inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.15em] uppercase",
                  badgeColors[card.slug] ?? "bg-surface-container text-muted-foreground"
                )}
              >
                {card.badge}
              </span>
              <h3 className="mt-2 text-base font-bold tracking-tight text-foreground">{card.title}</h3>
              <p className="mt-1.5 text-sm font-normal leading-relaxed text-muted-foreground line-clamp-2">
                {card.body}
              </p>
            </div>
            <span
              className="flex-shrink-0 pt-1 text-base text-muted-foreground transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
