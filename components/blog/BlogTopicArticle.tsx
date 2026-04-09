import Link from "next/link"

import type { WhatIBringCard } from "@/lib/what-i-bring-cards"

type Props = { card: WhatIBringCard }

export function BlogTopicArticle({ card }: Props) {
  return (
    <article className="flex flex-col gap-10 md:gap-14">
      <nav aria-label="Breadcrumb">
        <Link
          href="/blog"
          className="text-sm font-medium text-on-surface-variant underline-offset-4 transition hover:text-primary hover:underline"
        >
          ← Blog
        </Link>
      </nav>

      <header className="flex flex-col gap-5">
        <div
          className={[
            "inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-semibold tracking-wide uppercase",
            card.badgeClass,
          ].join(" ")}
        >
          {card.badge}
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tighter text-on-surface leading-[1.08] md:text-5xl lg:text-6xl">
          {card.title}
        </h1>
        <p className="max-w-3xl text-lg font-light leading-relaxed text-on-surface-variant md:text-xl md:leading-relaxed">
          {card.body}
        </p>
      </header>

      {card.sections.length > 0 ? (
        <div className="flex flex-col gap-8 md:gap-10">
          {card.sections.map((section) => (
            <section
              key={section.heading}
              className="rounded-2xl bg-surface-container-low p-6 md:p-8 lg:p-10"
            >
              <h2 className="font-display text-xl font-bold tracking-tight text-on-surface md:text-2xl">
                {section.heading}
              </h2>
              <div className="mt-5 space-y-4">
                {section.paragraphs.map((paragraph, i) => (
                  <p
                    key={`${section.heading}-${i}`}
                    className="text-base leading-relaxed text-on-surface-variant md:text-lg [&_strong]:font-semibold [&_strong]:text-on-surface"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}

      <footer className="rounded-xl bg-surface-container-lowest px-5 py-6 md:px-8 md:py-8">
        <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">
          Continue exploring:{" "}
          <Link href="/blog" className="font-semibold text-primary underline-offset-4 hover:underline">
            all articles
          </Link>
          {" · "}
          <Link href="/what-i-bring" className="font-semibold text-primary underline-offset-4 hover:underline">
            what I bring
          </Link>
        </p>
      </footer>
    </article>
  )
}
