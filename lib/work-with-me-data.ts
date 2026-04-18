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
      "Problem framing memo and KPI success model",
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
      "Problem framing memo and KPI success model",
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
    title: "Scoping call",
    description:
      "A focused commercial + delivery-fit conversation about the problem, stakeholders, constraints, and what a successful outcome looks like. This is engagement scoping (not the project delivery Discover phase).",
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
      "Engagements are structured as either monthly retainers (embedded programme leadership) or fixed-fee statements of work (project/advisory). Pricing is tied to governance complexity, stakeholder load, and expected delivery cadence.",
    relatedEngagementIds: ["programme", "project", "advisory"],
  },
  {
    id: "availability",
    question: "What is your availability?",
    answer:
      "I maintain a limited number of concurrent engagements to protect delivery quality. Start windows are planned around milestone calendars and decision checkpoints, so earlier scoping usually secures better timing.",
    relatedEngagementIds: ["programme", "project", "advisory"],
  },
  {
    id: "location-remote",
    question: "How are stakeholder rhythms handled during delivery?",
    answer:
      "Delivery uses a structured rhythm: weekly operating reviews, decision logs, risk escalation points, and async status updates. On-site sessions are used for high-stakes alignment moments such as kick-off, executive reviews, or reset workshops.",
    relatedEngagementIds: ["programme", "project", "advisory"],
  },
  {
    id: "get-started",
    question: "How do we get started?",
    answer:
      "Reach out with a short brief (problem, stakeholders, timeline, constraints). The first step is a scoping call, followed by a proposal and operating model. If you primarily need product/design outcome packages, the Services page is the better starting point.",
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
      "Financial services, banking/compliance, enterprise SaaS, and capital markets are where I have the deepest pattern library — KYC/AML, FINTRAC reporting, Salesforce programmes, SAP integrations, and payment migrations. The deciding factor is stakeholder complexity and delivery risk, not logo category.",
    relatedEngagementIds: ["programme", "project", "advisory"],
  },
]
