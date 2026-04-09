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
      <style jsx>{`
        .hiw-pipeline {
          --hiw-cycle: 5.2s;
          /* DESIGN.md: primary #00694c → primary_container #0d8c6c */
          --hiw-beam-core: var(--color-primary-container);
          --hiw-beam-edge: var(--color-primary);
          --hiw-beam-glow: color-mix(in srgb, var(--color-primary-container) 55%, transparent);
          --hiw-beam-aura: color-mix(in srgb, var(--color-primary) 40%, transparent);
          --hiw-beam-soft: color-mix(in srgb, var(--color-primary) 35%, transparent);
          position: relative;
          isolation: isolate;
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.25rem 0.75rem;
        }

        .hiw-track {
          display: none;
        }

        .hiw-phase {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          position: relative;
          z-index: 1;
        }

        .hiw-phase-title {
          font-family: var(--font-manrope, ui-sans-serif), system-ui, sans-serif;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-on-surface);
          text-align: left;
          width: 100%;
        }

        .hiw-phase-desc {
          font-family: var(--font-inter, ui-sans-serif), system-ui, sans-serif;
          font-size: 0.75rem;
          font-weight: 400;
          line-height: 1.6;
          color: var(--color-on-surface-variant);
          text-align: left;
          width: 100%;
        }

        .hiw-phase-title--primary {
          color: var(--color-primary);
        }

        @media (min-width: 768px) {
          .hiw-pipeline {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            gap: 0;
            margin-bottom: 0;
          }

          /* Track joins circle centers: col centers at 1/12 … 11/12 of row */
          .hiw-track {
            display: block;
            position: absolute;
            top: calc(3rem - 1.5px);
            left: calc(100% / 12);
            width: calc(100% * 10 / 12);
            right: auto;
            height: 3px;
            border-radius: 999px;
            background: color-mix(in srgb, var(--color-on-surface) 9%, transparent);
            z-index: 0;
            overflow: visible;
            pointer-events: none;
          }

          .hiw-track::before {
            content: "";
            position: absolute;
            inset: -12px -4px;
            background: radial-gradient(
              closest-side at 50% 50%,
              color-mix(in srgb, var(--color-on-surface) 10%, transparent),
              transparent 75%
            );
            opacity: 0.45;
            pointer-events: none;
          }

          /* Brighter beam: primary → primary_container (signature gradient) */
          .hiw-track::after {
            content: "";
            position: absolute;
            top: 50%;
            /* Track starts at Discover center; +3rem = right edge of md:size-24 circle */
            left: 3rem;
            height: 5px;
            width: min(420px, 38vw);
            transform: translateY(-50%) scaleX(0.06);
            transform-origin: left center;
            border-radius: 999px;
            /* Shooting star: soft tail (left) → bright head (right, direction of travel) */
            background: linear-gradient(
              90deg,
              transparent 0%,
              color-mix(in srgb, var(--color-primary) 6%, transparent) 6%,
              color-mix(in srgb, var(--color-primary) 22%, transparent) 22%,
              var(--hiw-beam-edge) 48%,
              var(--hiw-beam-core) 72%,
              color-mix(in srgb, var(--color-primary-container) 88%, var(--hiw-beam-core)) 88%,
              color-mix(in srgb, var(--color-primary-container) 55%, transparent) 96%,
              transparent 100%
            );
            opacity: 1;
            filter: blur(0.45px);
            box-shadow:
              0 0 20px var(--hiw-beam-glow),
              0 0 40px var(--hiw-beam-aura),
              0 0 64px color-mix(in srgb, var(--color-primary-container) 28%, transparent),
              0 0 8px var(--hiw-beam-core);
            animation: hiw-beam var(--hiw-cycle) linear infinite;
          }

          /* Same easing + cycle as beam so keyframe % = same moment in time */
          .hiw-pipeline[data-pipeline-visible="true"] .hiw-node--value {
            animation: hiw-value-lit var(--hiw-cycle) linear infinite;
          }

          .hiw-phase {
            flex: 1;
            align-items: center;
          }

          .hiw-phase-title,
          .hiw-phase-desc {
            text-align: center;
          }

          .hiw-pipeline:not([data-pipeline-visible="true"]) .hiw-track::after,
          .hiw-pipeline:not([data-pipeline-visible="true"]) .hiw-node--value {
            animation-play-state: paused;
          }
        }

        /*
         * 0–15%: Emerge from Discover’s RIGHT edge (left: 3rem = radius past track start); scaleX = tail grows.
         * 15–42%: Cruise (3rem → 44%). 46–100%: Value ending untouched.
         */
        @keyframes hiw-beam {
          0% {
            left: 3rem;
            opacity: 0;
            transform: translateY(-50%) scaleX(0.06);
            filter: blur(0.35px);
            box-shadow:
              0 0 6px var(--hiw-beam-soft),
              0 0 10px color-mix(in srgb, var(--color-primary) 18%, transparent);
          }
          3% {
            left: 3rem;
            opacity: 0.22;
            transform: translateY(-50%) scaleX(0.14);
            filter: blur(0.38px);
            box-shadow:
              0 0 10px var(--hiw-beam-glow),
              0 0 18px var(--hiw-beam-aura);
          }
          7% {
            left: 3rem;
            opacity: 0.55;
            transform: translateY(-50%) scaleX(0.38);
            filter: blur(0.4px);
            box-shadow:
              0 0 14px var(--hiw-beam-glow),
              0 0 28px var(--hiw-beam-aura),
              0 0 36px color-mix(in srgb, var(--color-primary-container) 18%, transparent);
          }
          11% {
            left: 3rem;
            opacity: 0.88;
            transform: translateY(-50%) scaleX(0.72);
            filter: blur(0.42px);
            box-shadow:
              0 0 18px var(--hiw-beam-glow),
              0 0 34px var(--hiw-beam-aura),
              0 0 50px color-mix(in srgb, var(--color-primary-container) 24%, transparent),
              0 0 6px var(--hiw-beam-core);
          }
          15% {
            left: 3rem;
            opacity: 1;
            transform: translateY(-50%) scaleX(1);
            filter: blur(0.45px);
            box-shadow:
              0 0 20px var(--hiw-beam-glow),
              0 0 40px var(--hiw-beam-aura),
              0 0 64px color-mix(in srgb, var(--color-primary-container) 28%, transparent),
              0 0 8px var(--hiw-beam-core);
          }
          42% {
            left: 44%;
            opacity: 1;
            transform: translateY(-50%) scaleX(1);
            filter: blur(0.45px);
            box-shadow:
              0 0 20px var(--hiw-beam-glow),
              0 0 40px var(--hiw-beam-aura),
              0 0 64px color-mix(in srgb, var(--color-primary-container) 28%, transparent),
              0 0 8px var(--hiw-beam-core);
          }
          /* Leading edge touches Value circle (sync with hiw-value-lit 46%) */
          46% {
            left: 51%;
            opacity: 1;
            transform: translateY(-50%) scaleX(0.98);
            filter: blur(0.5px);
            box-shadow:
              0 0 20px var(--hiw-beam-glow),
              0 0 38px var(--hiw-beam-aura),
              0 0 56px color-mix(in srgb, var(--color-primary-container) 26%, transparent),
              0 0 8px var(--hiw-beam-core);
          }
          /* Compress + dim — energy into the circle */
          50% {
            left: 56%;
            opacity: 0.85;
            transform: translateY(-50%) scaleX(0.88);
            filter: blur(0.95px);
            box-shadow:
              0 0 14px var(--hiw-beam-glow),
              0 0 26px var(--hiw-beam-aura);
          }
          58% {
            left: 64%;
            opacity: 0.42;
            transform: translateY(-50%) scaleX(0.72);
            filter: blur(1.35px);
            box-shadow: 0 0 10px color-mix(in srgb, var(--color-primary-container) 32%, transparent);
          }
          /* Tail entering — almost gone */
          68% {
            left: 74%;
            opacity: 0.12;
            transform: translateY(-50%) scaleX(0.52);
            filter: blur(1.85px);
            box-shadow: none;
          }
          /* Fully swallowed; slide off dead */
          76% {
            left: 88%;
            opacity: 0;
            transform: translateY(-50%) scaleX(0.38);
            filter: blur(0.45px);
            box-shadow: none;
          }
          100% {
            left: 102%;
            opacity: 0;
            transform: translateY(-50%) scaleX(1);
            filter: blur(0.45px);
            box-shadow: none;
          }
        }

        @keyframes hiw-value-lit {
          0%,
          45% {
            background: var(--color-surface);
            box-shadow:
              0 0 0 1px color-mix(in srgb, var(--color-on-surface) 12%, transparent),
              0 1px 2px color-mix(in srgb, var(--color-on-surface) 6%, transparent);
            color: var(--color-primary);
          }
          /* Same instant as beam wall hit (48% on beam = contact) */
          46% {
            background: color-mix(in srgb, var(--color-primary-fixed) 14%, var(--color-surface));
            box-shadow:
              0 0 0 1px color-mix(in srgb, var(--color-primary) 28%, transparent),
              0 0 14px color-mix(in srgb, var(--color-primary-container) 26%, transparent);
            color: var(--color-primary);
          }
          /* Peak absorption while beam collapses */
          52%,
          64% {
            background: color-mix(in srgb, var(--color-primary-fixed) 64%, var(--color-surface));
            box-shadow:
              0 0 0 2px color-mix(in srgb, var(--color-primary) 55%, transparent),
              0 0 40px color-mix(in srgb, var(--color-primary-container) 60%, transparent),
              0 0 70px color-mix(in srgb, var(--color-primary) 42%, transparent),
              0 0 100px color-mix(in srgb, var(--color-primary-container) 32%, transparent);
            color: var(--color-primary);
          }
          /* Tail absorbed — cool down */
          72% {
            background: color-mix(in srgb, var(--color-primary-fixed) 18%, var(--color-surface));
            box-shadow:
              0 0 0 1px color-mix(in srgb, var(--color-primary) 26%, transparent),
              0 0 14px color-mix(in srgb, var(--color-primary-container) 22%, transparent);
            color: var(--color-primary);
          }
          /* Normal before next beam spawns at Discover */
          80%,
          100% {
            background: var(--color-surface);
            box-shadow:
              0 0 0 1px color-mix(in srgb, var(--color-on-surface) 12%, transparent),
              0 1px 2px color-mix(in srgb, var(--color-on-surface) 6%, transparent);
            color: var(--color-primary);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hiw-track::after {
            animation: none !important;
            opacity: 0.2 !important;
            left: 0 !important;
            width: 100% !important;
            transform: translateY(-50%) scaleX(1) !important;
          }
          .hiw-node--value {
            animation: none !important;
          }
        }
      `}</style>

      <div
        ref={pipelineRef}
        className="hiw-pipeline"
        data-pipeline-visible={isVisible ? "true" : "false"}
        role="list"
        aria-label="Delivery phases"
      >
        <div className="hiw-track" aria-hidden />
        {phases.map(({ title, description, Icon, emphasized }) => (
          <div key={title} className="hiw-phase" role="listitem">
            <div
              className={cn(
                "mb-4 flex size-20 shrink-0 items-center justify-center rounded-full bg-surface shadow-sm ring-1 ring-outline-variant/20 transition-colors md:size-24",
                "hover:bg-surface-container-low",
                emphasized && "hiw-node--value ring-2 ring-primary/35 text-primary"
              )}
              aria-hidden
            >
              <Icon className="size-7 stroke-[1.5] md:size-8" strokeLinecap="round" strokeLinejoin="round" />
            </div>
            <span
              className={cn(
                "hiw-phase-title text-base tracking-tight md:text-lg",
                emphasized && "hiw-phase-title--primary"
              )}
            >
              {title}
            </span>
            <span className="hiw-phase-desc mt-2 md:mt-2 md:px-1 md:text-[0.8125rem] md:leading-relaxed">
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
