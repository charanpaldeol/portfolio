"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useId, useState } from "react"

import { EditorialPageHero } from "@/components/portfolio/EditorialPageHero"
import { ExperienceEmailGate } from "@/components/portfolio/ExperienceEmailGate"
import { cn } from "@/lib/utils"

type TimelineEntry = {
  id: string
  role: string
  company: string
  period: string
  lede: string
  description: string
  current?: boolean
}

const timeline: TimelineEntry[] = [
  {
    id: "lead-bsa",
    role: "Lead Business Systems Analyst",
    company: "Global enterprise software company",
    period: "Oct 2023 – Present",
    lede:
      "Strategic initiatives across CRM, ERP, payments, and AI-enabled platforms—with emphasis on cloud migration, analytics, and delivery from scope through benefit realization.",
    description:
      "Owns strategic initiatives that weave together CRM, ERP, payments, and AI-enabled platforms—emphasizing cloud migration, predictive analytics, and scalable architectures. Leads end-to-end delivery from scope through benefit realization; aligns large, distributed stakeholder groups; runs structured elicitation and data profiling through ETL into warehouses; and builds process maps, SOPs, and playbooks for phased rollouts. Drives vendor selection for packaged solutions, ITSM-grade delivery, and knowledge bases that shorten onboarding and support cycles.",
    current: true,
  },
  {
    id: "senior-tba",
    role: "Senior Technical Business Analyst",
    company: "Major Canadian financial institution",
    period: "Mar 2022 – Oct 2023",
    lede:
      "Compliance-heavy capital-markets and KYC/AML work—BRDs, traceability, and controls from source data through regulator-ready reporting.",
    description:
      "Focused on compliance-heavy capital-markets and KYC/AML work: BRDs/TDDs, traceability, and controls aligned with privacy and security policy. Enhanced large-cash and suspicious-activity reporting flows to meet regulator-ready data validation, enrichment, and lineage; tightened reconciliation to the general ledger; and partnered with change management for adoption. Supported UAT and continuous improvement across Agile and waterfall delivery.",
    current: false,
  },
  {
    id: "tech-account",
    role: "Tech Account Lead",
    company: "Capital-markets technology firm",
    period: "Feb 2020 – Mar 2022",
    lede:
      "Remote lead for Salesforce CRM programs on the sell side—workflows, migrations, dashboards, and coordination with platform teams for reliable releases.",
    description:
      "Remote lead for Salesforce CRM programs serving sell-side capital markets—workflow design, compliance posture, and clearer data for risk and revenue. Delivered dashboards and analytics, centralized client data through integration-heavy migrations, and coordinated with R&D and platform teams so new capabilities stayed reliable in production.",
    current: false,
  },
  {
    id: "ba-logistics",
    role: "Business Analyst",
    company: "North American logistics technology company",
    period: "Jan 2017 – Jan 2020",
    lede:
      "End-to-end requirements and rollout for a real-time freight-visibility platform—workshops, UML, and specs aligned with operations and engineering.",
    description:
      "Owned requirements and rollout for a real-time freight-visibility platform: process reengineering, UML-backed workflow modeling, functional and technical specs, and workshops that kept business, operations, and engineering aligned on scope and timelines.",
    current: false,
  },
]

const education: Array<{ label: string; value?: string }> = [
  { label: "Graduate", value: "M.Eng., Computer Science — University of Windsor" },
  {
    label: "Undergraduate",
    value: "B.Eng., Electrical & Computer Engineering — Guru Nanak Dev University",
  },
  { label: "Certifications" },
]

const certificationChips = [
  { abbr: "PMP", detail: "PMI · 2024" },
  { abbr: "SAFe SM", detail: "Scaled Agile · 2023" },
  { abbr: "CBAP", detail: "IIBA · 2024" },
]

function PageHero() {
  return (
    <EditorialPageHero
      eyebrow="Experience"
      headerClassName="mb-12 md:mb-16"
      title={
        <>
          Career <span className="text-editorial-gradient">timeline.</span>
        </>
      }
      description="Eight years translating complex business and regulatory problems into clear requirements, trustworthy data, and enterprise systems that actually launch—across software platforms, banking compliance, capital-markets CRM, and supply-chain visibility."
    />
  )
}

