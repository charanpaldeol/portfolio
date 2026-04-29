import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

import { resolveProjects, resolveProofMetrics } from "@/lib/content-lookups"
import type { ServiceTier } from "@/lib/services-data"
import { cn } from "@/lib/utils"

type ServiceCardProps = {
  service: ServiceTier
  index: number
  reduceMotion: boolean
}

export function ServiceCard({ service, index, reduceMotion }: ServiceCardProps) {
  const paragraphs = service.description.split("\n\n").filter(Boolean)
  const relatedProjects = resolveProjects(service.relatedProjectSlugs)
  const relatedProofMetrics = resolveProofMetrics(service.relatedProofMetricTags)
  const domainProjects = resolveProjects(service.domainCues?.map((cue) => cue.projectSlug))
  const domainProofMetrics = resolveProofMetrics(service.domainCues?.flatMap((cue) => (cue.proofMetricTag ? [cue.proofMetricTag] : [])))
  const domainProjectMap = new Map(domainProjects.map((project) => [project.key, project]))
  const domainProofMap = new Map(domainProofMetrics.map((metric) => [metric.key, metric]))

  const visual = (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-3xl shadow-editorial-float",
        "aspect-[4/5] max-h-[22rem] sm:max-h-[26rem]",
        "md:aspect-[5/6] md:max-h-none md:min-h-[20rem]",
        "lg:sticky lg:top-[calc(var(--site-header-offset)+1rem)] lg:max-h-[min(36rem,calc(100vh-var(--site-header-offset)-2rem))] lg:min-h-0",
      )}
    >
      <Image
        src={service.imageSrc}
        alt={service.imageAlt}
        fill
        className="object-cover object-center"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={index === 0}
      />
    </div>
  )

  const content = (
    <div className="flex min-w-0 flex-col gap-10 md:gap-12">
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">{service.name}</h2>
        <p className="text-base leading-relaxed text-on-surface-variant md:text-lg">{service.tagline}</p>
        <p>
          <span className="inline-flex max-w-full rounded-full bg-primary-fixed px-3.5 py-1.5 text-xs font-semibold leading-snug text-on-primary-fixed">
            Best for: {service.whoItsFor}
          </span>
        </p>
      </div>
      <div className="space-y-4">
        {paragraphs.map((p, pi) => (
          <p key={pi} className="text-base leading-relaxed text-on-surface-variant">
            {p}
          </p>
        ))}
        {service.notFor ? (
          <p className="rounded-xl bg-surface-container px-4 py-3 text-sm leading-relaxed text-on-surface-variant">
            <span className="font-semibold text-on-surface">Not a fit if:</span> {service.notFor}
          </p>
        ) : null}
      </div>
      <div>
        <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-on-surface-variant uppercase">
          Deliverables
        </p>
        <ul className="space-y-3">
          {service.deliverables.map((d) => (
            <li key={d} className="relative pl-5 text-sm leading-snug text-on-surface-variant">
              <span
                className="absolute left-0 top-[0.55em] size-1.5 rounded-full bg-primary shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
                aria-hidden
              />
              {d}
            </li>
          ))}
        </ul>
      </div>
      <p>
        <span className="inline-flex rounded-full bg-surface-container-high px-3.5 py-1.5 text-xs font-semibold text-on-surface">
          {service.engagement}
        </span>
      </p>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {service.outcomes.map((o) => (
          <div
            key={o.description}
            className="flex h-full flex-col rounded-2xl bg-surface-container-lowest p-5 shadow-editorial-float md:p-6"
          >
            <p className="font-display text-2xl font-extrabold tracking-tight text-primary md:text-3xl">{o.metric}</p>
            <p className="mt-2 text-sm leading-snug text-on-surface-variant">{o.description}</p>
          </div>
        ))}
      </div>
      {service.bestFitScenarios?.length ? (
        <div className="rounded-2xl bg-surface-container-low p-5 md:p-6">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-on-surface-variant uppercase">
            Best-fit scenarios
          </p>
          <ul className="mt-3 space-y-2">
            {service.bestFitScenarios.map((scenario) => (
              <li key={scenario} className="relative pl-5 text-sm leading-relaxed text-on-surface-variant">
                <span
                  className="absolute left-0 top-[0.6em] size-1.5 rounded-full bg-secondary shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-secondary)_18%,transparent)]"
                  aria-hidden
                />
                {scenario}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {(relatedProjects.length > 0 || relatedProofMetrics.length > 0) && (
        <div className="rounded-2xl bg-surface-container-low p-5 md:p-6">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-on-surface-variant uppercase">
            Method → artifact → business outcome
          </p>
          {service.domainCues?.length ? (
            <div className="mt-3">
              <p className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">Domain routes</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {service.domainCues.map((cue) => {
                  const project = domainProjectMap.get(cue.projectSlug)
                  const proof = cue.proofMetricTag ? domainProofMap.get(cue.proofMetricTag) : undefined
                  const href = project?.href ?? proof?.href ?? "#"
                  return (
                    <Link
                      key={`${service.id}-${cue.label}-${cue.projectSlug}`}
                      href={href}
                      className="rounded-full bg-surface-container-lowest px-3 py-1.5 text-xs font-semibold text-on-surface transition hover:bg-surface"
                      title={project?.label ? `${cue.label}: ${project.label}` : cue.label}
                    >
                      {cue.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ) : null}
          {relatedProjects.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">Case studies</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {relatedProjects.map((project) => (
                  <Link
                    key={project.key}
                    href={project.href ?? "#"}
                    className="rounded-full bg-surface-container-lowest px-3 py-1.5 text-xs font-medium text-on-surface transition hover:bg-surface"
                  >
                    {project.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {relatedProofMetrics.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">Proof signals</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {relatedProofMetrics.map((metric) => (
                  <Link
                    key={metric.key}
                    href={metric.href ?? "#"}
                    className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/15"
                  >
                    {metric.label} · {metric.sublabel}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <motion.section
      id={service.id}
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: reduceMotion ? 0 : 0.48, delay: reduceMotion ? 0 : index * 0.05 }}
      className={cn(
        "scroll-mt-8 py-16 md:py-24",
        index % 2 === 1 ? "bg-surface-container-low" : "bg-surface",
      )}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-x-14 md:gap-y-10 lg:gap-x-16">
          {index % 2 === 0 ? (
            <>
              {content}
              {visual}
            </>
          ) : (
            <>
              {visual}
              {content}
            </>
          )}
        </div>
      </div>
    </motion.section>
  )
}
