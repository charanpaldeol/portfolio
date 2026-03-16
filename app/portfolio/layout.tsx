 "use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

const sections = [
  { href: "/portfolio", label: "Overview", value: "overview" },
  { href: "/portfolio/about", label: "About", value: "about" },
  { href: "/portfolio/services", label: "Services", value: "services" },
  { href: "/portfolio/projects", label: "Projects", value: "projects" },
  { href: "/portfolio/experience", label: "Experience", value: "experience" },
  { href: "/portfolio/contact", label: "Contact", value: "contact" },
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
          <nav className="sticky top-24 space-y-1 rounded-xl border border-slate-200 bg-white/80 p-2 text-sm shadow-sm">
            {sections.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive(item.href)
                    ? "border-l-2 border-slate-900 bg-slate-900/5 font-medium text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
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

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">{children}</div>
        </section>
      </div>
    </main>
  )
}

