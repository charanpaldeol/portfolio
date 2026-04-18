import type { LucideIcon } from "lucide-react"
import {
  BarChart2,
  Filter,
  Flame,
  Heart,
  RefreshCw,
  Users,
} from "lucide-react"

export type HowIThinkPrinciple = {
  id:
    | "less-better"
    | "clarity"
    | "empathy"
    | "evidence-over-opinion"
    | "adoption-over-delivery"
    | "ship-learn-adapt"
  quote: string
  underline?: boolean
  why: string
  example: string
  accent: "primary" | "secondary" | "tertiary"
  Icon: LucideIcon
  relatedProjectSlugs?: readonly string[]
  relatedServiceIds?: readonly string[]
  relatedPhaseSteps?: readonly string[]
  relatedExpertiseIds?: readonly string[]
}

export const HOW_I_THINK_PRINCIPLES: HowIThinkPrinciple[] = [
  {
    id: "less-better",
    quote: "Less, but better.",
    underline: true,
    why: "Remove distraction. Keep only what moves the outcome.",
    example:
      "For a payment migration programme, cut a 40-slide options deck to 8 decision slides and narrowed MVP scope to 3 production-critical flows, which reduced late change requests during build.",
    accent: "primary",
    Icon: Filter,
    relatedProjectSlugs: ["payment-settlement-platform", "hr-management-system"],
    relatedServiceIds: ["product-design-strategy"],
    relatedPhaseSteps: ["02", "03"],
    relatedExpertiseIds: ["business-product", "architects-tech-leads"],
  },
  {
    id: "clarity",
    quote: "Clarity above all.",
    why: "Make the next step obvious, the system legible, and the trade-offs explicit.",
    example:
      "In a banking modernisation workshop, each decision closed with one sentence, one owner, and one deadline, which removed cross-team ambiguity before integration design started.",
    accent: "tertiary",
    Icon: Flame,
    relatedProjectSlugs: ["credit-risk-underwriting", "api-first-banking-microservices"],
    relatedServiceIds: ["product-design-strategy", "design-systems"],
    relatedPhaseSteps: ["01", "02"],
    relatedExpertiseIds: ["business-product", "engineering-qa"],
  },
  {
    id: "empathy",
    quote: "Empathy is the engine.",
    why: "Design for real context — constraints, emotions, and intent.",
    example:
      "Before defining fulfilment requirements, I walked warehouse-to-dispatch handoffs with operations teams and asked where work breaks under pressure, which exposed overselling paths hidden in spreadsheets.",
    accent: "primary",
    Icon: Heart,
    relatedProjectSlugs: ["distributed-order-fulfillment", "ai-customer-onboarding-agent"],
    relatedServiceIds: ["ai-native-ux", "product-design-strategy"],
    relatedPhaseSteps: ["01", "02"],
    relatedExpertiseIds: ["ux-design", "business-product"],
  },
  {
    id: "evidence-over-opinion",
    quote: "Evidence beats opinion.",
    why: "Make decisions defensible — measure, test, iterate.",
    example:
      "On a real-time analytics programme, we ran a pilot dashboard with live incident workflows, measured decision latency and reversal rate, then used that evidence to prioritize the next roadmap tranche.",
    accent: "secondary",
    Icon: BarChart2,
    relatedProjectSlugs: ["real-time-analytics-dashboard", "fraud-detection-engine"],
    relatedServiceIds: ["product-design-strategy", "ai-native-ux"],
    relatedPhaseSteps: ["04", "06"],
    relatedExpertiseIds: ["data-ai-teams", "engineering-qa"],
  },
  {
    id: "adoption-over-delivery",
    quote: "Adoption over delivery.",
    why: "Ship changes people can actually absorb and use.",
    example:
      "In a cloud compliance rollout, release success was measured by policy adoption and exception closure rate, not by feature count, which kept teams focused on behavior change after launch.",
    accent: "tertiary",
    Icon: Users,
    relatedProjectSlugs: ["cloud-security-compliance-automation", "hr-management-system"],
    relatedServiceIds: ["fractional-leadership"],
    relatedPhaseSteps: ["05", "06"],
    relatedExpertiseIds: ["compliance-vendors", "business-product"],
  },
  {
    id: "ship-learn-adapt",
    quote: "Ship fast. Learn. Adapt.",
    why: "Prefer small bets, tight feedback loops, and course-correction over perfect plans.",
    example:
      "For AI-assisted onboarding, we shipped a constrained prototype by week 2, learned where escalation rules failed, and adapted thresholds before production to avoid scaling brittle decisions.",
    accent: "primary",
    Icon: RefreshCw,
    relatedProjectSlugs: ["high-performance-ecommerce-checkout", "ai-customer-onboarding-agent"],
    relatedServiceIds: ["ai-native-ux"],
    relatedPhaseSteps: ["04", "05"],
    relatedExpertiseIds: ["engineering-qa", "data-ai-teams"],
  },
]
