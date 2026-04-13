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
      "Reduction in manual reporting time after leading a BI tool selection and full implementation across a 200-person finance team.",
    tag: "SaaS implementation",
    tagColor: "emerald",
  },
  {
    numericValue: null,
    statDisplay: "4 → 1",
    label:
      "Consolidated four disconnected systems into a single platform, cutting onboarding time from 3 weeks to 4 days for a healthcare provider.",
    tag: "In-house build",
    tagColor: "violet",
  },
  {
    numericValue: 83,
    statSuffix: "%",
    label:
      "User adoption rate achieved within 60 days of go-live through structured change management — up from a projected 40%.",
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
