export type WhatIBringArticleSection = {
  heading: string
  paragraphs: string[]
}

export type WhatIBringCard = {
  slug: string
  badge: string
  badgeClass: string
  title: string
  body: string
  sections: WhatIBringArticleSection[]
  relatedPrincipleIds?: readonly string[]
  relatedServiceIds?: readonly string[]
  relatedProjectSlugs?: readonly string[]
  relatedPhaseSteps?: readonly string[]
  relatedExpertiseIds?: readonly string[]
  relatedBlogSlugs?: readonly string[]
}

export const whatIBringCards = [
  {
    slug: "problem-framing",
    badge: "Discovery",
    badgeClass: "bg-secondary-fixed text-on-secondary-fixed",
    title: "Problem Framing",
    body:
      "The most expensive decision in any tech program is choosing the wrong problem. Strong teams slow down just enough to define the decision, the constraints, and the measurable business outcome before writing a single line of code.",
    sections: [
      {
        heading: "Start with the decision, not the feature",
        paragraphs: [
          "A brief often arrives as a solution: build a chatbot, migrate to AI, launch a dashboard. The executive question is different: what decision must improve, for whom, and by how much?",
          "When the target decision is explicit, scope gets smaller, prioritization gets easier, and teams stop shipping activity that does not move a business metric.",
        ],
      },
      {
        heading: "Map friction in the current workflow",
        paragraphs: [
          "Interview frontline users, managers, and operators in the same value chain. Ask where delays happen, where rework is created, and where judgment depends on incomplete data.",
          "This exposes the real bottlenecks: handoff gaps, policy ambiguity, and missing context. Technology can then be applied to the true constraint, not the visible symptom.",
        ],
      },
      {
        heading: "Define an executive-grade problem statement",
        paragraphs: [
          "A useful problem statement is concrete: who is affected, what is failing, what risk is created, and what measurable result is required within a timeframe.",
          "If a statement cannot guide funding and de-scope conversations, it is too vague. Clarity at this step saves months later in delivery.",
        ],
      },
      {
        heading: "Lock success metrics before solution design",
        paragraphs: [
          "Set baseline, target, and measurement cadence before architecture debates begin. Typical metrics include cycle time, quality rate, operating cost, and adoption depth.",
          "This creates a shared contract between product, engineering, and leadership. Delivery teams then optimize for value, not just velocity.",
        ],
      },
    ],
    relatedPrincipleIds: ["clarity", "evidence-over-opinion", "less-better"],
    relatedServiceIds: ["product-design-strategy"],
    relatedProjectSlugs: ["kyc-aml-automation", "hr-management-system"],
    relatedPhaseSteps: ["01", "02"],
    relatedExpertiseIds: ["business-product", "compliance-vendors"],
    relatedBlogSlugs: ["designing-for-decisions"],
  },
  {
    slug: "solution-design",
    badge: "Design",
    badgeClass: "bg-secondary-fixed text-on-secondary-fixed",
    title: "Solution Design",
    body:
      "Solution design is capital allocation in technical form. Great design choices reduce future cost, increase speed of change, and keep strategic options open as the business evolves.",
    sections: [
      {
        heading: "Evaluate build, buy, and blend options rigorously",
        paragraphs: [
          "The right answer is rarely ideological. Evaluate time-to-value, integration complexity, lock-in risk, compliance burden, and total cost over three years.",
          "A blended strategy often wins: buy commodity capability, build differentiating workflows, and reserve internal engineering focus for high-leverage IP.",
        ],
      },
      {
        heading: "Design for decision speed",
        paragraphs: [
          "Architectures should optimize how fast teams can make safe changes. Clear service boundaries, explicit contracts, and observability by default make this possible.",
          "When decision speed improves, product strategy can adapt in weeks rather than quarters, which is a direct competitive advantage.",
        ],
      },
      {
        heading: "Treat requirements as a strategic artifact",
        paragraphs: [
          "Requirements are not paperwork. They are the translation layer between business intent, procurement logic, security controls, and engineering execution.",
          "Strong requirements remove ambiguity early, shorten review cycles, and reduce expensive late-stage reversals.",
        ],
      },
      {
        heading: "Make trade-offs explicit and reversible",
        paragraphs: [
          "Every design has trade-offs. Document what is being optimized, what is being deferred, and what trigger would justify a different choice later.",
          "This protects momentum and trust. Stakeholders can see that choices are deliberate, not accidental.",
        ],
      },
    ],
    relatedPrincipleIds: ["clarity", "evidence-over-opinion"],
    relatedServiceIds: ["product-design-strategy", "design-systems"],
    relatedProjectSlugs: ["api-first-banking-microservices", "event-streaming-pipeline"],
    relatedPhaseSteps: ["03"],
    relatedExpertiseIds: ["architects-tech-leads", "engineering-qa"],
    relatedBlogSlugs: ["why-design-systems-fail"],
  },
  {
    slug: "ai-native-delivery",
    badge: "Delivery",
    badgeClass: "bg-primary-fixed text-on-primary-fixed",
    title: "AI-Native Delivery",
    body:
      "AI-native delivery is not a faster sprint cadence. It is a different operating model: shorter feedback loops, stricter risk controls, and measurable value at each release boundary.",
    sections: [
      {
        heading: "Run delivery as a portfolio of hypotheses",
        paragraphs: [
          "Each initiative should state a hypothesis, expected impact, confidence level, and the evidence required to scale investment.",
          "This changes governance from static planning to evidence-based funding, which is essential for AI programs with high uncertainty.",
        ],
      },
      {
        heading: "Design controlled acceleration",
        paragraphs: [
          "Agent workflows and automation can compress cycle time dramatically, but only when guardrails are explicit: data boundaries, approval gates, rollback paths, and audit trails.",
          "Speed without control creates hidden risk. Controlled acceleration compounds value safely.",
        ],
      },
      {
        heading: "Instrument for operational truth",
        paragraphs: [
          "Beyond uptime, track decision quality, exception rate, rework burden, and user trust signals. These indicators reveal whether AI is improving outcomes or just generating output.",
          "Teams that instrument this early avoid scaling brittle behavior into core operations.",
        ],
      },
      {
        heading: "Align operating model to regulation and risk",
        paragraphs: [
          "In regulated environments, architecture and process must satisfy legal, security, and governance requirements from day one.",
          "The winning pattern is simple: compliance by design, transparent controls, and delivery rituals that produce defensible evidence continuously.",
        ],
      },
    ],
    relatedPrincipleIds: ["ship-learn-adapt", "evidence-over-opinion", "adoption-over-delivery"],
    relatedServiceIds: ["ai-native-ux"],
    relatedProjectSlugs: [
      "fraud-detection-engine",
      "ai-customer-onboarding-agent",
      "data-breach-forensics-ai",
    ],
    relatedPhaseSteps: ["04", "05", "06"],
    relatedExpertiseIds: ["data-ai-teams", "engineering-qa"],
    relatedBlogSlugs: ["prompt-as-design-artifact"],
  },
  {
    slug: "engineering-depth",
    badge: "Engineering",
    badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    title: "Engineering Depth",
    body:
      "Executive decisions become expensive when technical consequences are invisible. Engineering depth at leadership level turns architecture choices into clear business trade-offs.",
    sections: [
      {
        heading: "Translate architecture into financial impact",
        paragraphs: [
          "Technical decisions influence cost-to-serve, speed-to-market, and risk exposure. Explain them in those terms and executive alignment improves immediately.",
          "When architecture language is connected to P&L outcomes, prioritization debates become clearer and faster.",
        ],
      },
      {
        heading: "Pressure-test where logic should live",
        paragraphs: [
          "A recurring source of waste is misplaced responsibility between UI, services, and data layers. Correct placement improves maintainability, testability, and change velocity.",
          "Reviewing this early avoids fragile systems where every change requires cross-team coordination.",
        ],
      },
      {
        heading: "Engineer for reliability under growth",
        paragraphs: [
          "Capacity planning, failure modes, deployment strategy, and observability are not late-stage concerns. They define whether growth becomes leverage or technical debt.",
          "Reliability disciplines should be designed into the initial roadmap, not patched in after incidents.",
        ],
      },
      {
        heading: "Bridge technical and executive forums",
        paragraphs: [
          "Leaders need someone who can challenge architecture in a design review and then explain strategic implications in a board discussion.",
          "This bridge role reduces translation loss, aligns expectations, and keeps programs moving with fewer surprises.",
        ],
      },
    ],
    relatedPrincipleIds: ["clarity", "evidence-over-opinion"],
    relatedServiceIds: ["design-systems", "fractional-leadership"],
    relatedProjectSlugs: [
      "api-first-banking-microservices",
      "fraud-detection-engine",
      "high-performance-ecommerce-checkout",
    ],
    relatedPhaseSteps: ["03", "04"],
    relatedExpertiseIds: ["engineering-qa", "architects-tech-leads"],
    relatedBlogSlugs: ["why-design-systems-fail", "designing-for-decisions"],
  },
  {
    slug: "value-realization",
    badge: "Adoption",
    badgeClass: "bg-secondary-fixed text-on-secondary-fixed",
    title: "Value Realization",
    body:
      "Deployment is a milestone, not the outcome. Value realization is the discipline of turning shipped capability into measurable business performance and sustained adoption.",
    sections: [
      {
        heading: "Define value architecture before execution",
        paragraphs: [
          "Set impact hypotheses, baselines, and owner accountability at kickoff. Without this, teams cannot prove progress and leaders cannot make confident follow-on investments.",
          "A simple value architecture links initiatives to metrics, milestones, and decision checkpoints.",
        ],
      },
      {
        heading: "Track leading and lagging indicators together",
        paragraphs: [
          "Lagging metrics show final impact; leading metrics reveal whether change is on track. Both are required for intelligent course correction.",
          "For example: adoption depth, task completion quality, and cycle-time trend should be monitored before quarterly outcomes are finalized.",
        ],
      },
      {
        heading: "Drive adoption as an operating discipline",
        paragraphs: [
          "Adoption fails when change is treated as a launch campaign instead of a management system. Teams need role-based enablement, manager reinforcement, and clear behavioral expectations.",
          "Structure 30, 60, and 90-day adoption reviews to identify resistance patterns and remove friction quickly.",
        ],
      },
      {
        heading: "Report outcomes in board-ready terms",
        paragraphs: [
          "Executives need concise evidence: what moved, what did not, why, and what decision is required next. Reporting should be narrative plus data, not dashboards without context.",
          "Programs earn long-term trust when they can demonstrate causality between delivered change and business impact.",
        ],
      },
    ],
    relatedPrincipleIds: ["adoption-over-delivery", "ship-learn-adapt"],
    relatedServiceIds: ["fractional-leadership"],
    relatedProjectSlugs: ["hr-management-system", "compliance-risk-monitoring"],
    relatedPhaseSteps: ["05", "06"],
    relatedExpertiseIds: ["business-product", "compliance-vendors"],
    relatedBlogSlugs: ["designing-for-decisions", "prompt-as-design-artifact"],
  },
] as const satisfies readonly WhatIBringCard[]

export function getWhatIBringCard(slug: string): WhatIBringCard | undefined {
  return whatIBringCards.find((c) => c.slug === slug)
}

export function requireWhatIBringCard(slug: string): WhatIBringCard {
  const card = getWhatIBringCard(slug)
  if (!card) {
    throw new Error(`Missing blog card: ${slug}`)
  }
  return card
}
