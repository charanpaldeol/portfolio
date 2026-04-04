"use client"

import { motion } from "framer-motion"
import { AnimatedGradientText } from "components/magicui/animated-gradient-text"
import { BlurFade } from "components/magicui/blur-fade"

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

export default function AboutPage() {
  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <AnimatedGradientText className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          About
        </AnimatedGradientText>
        <BlurFade>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Background &amp; approach
          </h1>
        </BlurFade>
        <BlurFade delay={0.05}>
          <p className="max-w-xl text-sm text-slate-600 md:text-base">
            Designer, engineer, and product thinker. I sit at the intersection of code and craft.
          </p>
        </BlurFade>
      </header>

      {/* Bio card */}
      <BlurFade delay={0.1}>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-6 sm:p-8 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            {/* Avatar section */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-5xl shadow-md">
              👤
            </div>
            
            {/* Bio content */}
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-base leading-relaxed text-slate-800 font-medium">
                  I'm an independent consultant with 8+ years building digital products across B2B SaaS, fintech, and
                  consumer apps. I've worked across the full stack—from shaping product strategy and UX to writing the
                  code that ships it.
                </p>
              </div>
              
              <p className="text-sm leading-relaxed text-slate-600">
                I care deeply about the space between design and engineering where most product quality is made or lost. Before going independent, I led frontend architecture and design systems at a B2B data platform and spent time at agencies designing and building for clients across healthcare, retail, and fintech.
              </p>
              
              <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
                Based in Toronto, CA · Available globally (remote-first)
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* How I work */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">How I work</h2>
          <p className="text-xs text-slate-400">Core principles</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.25, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-300"
            >
              {/* Accent line */}
              <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-300 group-hover:w-full" />
              
              <div className="mb-3 text-2xl">{v.icon}</div>
              <h3 className="text-sm font-semibold text-slate-900">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tech stack</h2>
          <p className="text-xs text-slate-400">Tools & frameworks</p>
        </div>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {stack.map((row, i) => (
                <tr key={row.category} className={[
                  "transition-all duration-200",
                  i % 2 === 0 ? "bg-white hover:bg-slate-50" : "bg-slate-50/30 hover:bg-slate-50",
                ].join(" ")}>
                  <td className="w-32 px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 whitespace-nowrap">
                    {row.category}
                  </td>
                  <td className="px-5 py-4 text-slate-700 font-medium">{row.items}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
