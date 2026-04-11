"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Building2,
  Cloud,
  Globe2,
  Quote,
  Rocket,
  Shield,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

const ENGINEERING_HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA2R23OvZ4aEAyfgZSSeYP4g2IsHm17XILz3jm2iRLGCURkMzv9sW2CG9nHDywcUv-fD7cH4t8cGg7Tbz_AoOm3vfqv7QQBJGKyA-1iOd-1PG7_eykFv5yVWRC03we7zn71qXmGPbK8U6VjtkYAHxTdvDXkBXdvXsDgXxhbdRHte0HEifsutTumIJ4PB1Kry8M9h5_27BLDavV1yMEXuugVVBd29zGFfJ0qJ_rjj0AHCrLhK5L2vvthJMS1pibNd0apiUHj4n34PoE"

const QUOTE_AVATAR_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA1ZEHtxm2YRN0HUeiTcE_4Rp4kZV71SCtVXpgzGtj4SjfcpP7EJX_IJMqWoQJ1nBEYVgXqG3iDfDDGT-7q-tKgZOlKF3YOt-YEGmMGlGsx8tlV-RXB6w1iGKuIzbW1mLK9hN4RC81ncn7Hc4zvBCOE6Deyw_lSCmyuTkRAi_vedNKulf0S_Oyw7Cmk1b70humP1eJqMBB1U0pv9LjDQvx18R4v-_XzqA5iAYaDYZ_PWOG9t5G5tDDz2Yo0iUatKNvqpY29KjMaXnU"

const services = [
  {
    icon: Globe2,
    title: "Simple & Fast",
    tagline: "Get online in weeks",
    taglineClass: "bg-primary-fixed text-on-primary-fixed",
    description:
      "Landing pages, brochure websites, portfolio sites. Modern, mobile-friendly, SEO-optimized. Fast turnaround, predictable cost.",
    deliverables: [
      "Responsive landing pages & marketing websites",
      "SEO optimization & analytics integration",
      "Fast load times & mobile-first design",
    ],
    relatedProjects: [
      { title: "Landing Page & Marketing Website", slug: "landing-page-website", metric: "4-week launch" },
    ],
    ideal: "Startups, solopreneurs, small businesses",
  },
  {
    icon: Building2,
    title: "Custom Internal Systems",
    tagline: "Automate your operations",
    taglineClass: "bg-secondary-fixed text-on-secondary-fixed",
    description:
      "HR, payroll, inventory, and workflow tools built for your business. Replace spreadsheets with one unified platform.",
    deliverables: [
      "HR, attendance, leave, reviews",
      "Payroll automation & GL integration",
      "Inventory & custom workflows",
    ],
    relatedProjects: [
      { title: "HR Management System", slug: "hr-management-system", metric: "40% time saved" },
      { title: "Payroll System", slug: "payroll-management-system", metric: "2 days → 20 min" },
    ],
    ideal: "SMBs ready to automate manual processes",
  },
  {
    icon: Rocket,
    title: "SaaS & Product Development",
    tagline: "Build your platform",
    taglineClass: "bg-secondary-fixed/90 text-on-secondary-fixed",
    description:
      "From idea to market-ready product: architecture, MVP, real-time features, payments, AI, and scalable infrastructure.",
    deliverables: [
      "Product architecture & roadmap",
      "MVP in 3–6 months",
      "Real-time, payments, AI/ML",
    ],
    relatedProjects: [
      { title: "Payment Settlement Platform", slug: "payment-settlement-platform", metric: "5,000+ tx/sec" },
      { title: "E-commerce Search", slug: "ecommerce-product-search-recommendations", metric: "+18% AOV" },
    ],
    ideal: "Startups and growth-stage product teams",
  },
  {
    icon: Cloud,
    title: "Enterprise Scale & Integration",
    tagline: "Complex systems at scale",
    taglineClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    description:
      "Microservices, modernization, compliance automation, and real-time analytics — for reliability, scale, and regulation.",
    deliverables: [
      "Microservices & 99.99% SLA patterns",
      "Compliance & legacy integration",
      "Cloud & DevOps",
    ],
    relatedProjects: [
      { title: "Banking Microservices", slug: "api-first-banking-microservices", metric: "99.99% SLA" },
      { title: "Event Streaming", slug: "event-streaming-pipeline", metric: "100M+ events/day" },
    ],
    ideal: "Enterprises and mission-critical systems",
  },
  {
    icon: Shield,
    title: "Security & Fraud Prevention",
    tagline: "Protect your platform",
    taglineClass: "bg-red-500/15 text-red-600",
    description:
      "Fraud detection, API security, breach forensics, and compliance monitoring across payments, ecommerce, and SaaS.",
    deliverables: [
      "Real-time fraud & API protection",
      "Forensics & incident response",
      "KYC/AML and posture automation",
    ],
    relatedProjects: [
      { title: "Fraud Detection Engine", slug: "fraud-detection-engine", metric: "99.2% accuracy" },
      { title: "API Attack Detection", slug: "real-time-api-attack-detection", metric: "98% detection" },
    ],
    ideal: "Teams handling transactions and sensitive data",
  },
  {
    icon: Users,
    title: "Ongoing Support & Leadership",
    tagline: "Expert guidance for any size",
    taglineClass: "bg-blue-500/15 text-blue-600",
    description:
      "Fractional CTO, architecture reviews, hiring support, and mentorship — retainer, hourly, or project-based.",
    deliverables: [
      "Technical direction & reviews",
      "Hiring & mentorship",
      "Incident response & roadmap",
    ],
    relatedProjects: [] as { title: string; slug: string; metric: string }[],
    ideal: "Teams needing senior technical leadership",
  },
] as const

