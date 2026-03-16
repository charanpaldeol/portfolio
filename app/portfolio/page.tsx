"use client"

import { motion } from "framer-motion"
import { Button } from "components/Button/Button"
import { AnimatedGradientText } from "components/magicui/animated-gradient-text"
import { BlurFade } from "components/magicui/blur-fade"

const cards = [
  {
    href: "/portfolio/about",
    title: "About",
    description: "Who I am, how I work, and what I care about.",
    icon: "👤",
  },
  {
    href: "/portfolio/services",
    title: "Services",
    description: "How I help teams ship products with momentum.",
    icon: "🛠️",
  },
  {
    href: "/portfolio/projects",
    title: "Projects",
    description: "Selected projects with context, constraints, and outcomes.",
    icon: "📁",
  },
  {
    href: "/portfolio/experience",
    title: "Experience",
    description: "Roles, teams, and responsibilities across my career.",
    icon: "📈",
  },
] as const

export default function PortfolioOverviewPage() {
  return (
    <div className="space-y-10">
      <header className="grid gap-6 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] md:items-center">
        <div className="space-y-3">
          <AnimatedGradientText className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            Portfolio
          </AnimatedGradientText>
          <BlurFade>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Work, experience &amp; expertise
            </h1>
          </BlurFade>
          <BlurFade delay={0.05}>
            <p className="max-w-xl text-sm text-slate-600 md:text-base">
              A focused view of how I partner with teams to design, build, and launch products—from early concepts to
              mature, scaled systems.
            </p>
          </BlurFade>
        </div>

        <BlurFade delay={0.1}>
          <div className="rounded-2xl border border-slate-200 bg-slate-900 text-slate-50 shadow-sm">
            <div className="border-b border-slate-800 px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Featured snapshot
            </div>
            <div className="space-y-3 px-4 py-4 text-sm md:px-5 md:py-5">
              <p className="text-slate-100">
                I help founders and product teams move from ambiguous ideas to shipped, maintainable products—balancing
                strategy, UX, and engineering tradeoffs.
              </p>
              <p className="text-xs text-slate-300">
                Recent work spans B2B SaaS dashboards, internal tools, and consumer-facing experiences across web and
                mobile.
              </p>
              <div className="pt-1">
                <Button href="/portfolio/projects" size="sm" variant="secondary" className="bg-slate-50 text-slate-900">
                  View selected projects
                </Button>
              </div>
            </div>
          </div>
        </BlurFade>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Navigate the portfolio
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index, duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/5 text-lg">
                  <span aria-hidden="true">{card.icon}</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{card.description}</p>
                <div className="mt-auto pt-3">
                  <Button href={card.href} size="sm" className="mt-2">
                    View {card.title.toLowerCase()}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

