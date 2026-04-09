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
        <AnimatedGradientText className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          About
        </AnimatedGradientText>
        <BlurFade>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Background &amp; approach
          </h1>
        </BlurFade>
        <BlurFade delay={0.05}>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            Designer, engineer, and product thinker. I sit at the intersection of code and craft.
          </p>
        </BlurFade>
      </header>

      {/* Bio card */}
      <BlurFade delay={0.1}>
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container-low to-surface-container-lowest p-6 shadow-editorial transition-all duration-300 hover:shadow-editorial-lg sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            {/* Avatar section */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-container text-5xl text-primary-foreground shadow-editorial-float">
              👤
            </div>
            
            {/* Bio content */}
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-base leading-relaxed font-medium text-foreground">
                  I'm an independent consultant with 8+ years building digital products across B2B SaaS, fintech, and
                  consumer apps. I've worked across the full stack—from shaping product strategy and UX to writing the
                  code that ships it.
                </p>
              </div>
              
              <p className="text-sm leading-relaxed text-muted-foreground">
                I care deeply about the space between design and engineering where most product quality is made or lost. Before going independent, I led frontend architecture and design systems at a B2B data platform and spent time at agencies designing and building for clients across healthcare, retail, and fintech.
              </p>
              
              <div className="flex items-center gap-2 pt-2 text-xs font-medium text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/50" />
                Based in Toronto, CA · Available globally (remote-first)
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* How I work */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">How I work</h2>
          <p className="text-xs text-muted-foreground/80">Core principles</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.25, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl bg-card p-5 shadow-editorial-float transition-all duration-300 hover:shadow-editorial-lg"
            >
              <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-secondary to-primary transition-all duration-300 group-hover:w-full" />

              <div className="mb-3 text-2xl">{v.icon}</div>
              <h3 className="text-sm font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">Tech stack</h2>
          <p className="text-xs text-muted-foreground/80">Tools & frameworks</p>
        </div>
        <div className="overflow-hidden rounded-2xl bg-card shadow-editorial-float transition-all duration-300 hover:shadow-editorial">
          <table className="w-full text-sm">
            <tbody>
              {stack.map((row, i) => (
                <tr
                  key={row.category}
                  className={[
                    "transition-all duration-200",
                    i % 2 === 0 ? "bg-surface-container-lowest/80 hover:bg-surface-container-low" : "bg-surface-container-low/50 hover:bg-surface-container",
                  ].join(" ")}
                >
                  <td className="w-32 px-5 py-4 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase whitespace-nowrap">
                    {row.category}
                  </td>
                  <td className="px-5 py-4 font-medium text-foreground">{row.items}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
