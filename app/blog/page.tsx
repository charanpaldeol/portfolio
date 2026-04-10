import { Metadata } from "next"
import Link from "next/link"

import { PageShell } from "@/components/layout/PageShell"
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

/** Bento spans for five cards: 7+5, 5+7, full — editorial asymmetry */
const bentoSpans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7", "md:col-span-12"] as const

export default function BlogPage() {
  return (
    <PageShell>
      <div className="space-y-12 md:space-y-16">
        <header className="max-w-4xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-14 bg-primary" aria-hidden />
            <span className="font-sans text-xs font-semibold tracking-[0.22em] text-primary uppercase">Blog</span>
          </div>
          <h1 className="font-display text-5xl font-extrabold tracking-tighter text-on-surface leading-[1.05] md:text-7xl">
            Ideas that <span className="text-editorial-gradient">ship.</span>
          </h1>
          <p className="mt-8 max-w-2xl font-sans text-lg font-light leading-relaxed text-on-surface-variant md:text-2xl md:leading-relaxed">
            Frameworks and practical thinking on problem framing, solution design, AI-native delivery, engineering
            depth, and value realization.
          </p>
        </header>

        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-12 md:gap-6">
          {whatIBringCards.map((card, index) => {
            const excerpt = card.body.length > 160 ? `${card.body.slice(0, 160)}…` : card.body
            const span = bentoSpans[index] ?? "md:col-span-6"

            return (
              <li key={card.slug} className={cn("h-full", span)}>
                <Link
                  href={`/blog/${card.slug}`}
                  className="group flex h-full min-h-[200px] flex-col rounded-2xl bg-surface-container-low p-7 no-underline transition-colors duration-300 hover:bg-surface-container md:min-h-[220px] md:p-9"
                >
                  <span className={cn("inline-flex w-fit rounded-full px-3 py-1 font-sans text-[11px] font-semibold tracking-wide uppercase", card.badgeClass)}>
                    {card.badge}
                  </span>
                  {/* Title scale: Inter Medium per DESIGN.md (card / sidebar headers) */}
                  <span className="mt-5 block font-sans text-xl font-medium tracking-tight text-on-surface md:text-2xl">
                    {card.title}
                  </span>
                  <span className="mt-3 block flex-1 font-sans text-sm font-normal leading-relaxed text-on-surface-variant md:text-base md:leading-relaxed">
                    {excerpt}
                  </span>
                  <span className="mt-6 inline-flex items-center font-sans text-xs font-semibold tracking-wider text-primary uppercase transition group-hover:gap-2">
                    <span>Read article</span>
                    <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
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
