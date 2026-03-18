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
              "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-all duration-300",
              svc.hoverBorder,
            ].join(" ")}
          >
            {/* Gradient background on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                 style={{
                   background: `linear-gradient(135deg, ${svc.taglineColor.match(/(?:text-|border|bg-)(\w+-\d+)/)?.[1] || 'violet'}-50 0%, transparent 100%)`,
                 }} 
            />
            
            <div className="relative">
              <div className="mb-4 text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 inline-block">{svc.icon}</div>
              
              <span className={["inline-block rounded-full px-3 py-1 text-[11px] font-semibold mb-3", svc.taglineColor].join(" ")}>
                {svc.tagline}
              </span>
              
              <h3 className="text-base font-semibold text-slate-900 mb-2">{svc.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600 mb-4">{svc.description}</p>
              
              <ul className="space-y-2">
                {svc.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-xs font-medium text-slate-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 transition-colors duration-200 group-hover:bg-slate-500" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Process strip */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">How I work</h2>
          <p className="text-xs text-slate-400">4-step process</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.25, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg transition-all duration-300"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-slate-400 to-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="text-3xl font-bold bg-gradient-to-r from-slate-300 to-slate-200 bg-clip-text text-transparent mb-2 group-hover:from-blue-400 group-hover:to-blue-300 transition-all duration-300">
                  {step.number}
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{step.label}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA block */}
      <BlurFade delay={0.35}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-10 text-center space-y-5 shadow-lg hover:shadow-xl transition-all duration-300 group">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
               style={{
                 background: 'radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.1), transparent)',
               }}
          />
          
          <div className="relative">
            <h2 className="text-2xl font-semibold text-white">Ready to talk scope?</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
              I take on a small number of engagements at a time. Let's explore if there's a great fit for your project.
            </p>
            <div className="pt-3">
              <ShimmerButton href="/portfolio/contact">
                Get in touch
              </ShimmerButton>
            </div>
          </div>
        </div>
      </BlurFade>
    </section>
  )
}
