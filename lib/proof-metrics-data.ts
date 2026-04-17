/**
 * Proof-of-work metrics for the homepage — single source of truth (GOVERNANCE).
 * Edit this file to add or change cards; layout lives in ProofMetrics.tsx.
 */

export type TagColor = "emerald" | "violet" | "amber" | "sky" | "rose"

export interface Metric {
  numericValue: number | null
  statSuffix?: string
  statDisplay?: string
  label: string
  tag: string
  tagColor: TagColor
}

export const metrics = [
  {
    numericValue: 60,
    statSuffix: "%",
    label:
      "Reduction in manual reporting time after leading BI tool selection and full implementation for a 200-person enterprise operations team at a major SaaS company.",
    tag: "SaaS implementation",
    tagColor: "emerald",
  },
  {
    numericValue: null,
    statDisplay: "4 → 1",
    label:
      "Consolidated four disconnected enterprise systems into a single platform — cutting partner onboarding from 3 weeks to 4 days across 100+ locations.",
    tag: "Platform consolidation",
    tagColor: "violet",
  },
  {
    numericValue: 83,
    statSuffix: "%",
    label:
      "User adoption rate achieved within 60 days of go-live at a major Canadian bank — up from a projected 40% — through structured PROSCI change management.",
    tag: "Change management",
    tagColor: "amber",
  },
] as const satisfies readonly Metric[]

export const tagStyles: Record<TagColor, { pill: string; accent: string }> = {
  emerald: {
    pill: "bg-primary-fixed text-on-primary-fixed",
    accent: "bg-primary",
  },
  violet: {
    pill: "bg-secondary-fixed text-on-secondary-fixed",
    accent: "bg-secondary",
  },
  amber: {
    pill: "bg-tertiary-fixed text-on-tertiary-fixed",
    accent: "bg-tertiary",
  },
  sky: {
    pill: "bg-secondary-fixed/80 text-on-secondary-fixed",
    accent: "bg-secondary",
  },
  rose: {
    pill: "bg-primary-fixed/90 text-on-primary-fixed",
    accent: "bg-primary",
  },
}
