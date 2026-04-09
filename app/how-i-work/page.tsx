"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import HowIWork from "@/components/home/HowIWork"
import { PageShell } from "@/components/layout/PageShell"

function PageHero() {
  return (
    <header className="mb-14 max-w-4xl md:mb-20">
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55 }}
        className="mb-6 flex items-center gap-4"
      >
        <div className="h-px w-14 shrink-0 bg-primary" aria-hidden />
        <span className="font-sans text-xs font-semibold tracking-[0.22em] text-primary uppercase">
          Operating model
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.12 }}
        className="font-display text-5xl font-extrabold tracking-tighter text-on-surface leading-[1.05] md:text-7xl"
      >
        How I <span className="text-editorial-gradient">work</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.25 }}
        className="mt-8 max-w-2xl font-sans text-lg font-normal leading-relaxed text-on-surface-variant md:text-2xl md:leading-relaxed"
      >
        End-to-end ownership, measured outcomes, and clean handoffs only when the
        value is real.
      </motion.p>
    </header>
  )
}

function CTA() {
  return (
    <section className="relative mt-14 flex flex-col items-start justify-between gap-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-container p-10 shadow-editorial md:mt-20 md:flex-row md:items-center md:p-12">
      <div className="relative z-10">
        <h2 className="font-display text-2xl font-bold tracking-tight text-primary-foreground md:text-3xl">
          Talk through your delivery arc
        </h2>
        <p className="mt-3 max-w-xl font-sans text-sm font-normal leading-relaxed text-primary-foreground/88 md:text-base md:leading-relaxed">
          If you have a messy cross-functional program, I can help frame the decision,
          build the plan, and drive adoption through to outcomes.
        </p>
      </div>
      <div className="relative z-10">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-fixed px-7 py-4 font-sans text-sm font-semibold text-on-primary-fixed shadow-editorial-float transition hover:brightness-[1.03]"
        >
          Contact me <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div
        className="pointer-events-none absolute top-0 right-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-foreground/15 via-transparent to-transparent"
        aria-hidden
      />
    </section>
  )
}

export default function HowIWorkPage() {
  return (
    <PageShell>
      <PageHero />
      <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-12 lg:p-14">
        <HowIWork />
      </section>
      <CTA />
    </PageShell>
  )
}

