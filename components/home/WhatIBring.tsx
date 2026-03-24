"use client"

import { ArrowRightIcon } from "@radix-ui/react-icons"
import Link from "next/link"

import { whatIBringCards } from "@/lib/what-i-bring-cards"
import { BorderBeam } from "@/registry/magicui/border-beam"

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
              "group relative h-full bg-background border border-border rounded-xl p-5 overflow-hidden text-left flex flex-col no-underline cursor-pointer",
              "sm:last:col-span-2 sm:last:max-w-[calc(50%-0.375rem)] sm:last:justify-self-center",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            ].join(" ")}
          >
            <BorderBeam size={250} duration={8} borderWidth={1.5} />
            <h3 className="text-sm font-medium text-foreground mb-2">{`${card.badge} — ${card.title}`}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{card.body}</p>
            <div className="relative z-10 mt-auto pt-4">
              <div className="border-t border-border pt-3 flex justify-end">
                <span className="inline-flex items-center gap-1 text-xs font-medium tracking-wide text-muted-foreground transition-colors group-hover:text-foreground">
                  <span>Read more</span>
                  <ArrowRightIcon className="size-3 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