function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  const reduceMotion = useReducedMotion() ?? false
  const contentId = useId()
  const [expanded, setExpanded] = useState(false)
  const needsToggle = entry.description.length > entry.lede.length + 40

  return (
    <motion.article
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: reduceMotion ? 0 : 0.04 + index * 0.05, duration: reduceMotion ? 0 : 0.45 }}
      className="group relative overflow-hidden rounded-2xl bg-surface-container-lowest/90 px-5 py-6 shadow-[0_24px_60px_-28px_rgba(27,28,26,0.08)] md:px-8 md:py-7"
      aria-labelledby={`${contentId}-title`}
    >
      <div
        className="pointer-events-none absolute inset-y-3 left-0 w-1 rounded-full bg-tertiary md:inset-y-4"
        aria-hidden
      />
      <div className="pl-4 md:pl-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2 gap-y-1.5">
              <h2
                id={`${contentId}-title`}
                className="font-display text-xl font-bold tracking-tight text-on-surface md:text-2xl"
              >
                {entry.role}
              </h2>
              {entry.current ? (
                <span className="rounded-full bg-primary-fixed px-2.5 py-1 text-[10px] font-semibold tracking-wide text-on-primary-fixed uppercase">
                  Current
                </span>
              ) : null}
            </div>
            <p className="text-sm font-medium text-on-surface md:text-base">{entry.company}</p>
          </div>
          <p className="shrink-0 rounded-full bg-surface-container-low px-3 py-1.5 text-center text-[11px] font-semibold tracking-wide text-on-surface-variant uppercase sm:text-left">
            {entry.period}
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <p
            id={`${contentId}-body`}
            className="max-w-prose text-base leading-relaxed text-on-surface-variant md:text-[1.05rem] md:leading-[1.65]"
          >
            {expanded || !needsToggle ? entry.description : entry.lede}
          </p>
          {needsToggle ? (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-1.5 py-2 text-sm font-semibold text-primary transition-colors hover:text-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest"
              aria-expanded={expanded}
              aria-controls={`${contentId}-body`}
            >
              <span>{expanded ? "Show less" : "Read full role"}</span>
              <ChevronDown
                className={cn("size-4 shrink-0 transition-transform duration-200", expanded && "rotate-180")}
                aria-hidden
              />
            </button>
          ) : null}
        </div>
      </div>
    </motion.article>
  )
}

export default function ExperiencePage() {
  const reduceMotion = useReducedMotion() ?? false
  const timelineHeadingId = useId()

  return (
    <ExperienceEmailGate>
      <div className="space-y-14 md:space-y-20">
        <PageHero />

        <motion.figure
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
          className="rounded-2xl bg-surface-container-low px-6 py-6 md:px-10 md:py-8"
        >
          <blockquote className="flex gap-5">
            <div className="w-1 shrink-0 self-stretch rounded-full bg-tertiary" aria-hidden />
            <p className="font-display text-lg font-bold leading-snug tracking-tight text-on-surface md:text-xl">
              I stay closest to the work where business intent, data quality, and delivery discipline have to meet—or
              nothing ships with confidence.
            </p>
          </blockquote>
        </motion.figure>

        <section className="space-y-8 md:space-y-10" aria-labelledby={timelineHeadingId}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Chapters</p>
              <h2
                id={timelineHeadingId}
                className="font-display text-2xl font-bold tracking-tight text-on-surface md:text-3xl"
              >
                Roles & impact
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-on-surface-variant">
              Expand any role for the full narrative. Employers are described at category level only.
            </p>
          </div>

          <div className="flex flex-col gap-6 md:gap-7">
            {timeline.map((entry, i) => (
              <TimelineCard key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        </section>

        <section className="space-y-6 md:space-y-8" aria-labelledby="experience-education-heading">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Education</p>
              <h2
                id="experience-education-heading"
                className="font-display text-2xl font-bold tracking-tight text-on-surface md:text-3xl"
              >
                Degrees & credentials
              </h2>
            </div>
            <span className="text-xs font-semibold tracking-[0.18em] text-on-surface-variant uppercase">
              Formal training
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl bg-surface-container-low">
            <ul className="flex flex-col divide-y divide-outline-variant/10">
              {education.map((row, i) => (
                <li
                  key={row.label}
                  className={cn(
                    "flex flex-col gap-2 px-5 py-5 sm:flex-row sm:items-start sm:gap-10 sm:py-6 md:px-8",
                    i % 2 === 0 ? "bg-surface-container-lowest/70" : "bg-surface-container-low/80",
                  )}
                >
                  <span className="w-32 shrink-0 pt-0.5 text-xs font-semibold tracking-[0.12em] text-on-surface-variant uppercase">
                    {row.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    {row.label === "Certifications" && row.value === undefined ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">
                          Project delivery, scaled agile practice, and professional business analysis.
                        </p>
                        <ul className="flex flex-wrap gap-2" aria-label="Certifications">
                          {certificationChips.map((c) => (
                            <li
                              key={c.abbr}
                              className="rounded-full bg-primary-fixed/95 px-3 py-1.5 text-xs font-semibold text-on-primary-fixed"
                            >
                              <span className="font-bold">{c.abbr}</span>
                              <span className="mx-1.5 text-on-primary-fixed/80" aria-hidden>
                                ·
                              </span>
                              <span className="font-medium text-on-primary-fixed/95">{c.detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <span className="text-sm leading-relaxed text-on-surface md:text-base">{row.value}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </ExperienceEmailGate>
  )
}
