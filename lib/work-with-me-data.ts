export type EngagementType = {
  id: string
  icon: string
  name: string
  description: string
  idealFor: string
  typicalDuration: string
  deliverables: string[]
}

export type ProcessStep = {
  number: string
  title: string
  description: string
  duration: string
}

export type FAQ = {
  question: string
  answer: string
}

export const engagementTypes: EngagementType[] = [
  {
    id: "fractional",
    icon: "🧭",
    name: "Fractional design lead",
    description:
      "Embedded leadership a few days a week: aligning product and engineering on outcomes, raising the quality bar across UX and UI, and keeping design decisions moving without a full-time hire.",
    idealFor: "Best for teams that have strong builders but need senior design direction, critique, and stakeholder translation.",
    typicalDuration: "3–6 months",
    deliverables: [
      "Design direction, reviews, and async feedback loops",
      "Roadmap-level UX framing tied to business metrics",
      "Hiring support and design ops light-weight rituals",
      "Partnering with PM/Eng on tradeoffs and sequencing",
    ],
  },
  {
    id: "project",
    icon: "⚡",
    name: "Project-based consulting",
    description:
      "A fixed-scope engagement with crisp milestones—discovery through shipped artifacts—when you need a senior pair of hands for a launch, redesign, or complex workflow.",
    idealFor: "Best for teams with a bounded problem, a deadline, and a need for execution-grade craft—not open-ended exploration.",
    typicalDuration: "4–12 weeks",
    deliverables: [
      "Problem framing, journey maps, and success metrics",
      "High-fidelity flows and interaction specs",
      "Build-ready handoff with engineering collaboration",
      "Launch checklist and measurement plan",
    ],
  },
  {
    id: "advisory",
    icon: "🛰️",
    name: "Design systems & AI workflow advisory",
    description:
      "Targeted expertise for design system architecture, governance, and AI-native delivery patterns—workshops, audits, and actionable recommendations your team can run with.",
    idealFor: "Best for orgs modernizing a system, adopting AI-assisted design/dev workflows, or unblocking adoption at scale.",
    typicalDuration: "2–8 weeks",
    deliverables: [
      "System audit with prioritized roadmap",
      "Component/token strategy and documentation guidance",
      "AI workflow design with guardrails and review gates",
      "Enablement sessions for designers and engineers",
    ],
  },
]

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery call",
    description:
      "A focused conversation about goals, constraints, stakeholders, and what “good” looks like. We decide if there is a mutual fit before any paperwork.",
    duration: "30 minutes",
  },
  {
    number: "02",
    title: "Proposal & scope",
    description:
      "A short written proposal with options, milestones, and ways of working. You get clarity on outcomes, cadence, and how we will collaborate day to day.",
    duration: "3–5 business days",
  },
  {
    number: "03",
    title: "Kick-off",
    description:
      "Align on communication channels, working sessions, success metrics, and the first deliverable. Quick wins are identified so momentum starts immediately.",
    duration: "1 session",
  },
  {
    number: "04",
    title: "Delivery & iteration",
    description:
      "Ship work in tight loops with visible artifacts, regular reviews, and adjustments based on feedback and learning. Close with a handoff your team can sustain.",
    duration: "Per engagement",
  },
]

export const faqs: FAQ[] = [
  {
    question: "How do you price engagements?",
    answer:
      "Most work is scoped as a monthly retainer for fractional leadership or a fixed-fee statement of work for projects. Advisory can be packaged as a sprint. TODO(Charan): Add your typical rate bands and minimums here.",
  },
  {
    question: "What is your availability?",
    answer:
      "I keep a small number of concurrent engagements so quality stays high. TODO(Charan): Update your next opening window (e.g., “accepting starts from …”).",
  },
  {
    question: "Where are you located—and do you work remotely?",
    answer:
      "I collaborate remotely with teams globally and travel on-site when milestones benefit from face time (workshops, exec reviews, design critiques).",
  },
  {
    question: "How do we get started?",
    answer:
      "Book a discovery call via the contact page. Come with a short brief: problem, users, timeline, and what you have tried so far. If there is a fit, you will receive a proposal within a few days.",
  },
  {
    question: "Do you work with agencies or only in-house teams?",
    answer:
      "Both. In-house product teams are common, but I also partner with agencies needing senior design leadership on critical accounts or delivery spikes.",
  },
  {
    question: "What industries do you focus on?",
    answer:
      "B2B SaaS, regulated workflows, and AI-native products are where I have the deepest pattern library—but the engagement model matters more than the sector.",
  },
]
