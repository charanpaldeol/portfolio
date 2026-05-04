import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { EditorialPageHero } from "@/components/portfolio/EditorialPageHero"
import { DeliveryPhaseGlossary } from "@/components/shared/DeliveryPhaseGlossary"
import { philosophyPoints, workflowPhases } from "@/lib/ai-workflow-data"
import { cn } from "@/lib/utils"

export default function HowIUseAIContent() {
  return (
    <>
      <EditorialPageHero
        eyebrow="Working in public"
        title={
          <>
            AI is my leverage, not my{" "}
            <span className="text-editorial-gradient">replacement</span>
          </>
        }
        description="A transparent look at where AI accelerates my work, where it falls short, and what stays irreducibly human."
      />

      <section aria-labelledby="philosophy-heading" className="mb-20 md:mb-24">
        <h2
          id="philosophy-heading"
          className="mb-10 font-display text-2xl font-bold tracking-tight text-on-surface md:text-3xl"
        >
          How I think about it
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {philosophyPoints.map((point, i) => (
            <article
              key={point.id}
              className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-8 shadow-editorial md:p-9"
            >
              <span
                className="pointer-events-none absolute left-5 top-5 font-display text-6xl font-extrabold leading-none text-primary/20 select-none md:left-6 md:top-6 md:text-7xl"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="relative z-10 mb-4 pt-10 font-display text-lg font-bold tracking-tight text-on-surface md:text-xl">
                {point.title}
              </h3>
              <p className="relative z-10 text-sm leading-relaxed text-on-surface-variant md:text-base">
                {point.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="workflow-heading" className="mb-20 md:mb-24">
        <h2
          id="workflow-heading"
          className="mb-4 font-display text-2xl font-bold tracking-tight text-on-surface md:text-3xl"
        >
          How it shows up across the arc
        </h2>
        <p className="mb-12 max-w-3xl text-base leading-relaxed text-on-surface-variant md:text-lg">
          This is the shape of a typical engagement — not a feature tour. Tools change; the rhythm of
          pairing acceleration with judgment does not.
        </p>
        <DeliveryPhaseGlossary className="mb-8" title="Delivery terms used on this page" />
        <div className="flex flex-col gap-6">
          {workflowPhases.map((phase, index) => (
            <article
              key={phase.id}
              className={cn(
                "rounded-2xl px-6 py-10 shadow-editorial md:px-10 md:py-12",
                index % 2 === 0 ? "bg-surface" : "bg-surface-container-low"
              )}
            >
              <h3 className="mb-4 font-display text-xl font-bold tracking-tight text-on-surface md:text-2xl">
                <span className="text-primary">{String(index + 1).padStart(2, "0")}</span>
                <span className="mx-2 text-on-surface-variant">·</span>
                {phase.title}
              </h3>
              <p className="mb-8 max-w-3xl text-base leading-relaxed text-on-surface-variant md:text-lg">
                {phase.description}
              </p>

              <div className="mb-8">
                <p className="mb-3 text-xs font-semibold tracking-wide text-primary uppercase">
                  Where AI helps
                </p>
                <p className="mb-4 max-w-3xl text-base leading-relaxed text-on-surface md:text-lg">
                  {phase.howAIHelps}
                </p>
                <ul className="flex flex-wrap gap-2" aria-label="Tools used in this phase">
                  {phase.tools.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-full bg-secondary-fixed px-3 py-1 text-xs font-medium text-on-secondary-fixed"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold tracking-wide text-primary uppercase">
                  What stays human
                </p>
                <div className="flex max-w-3xl overflow-hidden rounded-xl bg-surface-container-lowest shadow-editorial">
                  <div className="w-1 shrink-0 bg-primary-fixed" aria-hidden />
                  <p className="p-5 text-base leading-relaxed text-on-surface md:p-6 md:text-lg">
                    {phase.humanPart}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside
        aria-label="Honest limitations"
        className="mb-20 flex gap-6 md:mb-24 md:gap-8"
      >
        <div className="w-1 shrink-0 rounded-full bg-tertiary" aria-hidden />
        <blockquote className="max-w-3xl font-display text-xl font-bold leading-snug tracking-tight text-on-surface md:text-2xl md:leading-snug">
          AI still cannot tell you if you are solving the right problem. Research, stakeholder alignment,
          and strategic judgment remain wholly human work. I use AI to think faster inside the right
          problem — not to find the problem itself.
        </blockquote>
      </aside>

      <section
        aria-labelledby="related-heading"
        className="rounded-2xl bg-surface-container-low px-6 py-10 shadow-editorial md:px-10 md:py-12"
      >
        <h2
          id="related-heading"
          className="mb-4 font-display text-xl font-bold tracking-tight text-on-surface md:text-2xl"
        >
          Go deeper
        </h2>
        <p className="mb-8 max-w-2xl text-base leading-relaxed text-on-surface-variant">
          For the operating model behind AI-native programs — hypotheses, guardrails, and evidence — read
          the longer essay. For the full map of how I partner with teams, start from What I bring.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Link
            href="/blog/ai-native-delivery"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-fixed px-6 py-3.5 text-sm font-semibold text-on-primary-fixed shadow-editorial-float transition hover:brightness-[1.03]"
          >
            AI-native delivery <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/what-i-bring"
            className="inline-flex items-center gap-2 rounded-xl bg-surface-container-lowest px-6 py-3.5 text-sm font-semibold text-on-surface shadow-editorial transition hover:bg-surface-container"
          >
            What I bring <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  )
}
