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
    taglineColor: "bg-secondary-fixed text-on-secondary-fixed",
    description:
      "I help teams cut through ambiguity—turning user research, business goals, and technical constraints into a clear, sequenced roadmap.",
    deliverables: ["Discovery workshops & problem framing", "Roadmap prioritization & trade-off analysis", "OKR alignment and success metrics"],
  },
  {
    icon: "⚙️",
    title: "Full-Stack Engineering",
    tagline: "Ship with confidence",
    taglineColor: "bg-secondary-fixed/90 text-on-secondary-fixed",
    description:
      "End-to-end product engineering: React/Next.js frontends, Node.js backends, and the infrastructure to run them reliably in production.",
    deliverables: ["React / Next.js web applications", "API design & backend services", "CI/CD pipelines & deployment setup"],
  },
  {
    icon: "🎨",
    title: "Design Systems",
    tagline: "Build at scale",
    taglineColor: "bg-primary-fixed text-on-primary-fixed",
    description:
      "I build component libraries and design systems that bridge design and engineering—reducing handoff friction and accelerating every team that uses them.",
    deliverables: ["Token-based design system architecture", "Storybook component library", "Design-to-dev workflow & documentation"],
  },
  {
    icon: "🧭",
    title: "Technical Leadership",
    tagline: "Lead with clarity",
    taglineColor: "bg-tertiary-fixed text-on-tertiary-fixed",
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
        <AnimatedGradientText className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Services
        </AnimatedGradientText>
        <BlurFade>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            How I can help
          </h1>
        </BlurFade>
        <BlurFade delay={0.05}>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
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
            className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-editorial-float transition-all duration-300 hover:shadow-editorial-lg"
          >
            <div className="relative">
              <div className="mb-4 text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 inline-block">{svc.icon}</div>
              
              <span className={["mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase", svc.taglineColor].join(" ")}>
                {svc.tagline}
              </span>
              
              <h3 className="mb-2 text-base font-semibold text-foreground">{svc.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{svc.description}</p>
              
              <ul className="space-y-2">
                {svc.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-xs font-medium text-muted-foreground">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-surface-container-highest transition-colors duration-200 group-hover:bg-primary" />
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
          <h2 className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">How I work</h2>
          <p className="text-xs text-muted-foreground/80">4-step process</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.25, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl bg-card p-5 shadow-editorial-float transition-all duration-300 hover:shadow-editorial-lg"
            >
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-2 bg-gradient-to-r from-surface-container-highest to-muted-foreground/25 bg-clip-text font-display text-3xl font-extrabold text-transparent transition-all duration-300 group-hover:from-primary group-hover:to-secondary">
                  {step.number}
                </div>
                <h3 className="text-sm font-semibold text-foreground">{step.label}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA block */}
      <BlurFade delay={0.35}>
        <div className="group relative space-y-5 overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-container to-secondary px-8 py-10 text-center shadow-editorial-lg transition-all duration-300 hover:shadow-editorial">
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
               style={{
                 background: "radial-gradient(circle at bottom right, color-mix(in srgb, white 18%, transparent), transparent)",
               }}
          />

          <div className="relative">
            <h2 className="font-display text-2xl font-bold text-primary-foreground">Ready to talk scope?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-primary-foreground/85">
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
