"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

const services = [
  {
    icon: "🗺️",
    title: "Product Strategy",
    tagline: "Define what to build",
    taglineClass: "bg-secondary-fixed text-on-secondary-fixed",
    description:
      "I help teams cut through ambiguity — turning user research, business goals, and technical constraints into a clear, sequenced roadmap.",
    deliverables: [
      "Discovery workshops & problem framing",
      "Roadmap prioritization & trade-off analysis",
      "OKR alignment and success metrics",
    ],
    span: "md:col-span-7",
    surface: "bg-surface-container-low",
  },
  {
    icon: "⚙️",
    title: "Full-Stack Engineering",
    tagline: "Ship with confidence",
    taglineClass: "bg-secondary-fixed/90 text-on-secondary-fixed",
    description:
      "End-to-end product engineering: React/Next.js frontends, Node.js backends, and the infrastructure to run them reliably in production.",
    deliverables: ["React / Next.js web applications", "API design & backend services", "CI/CD pipelines & deployment setup"],
    span: "md:col-span-5",
    surface: "bg-surface-container-lowest",
  },
  {
    icon: "🎨",
    title: "Design Systems",
    tagline: "Build at scale",
    taglineClass: "bg-primary-fixed text-on-primary-fixed",
    description:
      "Component libraries and design systems that bridge design and engineering — reducing handoff friction and accelerating every team that uses them.",
    deliverables: [
      "Token-based design system architecture",
      "Storybook component library",
      "Design-to-dev workflow & documentation",
    ],
    span: "md:col-span-5",
    surface: "bg-surface-container-lowest",
  },
  {
    icon: "🧭",
    title: "Technical Leadership",
    tagline: "Lead with clarity",
    taglineClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    description:
      "Fractional engineering leadership for teams that need experienced technical direction — architecture reviews, hiring, and delivery rhythm.",
    deliverables: ["Architecture & code review", "Engineering hiring & onboarding", "Team process & delivery cadence"],
    span: "md:col-span-7",
    surface: "bg-surface-container-low",
  },
] as const

const steps = [
  { number: "01", label: "Understand", description: "Deep-dive into your problem, users, and constraints." },
  { number: "02", label: "Define", description: "Frame the scope, agree on success, and sequence the work." },
  { number: "03", label: "Build", description: "Ship in short cycles with constant feedback loops." },
  { number: "04", label: "Launch", description: "Deploy, measure, and iterate based on real usage." },
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
        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Services</span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.1 }}
        className="font-display text-5xl font-extrabold tracking-tighter text-on-surface leading-[1.05] md:text-7xl"
      >
        How I can <span className="text-editorial-gradient">help.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.22 }}
        className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-on-surface-variant md:text-2xl"
      >
        Product strategy, design systems, full-stack engineering, and technical leadership — structured for outcomes,
        not activity.
      </motion.p>
    </header>
  )
}

export default function ServicesPage() {
  return (
    <div className="space-y-16 md:space-y-20">
      <PageHero />

      {/* Asymmetric bento — tonal surfaces, no boxed chrome */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
        {services.map((svc, i) => (
          <motion.article
            key={svc.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 + i * 0.05, duration: 0.4 }}
            className={cn(
              "flex min-h-[280px] flex-col justify-between rounded-xl p-8 md:min-h-[320px] md:p-10",
              svc.span,
              svc.surface,
            )}
          >
            <div>
              <div className="mb-6 text-3xl">{svc.icon}</div>
              <span className={cn("mb-4 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase", svc.taglineClass)}>
                {svc.tagline}
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface md:text-3xl">{svc.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant md:text-base">{svc.description}</p>
              <ul className="mt-6 space-y-2.5">
                {svc.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-xs font-medium text-on-surface-variant md:text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </section>

      {/* Process — nested surface strip */}
      <section className="rounded-2xl bg-surface-container-low p-6 md:p-10">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight text-on-surface md:text-2xl">Engagement arc</h2>
          <span className="text-xs font-semibold tracking-[0.18em] text-on-surface-variant uppercase">Four beats</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 + i * 0.06, duration: 0.35 }}
              className="rounded-xl bg-surface-container-lowest p-5 md:p-6"
            >
              <div className="font-display text-3xl font-extrabold text-primary/35 md:text-4xl">{step.number}</div>
              <h3 className="mt-2 text-sm font-medium text-on-surface">{step.label}</h3>
              <p className="mt-2 text-xs leading-relaxed text-on-surface-variant md:text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA — signature gradient per DESIGN */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-container to-secondary px-8 py-12 text-on-primary md:flex md:items-center md:justify-between md:gap-12 md:px-12 md:py-14"
      >
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="relative z-10 max-w-xl">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Ready to talk scope?</h2>
          <p className="mt-3 text-sm leading-relaxed opacity-90 md:text-base">
            I take on a small number of engagements at a time. Let&apos;s explore whether there&apos;s a strong fit for
            your roadmap.
          </p>
        </div>
        <div className="relative z-10 mt-8 md:mt-0 md:shrink-0">
          <Link
            href="/portfolio/contact"
            className="inline-flex items-center justify-center rounded-xl bg-primary-fixed px-8 py-4 text-sm font-extrabold text-on-primary-fixed shadow-editorial transition hover:brightness-[1.03] md:px-10 md:py-5 md:text-base"
          >
            Get in touch
          </Link>
          <Link
            href="/what-i-bring"
            className="mt-4 flex items-center gap-2 text-xs font-semibold tracking-wider text-on-primary/90 uppercase underline-offset-4 transition hover:text-on-primary md:mt-5"
          >
            What I bring <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
