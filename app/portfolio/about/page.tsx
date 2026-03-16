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
        <div className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-4xl">
            👤
          </div>
          <div className="space-y-2">
            <p className="text-sm leading-relaxed text-slate-700">
              I'm an independent consultant with 8+ years building digital products across B2B SaaS, fintech, and
              consumer apps. I've worked across the full stack—from shaping product strategy and UX to writing the
              code that ships it. I care deeply about the space between design and engineering where most product
              quality is made or lost.
            </p>
            <p className="text-sm leading-relaxed text-slate-700">
              Before going independent, I led frontend architecture and design systems at a B2B data platform and
              spent time at agencies designing and building for clients across healthcare, retail, and fintech.
            </p>
            <p className="text-xs text-slate-400">Based in Toronto, CA · Available globally (remote-first)</p>
          </div>
        </div>
      </BlurFade>

      {/* How I work */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">How I work</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.25, ease: "easeOut" }}
              className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-all duration-200"
            >
              <div className="mb-2 text-xl text-slate-400">{v.icon}</div>
              <h3 className="text-sm font-semibold text-slate-900">{v.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tech stack</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {stack.map((row) => (
                <tr key={row.category} className="bg-white hover:bg-slate-50 transition-colors duration-150">
                  <td className="w-32 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 whitespace-nowrap">
                    {row.category}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.items}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
