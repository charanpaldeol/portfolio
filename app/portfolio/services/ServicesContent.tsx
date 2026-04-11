"use client"

import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  Building2,
  Cloud,
  Globe2,
  Quote,
  Rocket,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { createContext, type ReactNode, useContext } from "react"

import { cn } from "@/lib/utils"

/** When true, Framer Motion durations are collapsed (accessibility). */
const ReduceMotionContext = createContext(false)

const ENGINEERING_HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA2R23OvZ4aEAyfgZSSeYP4g2IsHm17XILz3jm2iRLGCURkMzv9sW2CG9nHDywcUv-fD7cH4t8cGg7Tbz_AoOm3vfqv7QQBJGKyA-1iOd-1PG7_eykFv5yVWRC03we7zn71qXmGPbK8U6VjtkYAHxTdvDXkBXdvXsDgXxhbdRHte0HEifsutTumIJ4PB1Kry8M9h5_27BLDavV1yMEXuugVVBd29zGFfJ0qJ_rjj0AHCrLhK5L2vvthJMS1pibNd0apiUHj4n34PoE"

const QUOTE_AVATAR_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA1ZEHtxm2YRN0HUeiTcE_4Rp4kZV71SCtVXpgzGtj4SjfcpP7EJX_IJMqWoQJ1nBEYVgXqG3iDfDDGT-7q-tKgZOlKF3YOt-YEGmMGlGsx8tlV-RXB6w1iGKuIzbW1mLK9hN4RC81ncn7Hc4zvBCOE6Deyw_lSCmyuTkRAi_vedNKulf0S_Oyw7Cmk1b70humP1eJqMBB1U0pv9LjDQvx18R4v-_XzqA5iAYaDYZ_PWOG9t5G5tDDz2Yo0iUatKNvqpY29KjMaXnU"

const services = [
  {
    icon: Globe2,
    title: "Websites & Landing Pages",
    tagline: "Live within hours",
    taglineClass: "bg-primary-fixed text-on-primary-fixed",
    description:
      "A fast, modern website that looks great on every device. We build landing pages, business sites, and portfolios that help you get found and turn visitors into customers.",
    deliverables: [
      "Landing pages and marketing sites",
      "Mobile-friendly and SEO-ready",
      "Built for speed and conversions",
    ],
    relatedProjects: [
      { title: "Landing Page Website", slug: "landing-page-website", metric: "Launched in 4 weeks" },
    ],
    ideal: "Small businesses, startups, solopreneurs",
  },
  {
    icon: Building2,
    title: "Custom Software & Products",
    tagline: "Built for how you work",
    taglineClass: "bg-secondary-fixed text-on-secondary-fixed",
    description:
      "Stop relying on spreadsheets and manual work. We build software around your business — internal tools, customer-facing products, or a full platform from scratch.",
    deliverables: [
      "HR, payroll, and operations tools",
      "SaaS products and MVPs",
      "Dashboards and workflow automation",
    ],
    relatedProjects: [
      { title: "HR Management System", slug: "hr-management-system", metric: "40% time saved" },
      { title: "Payment Platform", slug: "payment-settlement-platform", metric: "5,000+ tx/sec" },
    ],
    ideal: "Growing businesses ready to automate",
  },
  {
    icon: Rocket,
    title: "AI & Automation",
    tagline: "Work smarter, not harder",
    taglineClass: "bg-secondary-fixed/90 text-on-secondary-fixed",
    description:
      "Put AI to work in your business. We set up intelligent agents, automated workflows, and smart tools that handle repetitive tasks — so your team can focus on what matters.",
    deliverables: [
      "AI tools added to your existing systems",
      "AI agent setup and deployment for your stack",
      "Agentic workflows for complex processes",
    ],
    relatedProjects: [
      { title: "E-commerce Search & Recommendations", slug: "ecommerce-product-search-recommendations", metric: "+18% revenue" },
    ],
    ideal: "Teams ready to work with AI",
  },
  {
    icon: Cloud,
    title: "Enterprise Systems & Security",
    tagline: "Reliable at any scale",
    taglineClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    description:
      "Large systems that handle millions of transactions, keep data safe, and meet regulations. Built for companies where downtime and data breaches are not an option.",
    deliverables: [
      "Scalable systems with 99.99% uptime",
      "Fraud detection and API security",
      "Compliance and regulatory automation",
    ],
    relatedProjects: [
      { title: "Banking Microservices", slug: "api-first-banking-microservices", metric: "99.99% uptime" },
      { title: "Fraud Detection Engine", slug: "fraud-detection-engine", metric: "99.2% accuracy" },
    ],
    ideal: "Companies handling sensitive data at scale",
  },
] as const

