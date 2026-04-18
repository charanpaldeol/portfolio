export type ServiceTier = {
  id: string
  name: string
  tagline: string
  description: string
  whoItsFor: string
  notFor?: string
  deliverables: string[]
  engagement: string
  outcomes: { metric: string; description: string }[]
  /** Short scenarios that signal where this service creates highest leverage. */
  bestFitScenarios?: string[]
  /** Project slugs this service is best demonstrated by (see `projects-data.ts`). */
  relatedProjectSlugs?: string[]
  /** Proof metric tags this service most often moves (see `proof-metrics-data.ts`). */
  relatedProofMetricTags?: string[]
  /** Domain-context quick routes for reducing context-switch between service, project proof, and outcomes. */
  domainCues?: ServiceDomainCue[]
  /** Editorial illustration (SVG) beside service copy. */
  imageSrc: string
  imageAlt: string
}

export type ServiceDomainCue = {
  /** Visitor-facing domain label (for example: Fintech, Compliance). */
  label: "Fintech" | "Compliance" | "Supply Chain" | "Internal Systems"
  /** Project slug to route to domain-specific case study proof. */
  projectSlug: string
  /** Optional proof metric tag that reinforces the same domain route. */
  proofMetricTag?: string
}

export type ServiceFAQ = {
  question: string
  answer: string
  id?: string
  relatedServiceIds?: string[]
  /** Phase steps referenced by this FAQ. Values: "01"–"06" (Discover, Define, Design, Deliver, Adopt, Value). */
  relatedPhaseSteps?: string[]
}

