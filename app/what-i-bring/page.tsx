"use client"

import { motion } from "framer-motion"
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  Code2,
  DraftingCompass,
  Grid3X3,
  Maximize2,
  PenTool,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

import { RelatedLinks } from "@/components/content/RelatedLinks"
import { PageShell } from "@/components/layout/PageShell"
import { EditorialPageHero } from "@/components/portfolio/EditorialPageHero"
import { resolveBlogArticles, resolveProjects, resolveServices } from "@/lib/content-lookups"
import { whatIBringCards } from "@/lib/what-i-bring-cards"

function Hero() {
  return (
    <EditorialPageHero
      eyebrow="What I bring"
      title={
        <>
          Mastering the{" "}
          <span className="text-editorial-gradient">Digital Blueprint.</span>
        </>
      }
      description="From discovery to value realized: clear problem framing, scalable solution design, AI-native delivery, engineering rigor, and adoption-driven impact."
    />
  )
}

function ServicesGrid() {
  const cards = whatIBringCards.slice(0, 5)

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Card 1: Problem Framing */}
      <motion.div whileHover={{ y: -5 }} className="md:col-span-8 group bg-surface-container-low rounded-xl p-10 flex flex-col justify-between min-h-[440px] relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-12">
            <DraftingCompass className="w-10 h-10 text-primary" />
            <span className="text-[11px] font-semibold text-on-surface-variant/50 tracking-widest uppercase">
              01 / DISCOVERY
            </span>
          </div>
          <h3 className="text-4xl font-bold mb-6 text-on-surface max-w-sm">
            {cards[0]?.title ?? "Problem Framing"}
          </h3>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
            {cards[0]?.body ??
              "Deconstructing complexity into executable roadmaps before a single line of code is written."}
          </p>
        </div>
        <Link
          href={`/blog/${cards[0]?.slug ?? "problem-framing"}`}
          className="mt-12 relative z-10 flex items-center gap-4 group/btn"
        >
          <span className="font-semibold text-primary group-hover/btn:mr-2 transition-all duration-300">
            Explore Strategy
          </span>
          <ArrowRight className="w-4 h-4 text-primary" />
        </Link>
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
          <Grid3X3 className="w-64 h-64" strokeWidth={0.5} />
        </div>
      </motion.div>

      {/* Card 2: Solution Design */}
      <motion.div whileHover={{ y: -5 }} className="md:col-span-4 group bg-surface-container-lowest rounded-xl p-8 flex flex-col justify-between border border-outline-variant/10">
        <div>
          <div className="flex justify-between items-start mb-8">
            <div className="bg-secondary-container/10 p-3 rounded-lg">
              <PenTool className="w-8 h-8 text-secondary" />
            </div>
            <span className="text-[10px] font-semibold text-on-surface-variant/40 tracking-widest uppercase">
              02 / ARCHITECTURE
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-on-surface">
            {cards[1]?.title ?? "Solution Design"}
          </h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {cards[1]?.body ??
              "Architecting scalable systems that prioritize clarity and future-readiness."}
          </p>
        </div>
        <Link
          href={`/blog/${cards[1]?.slug ?? "solution-design"}`}
          className="mt-10 flex items-center gap-2 text-primary"
        >
          <span className="text-xs font-semibold uppercase tracking-wider">
            Read more
          </span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </motion.div>

      {/* Card 3: AI-Native Delivery */}
      <motion.div whileHover={{ y: -5 }} className="md:col-span-4 group bg-secondary text-on-secondary rounded-xl p-8 flex flex-col justify-between min-h-[400px]">
        <div>
          <div className="flex justify-between items-start mb-8">
            <Brain className="w-10 h-10 fill-current" />
            <span className="text-xs font-semibold opacity-60 tracking-widest uppercase">
              03 / DELIVERY
            </span>
          </div>
          <h3 className="text-3xl font-bold mb-4">
            {cards[2]?.title ?? "AI-Native Delivery"}
          </h3>
          <p className="opacity-80 text-sm leading-relaxed mb-6">
            {cards[2]?.body ??
              "Integrating generative intelligence into your workflow for controlled acceleration."}
          </p>
          <ul className="space-y-3 opacity-90 text-xs font-medium">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></span>{" "}
              LLM Orchestration
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></span>{" "}
              Agent Guardrails
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></span>{" "}
              Automated Testing
            </li>
          </ul>
        </div>
        <Link
          href={`/blog/${cards[2]?.slug ?? "ai-native-delivery"}`}
          className="w-full bg-white/10 hover:bg-white/20 transition-colors py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-center"
        >
          View Delivery Model
        </Link>
      </motion.div>

      {/* Card 4: Engineering Depth */}
      <motion.div whileHover={{ y: -5 }} className="md:col-span-4 group bg-surface-container-high rounded-xl p-8 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-8">
            <Code2 className="w-8 h-8 text-tertiary" />
            <span className="text-[10px] font-semibold text-on-surface-variant/40 tracking-widest uppercase">
              04 / CORE
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-on-surface">
            {cards[3]?.title ?? "Engineering Depth"}
          </h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {cards[3]?.body ??
              "Uncompromising technical rigor across the stack for resilience and performance."}
          </p>
        </div>
        <Link
          href={`/blog/${cards[3]?.slug ?? "engineering-depth"}`}
          className="mt-8 flex items-center gap-2 text-primary"
        >
          <span className="text-xs font-semibold uppercase tracking-wider">
            Explore Stack
          </span>
          <Maximize2 className="w-3 h-3" />
        </Link>
      </motion.div>

      {/* Card 5: Value Realization */}
      <motion.div whileHover={{ y: -5 }} className="md:col-span-4 group bg-surface-container-low rounded-xl p-8 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <TrendingUp className="w-24 h-24 text-primary/5" />
        </div>
        <div>
          <div className="flex justify-between items-start mb-8 relative z-10">
            <CheckCircle2 className="w-8 h-8 text-primary" />
            <span className="text-[10px] font-semibold text-on-surface-variant/40 tracking-widest uppercase">
              05 / IMPACT
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-on-surface relative z-10">
            {cards[4]?.title ?? "Value Realization"}
          </h3>
          <p className="text-on-surface-variant text-sm leading-relaxed relative z-10">
            {cards[4]?.body ??
              "Measuring success through tangible business outcomes and sustainable advantage."}
          </p>
        </div>
        <Link
          href={`/blog/${cards[4]?.slug ?? "value-realization"}`}
          className="mt-10 flex items-center gap-2 text-primary relative z-10"
        >
          <span className="text-xs font-semibold uppercase tracking-wider">
            See Results
          </span>
          <Activity className="w-3 h-3" />
        </Link>
      </motion.div>
    </div>
  )
}