const engagementModels = [
  {
    id: "project-based",
    model: "Project-Based",
    timeline: "2–12 months",
    cta: "Contact for pricing",
    description: "A clear goal, a set timeline, and working software delivered in stages. From a landing page to a full platform.",
  },
  {
    id: "ai-automation",
    model: "AI & Automation",
    timeline: "1–8 weeks",
    cta: "Contact for details",
    description: "Set up AI agents, automated workflows, and smart tools. Fast results, with room to grow as you learn what works.",
  },
  {
    id: "leadership-advisory",
    model: "Leadership & Advisory",
    timeline: "3–12 months",
    cta: "Contact for details",
    description: "Senior technical guidance without the full-time cost. Architecture, hiring, code reviews, and big-picture strategy.",
  },
  {
    id: "ongoing-support",
    model: "Ongoing Support",
    timeline: "Monthly",
    cta: "Contact for details",
    description: "A reliable partner on call. Strategic guidance, incident support, and team coaching that scales with your needs.",
  },
] as const

const collaborationSteps = [
  {
    n: "01",
    title: "We listen first",
    body: "We learn your business, your goals, and what's holding you back. No guesswork — just a clear plan that fits.",
  },
  {
    n: "02",
    title: "We build in stages",
    body: "You see working software early and often. We ship in small, useful pieces so you can give feedback along the way.",
  },
  {
    n: "03",
    title: "We hand it off clean",
    body: "You own everything — code, documentation, and training included. We stick around if you need us, or you take it from here.",
  },
] as const

function HeroSection() {
  const reduceMotion = useContext(ReduceMotionContext)
  const t = (duration: number, delay = 0) => ({
    duration: reduceMotion ? 0 : duration,
    delay: reduceMotion ? 0 : delay,
  })
  const fadeUp = reduceMotion ? { opacity: 1, y: 0 } : undefined

  return (
    <section className="mb-24 md:mb-32">
      <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <motion.span
            initial={fadeUp ?? { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.45)}
            className="mb-6 inline-block rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold tracking-widest text-on-primary-fixed uppercase"
          >
            Strategic partnership
          </motion.span>
          <motion.h1
            initial={fadeUp ?? { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.6, 0.05)}
            className="font-display mb-8 text-5xl font-extrabold tracking-tighter text-balance text-on-surface leading-[0.92] md:text-7xl lg:text-8xl"
          >
            Services &amp; expertise
          </motion.h1>
          <motion.p
            initial={fadeUp ?? { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.55, 0.12)}
            className="max-w-2xl text-xl font-normal leading-relaxed text-pretty text-on-surface-variant md:text-2xl"
          >
            Architecting resilient systems and AI-native experiences — from first landing page to enterprise-scale
            platforms.
          </motion.p>
        </div>
        <div className="lg:col-span-4 lg:text-right">
          <div className="mb-6 hidden h-1 w-full bg-tertiary lg:block" aria-hidden />
          <motion.p
            initial={fadeUp ?? { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.5, 0.18)}
            className="text-sm font-medium tracking-widest text-on-surface-variant/60 uppercase"
          >
            Selected disciplines
          </motion.p>
        </div>
      </div>
    </section>
  )
}

