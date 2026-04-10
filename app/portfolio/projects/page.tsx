"use client"

import { motion } from "framer-motion"
import { useState } from "react"

import { PageShell } from "@/components/layout/PageShell"
import { cn } from "@/lib/utils"

const projects = [
  {
    title: "B2B Analytics Dashboard",
    tags: ["React", "TypeScript", "Data Viz"],
    description:
      "Rebuilt a legacy reporting tool into a real-time dashboard for a 50-person ops team. Reduced time-to-insight from 2 days to under 10 minutes.",
    outcome: "3× faster reporting",
    category: "Web",
    accent: "bg-secondary-container/15 text-secondary",
    icon: "📊",
    span: "md:col-span-8",
    minH: "min-h-[300px] md:min-h-[340px]",
  },
  {
    title: "Design System — Component Library",
    tags: ["Figma", "React", "Storybook"],
    description:
      "Built a 60-component design system from scratch, adopted across 3 product teams. Reduced design-to-dev handoff friction by standardizing tokens and patterns.",
    outcome: "60 components shipped",
    category: "Design Systems",
    accent: "bg-tertiary-container/15 text-tertiary",
    icon: "🎨",
    span: "md:col-span-4",
    minH: "min-h-[260px] md:min-h-[340px]",
  },
  {
    title: "Consumer Mobile App — iOS & Android",
    tags: ["React Native", "Node.js", "PostgreSQL"],
    description:
      "Led product and engineering for a consumer wellness app from 0 to launch. 10k+ downloads in first 90 days, 4.6★ App Store rating.",
    outcome: "10k+ downloads",
    category: "Mobile",
    accent: "bg-primary-container/20 text-primary",
    icon: "📱",
    span: "md:col-span-12",
    minH: "min-h-[240px]",
  },
] as const

const filters = ["All", "Web", "Mobile", "Design Systems"] as const
type Filter = (typeof filters)[number]

function PageHero() {
  return (
    <header className="mb-10 max-w-4xl md:mb-14">
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55 }}
        className="mb-6 flex items-center gap-4"
      >
        <div className="h-px w-12 bg-primary" />
        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Projects</span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.1 }}
        className="font-display text-5xl font-extrabold tracking-tighter text-on-surface leading-[1.05] md:text-7xl"
      >
        Selected <span className="text-editorial-gradient">work.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.22 }}
        className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-on-surface-variant md:text-2xl"
      >
        Product decisions, technical depth, and measurable outcomes — curated across teams and problem spaces.
      </motion.p>
    </header>
  )
}

export default function ProjectsPage() {
  const [active, setActive] = useState<Filter>("All")

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active)

  return (
    <PageShell>
      <section className="space-y-10 md:space-y-12">
        <PageHero />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="flex flex-wrap gap-2"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors duration-200",
                active === f
                  ? "bg-primary-fixed text-on-primary-fixed"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
              )}
            >
              {f}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          {filtered.map((project, i) => (
            <motion.article
              key={project.title}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + i * 0.07, duration: 0.35 }}
              className={cn(
                "flex flex-col rounded-xl bg-surface-container-low p-6 md:p-8 lg:p-10",
                project.span,
                project.minH,
              )}
            >
              <div className="flex flex-1 flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                <div
                  className={cn(
                    "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-3xl sm:h-[4.5rem] sm:w-[4.5rem]",
                    project.accent,
                  )}
                  aria-hidden
                >
                  {project.icon}
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="font-display text-xl font-bold tracking-tight text-on-surface md:text-2xl">
                      {project.title}
                    </h2>
                    <span className="shrink-0 rounded-full bg-secondary-fixed px-3 py-1 text-[10px] font-semibold tracking-wide text-on-secondary-fixed uppercase">
                      {project.outcome}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-container-lowest px-3 py-1 text-[11px] font-medium text-on-surface-variant"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">{project.description}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-sm text-on-surface-variant">No projects in this category yet.</p>
        ) : null}
      </section>
    </PageShell>
  )
}
