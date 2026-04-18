"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { resolveProjects, resolveServices } from "@/lib/content-lookups"
import { expertiseAreas, workPhases } from "@/lib/how-i-work-data"
import { cn } from "@/lib/utils"

import styles from "./HowIWork.module.css"

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default function HowIWork({ afterPipeline }: { afterPipeline?: ReactNode }) {
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
        {workPhases.map(({ title, description, Icon, emphasized, step }) => (
          <div
            key={title}
            id={`phase-${step}`}
            className={styles.hiwPhase}
            role="listitem"
          >
            <div
              className={cn(
                "relative mb-4 flex size-20 shrink-0 items-center justify-center rounded-full bg-surface shadow-sm ring-1 ring-outline-variant/20 transition-colors md:size-24",
                "hover:bg-surface-container-low",
                emphasized && cn(styles.hiwNodeValue, "ring-2 ring-primary/35 text-primary")
              )}
              aria-hidden
            >
              <Icon className="size-7 stroke-[1.5] md:size-8" strokeLinecap="round" strokeLinejoin="round" />
              <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-surface-container-low ring-1 ring-outline-variant/30 font-mono text-[9px] font-bold text-muted-foreground md:size-6 md:text-[10px]">
                {step}
              </span>
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

      {afterPipeline}

      <h2
        id="hiw-expertise-heading"
        className="font-display mt-14 text-2xl font-bold tracking-tight text-on-surface md:mt-16 md:text-3xl"
      >
        Expertise
      </h2>
      <p className="mt-2 max-w-2xl font-sans text-sm text-on-surface-variant md:text-base">
        Teams I lead across every phase.
      </p>

      <ul
        id="expertise"
        className="m-0 mt-8 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
      >
        {expertiseAreas.map((expertise) => {
          const { title, body, Icon, id, relatedServiceIds, relatedProjectSlugs } = expertise
          const anchorId = `expertise-${id ?? slugify(title)}`
          const relatedServices = resolveServices(relatedServiceIds)
          const relatedProjects = resolveProjects(relatedProjectSlugs)
          const hasRelated = relatedServices.length > 0 || relatedProjects.length > 0

          return (
            <li key={title} id={anchorId} className="scroll-mt-24">
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
                {hasRelated && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 font-sans text-[10px] font-semibold tracking-wide text-on-surface-variant/70 uppercase">
                      Related
                    </span>
                    {relatedServices.map((service) => (
                      <Badge key={`service-${service.key}`} variant="outline" asChild>
                        <Link href={service.href ?? "#"}>{service.label}</Link>
                      </Badge>
                    ))}
                    {relatedProjects.map((project) => (
                      <Badge key={`project-${project.key}`} variant="secondary" asChild>
                        <Link href={project.href ?? "#"}>{project.label}</Link>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </li>
          )
        })}
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