function BentoCardShell({
  className,
  children,
  delay = 0,
}: {
  className?: string
  children: ReactNode
  delay?: number
}) {
  const reduceMotion = useContext(ReduceMotionContext)
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : delay }}
      className={cn("flex flex-col", className)}
    >
      {children}
    </motion.div>
  )
}

function ServiceBentoWide({ service }: { service: (typeof services)[number] }) {
  const Icon = service.icon
  return (
    <BentoCardShell className="group h-full justify-between rounded-xl bg-surface-container-lowest p-8 shadow-editorial-float transition-colors duration-500 hover:bg-surface md:col-span-2 md:row-start-1 md:p-10">
      <div>
        <Icon className="mb-6 size-10 text-primary" strokeWidth={1.5} aria-hidden />
        <span
          className={cn(
            "mb-4 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase",
            service.taglineClass,
          )}
        >
          {service.tagline}
        </span>
        <h3 className="font-display mb-4 text-3xl font-bold tracking-tight text-on-surface">{service.title}</h3>
        <p className="text-base leading-relaxed text-on-surface-variant">{service.description}</p>
        <ul className="mt-6 space-y-2">
          {service.deliverables.map((d) => (
            <li key={d} className="flex items-start gap-2 text-sm text-on-surface-variant">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden />
              {d}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs font-semibold tracking-wide text-primary uppercase">Best for: {service.ideal}</p>
      </div>
      <div className="mt-auto flex flex-col gap-4 border-t border-primary/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
        <Link
          href="#collaboration-model"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-bold tracking-widest text-primary uppercase transition hover:gap-3"
        >
          View process
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        {service.relatedProjects.length > 0 ? (
          <div className="flex min-w-0 flex-col items-start gap-1 sm:items-end sm:text-right">
            {service.relatedProjects.slice(0, 2).map((p) => (
              <Link
                key={p.slug}
                href={`/portfolio/projects/${p.slug}`}
                className="text-xs font-medium text-on-surface-variant underline decoration-transparent underline-offset-2 transition hover:text-primary hover:decoration-primary"
              >
                {p.title} · <span className="text-primary/80">{p.metric}</span>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </BentoCardShell>
  )
}

function ServiceBentoCompact({
  service,
  variant,
  delay,
}: {
  service: (typeof services)[number]
  variant: "secondary" | "accent"
  delay?: number
}) {
  const Icon = service.icon
  const isSecondary = variant === "secondary"
  return (
    <BentoCardShell
      delay={delay}
      className={cn(
        "h-full min-h-[260px] justify-between rounded-xl p-8 md:min-h-0 md:p-8",
        isSecondary
          ? "bg-secondary-container text-secondary-foreground"
          : "border-l-4 border-tertiary bg-surface-container-highest text-on-surface",
      )}
    >
      <div>
        <Icon className={cn("mb-4 size-9", isSecondary ? "text-secondary-foreground" : "text-on-surface")} strokeWidth={1.5} />
        <h4 className="font-display mb-3 text-xl font-bold tracking-tight text-balance">{service.title}</h4>
        <p
          className={cn(
            "text-sm leading-relaxed text-pretty",
            isSecondary ? "text-secondary-foreground/95" : "text-on-surface-variant",
          )}
        >
          {service.description}
        </p>
      </div>
      {service.relatedProjects[0] ? (
        <Link
          href={`/portfolio/projects/${service.relatedProjects[0].slug}`}
          className={cn(
            "mt-6 inline-flex items-center gap-1 text-xs font-bold tracking-wide uppercase",
            isSecondary ? "text-secondary-foreground/90 hover:text-secondary-foreground" : "text-primary hover:underline",
          )}
        >
          Example case study
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      ) : (
        <Link
          href="#collaboration-model"
          className={cn(
            "mt-6 inline-flex items-center gap-1 text-xs font-bold tracking-wide uppercase",
            isSecondary ? "text-secondary-foreground/90" : "text-primary",
          )}
        >
          How we engage
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      )}
    </BentoCardShell>
  )
}

function ServiceBentoHeroTall({ service }: { service: (typeof services)[number] }) {
  const Icon = service.icon
  return (
    <BentoCardShell
      delay={0.06}
      className="group relative min-h-[22rem] overflow-hidden rounded-xl shadow-editorial-float md:col-span-2 md:row-span-2 md:col-start-3 md:row-start-1 md:min-h-0"
    >
      <Image
        src={ENGINEERING_HERO_IMAGE}
        alt="Engineering team collaborating with architecture diagrams in a modern office."
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(min-width: 768px) 45vw, 100vw"
        priority
      />
      <div className="absolute inset-0 z-10 flex flex-col justify-end bg-primary/90 p-8 text-primary-foreground md:p-10">
        <Icon className="mb-6 size-12 text-primary-foreground md:size-14" strokeWidth={1.25} aria-hidden />
        <h3 className="font-display mb-4 text-3xl font-extrabold tracking-tighter text-balance md:text-4xl">
          {service.title}
        </h3>
        <p className="max-w-md text-lg leading-relaxed text-primary-foreground/85">{service.description}</p>
        <p className="mt-4 text-sm font-medium text-primary-foreground/70">Best for: {service.ideal}</p>
        <Link
          href="/contact"
          className="mt-8 inline-flex w-fit items-center gap-2 border border-primary-foreground/30 px-4 py-2 text-sm font-bold tracking-wide uppercase transition hover:bg-primary-foreground/10"
        >
          Let&apos;s talk
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </BentoCardShell>
  )
}

function BentoSection() {
  const wideTop = services[0]
  const heroTall = services[1]
  const compactA = services[2]
  const compactB = services[3]

  return (
    <section className="-mx-6 mb-24 bg-surface-container-low py-20 md:-mx-8 md:mb-32 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2 md:items-stretch">
          <ServiceBentoWide service={wideTop} />
          <ServiceBentoHeroTall service={heroTall} />
          <div className="flex min-h-0 w-full md:col-span-1 md:col-start-1 md:row-start-2">
            <ServiceBentoCompact service={compactA} variant="secondary" delay={0.04} />
          </div>
          <div className="flex min-h-0 w-full md:col-span-1 md:col-start-2 md:row-start-2">
            <ServiceBentoCompact service={compactB} variant="accent" delay={0.07} />
          </div>
        </div>
      </div>
    </section>
  )
}

function CollaborationSection() {
  const reduceMotion = useContext(ReduceMotionContext)
  const t = { duration: reduceMotion ? 0 : 0.5 }
  const slide = reduceMotion ? { opacity: 1, x: 0 } : undefined

  return (
    <section id="collaboration-model" className="mb-24 scroll-mt-28 md:mb-32">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
        <motion.div
          initial={slide ?? { opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={t}
        >
          <h2 className="font-display mb-12 text-4xl font-extrabold tracking-tighter text-balance text-on-surface md:text-5xl">
            The collaboration model
          </h2>
          <div className="space-y-12">
            {collaborationSteps.map((step) => (
              <div key={step.n} className="flex gap-6 items-start">
                <span className="font-display text-lg font-bold text-tertiary">{step.n}</span>
                <div className="min-w-0">
                  <h4 className="font-display mb-2 text-xl font-bold tracking-tight text-on-surface">{step.title}</h4>
                  <p className="leading-relaxed text-pretty text-on-surface-variant">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={slide ?? { opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ ...t, delay: reduceMotion ? 0 : 0.06 }}
          className="relative flex flex-col justify-center overflow-hidden rounded-xl bg-surface-container p-10 md:p-12"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/5 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-secondary/5 blur-3xl" aria-hidden />
          <div className="relative z-10 border-l-4 border-tertiary pl-8">
            <Quote className="mb-6 size-10 text-tertiary" strokeWidth={1.5} aria-hidden />
            <p className="font-display mb-8 text-2xl font-bold leading-snug tracking-tight text-pretty text-on-surface md:text-3xl md:leading-tight">
              &ldquo;Architecture is not about making things complex; it&apos;s about making complex systems simple to
              maintain and evolve.&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-variant ring-2 ring-surface">
                <Image
                  src={QUOTE_AVATAR_IMAGE}
                  alt="Charan Deol"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-display font-bold text-on-surface">Charan Deol</p>
                <p className="text-sm font-medium text-on-surface-variant">Principal consultant</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function EngagementSection() {
  const reduceMotion = useContext(ReduceMotionContext)
  const intro = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
  const tIntro = { duration: reduceMotion ? 0 : 0.45 }

  return (
    <section className="mb-24 md:mb-32">
      <motion.div
        initial={intro}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={tIntro}
        className="mb-10 max-w-2xl"
      >
        <h2 className="font-display text-3xl font-extrabold tracking-tighter text-balance text-on-surface md:text-4xl">
          Engagement models
        </h2>
        <p className="mt-3 text-pretty text-on-surface-variant">
          Different engagements need different shapes — clear scope, timeline, and budget upfront.
        </p>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {engagementModels.map((m, i) => (
          <motion.div
            key={m.model}
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: reduceMotion ? 0 : 0.04 + i * 0.04,
              duration: reduceMotion ? 0 : 0.35,
            }}
            className="flex flex-col justify-between rounded-xl border border-primary/5 bg-surface-container-low p-6 shadow-editorial-float"
          >
            <div>
              <h3 className="font-display text-base font-bold tracking-tight text-on-surface">{m.model}</h3>
              <p className="text-xs font-medium text-on-surface-variant">{m.timeline}</p>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{m.description}</p>
            </div>
            <Link
              href={`/contact?from=services&model=${m.id}`}
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-primary transition hover:gap-3"
            >
              {m.cta}
              <ArrowRight className="size-3" aria-hidden />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function CtaSection() {
  const reduceMotion = useContext(ReduceMotionContext)
  return (
    <motion.section
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: reduceMotion ? 0 : 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-inverse-surface px-8 py-16 text-center text-inverse-on-surface md:px-16 md:py-24"
    >
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-1/2 w-[120%] -translate-x-1/2 bg-gradient-to-t from-primary/25 to-transparent opacity-60" aria-hidden />
      <div className="relative z-10 mx-auto max-w-3xl">
        <h2 className="font-display mb-8 text-4xl font-extrabold tracking-tighter text-balance text-pretty md:text-6xl lg:text-7xl">
          Ready to architect your next phase?
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-pretty text-inverse-on-surface/75 md:text-xl">
          Let&apos;s collaborate on high-performance systems and experiences your business can rely on.
        </p>
        <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
          <Link
            href="/contact?from=services"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-10 py-5 text-lg font-bold text-primary-foreground transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Let&apos;s collaborate
          </Link>
          <Link
            href="/portfolio/projects?from=services"
            className="inline-flex items-center justify-center rounded-lg border border-inverse-on-surface/25 bg-transparent px-10 py-5 text-lg font-bold text-inverse-on-surface transition hover:bg-inverse-on-surface/5"
          >
            View case studies
          </Link>
        </div>
      </div>
    </motion.section>
  )
}

export default function ServicesContent() {
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <ReduceMotionContext.Provider value={prefersReducedMotion}>
      <div className="pb-8 md:pb-12">
        <HeroSection />
        <BentoSection />
        <CollaborationSection />
        <EngagementSection />
        <CtaSection />
      </div>
    </ReduceMotionContext.Provider>
  )
}
