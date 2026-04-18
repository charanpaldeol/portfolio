import type { LucideIcon } from "lucide-react"
import {
  Box,
  Briefcase,
  Building2,
  CheckCircle2,
  Code2,
  Database,
  FileText,
  PenLine,
  Search,
  Shield,
  Users,
  Zap,
} from "lucide-react"

import { deliveryPhasesById } from "@/lib/delivery-taxonomy"

export type WorkPhase = {
  id?: string
  title: string
  description: string
  /** Tangible artifacts that make decisions and delivery quality explicit. */
  decisionArtifacts?: string[]
  Icon: LucideIcon
  emphasized?: boolean
  step: string
}

export type ExpertiseArea = {
  id?: string
  title: string
  body: string
  Icon: LucideIcon
  relatedServiceIds?: string[]
  relatedProjectSlugs?: string[]
  relatedTestimonialIds?: string[]
  relatedPhaseSteps?: string[]
}

export const workPhases: WorkPhase[] = [
  {
    id: "discover",
    title: deliveryPhasesById.discover.label,
    description:
      "Stakeholder interviews, process mapping, problem framing — including supply chain and fulfilment mapping where operations span warehouses and partners",
    decisionArtifacts: [
      "Stakeholder map with decision owners",
      "Current-state process map with bottlenecks and risk points",
      "Problem framing memo with baseline metrics",
    ],
    Icon: Search,
    step: "01",
  },
  {
    id: "define",
    title: deliveryPhasesById.define.label,
    description: "BRDs, user stories, acceptance criteria — translating the problem framing memo into a measurable business case with KPI baselines, target outcomes, and acceptance criteria stakeholders can sign off on",
    decisionArtifacts: [
      "Requirements decision log with assumptions and trade-offs",
      "Prioritized user story set with acceptance criteria",
      "Business case and KPI success model",
    ],
    Icon: FileText,
    step: "02",
  },
  {
    id: "design",
    title: deliveryPhasesById.design.label,
    description: "Architecture, data models, API contracts, integration specs",
    decisionArtifacts: [
      "Solution architecture options with rationale",
      "API and integration contract pack",
      "Data model and dependency map",
    ],
    Icon: Box,
    step: "03",
  },
  {
    id: "deliver",
    title: deliveryPhasesById.deliver.label,
    description: "Agile execution, backlog ownership, UAT, defect triage",
    decisionArtifacts: [
      "Release plan with risk and rollback criteria",
      "UAT scenario suite and sign-off matrix",
      "Defect triage board with severity ownership",
    ],
    Icon: Zap,
    step: "04",
  },
  {
    id: "adopt",
    title: deliveryPhasesById.adopt.label,
    description: "Training, comms, rollout, post-launch support",
    decisionArtifacts: [
      "Role-based enablement and communication plan",
      "Change impact map by stakeholder group",
      "Adoption playbook with reinforcement cadence",
    ],
    Icon: Users,
    step: "05",
  },
  {
    id: "value",
    title: deliveryPhasesById.value.label,
    description: "KPIs tracked, outcomes measured, platform scales",
    decisionArtifacts: [
      "Outcome dashboard with baseline versus current",
      "Executive value review with next investment options",
      "Post-implementation learning report",
    ],
    Icon: CheckCircle2,
    emphasized: true,
    step: "06",
  },
]

export const expertiseAreas: ExpertiseArea[] = [
  {
    id: "business-product",
    title: "Business & product",
    body: "Translating executive goals into delivery-ready requirements — from capital markets analytics and CRM decision-support programmes to supply chain implementations spanning warehouses, dispatch, and partner integrations.",
    Icon: Briefcase,
    relatedServiceIds: ["product-design-strategy", "fractional-leadership"],
    relatedProjectSlugs: ["landing-page-website", "real-time-analytics-dashboard", "distributed-order-fulfillment"],
    relatedTestimonialIds: ["t1", "t3", "t5"],
    relatedPhaseSteps: ["01", "02"],
  },
  {
    id: "engineering-qa",
    title: "Engineering & QA",
    body: "Writing specs engineers actually build from — and staying in UAT, defect triage, and release until it ships clean.",
    Icon: Code2,
    relatedServiceIds: ["ai-native-ux", "design-systems"],
    relatedProjectSlugs: [
      "fraud-detection-engine",
      "api-first-banking-microservices",
      "high-performance-ecommerce-checkout",
    ],
    relatedTestimonialIds: ["t1"],
    relatedPhaseSteps: ["03", "04"],
  },
  {
    id: "architects-tech-leads",
    title: "Architects & tech leads",
    body: "Bridging business intent and technical design across solution, enterprise, and integration architecture.",
    Icon: Building2,
    relatedServiceIds: ["design-systems"],
    relatedProjectSlugs: [
      "api-first-banking-microservices",
      "event-streaming-pipeline",
      "cloud-security-compliance-automation",
    ],
    relatedPhaseSteps: ["03", "04"],
  },
  {
    id: "ux-design",
    title: "UX & design",
    body: "Partnering on user flows, prototypes, and research to design decision surfaces — not just screens — so requirements and the actual experience of making a choice stay in sync.",
    Icon: PenLine,
    relatedServiceIds: ["ai-native-ux", "design-systems", "product-design-strategy"],
    relatedProjectSlugs: ["landing-page-website", "ai-customer-onboarding-agent"],
    relatedTestimonialIds: ["t3"],
    relatedPhaseSteps: ["02", "03"],
  },
  {
    id: "data-ai-teams",
    title: "Data & AI teams",
    body: "Scoping and shipping data science, LLM, and agentic workflows with clear success criteria from day one.",
    Icon: Database,
    relatedServiceIds: ["ai-native-ux"],
    relatedProjectSlugs: [
      "fraud-detection-engine",
      "ai-customer-onboarding-agent",
      "data-breach-forensics-ai",
      "ecommerce-product-search-recommendations",
    ],
    relatedTestimonialIds: ["t2"],
    relatedPhaseSteps: ["02", "04"],
  },
  {
    id: "compliance-vendors",
    title: "Compliance & vendors",
    body: "Navigating regulatory constraints, procurement, and 3rd-party integrations without slowing delivery.",
    Icon: Shield,
    relatedServiceIds: ["fractional-leadership"],
    relatedProjectSlugs: [
      "kyc-aml-automation",
      "compliance-risk-monitoring",
      "data-breach-forensics-ai",
      "cloud-security-compliance-automation",
    ],
    relatedTestimonialIds: ["t2", "t4"],
    relatedPhaseSteps: ["01", "02", "06"],
  },
]
