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
      "Standardized spacing and radius tokens so specs, Figma, and code referenced the same scale across twelve product surfaces. // TODO(Charan): plug in real surface count and rollout window",
    impact:
      "Cut “is this 16px or 18px?” back-and-forth in reviews and kept visual rhythm consistent where teams shipped independently.",
  },
  {
    id: "empty-state-pattern",
    layer: "component",
    title: "One empty-state pattern, many products",
    description:
      "Defined a reusable empty-state pattern (layout, tone, actions) instead of letting each squad invent its own. // TODO(Charan): add before/after implementation count",
    impact: "Retired seven divergent empty states and made onboarding flows feel like one suite instead of separate apps.",
  },
  {
    id: "nav-ia-platform",
    layer: "platform",
    title: "Shared navigation model across the suite",
    description:
      "Aligned primary IA and nav primitives across products so switching contexts did not re-teach users where “home” and settings lived. // TODO(Charan): add research or adoption metric",
    impact: "Reduced cognitive load at handoffs and made cross-sell journeys feel intentional instead of accidental.",
  },
  {
    id: "form-field-contract",
    layer: "token",
    title: "Form field contract at the token layer",
    description:
      "Locked label, error, and helper-text spacing to tokens and documented the contract for design and engineering. // TODO(Charan): cite audit or WCAG pass",
    impact: "Accessibility fixes in one product propagated as predictable deltas everywhere the contract was adopted.",
  },
  {
    id: "status-language",
    layer: "component",
    title: "Status vocabulary in components",
    description:
      "Mapped success, warning, error, and neutral states to shared semantic components instead of one-off banners. // TODO(Charan): add design-system version or ADR link",
    impact: "Support and ops saw fewer “which red is this?” incidents because state language matched across flows.",
  },
  {
    id: "release-telemetry",
    layer: "platform",
    title: "Telemetry hooks tied to platform releases",
    description:
      "Required a minimal analytics contract before features graduated to GA so outcomes were comparable across products. // TODO(Charan): add example KPI",
    impact: "Leadership could compare adoption curves without each team defining “active” differently.",
  },
]
