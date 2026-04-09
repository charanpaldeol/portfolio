"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import ToolsAndMethods from "@/components/home/ToolsAndMethods"
import { PageShell } from "@/components/layout/PageShell"

function PageHero() {
  return (
    <header className="mb-14 md:mb-20 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55 }}
        className="flex items-center gap-4 mb-6"
      >
        <div className="h-px w-12 bg-primary" />
        <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
          Toolkit
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.12 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface leading-[1.05]"
      >
        Tools &amp; <span className="text-editorial-gradient">methods</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.25 }}
        className="mt-6 text-on-surface-variant text-lg md:text-2xl leading-relaxed max-w-2xl font-light"
      >
        Comfortable in a technical design session in the morning and a boardroom
        presentation in the afternoon.
      </motion.p>
    </header>
  )
}

function CTA() {
  return (
    <section className="mt-14 md:mt-20 rounded-2xl bg-primary text-on-primary p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold">Need a clean engagement plan?</h2>
        <p className="mt-2 opacity-85 max-w-xl text-sm md:text-base leading-relaxed">
          I’ll bring the right artifacts at the right time — workshop design, requirements,
          solution specs, delivery rituals, and adoption.
        </p>
      </div>
      <div className="relative z-10">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-fixed text-on-primary-fixed px-7 py-4 font-semibold shadow-editorial-float transition hover:brightness-[1.03]"
        >
          Contact me <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
    </section>
  )
}

export default function ToolsAndMethodsPage() {
  return (
    <PageShell>
      <PageHero />
      <section className="rounded-2xl bg-surface-container-low p-6 shadow-editorial md:p-10">
        <ToolsAndMethods />
      </section>
      <CTA />
    </PageShell>
  )
}

