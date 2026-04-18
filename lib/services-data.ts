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
  /** Editorial illustration (SVG) beside service copy. */
  imageSrc: string
  imageAlt: string
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
      "Discovery that connects business decisions to user reality: problem framing, research synthesis, journey mapping, and a prioritized roadmap.\n\nYou get artifacts executives trust and engineers can estimate — not a slide deck that evaporates after the workshop.",
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
    ],
    imageSrc: "/portfolio/services/product-design-strategy.svg",
    imageAlt: "Abstract illustration: roadmap paths and discovery artifacts for product strategy.",
  },
  {
    id: "ai-native-ux",
    name: "AI-Native UX Design",
    tagline: "Interfaces and workflows for products where AI is the product — not a bolt-on.",
    description:
      "Design for probabilistic systems: prompt UX, confidence and uncertainty, review loops, traceability, and safe escalation paths.\n\nThe focus is customer outcomes — faster decisions, fewer errors, clearer accountability — not novelty for its own sake.",
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
    ],
    imageSrc: "/portfolio/services/ai-native-ux.svg",
    imageAlt: "Abstract illustration: layered signals and review patterns for AI-assisted product UX.",
  },
  {
    id: "design-systems",
    name: "Design Systems & Component Architecture",
    tagline: "Tokens, components, and Figma↔code parity your team can maintain.",
    description:
      "Audit or build a token-first system, component API design, accessibility defaults, and documentation that matches how engineers actually ship.\n\nThe goal is speed without chaos: consistent patterns, fewer one-offs, and less design–dev ping-pong.",
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
    ],
    imageSrc: "/portfolio/services/design-systems.svg",
    imageAlt: "Abstract illustration: modular tiles suggesting tokens, components, and documentation.",
  },
  {
    id: "fractional-leadership",
    name: "Fractional Design Leadership",
    tagline: "Senior design leadership embedded part-time — craft, process, and cross-functional traction.",
    description:
      "Operating as an embedded lead: critique and standards, design–dev partnership, planning with PMs, and hiring support when you need a senior seat at the table without a full-time hire yet.\n\nThis is hands-on leadership — reviews, rituals, and unblocking — not staff-only strategy theater.",
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
    ],
    imageSrc: "/portfolio/services/fractional-leadership.svg",
    imageAlt: "Abstract illustration: overlapping collaboration shapes for embedded design leadership.",
  },
]

export const serviceFAQs: ServiceFAQ[] = [
  // TODO(Charan): confirm public rate bands vs. private quotes
  {
    id: "rates-availability",
    question: "How do you structure rates and availability?",
    answer:
      "Engagements are scoped around outcomes and timeboxed milestones. Rates depend on cadence, seniority of the work, and risk profile — specifics are confirmed on a short intro call.",
    relatedServiceIds: [
      "product-design-strategy",
      "ai-native-ux",
      "design-systems",
      "fractional-leadership",
    ],
  },
  {
    id: "remote-collaboration",
    question: "Where are you based, and how do you collaborate remotely?",
    answer:
      "Collaboration is remote-first with structured async updates and workshop blocks in friendly time zones. On-site intensives are available when travel makes sense for the phase of work.",
    relatedServiceIds: [
      "product-design-strategy",
      "ai-native-ux",
      "design-systems",
      "fractional-leadership",
    ],
  },
  {
    id: "timelines",
    question: "What timelines should teams plan for?",
    answer:
      "Strategy and AI-native UX work typically lands in multi-week phases; systems work often runs as a quarter-long program with incremental releases. Fractional leadership is intentionally measured in months so standards stick.",
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
    question: "What makes this different from a traditional agency?",
    answer:
      "You work directly with a senior practitioner who designs and understands implementation tradeoffs — not a rotating bench. The work is positioned for product impact, not deliverable volume.",
    relatedServiceIds: ["fractional-leadership", "ai-native-ux"],
  },
  {
    id: "engagement-start",
    question: "How does an engagement start?",
    answer:
      "Share context on the product stage, constraints, and the decision you need to improve. From there, the first step is a short discovery slice or a scoped milestone before expanding scope.",
    relatedServiceIds: ["product-design-strategy", "fractional-leadership"],
    relatedPhaseSteps: ["01"],
  },
]