export const services: ServiceTier[] = [
  {
    id: "product-design-strategy",
    name: "Product Design Strategy",
    tagline: "Clarity before pixels — a credible plan your team can fund and ship.",
    description:
      "Discovery that connects business decisions to user reality: problem framing, research synthesis, journey mapping, and a prioritized roadmap.\n\nThe output is decision-grade: explicit trade-offs, funding-ready scope options, and implementation constraints engineering can estimate without re-discovery cycles.",
    whoItsFor: "Product and engineering leaders shipping 0→1, redesigns, or pivots where scope and risk are both high.",
    notFor: "Teams looking for a visual-only reskin without revisiting product strategy or success metrics.",
    deliverables: [
      "Executive-ready problem framing and success metrics",
      "Journey maps, opportunity areas, and prioritized bets",
      "Interaction models and narrative prototypes for alignment",
      "Design direction that de-risks the next build cycle",
    ],
    engagement: "Fixed scope (4–10 weeks)",
    outcomes: [
      { metric: "2–3×", description: "faster stakeholder alignment on what to build first" },
      { metric: "30–50%", description: "fewer late scope changes once engineering starts" },
      { metric: "Weeks not months", description: "to produce an executive decision artifact with measurable success criteria" },
    ],
    bestFitScenarios: [
      "A programme is blocked by conflicting stakeholder definitions of the problem.",
      "Leadership needs a funding decision artifact before committing engineering capacity.",
      "A product pivot needs defensible scope options and measurable success criteria.",
    ],
    relatedProjectSlugs: ["distributed-order-fulfillment", "payment-settlement-platform", "hr-management-system"],
    relatedProofMetricTags: ["SaaS implementation", "Platform consolidation", "Change management"],
    domainCues: [
      { label: "Fintech", projectSlug: "payment-settlement-platform", proofMetricTag: "Platform consolidation" },
      { label: "Supply Chain", projectSlug: "distributed-order-fulfillment", proofMetricTag: "SaaS implementation" },
      { label: "Internal Systems", projectSlug: "hr-management-system", proofMetricTag: "Change management" },
    ],
    imageSrc: "/portfolio/services/product-design-strategy.svg",
    imageAlt: "Abstract illustration: roadmap paths and discovery artifacts for product strategy.",
  },
  {
    id: "ai-native-ux",
    name: "AI-Native UX Design",
    tagline: "Interfaces and workflows for products where AI is the product — not a bolt-on.",
    description:
      "Design for probabilistic systems: prompt UX, confidence and uncertainty, review loops, traceability, and safe escalation paths.\n\nThe focus is customer outcomes: faster decisions, lower correction burden, and auditable human override paths that satisfy compliance and operational risk teams.",
    whoItsFor: "Teams building copilots, agents, retrieval workflows, or AI-assisted operations tools.",
    notFor:
      "Teams looking for AI only as a drafting shortcut in Figma. This engagement is product UX for AI-powered experiences.",
    deliverables: [
      "Task models, states, and edge-case maps for AI-assisted flows",
      "UI patterns for verification, edits, and human-in-the-loop review",
      "Content and interaction specs for prompts, outputs, and failures",
      "Measurement plan for trust, quality, and operational impact",
    ],
    engagement: "Fixed scope (6–12 weeks) or ongoing (3–6 months)",
    outcomes: [
      { metric: "20–40%", description: "reduction in correction loops after first production release" },
      { metric: "2–3×", description: "faster iteration on high-risk AI flows once baseline instrumentation exists" },
      { metric: "Higher trust", description: "through clearer confidence signals, fallback states, and escalation design" },
    ],
    bestFitScenarios: [
      "A copilot or agent experience needs trust and verification designed in from day one.",
      "Teams need to reduce rework from ambiguous AI outputs in production workflows.",
      "Compliance and operations require clear human override and audit-ready interaction flows.",
    ],
    relatedProjectSlugs: ["ai-customer-onboarding-agent", "fraud-detection-engine", "compliance-risk-monitoring"],
    relatedProofMetricTags: ["Change management"],
    domainCues: [
      { label: "Compliance", projectSlug: "fraud-detection-engine", proofMetricTag: "Change management" },
      { label: "Fintech", projectSlug: "ai-customer-onboarding-agent", proofMetricTag: "Change management" },
    ],
    imageSrc: "/portfolio/services/ai-native-ux.svg",
    imageAlt: "Abstract illustration: layered signals and review patterns for AI-assisted product UX.",
  },
  {
    id: "design-systems",
    name: "Design Systems & Component Architecture",
    tagline: "Tokens, components, and Figma↔code parity your team can maintain.",
    description:
      "Audit or build a token-first system, component API design, accessibility defaults, and documentation that matches how engineers actually ship.\n\nThe goal is speed without chaos: consistent patterns, fewer one-offs, less design-dev ping-pong, and governance that keeps Figma and production aligned over time.",
    whoItsFor: "Growing product orgs where UI drift, rework, and handoff tax are slowing delivery.",
    notFor: "A purely marketing-site component library with no product surface area.",
    deliverables: [
      "Token taxonomy and semantic mapping to implementation",
      "Component inventory, consolidation plan, and migration notes",
      "Figma libraries aligned to coded components",
      "Guidance for contribution, versioning, and governance",
    ],
    engagement: "Ongoing (3–6 months) or fixed audit (3–5 weeks)",
    outcomes: [
      { metric: "25–45%", description: "less repeated UI work across squads after baseline" },
      { metric: "Top journeys", description: "documented accessible patterns for the highest-traffic flows" },
      { metric: "Faster onboarding", description: "new designers and engineers ship with shared primitives instead of local variants" },
    ],
    bestFitScenarios: [
      "Multiple squads are shipping similar UI with inconsistent quality and naming.",
      "Design and engineering teams need Figma-to-code parity and governance.",
      "A product org wants to reduce handoff tax and component drift before scaling.",
    ],
    relatedProjectSlugs: ["api-first-banking-microservices", "event-streaming-pipeline", "hr-management-system"],
    relatedProofMetricTags: ["Platform consolidation"],
    domainCues: [
      { label: "Fintech", projectSlug: "api-first-banking-microservices", proofMetricTag: "Platform consolidation" },
      { label: "Supply Chain", projectSlug: "event-streaming-pipeline", proofMetricTag: "Platform consolidation" },
      { label: "Internal Systems", projectSlug: "hr-management-system", proofMetricTag: "Platform consolidation" },
    ],
    imageSrc: "/portfolio/services/design-systems.svg",
    imageAlt: "Abstract illustration: modular tiles suggesting tokens, components, and documentation.",
  },
  {
    id: "fractional-leadership",
    name: "Fractional Design Leadership",
    tagline: "Senior design leadership embedded part-time — craft, process, and cross-functional traction.",
    description:
      "Operating as an embedded lead: critique and standards, design-dev partnership, planning with PMs, and hiring support when you need a senior seat at the table without a full-time hire yet.\n\nThis is hands-on leadership: reviews, rituals, decision hygiene, and cross-functional unblocking that improves execution quality week over week.",
    whoItsFor: "Startups and scale-ups with strong IC designers but no seasoned design leader in seat.",
    notFor: "A full-time Head of Design replacement on a fractional calendar — scope stays bounded and explicit.",
    deliverables: [
      "Weekly design reviews and quality bar for shipped work",
      "Rituals with product/engineering for alignment and velocity",
      "Role definitions, loops, and lightweight documentation",
      "Interview loops and rubrics when you are hiring design leaders or ICs",
    ],
    engagement: "Ongoing (3–6 months)",
    outcomes: [
      { metric: "1–2 quarters", description: "to stabilize design quality and delivery predictability" },
      { metric: "Weekly", description: "design critique and alignment loop embedded with product and engineering" },
      { metric: "Lower execution drift", description: "through clearer ownership, better review rituals, and repeatable decision frameworks" },
    ],
    bestFitScenarios: [
      "A growing team needs senior design leadership without immediate full-time hire risk.",
      "Delivery quality is uneven because ownership and decision rituals are unclear.",
      "Product and engineering need a stronger design governance loop across active workstreams.",
    ],
    relatedProjectSlugs: ["cloud-security-compliance-automation", "hr-management-system", "compliance-risk-monitoring"],
    relatedProofMetricTags: ["Change management"],
    domainCues: [
      { label: "Compliance", projectSlug: "cloud-security-compliance-automation", proofMetricTag: "Change management" },
      { label: "Internal Systems", projectSlug: "hr-management-system", proofMetricTag: "Change management" },
      { label: "Fintech", projectSlug: "compliance-risk-monitoring", proofMetricTag: "Change management" },
    ],
    imageSrc: "/portfolio/services/fractional-leadership.svg",
    imageAlt: "Abstract illustration: overlapping collaboration shapes for embedded design leadership.",
  },
]

