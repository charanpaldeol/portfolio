import { Metadata } from "next"
import Link from "next/link"

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

export default function BlogPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="rounded-2xl bg-surface-container-low px-5 py-6 shadow-editorial md:px-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">Blogs</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Ideas, frameworks, and practical thinking for building better technology outcomes.
        </p>
      </header>

      <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 md:gap-4">
        {whatIBringCards.map((card) => {
          const excerpt = card.body.length > 145 ? `${card.body.slice(0, 145)}...` : card.body

          return (
            <li key={card.slug} className="h-full">
              <Link
                href={`/blog/${card.slug}`}
                className="group flex h-full flex-col rounded-xl bg-card p-4 no-underline shadow-editorial-float transition-shadow hover:shadow-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${card.badgeClass}`}>
                  {card.badge}
                </span>
                <span className="mt-2 block text-base font-semibold tracking-tight text-foreground">{card.title}</span>
                <span className="mt-1 block flex-1 text-xs leading-relaxed text-muted-foreground">{excerpt}</span>
                <span className="mt-3 inline-flex items-center pt-2 text-[11px] font-semibold tracking-wider text-foreground uppercase">
                  Read article
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

