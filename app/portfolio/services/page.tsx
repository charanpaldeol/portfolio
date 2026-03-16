"use client"

import { motion } from "framer-motion"
import { AnimatedGradientText } from "components/magicui/animated-gradient-text"
import { BlurFade } from "components/magicui/blur-fade"
import { ShimmerButton } from "components/magicui/shimmer-button"

const services = [
  {
    icon: "🗺️",
    title: "Product Strategy",
    tagline: "Define what to build",
    taglineColor: "bg-violet-50 text-violet-700 border border-violet-100",
    hoverBorder: "hover:border-violet-200",
    description:
      "I help teams cut through ambiguity—turning user research, business goals, and technical constraints into a clear, sequenced roadmap.",
    deliverables: ["Discovery workshops & problem framing", "Roadmap prioritization & trade-off analysis", "OKR alignment and success metrics"],
  },
  {
    icon: "⚙️",
    title: "Full-Stack Engineering",
    tagline: "Ship with confidence",
    taglineColor: "bg-sky-50 text-sky-700 border border-sky-100",
    hoverBorder: "hover:border-sky-200",
    description:
      "End-to-end product engineering: React/Next.js frontends, Node.js backends, and the infrastructure to run them reliably in production.",
    deliverables: ["React / Next.js web applications", "API design & backend services", "CI/CD pipelines & deployment setup"],
  },
  {
    icon: "🎨",
    title: "Design Systems",
    tagline: "Build at scale",
    taglineColor: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    hoverBorder: "hover:border-emerald-200",
    description:
      "I build component libraries and design systems that bridge design and engineering—reducing handoff friction and accelerating every team that uses them.",
    deliverables: ["Token-based design system architecture", "Storybook component library", "Design-to-dev workflow & documentation"],
  },
  {
    icon: "🧭",
    title: "Technical Leadership",
    tagline: "Lead with clarity",
    taglineColor: "bg-amber-50 text-amber-700 border border-amber-100",
    hoverBorder: "hover:border-amber-200",
    description:
      "Fractional eng leadership for teams that need experienced technical direction without a full-time commitment—architecture reviews, hiring, and team process.",
    deliverables: ["Architecture & code review", "Engineering hiring & onboarding", "Team process & delivery cadence"],
  },
]

const steps = [
  { number: "01", label: "Understand", description: "Deep-dive into your problem, users, and constraints." },
  { number: "02", label: "Define", description: "Frame the scope, agree on success, and sequence the work." },
  { number: "03", label: "Build", description: "Ship in short cycles with constant feedback loops." },
  { number: "04", label: "Launch", description: "Deploy, measure, and iterate based on real usage." },
]

export default function ServicesPage() {
  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <AnimatedGradientText className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          Services
        </AnimatedGradientText>
        <BlurFade>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            How I can help
          </h1>
        </BlurFade>
        <BlurFade delay={0.05}>
          <p className="max-w-xl text-sm text-slate-600 md:text-base">
            Explore how I partner with teams on product strategy, design systems, full-stack engineering, and
            technical leadership engagements.
          </p>
        </BlurFade>
      </header>

      {/* Service cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((svc, i) => (
          <motion.div
            key={svc.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.06, duration: 0.25, ease: "easeOut" }}
            className={[
              "rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-all duration-200",
              svc.hoverBorder,
            ].join(" ")}
          >
            <div className="mb-3 text-3xl">{svc.icon}</div>
            <span className={["inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold mb-2", svc.taglineColor].join(" ")}>
              {svc.tagline}
            </span>
            <h3 className="text-base font-semibold text-slate-900">{svc.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{svc.description}</p>
            <ul className="mt-3 space-y-1.5">
              {svc.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  {d}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Process strip */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">How I work</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.25, ease: "easeOut" }}
              className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="text-2xl font-bold text-slate-200 mb-1">{step.number}</div>
              <h3 className="text-sm font-semibold text-slate-900">{step.label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA block */}
      <BlurFade delay={0.35}>
        <div className="rounded-xl bg-slate-900 px-6 py-8 text-center space-y-4">
          <h2 className="text-xl font-semibold text-white">Ready to talk scope?</h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            I take on a small number of engagements at a time. Let's see if there's a fit.
          </p>
          <ShimmerButton href="/portfolio/contact">
            Get in touch
          </ShimmerButton>
        </div>
      </BlurFade>
    </section>
  )
}
