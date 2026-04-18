import { ChevronDown } from "lucide-react"
import Link from "next/link"

import { RelatedLinks } from "@/components/content/RelatedLinks"
import { PageShell } from "@/components/layout/PageShell"
import { EditorialPageHero } from "@/components/portfolio/EditorialPageHero"
import { Badge } from "@/components/ui/badge"
import { resolveBlogArticles, resolveEngagements, resolvePhases, resolveProcessSteps, resolveWorkWithMeFaqs } from "@/lib/content-lookups"
import { cn } from "@/lib/utils"
import {
  engagementTypes,
  faqs,
  processSteps,
} from "@/lib/work-with-me-data"

export function WorkWithMeContent() {
  return (
    <PageShell>
      <EditorialPageHero
        eyebrow="Available for consulting"
        title={
          <>
            Let&apos;s build something worth{" "}
            <span className="text-editorial-gradient">shipping</span>
          </>
        }
        description="I work with teams as a Lead Technical Business Analyst, programme delivery consultant, and enterprise systems implementation advisor — from requirements through go-live."
      />
      <p className="mb-12 max-w-3xl text-sm leading-relaxed text-on-surface-variant md:text-base">
        If you are primarily looking for product/design outcome packages, start with{" "}
        <Link href="/portfolio/services" className="font-semibold text-primary underline decoration-primary/30 underline-offset-[0.22em]">
          Services
        </Link>
        . Work with me is best when you need embedded delivery governance and stakeholder orchestration.
      </p>

      <section aria-labelledby="engagements-heading" className="mb-24">
        <h2
          id="engagements-heading"
          className="mb-10 font-display text-3xl font-bold tracking-tight text-on-surface md:text-4xl"
        >
          Ways we can work together
        </h2>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {engagementTypes.map((e) => {
            const coveredPhases = resolvePhases(e.relatedPhaseSteps)
            return (
              <article
                key={e.id}
                id={`engagement-${e.id}`}
                className="flex flex-col rounded-2xl bg-surface-container-lowest p-8 md:p-10"
              >
                <div className="mb-4 text-3xl" aria-hidden>
                  {e.icon}
                </div>
                <h3 className="mb-4 text-2xl font-bold text-on-surface">{e.name}</h3>
                <p className="mb-6 text-base leading-relaxed text-on-surface-variant">
                  {e.description}
                </p>
                <p className="mb-6 text-sm font-medium leading-relaxed text-on-surface">
                  {e.idealFor}
                </p>
                <span
                  className={cn(
                    "mb-6 inline-flex w-fit rounded-full bg-primary-fixed px-4 py-1.5",
                    "text-xs font-semibold uppercase tracking-wide text-on-primary-fixed"
                  )}
                >
                  {e.typicalDuration}
                </span>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  What you get
                </p>
                <ul className="mt-auto space-y-3 text-sm leading-relaxed text-on-surface-variant">
                  {e.deliverables.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span
                        className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
                        aria-hidden
                      />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                {coveredPhases.length > 0 && (
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-on-surface/55">
                      Delivery phases
                    </span>
                    {coveredPhases.map((p) => (
                      <Badge key={p.key} variant="secondary" asChild>
                        <Link href={p.href ?? "#"}>{p.label}</Link>
                      </Badge>
                    ))}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>

      <section id="process" aria-labelledby="process-heading" className="mb-24">
        <h2
          id="process-heading"
          className="mb-10 font-display text-3xl font-bold tracking-tight text-on-surface md:text-4xl"
        >
          How it works
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {processSteps.map((step) => (
            <div key={step.number} className="flex flex-col">
              <span className="mb-4 font-display text-5xl font-extrabold text-primary md:text-6xl">
                {step.number}
              </span>
              <h3 className="mb-3 text-xl font-bold text-on-surface">{step.title}</h3>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-on-surface-variant md:text-base">
                {step.description}
              </p>
              <span className="text-xs font-semibold uppercase tracking-wider text-tertiary">
                {step.duration}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="faqs" aria-labelledby="faq-heading" className="mb-24">
        <h2
          id="faq-heading"
          className="mb-10 font-display text-3xl font-bold tracking-tight text-on-surface md:text-4xl"
        >
          Frequently asked questions
        </h2>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => {
            const relatedEngagements = resolveEngagements(faq.relatedEngagementIds)
            return (
              <details
                key={faq.question}
                id={`faq-${faq.id ?? index}`}
                className="group rounded-2xl bg-surface-container-lowest px-5 md:px-6"
              >
                <summary
                  className={cn(
                    "flex cursor-pointer list-none items-center justify-between gap-4 py-5",
                    "text-left text-base font-semibold text-on-surface",
                    "[&::-webkit-details-marker]:hidden"
                  )}
                >
                  {faq.question}
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-on-surface-variant transition-transform",
                      "group-open:rotate-180"
                    )}
                    aria-hidden
                  />
                </summary>
                <div className="bg-surface-container-low/40 rounded-xl px-3 pb-5 pt-2 text-sm leading-relaxed text-on-surface-variant md:text-base">
                  {faq.answer}
                  {relatedEngagements.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-on-surface/55">
                        Relevant engagements
                      </span>
                      {relatedEngagements.map((en) => (
                        <Badge key={en.key} variant="outline" asChild>
                          <Link href={en.href ?? "#"}>{en.label}</Link>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            )
          })}
        </div>
      </section>

      <RelatedLinks
        className="mb-24"
        heading="You may also need"
        description="Common next reads after scoping an engagement."
        groups={[
          { title: "Engagement types", items: resolveEngagements(engagementTypes.map((e) => e.id)) },
          { title: "Process steps", items: resolveProcessSteps(processSteps.map((step) => step.id ?? "")), showSublabel: true },
          { title: "Frequently asked", items: resolveWorkWithMeFaqs(faqs.map((faq) => faq.id ?? "")) },
          {
            title: "Related essays",
            items: resolveBlogArticles(["problem-framing", "designing-for-decisions", "value-realization"]),
            showSublabel: true,
          },
        ]}
      />

      <section
        aria-labelledby="cta-heading"
        className="relative overflow-hidden rounded-3xl bg-inverse-surface px-8 py-16 text-inverse-on-surface md:px-16 md:py-20"
      >
        <div
          className="pointer-events-none absolute -top-24 left-1/4 size-72 rounded-full bg-primary/20 blur-[80px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 right-1/4 size-72 rounded-full bg-secondary/15 blur-[80px]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2
            id="cta-heading"
            className="font-display text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl"
          >
            Ready to start?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-inverse-on-surface/80 md:text-lg">
            Book a free 30-minute discovery call. No commitment, no pitch deck — just a conversation about your product challenge.
          </p>
          <div className="mt-10">
            <Link
              href="/contact"
              className={cn(
                "inline-flex items-center justify-center rounded-xl px-10 py-5",
                "text-base font-extrabold text-on-primary shadow-editorial-float",
                "bg-gradient-to-r from-primary to-secondary transition-all hover:brightness-105"
              )}
            >
              Book a discovery call
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
