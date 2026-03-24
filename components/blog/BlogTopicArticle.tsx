import Link from "next/link"

import type { WhatIBringCard } from "@/lib/what-i-bring-cards"

type Props = { card: WhatIBringCard }

export function BlogTopicArticle({ card }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <nav>
        <Link href="/blog" className="text-sm text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline">
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
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{card.title}</h1>
        <p className="text-sm text-slate-600 md:text-base leading-relaxed max-w-3xl">{card.body}</p>
      </header>
      {card.sections.length > 0 ? (
        <div className="flex flex-col gap-10 max-w-3xl">
          {card.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">{section.heading}</h2>
              {section.paragraphs.map((paragraph, i) => (
                <p key={`${section.heading}-${i}`} className="text-sm text-slate-600 md:text-base leading-relaxed">
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
