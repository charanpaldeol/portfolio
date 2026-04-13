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
  },
  {
    title: "Define",
    description: "BRDs, user stories, acceptance criteria, business case",
    Icon: FileText,
  },
  {
    title: "Design",
    description: "Architecture, data models, API contracts, integration specs",
    Icon: Box,
  },
  {
    title: "Deliver",
    description: "Agile execution, backlog ownership, UAT, defect triage",
    Icon: Zap,
  },
  {
    title: "Adopt",
    description: "Training, comms, rollout, post-launch support",
    Icon: Users,
  },
  {
    title: "Value",
    description: "KPIs tracked, outcomes measured, platform scales",
    Icon: CheckCircle2,
    emphasized: true,
  },
]

export const expertiseAreas: ExpertiseArea[] = [
  {
    title: "Business & product",
    body: "Executives, product owners, domain SMEs",
    Icon: Briefcase,
  },
  {
    title: "Engineering & QA",
    body: "Dev, QA, DevOps, testing, release",
    Icon: Code2,
  },
  {
    title: "Architects & tech leads",
    body: "Solution, enterprise, integration",
    Icon: Building2,
  },
  {
    title: "UX & design",
    body: "Flows, prototypes, research",
    Icon: PenLine,
  },
  {
    title: "Data & AI teams",
    body: "Data science, LLMs, agentic workflows",
    Icon: Database,
  },
  {
    title: "Compliance & vendors",
    body: "Regulatory, procurement, 3rd parties",
    Icon: Shield,
  },
]
