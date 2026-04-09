import Link from "next/link"

import type { WhatIBringCard } from "@/lib/what-i-bring-cards"

type Props = { card: WhatIBringCard }

export function BlogTopicArticle({ card }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <nav>
        <Link
          href="/blog"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Blog
        </Link>
      </nav>
      <header className="flex flex-col gap-4">
        <div
          className={[
            "text-[10px] font-medium px-2 py-0.5 rounded-full inline-block w-fit",
            card.badgeClass,
          ].join(" ")}
        >
          {card.badge}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {card.title}
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {card.body}
        </p>
      </header>
      {card.sections.length > 0 ? (
        <div className="flex flex-col gap-10 max-w-3xl">
          {card.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph, i) => (
                <p
                  key={`${section.heading}-${i}`}
                  className="text-sm leading-relaxed text-muted-foreground md:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      ) : null}
    </div>
  )
}
