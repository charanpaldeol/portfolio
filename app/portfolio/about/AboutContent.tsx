"use client"

import { motion } from "framer-motion"

const values = [
  {
    icon: "✦",
    title: "Craft over speed",
    description: "Details matter in code, design, and how products are explained.",
  },
  {
    icon: "◎",
    title: "Systems thinking",
    description: "Look for leverage: solutions that scale, patterns that generalize.",
  },
  {
    icon: "◈",
    title: "Honest collaboration",
    description: "Surface hard tradeoffs early rather than discover them at launch.",
  },
  {
    icon: "⬡",
    title: "Outcomes over output",
    description: "What shipped, and did it work?",
  },
]

const stack = [
  { category: "Languages", items: "TypeScript, JavaScript, Python, SQL" },
  { category: "Frontend", items: "React, Next.js, Tailwind CSS, Framer Motion" },
  { category: "Backend", items: "Node.js, Express, PostgreSQL, Redis" },
  { category: "Design", items: "Figma, Storybook, design tokens, component systems" },
  { category: "Infra", items: "Vercel, AWS, Docker, GitHub Actions" },
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
        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">About</span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.1 }}
        className="font-display text-5xl font-extrabold tracking-tighter text-on-surface leading-[1.05] md:text-7xl"
      >
        Background &amp;{" "}
        <span className="text-editorial-gradient">approach.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.22 }}
        className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-on-surface-variant md:text-2xl"
      >
        Designer, engineer, and product thinker at the intersection of code and craft — building with editorial
        clarity and systems discipline.
      </motion.p>
    </header>
  )
}

export default function AboutPage() {
  return (
    <div className="space-y-16 md:space-y-20">
      <PageHero />

      {/* Bio — tonal lift: low section, lowest inner read surface */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-surface-container-low p-6 sm:p-8 md:p-10"
      >
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-container text-5xl text-on-primary shadow-editorial sm:h-32 sm:w-32">
            👤
          </div>
          <div className="min-w-0 flex-1 space-y-5">
            <p className="text-base font-medium leading-relaxed text-on-surface md:text-lg">
              I&apos;m an independent consultant with 8+ years building digital products across B2B SaaS, fintech, and
              consumer apps. I&apos;ve worked across the full stack — from shaping product strategy and UX to writing
              the code that ships it.
            </p>
            <p className="text-base leading-relaxed text-on-surface-variant md:text-lg">
              I care deeply about the space between design and engineering where most product quality is made or lost.
              Before going independent, I led frontend architecture and design systems at a B2B data platform and spent
              time at agencies designing and building for clients across healthcare, retail, and fintech.
            </p>
            <p className="text-xs font-semibold tracking-widest text-tertiary uppercase">
              Toronto, CA · Remote worldwide
            </p>
          </div>
        </div>
      </motion.section>

      {/* Expert highlight */}
      <section className="border-l-4 border-tertiary py-2 pl-8 md:pl-12">
        <blockquote className="font-display text-2xl font-extrabold italic leading-tight text-on-surface-variant md:text-3xl">
          &quot;The best work happens when strategy, design, and engineering share one narrative — not three
          handoffs.&quot;
        </blockquote>
        <p className="mt-4 text-xs font-semibold tracking-widest text-tertiary uppercase">Working thesis</p>
      </section>

      {/* Principles — surface shifts, no divider lines */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight text-on-surface md:text-2xl">How I work</h2>
          <span className="text-xs font-semibold tracking-[0.18em] text-on-surface-variant uppercase">Core principles</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
              className="rounded-xl bg-surface-container-lowest p-6 transition-colors duration-300 hover:bg-surface-container-low md:p-8"
            >
              <div className="mb-4 text-2xl text-on-surface-variant">{v.icon}</div>
              <h3 className="text-base font-medium tracking-tight text-on-surface">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant md:text-base">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stack — stacked layers, no table borders */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight text-on-surface md:text-2xl">Tech stack</h2>
          <span className="text-xs font-semibold tracking-[0.18em] text-on-surface-variant uppercase">
            Tools &amp; frameworks
          </span>
        </div>
        <div className="overflow-hidden rounded-2xl bg-surface-container-low">
          <ul className="flex flex-col gap-0">
            {stack.map((row, i) => (
              <li
                key={row.category}
                className={[
                  "flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-8 sm:py-5 md:px-8",
                  i % 2 === 0 ? "bg-surface-container-lowest/80" : "bg-surface-container-low",
                ].join(" ")}
              >
                <span className="w-32 shrink-0 text-xs font-semibold tracking-[0.12em] text-on-surface-variant uppercase">
                  {row.category}
                </span>
                <span className="text-sm font-normal leading-relaxed text-on-surface md:text-base">{row.items}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
