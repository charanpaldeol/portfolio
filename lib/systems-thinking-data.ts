export type SystemsExample = {
  id: string
  layer: "token" | "component" | "platform"
  title: string
  description: string
  impact: string
}

export const systemsExamples: SystemsExample[] = [
  {
    id: "spacing-tokens",
    layer: "token",
    title: "Spacing tokens as the single source of truth",
    description:
      "Standardized spacing and radius tokens so specs, Figma, and code referenced the same scale across twelve product surfaces — rolled out across six teams over a single 6-week sprint cycle.",
    impact:
      `Cut \u201cis this 16px or 18px?\u201d back-and-forth in reviews and kept visual rhythm consistent where teams shipped independently.`,
  },
  {
    id: "empty-state-pattern",
    layer: "component",
    title: "One empty-state pattern, many products",
    description:
      "Defined a reusable empty-state pattern (layout, tone, actions) across four squads, replacing seven divergent implementations that had accumulated across three product lines.",
    impact: "Retired seven divergent empty states and made onboarding flows feel like one suite instead of separate apps.",
  },
  {
    id: "nav-ia-platform",
    layer: "platform",
    title: "Shared navigation model across the suite",
    description:
      "Aligned primary IA and nav primitives across products so switching contexts did not re-teach users where home and settings lived. Validated through cross-product usability sessions across three product lines — task completion improved 31% on cross-product journeys.",
    impact: "Reduced cognitive load at handoffs and made cross-sell journeys feel intentional instead of accidental.",
  },
  {
    id: "form-field-contract",
    layer: "token",
    title: "Form field contract at the token layer",
    description:
      "Locked label, error, and helper-text spacing to tokens and documented the contract for design and engineering — validated against WCAG 2.1 AA standards across all adopting surfaces before rollout.",
    impact: "Accessibility fixes in one product propagated as predictable deltas everywhere the contract was adopted.",
  },
  {
    id: "status-language",
    layer: "component",
    title: "Status vocabulary in components",
    description:
      "Mapped success, warning, error, and neutral states to shared semantic components instead of one-off banners — formalized in v2.0 of the shared component library and documented in ADR-014.",
    impact: `Support and ops saw fewer \u201cwhich red is this?\u201d incidents because state language matched across flows.`,
  },
  {
    id: "release-telemetry",
    layer: "platform",
    title: "Telemetry hooks tied to platform releases",
    description:
      `Required a minimal analytics contract before features graduated to GA — teams had to define their \u201cactive user\u201d KPI (e.g. feature interaction within first 14 days of release) before shipping — so adoption curves were comparable across products.`,
    impact: `Leadership could compare adoption curves without each team defining \u201cactive\u201d differently.`,
  },
]
