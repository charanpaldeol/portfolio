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
  /** Project slugs that directly evidence this metric. */
  relatedProjectSlugs?: readonly string[]
  /** Service IDs connected to this outcome. */
  relatedServiceIds?: readonly string[]
  /** Canonical phase steps where this metric is typically realized. */
  relatedPhaseSteps?: readonly string[]
  /** How-I-think principles reflected by this metric. */
  relatedPrincipleIds?: readonly string[]
  /** Before-state used for comparison. */
  baseline?: string
  /** Window used to evaluate improvement. */
  timeframe?: string
  /** How the metric was verified. */
  measurementMethod?: string
}

export const metrics = [
  {
    numericValue: 60,
    statSuffix: "%",
    label:
      "Reduced manual reporting effort by 60% over two quarters after leading BI tool selection, KPI definition, and implementation for a 200-person enterprise operations team. Baseline came from weekly analyst time logs; post-launch measurement used dashboard telemetry and monthly finance ops reviews.",
    tag: "SaaS implementation",
    tagColor: "emerald",
    relatedProjectSlugs: ["real-time-analytics-dashboard", "distributed-order-fulfillment"],
    relatedServiceIds: ["product-design-strategy"],
    relatedPhaseSteps: ["04", "06"],
    relatedPrincipleIds: ["evidence-over-opinion"],
    baseline: "Weekly analyst reporting effort across a 200-person operations function",
    timeframe: "Two quarters post implementation",
    measurementMethod: "Compared analyst time logs before and after launch with dashboard usage telemetry",
  },
  {
    numericValue: null,
    statDisplay: "4 → 1",
    label:
      "Consolidated four disconnected enterprise systems into one operational platform, cutting partner onboarding from three weeks to four days across 100+ locations. Measurement compared pre-migration onboarding lead time and error tickets against the first 90 days after cutover.",
    tag: "Platform consolidation",
    tagColor: "violet",
    relatedProjectSlugs: ["payment-settlement-platform", "event-streaming-pipeline", "hr-management-system"],
    relatedServiceIds: ["design-systems", "product-design-strategy"],
    relatedPhaseSteps: ["03", "04"],
    relatedPrincipleIds: ["less-better", "clarity"],
    baseline: "Four disconnected systems and three-week partner onboarding lead time",
    timeframe: "First 90 days after cutover",
    measurementMethod: "Compared onboarding cycle time and support ticket volume pre/post migration",
  },
  {
    numericValue: 83,
    statSuffix: "%",
    label:
      "Reached 83% user adoption within 60 days of go-live at a major Canadian bank, versus a pre-launch forecast of 40%, through role-based enablement and structured PROSCI change routines. Adoption was tracked via active workflow completion, supervisor usage audits, and weekly operating reviews.",
    tag: "Change management",
    tagColor: "amber",
    relatedProjectSlugs: ["ai-customer-onboarding-agent", "cloud-security-compliance-automation", "hr-management-system"],
    relatedServiceIds: ["fractional-leadership", "ai-native-ux"],
    relatedPhaseSteps: ["05", "06"],
    relatedPrincipleIds: ["adoption-over-delivery", "ship-learn-adapt"],
    baseline: "40% projected adoption before launch",
    timeframe: "First 60 days post go-live",
    measurementMethod: "Tracked active workflow completion, supervisor usage audits, and weekly operating reviews",
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
