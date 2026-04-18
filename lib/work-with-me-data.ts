export type EngagementType = {
  id: string
  icon: string
  name: string
  description: string
  idealFor: string
  typicalDuration: string
  deliverables: string[]
  /** Phase steps this engagement typically covers. Values: "01"–"06". */
  relatedPhaseSteps?: string[]
}

export type ProcessStep = {
  number: string
  title: string
  description: string
  duration: string
  id?: string
}

export type FAQ = {
  question: string
  answer: string
  id?: string
  /** Engagement type IDs referenced by this FAQ. Values: "programme", "project", "advisory". */
  relatedEngagementIds?: string[]
  /** Phase steps referenced by this FAQ. Values: "01"–"06". */
  relatedPhaseSteps?: string[]
}

export const engagementTypes: EngagementType[] = [
  {
    id: "programme",
    icon: "🧭",
    name: "Programme delivery & BA leadership",
    description:
      "Embedded as a Lead Technical Business Analyst or Lead Business Systems Analyst — driving requirements, stakeholder alignment, and delivery governance across an initiative from discovery through go-live.",
    idealFor: "Best for teams with a complex programme underway who need senior BA leadership to bridge technical and business stakeholders, manage scope, and deliver clean outcomes.",
    typicalDuration: "3–6 months",
    deliverables: [
      "Requirements elicitation, BRDs, and functional specifications",
      "Stakeholder alignment workshops and communication plans",
      "Data mapping, source-to-target documentation, and ETL specifications",
      "UAT framework design, execution, and sign-off management",
      "Change management support and go-live governance",
    ],
    relatedPhaseSteps: ["01", "02", "03", "04", "05", "06"],
  },
  {
    id: "project",
    icon: "⚡",
    name: "Project-based BA consulting",
    description:
      "Fixed-scope engagement for a bounded problem — a system migration, compliance implementation, CRM deployment, or process reengineering initiative — with clear milestones and deliverables.",
    idealFor: "Best for teams with a specific project that needs structured BA work: requirements, data analysis, vendor coordination, and a handoff the internal team can sustain independently.",
    typicalDuration: "4–12 weeks",
    deliverables: [
      "Current-state process mapping and gap analysis",
      "Future-state requirements and integration specifications",
      "Vendor evaluation support and RFP documentation",
      "UAT design, execution, and compliance sign-off",
      "Operational runbook and knowledge transfer",
    ],
    relatedPhaseSteps: ["01", "02", "03", "04"],
  },
  {
    id: "advisory",
    icon: "🛰️",
    name: "Enterprise systems & AI implementation advisory",
    description:
      "Targeted expertise for enterprise system implementations, AI platform rollouts, and compliance programme design — workshops, audits, and actionable requirements your team can execute against.",
    idealFor: "Best for orgs implementing Salesforce, SAP, or AI-driven platforms and needing structured BA governance to ensure the right requirements reach the right teams.",
    typicalDuration: "2–8 weeks",
    deliverables: [
      "System audit and requirements gap analysis",
      "Data governance and source-to-target mapping guidance",
      "AI implementation requirements and UAT frameworks",
      "Compliance and regulatory alignment documentation",
      "Stakeholder enablement sessions and knowledge transfer",
    ],
    relatedPhaseSteps: ["01", "02", "06"],
  },
]

export const processSteps: ProcessStep[] = [
  {
    id: "discovery-call",
    number: "01",
    title: "Discovery call",
    description:
      "A focused conversation about the problem, stakeholders, constraints, and what a successful outcome looks like. We decide if there is a mutual fit before any paperwork.",
    duration: "30 minutes",
  },
  {
    id: "proposal-scope",
    number: "02",
    title: "Proposal & scope",
    description:
      "A short written proposal with engagement options, milestones, and ways of working. You get clarity on deliverables, cadence, and how we will collaborate day to day.",
    duration: "3–5 business days",
  },
  {
    id: "kick-off",
    number: "03",
    title: "Kick-off",
    description:
      "Align on communication channels, working sessions, success metrics, and the first deliverable. Quick wins are identified so momentum starts immediately.",
    duration: "1 session",
  },
  {
    id: "delivery-iteration",
    number: "04",
    title: "Delivery & iteration",
    description:
      "Work is delivered in tight loops with visible artifacts, regular stakeholder reviews, and scope adjustments based on feedback. Close with a handoff your team can sustain.",
    duration: "Per engagement",
  },
]

export const faqs: FAQ[] = [
  {
    id: "pricing",
    question: "How do you price engagements?",
    answer:
      "Engagements are typically structured as a monthly retainer for programme delivery roles or a fixed-fee statement of work for project-based and advisory engagements. Rates are shared on request — reach out with your scope and timeline for a tailored proposal.",
    relatedEngagementIds: ["programme", "project", "advisory"],
  },
  {
    id: "availability",
    question: "What is your availability?",
    answer:
      "I maintain a small number of concurrent engagements to keep quality high. Currently accepting new starts from Q3 2026 — reach out early to discuss scope and timing so we can plan the right start date.",
    relatedEngagementIds: ["programme", "project", "advisory"],
  },
  {
    id: "location-remote",
    question: "Where are you located — and do you work remotely?",
    answer:
      "Based in Toronto, Canada. I collaborate remotely with teams globally and travel on-site when milestones benefit from face time — stakeholder workshops, executive reviews, and programme kick-offs.",
    relatedEngagementIds: ["programme", "project", "advisory"],
  },
  {
    id: "get-started",
    question: "How do we get started?",
    answer:
      "Reach out via the contact page with a short brief: the problem, the stakeholders involved, your timeline, and what you have tried so far. If there is a fit, you will receive a proposal within a few business days.",
    relatedEngagementIds: ["programme", "project", "advisory"],
    relatedPhaseSteps: ["01"],
  },
  {
    id: "agencies-or-inhouse",
    question: "Do you work with agencies or only in-house teams?",
    answer:
      "Both. In-house product and operations teams are most common, but I also partner with implementation consultancies and agencies that need senior BA leadership on critical client programmes or delivery spikes.",
    relatedEngagementIds: ["project", "advisory"],
  },
  {
    id: "industries",
    question: "What industries do you focus on?",
    answer:
      "Financial services, banking and compliance, enterprise SaaS, and capital markets are where I have the deepest pattern library — KYC/AML, FINTRAC reporting, Salesforce implementations, SAP integrations, and payment system migrations. The problem quality and stakeholder complexity matter more than the sector.",
    relatedEngagementIds: ["programme", "project", "advisory"],
  },
]
