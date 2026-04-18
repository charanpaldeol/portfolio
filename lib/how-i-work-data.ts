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

export type WorkPhase = {
  id?: string
  title: string
  description: string
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
    title: "Discover",
    description: "Stakeholder interviews, process mapping, problem framing",
    Icon: Search,
    step: "01",
  },
  {
    id: "define",
    title: "Define",
    description: "BRDs, user stories, acceptance criteria, business case",
    Icon: FileText,
    step: "02",
  },
  {
    id: "design",
    title: "Design",
    description: "Architecture, data models, API contracts, integration specs",
    Icon: Box,
    step: "03",
  },
  {
    id: "deliver",
    title: "Deliver",
    description: "Agile execution, backlog ownership, UAT, defect triage",
    Icon: Zap,
    step: "04",
  },
  {
    id: "adopt",
    title: "Adopt",
    description: "Training, comms, rollout, post-launch support",
    Icon: Users,
    step: "05",
  },
  {
    id: "value",
    title: "Value",
    description: "KPIs tracked, outcomes measured, platform scales",
    Icon: CheckCircle2,
    emphasized: true,
    step: "06",
  },
]

export const expertiseAreas: ExpertiseArea[] = [
  {
    id: "business-product",
    title: "Business & product",
    body: "Translating executive goals into delivery-ready requirements with executives, product owners, and domain SMEs.",
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
    body: "Partnering on user flows, prototypes, and research so requirements and experience stay in sync.",
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
