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
  prefix: "I help regulated and enterprise teams turn ambiguous initiatives into shipped systems",
  accent: "with measurable adoption.",
} as const

/**
 * Body paragraph under the subhead. The extractor concatenates these pieces
 * into a single sentence for the knowledge graph; the Hero component renders
 * them with inline emphasis around `accent`.
 */
export const homeHeroBody = {
  before: "From discovery to rollout, I align",
  accent: "product, engineering, and compliance",
  after: "so high-stakes work lands faster with fewer reversals.",
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
      "I align compliance, product, and engineering around clear controls that reduce decision delays and improve audit readiness.",
  },
  {
    domain: "Enterprise SaaS and internal platforms",
    recurringProblems:
      "Disconnected systems, inconsistent reporting, and stakeholder misalignment on what success means.",
    visitorValue:
      "I turn operating complexity into a shared roadmap, clear ownership, and KPI-backed delivery that shortens reporting and decision cycles.",
  },
  {
    domain: "Supply chain visibility and fulfilment operations",
    recurringProblems:
      "Inventory truth gaps, partner handoff failures, overselling, and reconciliation-heavy workflows.",
    visitorValue:
      "I map warehouse-to-dispatch reality, define integration contracts, and improve fulfilment throughput with fewer reconciliation errors.",
  },
]

/**
 * Plain-text representation of the hero body for the knowledge-graph corpus.
 * Kept as a derived constant so graphify sees a single contiguous sentence.
 */
export const homeHeroBodyPlain =
  `${homeHeroBody.before} ${homeHeroBody.accent} ${homeHeroBody.after}`
