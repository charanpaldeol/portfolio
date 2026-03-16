import Link from "next/link"
import { ReactNode } from "react"

import { cn } from "../../lib/utils"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"

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
            <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-slate-200 bg-white/80">
              <Tabs defaultValue="overview" className="w-max min-w-full px-1 py-1">
                <TabsList className="inline-flex h-9 bg-transparent">
                  {sections.map((item) => (
                    <TabsTrigger
                      key={item.href}
                      value={item.value}
                      asChild
                      className="px-3 text-xs font-medium text-slate-600 data-[state=active]:text-slate-900"
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </ScrollArea>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">{children}</div>
        </section>
      </div>
    </main>
  )
}

