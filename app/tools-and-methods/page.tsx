"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"

import ToolsAndMethods from "@/components/home/ToolsAndMethods"
import { PageShell } from "@/components/layout/PageShell"
import { EditorialPageHero } from "@/components/portfolio/EditorialPageHero"

function PageHero() {
  return (
    <EditorialPageHero
      eyebrow="Toolkit"
      title={
        <>
          Tools &amp; <span className="text-editorial-gradient">methods</span>
        </>
      }
      description="Comfortable in a technical design session in the morning and a boardroom presentation in the afternoon."
    />
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

