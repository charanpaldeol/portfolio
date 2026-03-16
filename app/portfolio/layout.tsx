"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

const sections = [
  { href: "/portfolio", label: "Overview", value: "overview", icon: "⚡" },
  { href: "/portfolio/about", label: "About", value: "about", icon: "👤" },
  { href: "/portfolio/services", label: "Services", value: "services", icon: "🛠️" },
  { href: "/portfolio/projects", label: "Projects", value: "projects", icon: "📁" },
  { href: "/portfolio/experience", label: "Experience", value: "experience", icon: "📈" },
  { href: "/portfolio/contact", label: "Contact", value: "contact", icon: "✉️" },
] as const

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/portfolio") return pathname === "/portfolio"
    return pathname.startsWith(href)
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      {/* Desktop side navigation */}
      <div className="grid gap-8 md:grid-cols-[220px,1fr]">
        <aside className="hidden md:block">
          <nav className="sticky top-24 rounded-xl border border-slate-200 bg-white/80 p-2 text-sm shadow-sm">
            <div className="px-3 pb-2 pt-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Portfolio</span>
            </div>
            <div className="space-y-0.5">
              {sections.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-slate-900 text-white font-medium shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")}
                >
                  <span className="text-base leading-none" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-2 mx-1 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-medium text-emerald-700">Available for work</span>
              </div>
              <p className="mt-0.5 text-[11px] text-emerald-600 leading-snug">Limited 2026 capacity</p>
            </div>
          </nav>
        </aside>

        <section className="space-y-6">
          {/* Mobile horizontal tab bar */}
          <div className="md:hidden">
            <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white/80">
              <div className="flex min-w-full gap-1 px-2 py-1.5 text-xs font-medium text-slate-600">
                {sections.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-colors",
                      isActive(item.href)
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">{children}</div>
        </section>
      </div>
    </main>
  )
}
