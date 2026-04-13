"use client"

import { Fragment } from "react"

import { toolGroups } from "@/lib/tools-and-methods-data"

import { ToolkitPhaseColumnHeading } from "./tools-and-methods/ToolkitPhaseColumnHeading"
import { ToolkitPhaseNode } from "./tools-and-methods/ToolkitPhaseNode"

export default function ToolsAndMethods() {
  const upstream = toolGroups.slice(0, 3)
  const downstream = toolGroups.slice(3)

  return (
    <div className="space-y-16">
      <section
        id="toolkit-principle"
        aria-label="Guiding principle"
        className="relative scroll-mt-24 overflow-hidden rounded-2xl bg-surface-container-low p-10 shadow-editorial md:p-14"
      >
        <div
          className="pointer-events-none absolute right-4 top-4 select-none font-display text-[5rem] font-extrabold leading-none text-on-surface opacity-[0.04] sm:right-8 sm:top-6 sm:text-[9rem]"
          aria-hidden
        >
          &ldquo;
        </div>
        <div className="relative flex max-w-3xl gap-4 sm:gap-5 md:gap-6">
          <div className="w-1 shrink-0 self-stretch rounded-full bg-tertiary" aria-hidden />
          <div className="min-w-0 flex-1">
          <blockquote>
            <p className="font-display text-2xl font-extrabold leading-tight tracking-tight text-on-surface md:text-4xl">
              The tools we choose are secondary to the intent they serve — every artefact
              must earn its place in the delivery arc.
            </p>
            <footer className="mt-6 text-sm font-semibold text-tertiary-container">
              <cite className="not-italic">Guiding principle behind the toolkit</cite>
            </footer>
          </blockquote>
          </div>
        </div>
      </section>

      <section
        id="toolkit-phases"
        aria-label="Delivery phase toolkit"
        className="scroll-mt-24"
      >
        <div className="mb-10 hidden grid-cols-2 items-start gap-5 md:grid">
          <ToolkitPhaseColumnHeading variant="strategic" />
          <ToolkitPhaseColumnHeading variant="execution" />
        </div>

        <div className="relative hidden md:block">
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 w-12 -translate-x-1/2 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-on-surface)_10%,transparent),transparent_70%)] opacity-45"
            aria-hidden
          />
          <div className="grid grid-cols-2 gap-5">
            {upstream.map((g, i) => {
              const right = downstream[i]
              if (!right) return null
              return (
                <Fragment key={g.phase}>
                  <ToolkitPhaseNode {...g} accent="primary" />
                  <ToolkitPhaseNode {...right} accent="secondary" />
                </Fragment>
              )
            })}
          </div>
        </div>

        <div className="relative flex flex-col gap-12 md:hidden">
          <div className="flex flex-col gap-5">
            <ToolkitPhaseColumnHeading variant="strategic" />
            {upstream.map((g) => (
              <ToolkitPhaseNode key={g.phase} {...g} accent="primary" />
            ))}
          </div>
          <div className="flex flex-col gap-5">
            <ToolkitPhaseColumnHeading variant="execution" />
            {downstream.map((g) => (
              <ToolkitPhaseNode key={g.phase} {...g} accent="secondary" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