const engagementModels = [
  {
    model: "Fixed-Scope Project",
    timeline: "2-12 weeks",
    price: "$8k - $50k",
    description: "Landing pages, simple internal tools, well-defined scope.",
  },
  {
    model: "Custom Development (Iterative)",
    timeline: "2-6 months",
    price: "$30k - $150k",
    description: "HR, payroll, internal tools — sprint-based delivery.",
  },
  {
    model: "SaaS MVP Development",
    timeline: "3-6 months",
    price: "$80k - $250k",
    description: "MVP from scratch: architecture, build, first deployment.",
  },
  {
    model: "Enterprise Project",
    timeline: "3-12 months",
    price: "$150k - $500k+",
    description: "Microservices, compliance automation, large integrations.",
  },
  {
    model: "Fractional CTO / VP Eng",
    timeline: "3-12 months (ongoing)",
    price: "$8k - $20k/month",
    description: "Leadership, architecture, hiring, code review.",
  },
  {
    model: "Retainer / Ongoing Support",
    timeline: "Monthly (flexible)",
    price: "$2k - $8k/month",
    description: "Guidance, reviews, incidents, and strategy.",
  },
] as const

const collaborationSteps = [
  {
    n: "01",
    title: "Architectural discovery",
    body: "Deep-dive on your stack, constraints, and goals — mapping a resilient path that matches the business.",
  },
  {
    n: "02",
    title: "Incremental delivery",
    body: "Vertical slices of value with architectural integrity: ship early, learn fast, keep quality high.",
  },
  {
    n: "03",
    title: "Sustainable handoff",
    body: "Documentation and team enablement so you own the system — with optional ongoing support when you need it.",
  },
] as const

