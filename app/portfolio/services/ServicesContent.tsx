"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { createContext, type ReactNode, useContext } from "react"

import { editorialGradientLastWord, EditorialPageHero } from "@/components/portfolio/EditorialPageHero"
import { serviceFAQs, services } from "@/lib/services-data"
import { cn } from "@/lib/utils"

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
    <div className="mb-16 md:mb-24">
      <EditorialPageHero
        eyebrow="Services"
        title={editorialGradientLastWord("From strategy to shipped product")}
        description="Product design consulting for teams building AI-powered products, scaling design systems, and shipping faster."
      />
    </div>
  )
}

function DifferentiationSection() {
  const reduceMotion = useContext(ReduceMotionContext)
  const slide = reduceMotion ? { opacity: 1, x: 0 } : undefined
  return (
    <section className="mb-24 md:mb-32">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={slide ?? { opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
          className="space-y-4"
        >
          <h2 className="font-display text-3xl font-extrabold tracking-tighter text-on-surface md:text-4xl">
            Why design and engineering literacy matters
          </h2>
          <p className="text-pretty text-on-surface-variant">
            For a deeper look at how I think about discovery, delivery, and AI-native programs, read{" "}
            <Link href="/what-i-bring" className="font-semibold text-primary underline-offset-4 hover:underline">
              what I bring
            </Link>
            .
          </p>
        </motion.div>
        <motion.div
          initial={slide ?? { opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.06 }}
          className="flex gap-6 rounded-2xl bg-surface-container-low p-8 md:p-10"
        >
          <div className="w-1 shrink-0 self-stretch rounded-full bg-tertiary" aria-hidden />
          <div>
            <p className="font-display text-3xl font-bold leading-snug text-pretty text-on-surface md:text-4xl md:leading-tight">
              I bring both design craft and engineering literacy — which means I speak your developers&apos; language and
              ship work that doesn&apos;t fall apart in implementation.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FaqSection() {
  return (
    <section className="mb-24 md:mb-32">
      <SectionReveal className="mb-10 max-w-2xl">
        <h2 className="font-display text-3xl font-extrabold tracking-tighter text-on-surface md:text-4xl">FAQ</h2>
        <p className="mt-3 text-pretty text-on-surface-variant">Practical questions teams ask before a first call.</p>
      </SectionReveal>
      <div className="space-y-3">
        {serviceFAQs.map((item, i) => (
          <SectionReveal key={item.question} delay={i * 0.04}>
            <details className="group rounded-2xl bg-surface-container-low px-5 py-4 shadow-editorial-float open:bg-surface-container">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold text-on-surface marker:content-none [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <ChevronDown
                  className="size-5 shrink-0 text-on-surface-variant transition group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{item.answer}</p>
            </details>
          </SectionReveal>
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
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-1/2 w-[120%] -translate-x-1/2 bg-gradient-to-t from-primary/25 to-transparent opacity-60"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-3xl">
        <h2 className="font-display mb-6 text-4xl font-extrabold tracking-tighter text-pretty md:text-5xl">
          Ready to scope the first milestone?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-pretty text-inverse-on-surface/75 md:text-xl">
          Engagement shapes and process live on Work With Me. If you already know what you need, jump straight to
          contact.
        </p>
        <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/work-with-me"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-10 py-5 text-lg font-bold text-primary-foreground transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Work with me
          </Link>
          <Link
            href="/contact?from=services"
            className="inline-flex items-center justify-center rounded-lg bg-inverse-on-surface/10 px-10 py-5 text-lg font-bold text-inverse-on-surface transition hover:bg-inverse-on-surface/15"
          >
            Contact
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
        {services.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} reduceMotion={prefersReducedMotion} />
        ))}
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <DifferentiationSection />
          <FaqSection />
          <CtaSection />
        </div>
      </div>
    </ReduceMotionContext.Provider>
  )
}
