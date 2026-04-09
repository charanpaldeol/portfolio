import { Metadata } from "next"
import Link from "next/link"

import { PageShell } from "@/components/layout/PageShell"
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
            <div className="h-px w-12 bg-primary" />
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Blog</span>
          </div>
          <h1 className="font-display text-5xl font-extrabold tracking-tighter text-on-surface leading-[1.05] md:text-7xl">
            Ideas that <span className="text-editorial-gradient">ship.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-on-surface-variant md:text-2xl">
            Frameworks and practical thinking on problem framing, solution design, AI-native delivery, engineering
            depth, and value realization.
          </p>
        </header>

        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-12 md:gap-6">
          {whatIBringCards.map((card, index) => {
            const excerpt = card.body.length > 160 ? `${card.body.slice(0, 160)}…` : card.body
            const span = bentoSpans[index] ?? "md:col-span-6"

            return (
              <li key={card.slug} className={["h-full", span].join(" ")}>
                <Link
                  href={`/blog/${card.slug}`}
                  className="group flex h-full min-h-[200px] flex-col rounded-xl bg-surface-container-low p-6 no-underline transition-colors duration-300 hover:bg-surface-container md:min-h-[220px] md:p-8"
                >
                  <span
                    className={[
                      "inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-semibold tracking-wide uppercase",
                      card.badgeClass,
                    ].join(" ")}
                  >
                    {card.badge}
                  </span>
                  <span className="mt-4 block font-display text-xl font-bold tracking-tight text-on-surface md:text-2xl">
                    {card.title}
                  </span>
                  <span className="mt-2 block flex-1 text-sm leading-relaxed text-on-surface-variant md:text-base">
                    {excerpt}
                  </span>
                  <span className="mt-5 inline-flex items-center text-xs font-semibold tracking-wider text-primary uppercase transition group-hover:gap-2">
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
