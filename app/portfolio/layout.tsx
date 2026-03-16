import Link from "next/link"
import { ReactNode } from "react"

import { ScrollArea } from "../../components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/navigation-menu"

const sections = [
  { href: "/portfolio", label: "Overview", value: "overview" },
  { href: "/portfolio/about", label: "About", value: "about" },
  { href: "/portfolio/services", label: "Services", value: "services" },
  { href: "/portfolio/projects", label: "Projects", value: "projects" },
  { href: "/portfolio/experience", label: "Experience", value: "experience" },
  { href: "/portfolio/contact", label: "Contact", value: "contact" },
] as const

export default function PortfolioLayout({ children }: { children: ReactNode }) {
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
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900",
                  "data-[active=true]:bg-slate-900 data-[active=true]:text-slate-50"
                )}
                data-active={false}
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
                    className="rounded-full px-3 py-1.5 hover:bg-slate-100 hover:text-slate-900"
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

