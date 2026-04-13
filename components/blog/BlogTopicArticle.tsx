import Link from "next/link"

import { NewsletterSignup } from "@/components/home/NewsletterSignup"
import { cn } from "@/lib/utils"
import type { WhatIBringCard } from "@/lib/what-i-bring-cards"

type Props = { card: WhatIBringCard }

/**
 * Typography per DESIGN.md:
 * — Display: Manrope ExtraBold (hero title)
 * — Headline: Manrope Bold, tight tracking (section h2)
 * — Label: Inter SemiBold uppercase (kicker, badge)
 * — Body: Inter Regular, generous line-height (long-form)
 */
export function BlogTopicArticle({ card }: Props) {
  return (
    <article className="flex w-full min-w-0 flex-col gap-14 md:gap-20">
      <header className="max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px w-14 shrink-0 bg-primary" aria-hidden />
          <Link
            href="/blog"
            className="font-sans text-xs font-semibold tracking-[0.22em] text-primary uppercase underline-offset-4 transition hover:underline"
          >
            Blog
          </Link>
        </div>

        <div className={cn("inline-flex w-fit rounded-full px-3 py-1 font-sans text-[11px] font-semibold tracking-wide uppercase", card.badgeClass)}>
          {card.badge}
        </div>

        <h1 className="mt-6 font-display text-5xl font-extrabold tracking-tighter text-on-surface leading-[1.05] md:text-7xl">
          {card.title}
        </h1>

        <p className="mt-8 max-w-2xl font-sans text-lg font-light leading-relaxed text-on-surface-variant md:text-2xl md:leading-relaxed">
          {card.body}
        </p>
      </header>

      {card.sections.length > 0 ? (
        <section className="w-full rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-12 lg:p-14">
          <div className="flex w-full min-w-0 flex-col gap-12 md:gap-16">
            {card.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-headline text-xl text-on-surface md:text-2xl">
                  {section.heading}
                </h2>
                <div className="mt-6 space-y-5">
                  {section.paragraphs.map((paragraph, i) => (
                    <p
                      key={`${section.heading}-${i}`}
                      className="font-sans text-base font-normal leading-[1.75] text-on-surface-variant md:text-lg md:leading-[1.75] [&_strong]:font-semibold [&_strong]:text-on-surface"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <footer className="w-full rounded-2xl bg-surface-container-lowest px-8 py-8 md:px-10 md:py-10">
        <p className="font-sans text-sm font-normal leading-relaxed text-on-surface-variant md:text-base">
          Continue exploring:{" "}
          <Link
            href="/blog"
            className="font-semibold text-primary underline decoration-transparent underline-offset-4 transition hover:underline hover:decoration-primary/40"
          >
            all articles
          </Link>
          {" · "}
          <Link
            href="/what-i-bring"
            className="font-semibold text-primary underline decoration-transparent underline-offset-4 transition hover:underline hover:decoration-primary/40"
          >
            what I bring
          </Link>
        </p>
      </footer>

      <NewsletterSignup variant="inline" />
    </article>
  )
}