function HeroSection() {
  return (
    <section className="mb-24 md:mb-32">
      <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-6 inline-block rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold tracking-widest text-on-primary-fixed uppercase"
          >
            Strategic partnership
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display mb-8 text-5xl font-extrabold tracking-tighter text-on-surface leading-[0.92] md:text-7xl lg:text-8xl"
          >
            Services &amp; expertise
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="max-w-2xl text-xl leading-relaxed text-on-surface-variant md:text-2xl"
          >
            Architecting resilient systems and AI-native experiences — from first landing page to enterprise-scale
            platforms.
          </motion.p>
        </div>
        <div className="lg:col-span-4 lg:text-right">
          <div className="mb-6 hidden h-1 w-full bg-tertiary lg:block" aria-hidden />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay }}
      className={cn("flex flex-col", className)}
    >
      {children}
    </motion.div>
  )
}

function ServiceBentoWide({ service }: { service: (typeof services)[number] }) {
  const Icon = service.icon
  return (
    <BentoCardShell className="group justify-between bg-surface-container-lowest p-8 transition-colors duration-500 hover:bg-surface md:col-span-2 md:row-start-1 md:p-10">
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
        <p className="leading-relaxed text-on-surface-variant">{service.description}</p>
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
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-primary/10 pt-6">
        <Link
          href="#collaboration-model"
          className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-primary uppercase transition hover:gap-3"
        >
          View process
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        {service.relatedProjects.length > 0 ? (
          <div className="flex flex-col items-start gap-1 text-right sm:items-end">
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
        "justify-between p-8 md:p-8",
        isSecondary
          ? "bg-secondary-container text-secondary-foreground"
          : "border-l-4 border-tertiary bg-surface-container-highest text-on-surface",
      )}
    >
      <div>
        <Icon className={cn("mb-4 size-9", isSecondary ? "text-secondary-foreground" : "text-on-surface")} strokeWidth={1.5} />
        <h4 className="font-display mb-3 text-xl font-bold tracking-tight">{service.title}</h4>
        <p className={cn("text-sm leading-snug", isSecondary ? "opacity-90" : "text-on-surface-variant")}>
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
      className="group relative min-h-[22rem] overflow-hidden md:col-span-2 md:row-span-2 md:col-start-3 md:row-start-1 md:min-h-0"
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
        <h3 className="font-display mb-4 text-3xl font-extrabold tracking-tighter md:text-4xl">{service.title}</h3>
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

function ServiceBentoWideBottom({ service }: { service: (typeof services)[number] }) {
  const Icon = service.icon
  return (
    <BentoCardShell
      delay={0.08}
      className="justify-between border border-primary/10 bg-surface-container-lowest p-8 md:col-span-2 md:p-10"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <Icon className="mb-4 size-9 text-primary" strokeWidth={1.5} aria-hidden />
          <span
            className={cn(
              "mb-3 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase",
              service.taglineClass,
            )}
          >
            {service.tagline}
          </span>
          <h3 className="font-display text-2xl font-bold tracking-tight text-on-surface md:text-3xl">{service.title}</h3>
          <p className="mt-3 text-on-surface-variant">{service.description}</p>
        </div>
        <ul className="shrink-0 space-y-2 md:max-w-xs">
          {service.deliverables.map((d) => (
            <li key={d} className="flex items-start gap-2 text-sm text-on-surface-variant">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary" aria-hidden />
              {d}
            </li>
          ))}
        </ul>
      </div>
      {service.relatedProjects.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-3 border-t border-primary/10 pt-6">
          {service.relatedProjects.map((p) => (
            <Link
              key={p.slug}
              href={`/portfolio/projects/${p.slug}`}
              className="rounded-full bg-surface-container-high px-4 py-2 text-xs font-semibold text-on-surface transition hover:bg-primary/10 hover:text-primary"
            >
              {p.title}
            </Link>
          ))}
        </div>
      ) : null}
    </BentoCardShell>
  )
}

function BentoSection() {
  const wideTop = services[0]
  const heroTall = services[5]
  const compactA = services[1]
  const compactB = services[2]
  const wideBottomLeft = services[3]
  const wideBottomRight = services[4]

  return (
    <section className="-mx-6 mb-24 bg-surface-container-low py-20 md:-mx-8 md:mb-32 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2">
          <ServiceBentoWide service={wideTop} />
          <ServiceBentoHeroTall service={heroTall} />
          <div className="md:col-span-1 md:col-start-1 md:row-start-2">
            <ServiceBentoCompact service={compactA} variant="secondary" delay={0.04} />
          </div>
          <div className="md:col-span-1 md:col-start-2 md:row-start-2">
            <ServiceBentoCompact service={compactB} variant="accent" delay={0.07} />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <ServiceBentoWideBottom service={wideBottomLeft} />
          <ServiceBentoWideBottom service={wideBottomRight} />
        </div>
      </div>
    </section>
  )
}

function CollaborationSection() {
  return (
    <section id="collaboration-model" className="mb-24 scroll-mt-28 md:mb-32">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display mb-12 text-4xl font-extrabold tracking-tighter text-on-surface md:text-5xl">
            The collaboration model
          </h2>
          <div className="space-y-12">
            {collaborationSteps.map((step) => (
              <div key={step.n} className="flex gap-6 items-start">
                <span className="font-display text-lg font-bold text-tertiary">{step.n}</span>
                <div>
                  <h4 className="font-display mb-2 text-xl font-bold text-on-surface">{step.title}</h4>
                  <p className="leading-relaxed text-on-surface-variant">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="relative flex flex-col justify-center overflow-hidden rounded-xl bg-surface-container p-10 md:p-12"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/5 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-secondary/5 blur-3xl" aria-hidden />
          <div className="relative z-10 border-l-4 border-tertiary pl-8">
            <Quote className="mb-6 size-10 text-tertiary" strokeWidth={1.5} aria-hidden />
            <p className="font-display mb-8 text-2xl font-bold leading-tight tracking-tight text-on-surface md:text-3xl">
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
                <p className="font-bold text-on-surface">Charan Deol</p>
                <p className="text-sm text-on-surface-variant">Principal consultant</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function EngagementSection() {
  return (
    <section className="mb-24 md:mb-32">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mb-10 max-w-2xl"
      >
        <h2 className="font-display text-3xl font-extrabold tracking-tighter text-on-surface md:text-4xl">
          Engagement models
        </h2>
        <p className="mt-3 text-on-surface-variant">
          Different engagements need different shapes — clear scope, timeline, and budget upfront.
        </p>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {engagementModels.map((m, i) => (
          <motion.div
            key={m.model}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.04 + i * 0.04, duration: 0.35 }}
            className="rounded-xl border border-primary/5 bg-surface-container-low p-6 shadow-editorial-float"
          >
            <h3 className="font-display text-base font-bold text-on-surface">{m.model}</h3>
            <p className="mt-1 text-sm font-semibold text-primary">{m.price}</p>
            <p className="text-xs font-medium text-on-surface-variant">{m.timeline}</p>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{m.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-inverse-surface px-8 py-16 text-center text-inverse-on-surface md:px-16 md:py-24"
    >
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-1/2 w-[120%] -translate-x-1/2 bg-gradient-to-t from-primary/25 to-transparent opacity-60" aria-hidden />
      <div className="relative z-10 mx-auto max-w-3xl">
        <h2 className="font-display mb-8 text-4xl font-extrabold tracking-tighter md:text-6xl lg:text-7xl">
          Ready to architect your next phase?
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-inverse-on-surface/75 md:text-xl">
          Let&apos;s collaborate on high-performance systems and experiences your business can rely on.
        </p>
        <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-10 py-5 text-lg font-bold text-primary-foreground transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Let&apos;s collaborate
          </Link>
          <Link
            href="/portfolio/projects"
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
  return (
    <div className="pb-8 md:pb-12">
      <HeroSection />
      <BentoSection />
      <CollaborationSection />
      <EngagementSection />
      <CtaSection />
    </div>
  )
}
