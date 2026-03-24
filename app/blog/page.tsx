import { Metadata } from "next"
import Link from "next/link"

import { whatIBringCards } from "@/lib/what-i-bring-cards"

export const metadata: Metadata = { title: "Blog" }

export default function BlogPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Blog</h1>
      <ul className="flex flex-col gap-4 list-none p-0 m-0">
        {whatIBringCards.map((card) => (
          <li key={card.slug}>
            <Link
              href={`/blog/${card.slug}`}
              className="block rounded-lg border border-slate-200 p-4 no-underline transition-colors hover:border-slate-300 hover:bg-slate-50/80"
            >
              <span className="text-xs font-medium text-slate-500">{card.badge}</span>
              <span className="mt-1 block text-base font-semibold text-slate-900">{card.title}</span>
              <span className="mt-2 block text-sm text-slate-600 leading-relaxed">{card.body}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

