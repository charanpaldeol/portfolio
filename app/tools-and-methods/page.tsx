"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"

import ToolsAndMethods from "@/components/home/ToolsAndMethods"
import { PageShell } from "@/components/layout/PageShell"
import { EditorialPageHero } from "@/components/portfolio/EditorialPageHero"

function PageHero() {
  return (
    <EditorialPageHero
      headerClassName="mb-10 md:mb-12"
      eyebrow="Toolkit"
      title={
        <>
          Tools &amp; <span className="text-editorial-gradient">methods</span>
        </>
      }
      description="From LLM integration and solution architecture to stakeholder workshops and board-ready reporting — the full toolkit, mapped to every phase of delivery."
    />
  )
}

function CTA() {
  return (
    <section className="relative mt-14 flex flex-col items-stretch gap-8 overflow-hidden rounded-2xl bg-primary p-10 text-on-primary md:mt-20 md:flex-row md:items-center md:justify-between md:p-12">
      <div className="relative z-10 min-w-0 flex-1">
        <h2 className="text-2xl font-bold md:text-3xl">Need a clean engagement plan?</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed opacity-85 md:text-base">
          The right artifacts at the right phase — from problem framing and AI-native architecture
          through to adoption and value reporting.
        </p>
      </div>
      <div className="relative z-10 shrink-0 md:self-center">
        <Link
          href="/contact"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-fixed px-7 py-4 font-semibold text-on-primary-fixed shadow-editorial-float transition hover:brightness-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-fixed/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary md:w-auto"
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
      <ToolsAndMethods />
      <CTA />
    </PageShell>
  )
}

