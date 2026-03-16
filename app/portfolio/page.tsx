"use client"

import { motion } from "framer-motion"
import { AnimatedGradientText } from "components/magicui/animated-gradient-text"
import { BlurFade } from "components/magicui/blur-fade"
import { ShimmerButton } from "components/magicui/shimmer-button"
import { NumberTicker } from "components/magicui/number-ticker"
import { Marquee } from "components/magicui/marquee"

const cards = [
  {
    href: "/portfolio/about",
    title: "About",
    description: "Who I am, how I work, and what I care about.",
    icon: "👤",
    gradient: "from-violet-500/10 to-purple-500/5",
    hoverBorder: "hover:border-violet-200",
  },
  {
    href: "/portfolio/services",
    title: "Services",
    description: "How I help teams ship products with momentum.",
    icon: "🛠️",
    gradient: "from-sky-500/10 to-blue-500/5",
    hoverBorder: "hover:border-sky-200",
  },
  {
    href: "/portfolio/projects",
    title: "Projects",
    description: "Selected projects with context, constraints, and outcomes.",
    icon: "📁",
    gradient: "from-emerald-500/10 to-teal-500/5",
    hoverBorder: "hover:border-emerald-200",
  },
  {
    href: "/portfolio/experience",
    title: "Experience",
    description: "Roles, teams, and responsibilities across my career.",
    icon: "📈",
    gradient: "from-amber-500/10 to-orange-500/5",
    hoverBorder: "hover:border-amber-200",
  },
  {
    href: "/portfolio/contact",
    title: "Contact",
    description: "Let's talk about your next project or idea.",
    icon: "✉️",
    gradient: "from-rose-500/10 to-pink-500/5",
    hoverBorder: "hover:border-rose-200",
  },
] as const

const skills = [
  "Product Strategy",
  "React / Next.js",
  "TypeScript",
  "System Design",
  "UX Design",
  "Node.js",
  "Figma",
  "Data Pipelines",
  "B2B SaaS",
  "Mobile (iOS/Android)",
  "Design Systems",
  "Team Leadership",
]

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
                <ShimmerButton href="/portfolio/projects">
                  View selected projects
                </ShimmerButton>
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-slate-800">
              {[
                { value: 8, suffix: "+", label: "Years experience" },
                { value: 40, suffix: "+", label: "Projects shipped" },
                { value: 15, suffix: "+", label: "Teams worked with" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={[
                    "px-4 py-3 text-center",
                    i < 2 ? "border-r border-slate-800" : "",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold text-white">
                    <NumberTicker value={stat.value} suffix={stat.suffix} delay={0.3 + i * 0.1} />
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </BlurFade>
      </header>

      {/* Skills marquee */}
      <BlurFade delay={0.15}>
        <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50/60 py-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-50 z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-50 z-10" />
          <Marquee pauseOnHover className="[--duration:30s]">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </Marquee>
        </div>
      </BlurFade>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Navigate the portfolio
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <motion.a
              key={card.href}
              href={card.href}
              className={[
                "group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200",
                "hover:shadow-md",
                card.hoverBorder,
              ].join(" ")}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.06, duration: 0.25, ease: "easeOut" }}
              whileHover={{ y: -3 }}
            >
              <div
                className={[
                  "mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-lg transition-transform duration-200 group-hover:scale-110",
                  card.gradient,
                ].join(" ")}
              >
                <span aria-hidden="true">{card.icon}</span>
              </div>
              <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-600">{card.description}</p>
              <div className="mt-3 flex items-center gap-1 text-sm font-medium text-slate-700">
                <span>View {card.title.toLowerCase()}</span>
                <svg
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </section>
    </div>
  )
}
