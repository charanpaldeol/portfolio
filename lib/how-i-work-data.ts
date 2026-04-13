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
  title: string
  description: string
  Icon: LucideIcon
  emphasized?: boolean
  step: string
}

export type ExpertiseArea = {
  title: string
  body: string
  Icon: LucideIcon
}

export const workPhases: WorkPhase[] = [
  {
    title: "Discover",
    description: "Stakeholder interviews, process mapping, problem framing",
    Icon: Search,
    step: "01",
  },
  {
    title: "Define",
    description: "BRDs, user stories, acceptance criteria, business case",
    Icon: FileText,
    step: "02",
  },
  {
    title: "Design",
    description: "Architecture, data models, API contracts, integration specs",
    Icon: Box,
    step: "03",
  },
  {
    title: "Deliver",
    description: "Agile execution, backlog ownership, UAT, defect triage",
    Icon: Zap,
    step: "04",
  },
  {
    title: "Adopt",
    description: "Training, comms, rollout, post-launch support",
    Icon: Users,
    step: "05",
  },
  {
    title: "Value",
    description: "KPIs tracked, outcomes measured, platform scales",
    Icon: CheckCircle2,
    emphasized: true,
    step: "06",
  },
]

export const expertiseAreas: ExpertiseArea[] = [
  {
    title: "Business & product",
    body: "Translating executive goals into delivery-ready requirements with executives, product owners, and domain SMEs.",
    Icon: Briefcase,
  },
  {
    title: "Engineering & QA",
    body: "Writing specs engineers actually build from — and staying in UAT, defect triage, and release until it ships clean.",
    Icon: Code2,
  },
  {
    title: "Architects & tech leads",
    body: "Bridging business intent and technical design across solution, enterprise, and integration architecture.",
    Icon: Building2,
  },
  {
    title: "UX & design",
    body: "Partnering on user flows, prototypes, and research so requirements and experience stay in sync.",
    Icon: PenLine,
  },
  {
    title: "Data & AI teams",
    body: "Scoping and shipping data science, LLM, and agentic workflows with clear success criteria from day one.",
    Icon: Database,
  },
  {
    title: "Compliance & vendors",
    body: "Navigating regulatory constraints, procurement, and 3rd-party integrations without slowing delivery.",
    Icon: Shield,
  },
]
