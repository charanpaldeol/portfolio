"use client"

import { motion } from "framer-motion"
import { AnimatedGradientText } from "components/magicui/animated-gradient-text"
import { BlurFade } from "components/magicui/blur-fade"

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

export default function ExperiencePage() {
  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <AnimatedGradientText className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          Experience
        </AnimatedGradientText>
        <BlurFade>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Career timeline
          </h1>
        </BlurFade>
        <BlurFade delay={0.05}>
          <p className="max-w-xl text-sm text-slate-600 md:text-base">
            An overview of the roles, teams, and responsibilities that have shaped my experience across product,
            design, and engineering.
          </p>
        </BlurFade>
      </header>

      {/* Timeline */}
      <div className="relative space-y-0 pl-6 border-l-2 border-slate-100">
        {timeline.map((entry, i) => (
          <motion.div
            key={entry.role}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.06, duration: 0.25, ease: "easeOut" }}
            className="relative pb-8 last:pb-0"
          >
            {/* Timeline dot */}
            <span
              className={[
                "absolute -left-[1.3125rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-white",
                entry.current ? "bg-slate-900" : "bg-slate-300",
              ].join(" ")}
            />

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">{entry.role}</h3>
                {entry.current && (
                  <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {entry.company} · {entry.period}
              </p>
              <p className="text-sm leading-relaxed text-slate-500">{entry.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Education */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Education</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {education.map((row) => (
                <tr key={row.label} className="bg-white hover:bg-slate-50 transition-colors duration-150">
                  <td className="w-28 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 whitespace-nowrap">
                    {row.label}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
