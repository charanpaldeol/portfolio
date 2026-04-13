import { motion } from "framer-motion"

import type { ServiceTier } from "@/lib/services-data"
import { cn } from "@/lib/utils"

type ServiceCardProps = {
  service: ServiceTier
  index: number
  reduceMotion: boolean
}

export function ServiceCard({ service, index, reduceMotion }: ServiceCardProps) {
  const paragraphs = service.description.split("\n\n").filter(Boolean)
  const accent = (
    <div
      className={cn(
        "min-h-[12rem] rounded-3xl md:min-h-[18rem]",
        index % 2 === 0 ? "bg-primary-fixed/10" : "bg-secondary-fixed/10",
      )}
      aria-hidden
    />
  )

  const content = (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface md:text-3xl">{service.name}</h2>
        <p className="mt-2 text-base text-on-surface-variant">{service.tagline}</p>
        <p className="mt-4">
          <span className="inline-flex rounded-full bg-primary-fixed px-3 py-1 text-xs font-semibold text-on-primary-fixed">
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
          <p className="text-sm leading-relaxed text-on-surface-variant">
            <span className="font-semibold text-on-surface">Not a fit if:</span> {service.notFor}
          </p>
        ) : null}
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold tracking-wide text-on-surface uppercase">Deliverables</p>
        <ul className="space-y-2">
          {service.deliverables.map((d) => (
            <li key={d} className="relative pl-5 text-sm text-on-surface-variant">
              <span className="absolute left-0 top-2 size-1.5 rounded-full bg-primary" aria-hidden />
              {d}
            </li>
          ))}
        </ul>
      </div>
      <p>
        <span className="inline-flex rounded-full bg-surface-container-high px-3 py-1 text-xs font-semibold text-on-surface-variant">
          {service.engagement}
        </span>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {service.outcomes.map((o) => (
          <div key={o.description} className="rounded-2xl bg-surface-container-lowest p-4 shadow-editorial-float">
            <p className="font-display text-2xl font-bold text-primary md:text-3xl">{o.metric}</p>
            <p className="mt-1 text-sm leading-snug text-on-surface-variant">{o.description}</p>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <motion.section
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: reduceMotion ? 0 : 0.48, delay: reduceMotion ? 0 : index * 0.05 }}
      className={cn("py-16 md:py-24", index % 2 === 1 ? "bg-surface-container-low" : "bg-surface")}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          {index % 2 === 0 ? (
            <>
              {content}
              {accent}
            </>
          ) : (
            <>
              {accent}
              {content}
            </>
          )}
        </div>
      </div>
    </motion.section>
  )
}
