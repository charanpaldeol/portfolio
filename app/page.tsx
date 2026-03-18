"use client"

import { motion } from "framer-motion"
import { AnimatedGradientText } from "components/magicui/animated-gradient-text"
import { BlurFade } from "components/magicui/blur-fade"
import { ShimmerButton } from "components/magicui/shimmer-button"
import { Button } from "components/Button/Button"

const highlights = [
  { icon: "🏗️", label: "Product strategy & execution" },
  { icon: "⚛️", label: "React / Next.js / TypeScript" },
  { icon: "🎨", label: "UX design & design systems" },
  { icon: "📱", label: "Web & mobile — web to iOS/Android" },
]

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-16">
      <div className="mx-auto w-full max-w-4xl">
        {/* Top badge */}
        <BlurFade>
          <div className="mb-6 flex items-center justify-center gap-2">
            <AnimatedGradientText className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Product · Design · Engineering
            </AnimatedGradientText>
          </div>
        </BlurFade>

        {/* Hero headline */}
        <BlurFade delay={0.05}>
          <h1 className="text-center text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl xl:text-6xl">
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">
              Charan Deol
            </span>
          </h1>
        </BlurFade>

        {/* Sub-headline */}
        <BlurFade delay={0.1}>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-slate-600 md:text-xl">
            I help founders and product teams turn ambiguous ideas into shipped, maintainable products — balancing
            strategy, UX, and engineering tradeoffs.
          </p>
        </BlurFade>

        {/* Availability pill */}
        <BlurFade delay={0.15}>
          <div className="mt-5 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Available for work · Limited 2026 capacity
            </span>
          </div>
        </BlurFade>

        {/* CTA buttons */}
        <BlurFade delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ShimmerButton href="/portfolio">View portfolio</ShimmerButton>
            <Button intent="secondary" href="/portfolio/contact">
              Get in touch
            </Button>
          </div>
        </BlurFade>

        {/* Highlights grid */}
        <BlurFade delay={0.25}>
          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {highlights.map((item, i) => (
              <motion.div
                key={item.label}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-5 text-center shadow-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.25, ease: "easeOut" }}
              >
                <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                <span className="text-xs font-medium leading-snug text-slate-700">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </BlurFade>
      </div>
    </main>
  )
}
