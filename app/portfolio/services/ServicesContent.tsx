"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { createContext, type ReactNode, useContext } from "react"

import { RelatedLinks } from "@/components/content/RelatedLinks"
import { editorialGradientLastWord, EditorialPageHero } from "@/components/portfolio/EditorialPageHero"
import { Badge } from "@/components/ui/badge"
import { resolveBlogArticles, resolvePhases, resolveServices } from "@/lib/content-lookups"
import { serviceFAQs, services } from "@/lib/services-data"
import { cn } from "@/lib/utils"
import { withAttribution } from "@/lib/ux-measurement"

import { ServiceCard } from "./ServiceCard"

const ReduceMotionContext = createContext(false)

function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduceMotion = useContext(ReduceMotionContext)
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

function HeroSection() {
  return (
    <div className="mx-auto mb-12 max-w-6xl md:mb-16">
      <EditorialPageHero
        eyebrow="Services"
        title={editorialGradientLastWord("From strategy to shipped product")}
        description="Product design consulting for teams building AI-powered products, scaling design systems, and shipping faster."
        headerClassName="mb-0"
      />
    </div>
  )
}

function DifferentiationSection() {
  const reduceMotion = useContext(ReduceMotionContext)
  const slide = reduceMotion ? { opacity: 1, x: 0 } : undefined
  return (
    <section>
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
        <motion.div
          initial={slide ?? { opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
          className="space-y-5"
        >
          <h2 className="font-display text-3xl font-extrabold tracking-tighter text-on-surface md:text-4xl">
            Why design and engineering literacy matters
          </h2>
          <p className="max-w-prose text-pretty text-base leading-relaxed text-on-surface-variant md:text-lg">
            For a deeper look at how I think about discovery, delivery, and AI-native programs, read{" "}
            <Link
              href="/what-i-bring"
              className="font-semibold text-primary underline decoration-primary/30 underline-offset-[0.22em] transition hover:decoration-primary"
            >
              what I bring
            </Link>
            . If you need embedded programme governance after service strategy, continue to{" "}
            <Link
              href="/work-with-me"
              className="font-semibold text-primary underline decoration-primary/30 underline-offset-[0.22em] transition hover:decoration-primary"
            >
              Work with me
            </Link>
            .
          </p>
        </motion.div>
        <motion.div
          initial={slide ?? { opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.06 }}
          className="flex flex-col gap-5 rounded-2xl bg-surface-container-low p-8 shadow-editorial-float backdrop-blur-[2px] sm:flex-row sm:gap-6 md:p-10"
        >
          <div
            className="h-1 w-full shrink-0 rounded-full bg-gradient-to-r from-tertiary to-primary sm:h-auto sm:w-1 sm:self-stretch sm:bg-gradient-to-b"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="font-display text-2xl font-bold leading-snug text-pretty text-on-surface md:text-3xl md:leading-tight">
              I bring both design craft and engineering literacy — which means I speak your developers&apos; language
              and ship work that doesn&apos;t fall apart in implementation.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FaqSection() {
  return (
    <section>
      <SectionReveal className="mb-10 max-w-2xl">
        <h2 className="font-display text-3xl font-extrabold tracking-tighter text-on-surface md:text-4xl">FAQ</h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-on-surface-variant">
          Practical questions teams ask before a first call.
        </p>
      </SectionReveal>
      <div className="space-y-4">
        {serviceFAQs.map((item, i) => {
          const relatedServices = resolveServices(item.relatedServiceIds)
          const relatedPhases = resolvePhases(item.relatedPhaseSteps)
          return (
            <SectionReveal key={item.question} delay={i * 0.04}>
              <details className="group rounded-2xl bg-surface-container-low px-5 py-4 shadow-editorial-float transition-colors open:bg-surface-container">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-base font-bold leading-snug text-on-surface marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 pr-2">{item.question}</span>
                  <ChevronDown
                    className="mt-0.5 size-5 shrink-0 text-on-surface-variant transition-transform duration-200 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">{item.answer}</p>
                {relatedServices.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-on-surface/55">Applies to:</span>
                    {relatedServices.map((svc) => (
                      <Badge key={svc.key} variant="outline" asChild>
                        <Link href={svc.href ?? "#"}>{svc.label}</Link>
                      </Badge>
                    ))}
                  </div>
                )}
                {relatedPhases.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-on-surface/55">Relevant phases:</span>
                    {relatedPhases.map((phase) => (
                      <Badge key={phase.key} variant="secondary" asChild>
                        <Link href={phase.href ?? "#"}>{phase.label}</Link>
                      </Badge>
                    ))}
                  </div>
                )}
              </details>
            </SectionReveal>
          )
        })}
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
      className="relative overflow-hidden rounded-2xl bg-inverse-surface px-6 py-14 text-center text-inverse-on-surface shadow-editorial-lg sm:px-10 md:px-16 md:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,color-mix(in_srgb,var(--color-primary)_28%,transparent),transparent_55%)] opacity-90"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-3xl">
        <h2 className="font-display mb-5 text-3xl font-extrabold tracking-tighter text-pretty md:mb-6 md:text-4xl lg:text-5xl">
          Ready to scope the first milestone?
        </h2>
        <p className="mx-auto mb-9 max-w-2xl text-base text-pretty leading-relaxed text-inverse-on-surface/80 md:mb-10 md:text-lg">
          Exploring options? Start with engagement shapes on Work With Me. Ready to scope? Jump straight to contact.
        </p>
        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <Link
            href={withAttribution("/work-with-me", { from: "services-cta", intent: "explore" })}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-editorial-float transition hover:brightness-105 active:brightness-95 sm:px-10 sm:py-4 sm:text-lg"
          >
            Explore engagement options
          </Link>
          <Link
            href={withAttribution("/contact", { from: "services-cta", intent: "scope" })}
            className="inline-flex items-center justify-center rounded-xl bg-inverse-on-surface/10 px-8 py-4 text-base font-bold text-inverse-on-surface transition hover:bg-inverse-on-surface/18 sm:px-10 sm:py-4 sm:text-lg"
          >
            Scope the first milestone
          </Link>
        </div>
      </div>
    </motion.section>
  )
}

function RelatedSection() {
  const serviceIds = services.map((service) => service.id)
  const phaseSteps = Array.from(new Set(serviceFAQs.flatMap((faq) => faq.relatedPhaseSteps ?? [])))
  return (
    <RelatedLinks
      heading="Related pathways"
      description="Start from a service, then branch to methods and proof."
      groups={[
        { title: "Services", items: resolveServices(serviceIds) },
        { title: "Proof pathway", items: resolveBlogArticles(["value-realization"]), showSublabel: true },
        { title: "Work phases", items: resolvePhases(phaseSteps), showSublabel: true },
        {
          title: "Deep dives",
          items: resolveBlogArticles(["designing-for-decisions", "why-design-systems-fail", "prompt-as-design-artifact"]),
          showSublabel: true,
        },
      ]}
    />
  )
}

export default function ServicesContent() {
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <ReduceMotionContext.Provider value={prefersReducedMotion}>
      <div className="pb-10 md:pb-14">
        <HeroSection />
        <div className="flex flex-col">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} reduceMotion={prefersReducedMotion} />
          ))}
        </div>
        <div className="mx-auto mt-20 max-w-6xl space-y-20 md:mt-28 md:space-y-28">
          <DifferentiationSection />
          <FaqSection />
          <RelatedSection />
          <CtaSection />
        </div>
      </div>
    </ReduceMotionContext.Provider>
  )
}