function Manifesto() {
  return (
    <section className="mt-32 border-l-4 border-tertiary pl-12 py-4">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-extrabold mb-6 italic text-on-surface-variant leading-tight"
      >
        &quot;Architecture is not just about building systems; it is about
        defining how teams inhabit their digital future.&quot;
      </motion.h2>
      <p className="text-xs font-semibold tracking-widest text-tertiary uppercase">
        The editorial manifesto
      </p>
    </section>
  )
}

function CTA() {
  return (
    <section className="mt-32 bg-primary text-on-primary rounded-2xl p-12 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start your project
        </h2>
        <p className="opacity-80 max-w-md text-base md:text-lg">
          Ready to build something authoritative? Let&apos;s discuss your next
          architectural leap.
        </p>
      </div>
      <div className="relative z-10 w-full md:w-auto">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/contact"
            className="block w-full md:w-auto bg-primary-fixed text-on-primary-fixed px-10 py-5 rounded-xl font-extrabold text-lg shadow-xl hover:translate-y-[-2px] transition-all text-center"
          >
            Request a consultation
          </Link>
        </motion.div>
      </div>
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
    </section>
  )
}

function RelatedSection() {
  const relatedServiceIds = Array.from(new Set(whatIBringCards.flatMap((card) => card.relatedServiceIds ?? [])))
  const relatedProjectSlugs = Array.from(new Set(whatIBringCards.flatMap((card) => card.relatedProjectSlugs ?? [])))
  const relatedBlogSlugs = Array.from(new Set(whatIBringCards.flatMap((card) => card.relatedBlogSlugs ?? [])))

  return (
    <section className="mt-20">
      <RelatedLinks
        heading="Navigate by connection"
        description="Jump from capability themes to concrete projects and deeper essays."
        groups={[
          { title: "Services", items: resolveServices(relatedServiceIds) },
          { title: "Projects", items: resolveProjects(relatedProjectSlugs), showSublabel: true },
          { title: "Related essays", items: resolveBlogArticles(relatedBlogSlugs), showSublabel: true },
        ]}
      />
    </section>
  )
}

export default function WhatIBringPage() {
  return (
    <PageShell>
      <Hero />
      <ServicesGrid />
      <RelatedSection />
      <Manifesto />
      <CTA />
    </PageShell>
  )
}