export const serviceFAQs: ServiceFAQ[] = [
  // TODO(Charan): confirm public rate bands vs. private quotes
  {
    id: "rates-availability",
    question: "How are service engagements scoped and priced?",
    answer:
      "Services are scoped around outcomes, explicit deliverables, and timeboxed milestones. Pricing reflects complexity, decision risk, and collaboration cadence — quoted after a short context call, not by day-rate alone.",
    relatedServiceIds: [
      "product-design-strategy",
      "ai-native-ux",
      "design-systems",
      "fractional-leadership",
    ],
  },
  {
    id: "remote-collaboration",
    question: "What is the difference between Services and Work with me?",
    answer:
      "Services are product/design-led outcome packages (strategy, AI-native UX, design systems, leadership). Work with me is engagement-model and delivery-operations support (programme, project, advisory). If you need an embedded delivery lead alongside service outcomes, start with Services and continue into Work with me.",
    relatedServiceIds: [
      "product-design-strategy",
      "ai-native-ux",
      "design-systems",
      "fractional-leadership",
    ],
  },
  {
    id: "timelines",
    question: "How quickly can a service start showing value?",
    answer:
      "Most services are designed to produce a concrete decision artifact in the first 1-2 weeks (scope, architecture direction, or risk map), then compound into implementation-ready outputs over the engagement window.",
    relatedServiceIds: [
      "product-design-strategy",
      "ai-native-ux",
      "design-systems",
      "fractional-leadership",
    ],
    relatedPhaseSteps: ["01", "04"],
  },
  {
    id: "vs-agency",
    question: "Do services include implementation-aware guidance?",
    answer:
      "Yes. Every service is shaped for implementation handoff: constraints, trade-offs, and technical implications are documented so engineering and delivery teams can execute without narrative loss.",
    relatedServiceIds: ["fractional-leadership", "ai-native-ux"],
  },
  {
    id: "engagement-start",
    question: "What does the first service milestone usually cover?",
    answer:
      "The first milestone is usually a scoped problem-definition or design-direction sprint: decision context, constraints, success metrics, and prioritized next actions. If ongoing delivery support is needed after that, transition into Work with me engagement models.",
    relatedServiceIds: ["product-design-strategy", "fractional-leadership"],
    relatedPhaseSteps: ["01"],
  },
]
