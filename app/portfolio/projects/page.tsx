"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { AnimatedGradientText } from "components/magicui/animated-gradient-text"
import { BlurFade } from "components/magicui/blur-fade"
import { PageShell } from "@/components/layout/PageShell"

const projects = [
  {
    title: "B2B Analytics Dashboard",
    tags: ["React", "TypeScript", "Data Viz"],
    description:
      "Rebuilt a legacy reporting tool into a real-time dashboard for a 50-person ops team. Reduced time-to-insight from 2 days to under 10 minutes.",
    outcome: "3× faster reporting",
    category: "Web",
    color: "bg-secondary",
    icon: "📊",
  },
  {
    title: "Design System — Component Library",
    tags: ["Figma", "React", "Storybook"],
    description:
      "Built a 60-component design system from scratch, adopted across 3 product teams. Reduced design-to-dev handoff friction by standardizing tokens and patterns.",
    outcome: "60 components shipped",
    category: "Design Systems",
    color: "bg-tertiary",
    icon: "🎨",
  },
  {
    title: "Consumer Mobile App — iOS & Android",
    tags: ["React Native", "Node.js", "PostgreSQL"],
    description:
      "Led product and engineering for a consumer wellness app from 0 to launch. 10k+ downloads in first 90 days, 4.6★ App Store rating.",
    outcome: "10k+ downloads",
    category: "Mobile",
    color: "bg-primary",
    icon: "📱",
  },
]

const filters = ["All", "Web", "Mobile", "Design Systems"] as const
type Filter = (typeof filters)[number]

export default function ProjectsPage() {
  const [active, setActive] = useState<Filter>("All")

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active)

  return (
    <PageShell>
      <section className="space-y-8">
        <header className="space-y-3">
          <AnimatedGradientText className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Projects
          </AnimatedGradientText>
          <BlurFade>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              Selected projects
            </h1>
          </BlurFade>
          <BlurFade delay={0.05}>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              A curated selection of projects highlighting product decisions, technical depth, and outcomes across
              different teams and problem spaces.
            </p>
          </BlurFade>
        </header>

        {/* Filter tabs */}
        <BlurFade delay={0.1}>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={[
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150",
                  active === f
                    ? "bg-primary text-primary-foreground shadow-editorial-float"
                    : "bg-surface-container-high text-muted-foreground hover:bg-surface-container hover:text-foreground",
                ].join(" ")}
              >
                {f}
              </button>
            ))}
          </div>
        </BlurFade>

        {/* Project cards */}
        <div className="space-y-4">
          {filtered.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.25, ease: "easeOut" }}
              className="flex flex-col gap-4 rounded-xl bg-card p-5 shadow-editorial-float transition-all duration-200 hover:shadow-editorial sm:flex-row sm:items-start"
            >
              {/* Icon / color block */}
              <div
                className={[
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl text-white",
                  project.color,
                ].join(" ")}
              >
                {project.icon}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-foreground">{project.title}</h3>
                  <span className="inline-flex items-center rounded-full bg-primary-fixed px-2.5 py-0.5 text-xs font-semibold tracking-wide text-on-primary-fixed uppercase">
                    {project.outcome}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
