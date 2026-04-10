"use client"

import type { LucideIcon } from "lucide-react"
import {
  Box,
  Briefcase,
  Building2,
  CheckCircle2,
  Code2,
  Database,
  FileText,
  PenLine,
  Search,
  Shield,
  Users,
  Zap,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

import styles from "./HowIWork.module.css"

const phases: {
  title: string
  description: string
  Icon: LucideIcon
  emphasized?: boolean
}[] = [
  {
    title: "Discover",
    description: "Stakeholder interviews, process mapping, problem framing",
    Icon: Search,
  },
  {
    title: "Define",
    description: "BRDs, user stories, acceptance criteria, business case",
    Icon: FileText,
  },
  {
    title: "Design",
    description: "Architecture, data models, API contracts, integration specs",
    Icon: Box,
  },
  {
    title: "Deliver",
    description: "Agile execution, backlog ownership, UAT, defect triage",
    Icon: Zap,
  },
  {
    title: "Adopt",
    description: "Training, comms, rollout, post-launch support",
    Icon: Users,
  },
  {
    title: "Value",
    description: "KPIs tracked, outcomes measured, platform scales",
    Icon: CheckCircle2,
    emphasized: true,
  },
]

const expertise: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Business & product",
    body: "Executives, product owners, domain SMEs",
    Icon: Briefcase,
  },
  {
    title: "Engineering & QA",
    body: "Dev, QA, DevOps, testing, release",
    Icon: Code2,
  },
  {
    title: "Architects & tech leads",
    body: "Solution, enterprise, integration",
    Icon: Building2,
  },
  {
    title: "UX & design",
    body: "Flows, prototypes, research",
    Icon: PenLine,
  },
  {
    title: "Data & AI teams",
    body: "Data science, LLMs, agentic workflows",
    Icon: Database,
  },
  {
    title: "Compliance & vendors",
    body: "Regulatory, procurement, 3rd parties",
    Icon: Shield,
  },
]

export default function HowIWork() {
  const pipelineRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = pipelineRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="mx-auto w-full max-w-5xl" aria-labelledby="hiw-expertise-heading">
      <div
        ref={pipelineRef}
        className={styles.hiwPipeline}
        data-pipeline-visible={isVisible ? "true" : "false"}
        role="list"
        aria-label="Delivery phases"
      >
        <div className={styles.hiwTrack} aria-hidden />
        {phases.map(({ title, description, Icon, emphasized }) => (
          <div key={title} className={styles.hiwPhase} role="listitem">
            <div
              className={cn(
                "mb-4 flex size-20 shrink-0 items-center justify-center rounded-full bg-surface shadow-sm ring-1 ring-outline-variant/20 transition-colors md:size-24",
                "hover:bg-surface-container-low",
                emphasized && cn(styles.hiwNodeValue, "ring-2 ring-primary/35 text-primary")
              )}
              aria-hidden
            >
              <Icon className="size-7 stroke-[1.5] md:size-8" strokeLinecap="round" strokeLinejoin="round" />
            </div>
            <span className={cn(styles.hiwPhaseTitle, "text-base tracking-tight md:text-lg", emphasized && styles.hiwPhaseTitlePrimary)}>
              {title}
            </span>
            <span className={cn(styles.hiwPhaseDesc, "mt-2 md:mt-2 md:px-1 md:text-[0.8125rem] md:leading-relaxed")}>
              {description}
            </span>
          </div>
        ))}
      </div>

      <h2
        id="hiw-expertise-heading"
        className="font-display mt-14 text-2xl font-bold tracking-tight text-on-surface md:mt-16 md:text-3xl"
      >
        Expertise
      </h2>
      <p className="mt-2 max-w-2xl font-sans text-sm text-on-surface-variant md:text-base">
        Teams I lead across every phase.
      </p>

      <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {expertise.map(({ title, body, Icon }) => (
          <li key={title}>
            <div className="flex h-full flex-col rounded-xl bg-surface-container-lowest p-6 transition-colors duration-200 hover:bg-surface-container md:p-8">
              <Icon
                className="mb-4 size-8 text-on-surface-variant"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              />
              <h3 className="font-display text-lg font-bold text-on-surface md:text-xl">{title}</h3>
              <p className="mt-2 font-sans text-sm font-normal leading-relaxed text-on-surface-variant md:text-base">
                {body}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 rounded-2xl bg-surface-container-low p-6 shadow-editorial md:mt-12 md:p-8">
        <p className="font-sans text-[0.9375rem] font-normal leading-relaxed text-on-surface-variant">
          Most PMs stop at the roadmap. Most BAs stop at the requirements doc.
        </p>
        <blockquote className="my-5 border-l-4 border-tertiary py-1 pl-5">
          <p className="font-display text-lg font-bold leading-snug tracking-tight text-on-surface md:text-xl">
            I stay in the room until the outcome is real
          </p>
        </blockquote>
        <p className="font-sans text-[0.9375rem] font-normal leading-relaxed text-on-surface-variant">
          — Technically sound, business-justified, delivered, adopted, and measurable. That&apos;s not a
          common combination. It&apos;s the only one I know how to do.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-primary-fixed px-3 py-1.5 font-sans text-[11px] font-semibold tracking-wide text-on-primary-fixed uppercase">
            Business
          </span>
          <span className="rounded-full bg-secondary-fixed px-3 py-1.5 font-sans text-[11px] font-semibold tracking-wide text-on-secondary-fixed uppercase">
            Technical
          </span>
          <span className="rounded-full bg-secondary-fixed px-3 py-1.5 font-sans text-[11px] font-semibold tracking-wide text-on-secondary-fixed uppercase">
            Delivery
          </span>
          <span className="rounded-full bg-primary-fixed px-3 py-1.5 font-sans text-[11px] font-semibold tracking-wide text-on-primary-fixed uppercase">
            AI-Native
          </span>
        </div>
      </div>
    </section>
  )
}
