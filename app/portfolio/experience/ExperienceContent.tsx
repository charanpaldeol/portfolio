"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const timeline = [
  {
    role: "Independent Consultant",
    company: "Self-employed",
    period: "2022 – Present",
    description:
      "Partnering with founders and product teams on strategy, design, and engineering. Clients span B2B SaaS, fintech, and consumer apps.",
    current: true,
  },
  {
    role: "Senior Product Engineer",
    company: "[Stealth SaaS Co.]",
    period: "2019 – 2022",
    description:
      "Led frontend architecture and design system for a B2B data platform. Grew from 3 to 18 engineers; established component library and design-engineering workflow.",
    current: false,
  },
  {
    role: "Product Designer & Engineer",
    company: "Agency / Studio",
    period: "2017 – 2019",
    description:
      "Designed and built web and mobile products for 10+ clients across healthcare, retail, and fintech.",
    current: false,
  },
  {
    role: "Junior Developer",
    company: "First role",
    period: "2015 – 2017",
    description:
      "Shipped features across a React + Rails monolith. First exposure to product thinking and end-to-end ownership.",
    current: false,
  },
]

const education = [
  { label: "Degree", value: "B.Sc. Computer Science" },
  { label: "School", value: "University of Toronto" },
  { label: "Graduated", value: "2015" },
  { label: "Focus", value: "Human-Computer Interaction, Distributed Systems" },
]

function PageHero() {
  return (
    <header className="mb-14 max-w-4xl md:mb-20">
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55 }}
        className="mb-6 flex items-center gap-4"
      >
        <div className="h-px w-12 bg-primary" />
        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Experience</span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.1 }}
        className="font-display text-5xl font-extrabold tracking-tighter text-on-surface leading-[1.05] md:text-7xl"
      >
        Career <span className="text-editorial-gradient">timeline.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.22 }}
        className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-on-surface-variant md:text-2xl"
      >
        Roles and chapters that shaped how I think about product, design systems, and shipping with teams at scale.
      </motion.p>
    </header>
  )
}

export default function ExperiencePage() {
  return (
    <div className="space-y-16 md:space-y-20">
      <PageHero />

      {/* Each chapter: Expert Highlight–style tertiary accent, no timeline border + dot chrome */}
      <section className="space-y-5 md:space-y-6">
        {timeline.map((entry, i) => (
          <motion.article
            key={entry.role}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 + i * 0.06, duration: 0.4 }}
            className="border-l-4 border-tertiary py-1 pl-6 md:pl-10"
          >
            <div className="flex flex-wrap items-center gap-2 gap-y-1">
              <h2 className="font-display text-lg font-bold tracking-tight text-on-surface md:text-xl">{entry.role}</h2>
              {entry.current ? (
                <span className="rounded-full bg-primary-fixed px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-on-primary-fixed uppercase">
                  Current
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-xs font-medium tracking-wide text-on-surface-variant uppercase">
              {entry.company} · {entry.period}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant md:text-base">{entry.description}</p>
          </motion.article>
        ))}
      </section>

      {/* Education — tonal list, no table / rules */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight text-on-surface md:text-2xl">Education</h2>
          <span className="text-xs font-semibold tracking-[0.18em] text-on-surface-variant uppercase">Credentials</span>
        </div>
        <div className="overflow-hidden rounded-2xl bg-surface-container-low">
          <ul className="flex flex-col">
            {education.map((row, i) => (
              <li
                key={row.label}
                className={cn(
                  "flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-8 sm:py-5 md:px-8",
                  i % 2 === 0 ? "bg-surface-container-lowest/80" : "bg-surface-container-low",
                )}
              >
                <span className="w-28 shrink-0 text-xs font-semibold tracking-[0.12em] text-on-surface-variant uppercase">
                  {row.label}
                </span>
                <span className="text-sm text-on-surface md:text-base">{row.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
