"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

const sections = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/portfolio/about", label: "About", icon: "👤" },
  { href: "/portfolio/services", label: "Services", icon: "🛠️" },
  { href: "/portfolio/projects", label: "Projects", icon: "📁" },
  { href: "/portfolio/experience", label: "Experience", icon: "📈" },
] as const

export default function PortfolioShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col gap-4 px-4 py-6 md:px-6 md:py-8">
      <nav className="w-full border-b border-slate-200 bg-white/80 text-sm">
        <div className="mx-auto flex max-w-6xl items-center overflow-x-auto px-1 py-2 md:px-0">
          <span className="hidden pr-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 md:inline">
            Site
          </span>
          <div className="flex gap-1 text-xs font-medium text-slate-600 md:text-sm">
            {sections.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "whitespace-nowrap rounded-full px-3 py-1.5 transition-colors",
                  isActive(item.href)
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")}
              >
                <span className="mr-1.5 text-sm" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <section className="mt-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:mt-3 md:p-8">
        {children}
      </section>
    </main>
  )
}
