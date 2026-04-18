/**
 * Homepage hero prose — single source of truth.
 * Edit this file to change the visible headline/body on `/`. Layout lives in
 * components/home/Hero.tsx. The knowledge-graph content extractor reads this
 * module so homepage prose shows up in the visitor knowledge graph.
 */

export const homeHeroAvailability = "Toronto, Ontario · Remote Worldwide"

export const homeHeroName = "Charan Deol"

/** Rendered as the H2 subhead under the name. */
export const homeHeroSubhead = {
  prefix: "Product Management & Business Systems.",
  accent: "AI-Native Delivery.",
} as const

/**
 * Body paragraph under the subhead. The extractor concatenates these pieces
 * into a single sentence for the knowledge graph; the Hero component renders
 * them with inline emphasis around `accent`.
 */
export const homeHeroBody = {
  before: "Most product leaders think in features. Most analysts think in requirements. I think in",
  accent: "systems, outcomes,",
  after: "and what it actually takes to ship — from discovery through to value realized.",
} as const

export const homeHeroIndustries = ["Finance & Banking", "Insurance", "Tech & SaaS"] as const

export type HomeDomainNarrative = {
  domain: string
  recurringProblems: string
  visitorValue: string
}

export const homeDomainNarratives: readonly HomeDomainNarrative[] = [
  {
    domain: "Finance, banking, and compliance",
    recurringProblems:
      "Regulatory ambiguity, fragmented workflows, and slow onboarding or risk response cycles.",
    visitorValue:
      "I align compliance, product, and engineering around explicit controls and measurable delivery outcomes.",
  },
  {
    domain: "Enterprise SaaS and internal platforms",
    recurringProblems:
      "Disconnected systems, inconsistent reporting, and stakeholder misalignment on what success means.",
    visitorValue:
      "I translate operating complexity into a clear roadmap, implementation artifacts, and KPI ownership.",
  },
  {
    domain: "Supply chain visibility and fulfilment operations",
    recurringProblems:
      "Inventory truth gaps, partner handoff failures, overselling, and reconciliation-heavy workflows.",
    visitorValue:
      "I map warehouse-to-dispatch reality, define integration requirements, and drive adoption to value realization.",
  },
]

/**
 * Plain-text representation of the hero body for the knowledge-graph corpus.
 * Kept as a derived constant so graphify sees a single contiguous sentence.
 */
export const homeHeroBodyPlain =
  `${homeHeroBody.before} ${homeHeroBody.accent} ${homeHeroBody.after}`
