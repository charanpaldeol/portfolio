import Link from "next/link"

import { whatIBringCards } from "@/lib/what-i-bring-cards"

export default function WhatIBring() {
  return (
    <section>
      <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">What I bring</div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {whatIBringCards.map((card) => (
          <Link
            key={card.slug}
            href={`/blog/${card.slug}`}
            className={[
              "group flex h-full flex-col rounded-xl border border-border bg-background p-5 text-left no-underline",
              "sm:last:col-span-2 sm:last:max-w-[calc(50%-0.375rem)] sm:last:justify-self-center",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            ].join(" ")}
          >
            <h3 className="mb-2 text-sm font-medium text-foreground">{`${card.badge} - ${card.title}`}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">{card.body}</p>
            <div className="mt-auto pt-4">
              <div className="flex justify-end border-t border-border pt-3">
                <span className="text-xs font-medium tracking-wide text-muted-foreground group-hover:text-foreground">
                  Read more
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
