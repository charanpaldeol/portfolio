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
}

export const HOW_I_THINK_PRINCIPLES: HowIThinkPrinciple[] = [
  {
    id: "less-better",
    quote: "Less, but better.",
    underline: true,
    why: "Remove distraction. Keep only what moves the outcome.",
    example: "Cut the 40-slide deck to 8 slides. Scope the MVP to 3 flows.",
    accent: "primary",
    Icon: Filter,
  },
  {
    id: "clarity",
    quote: "Clarity above all.",
    why: "Make the next step obvious, the system legible, and the trade-offs explicit.",
    example: "One sentence on what we decide today. One owner. One deadline.",
    accent: "tertiary",
    Icon: Flame,
  },
  {
    id: "empathy",
    quote: "Empathy is the engine.",
    why: "Design for real context — constraints, emotions, and intent.",
    example: "Walk the process before writing requirements. Ask 'what makes this hard?'",
    accent: "primary",
    Icon: Heart,
  },
  {
    id: "evidence-over-opinion",
    quote: "Evidence beats opinion.",
    why: "Make decisions defensible — measure, test, iterate.",
    example: "Run the pilot. Pull the data. Then argue the roadmap.",
    accent: "secondary",
    Icon: BarChart2,
  },
  {
    id: "adoption-over-delivery",
    quote: "Adoption over delivery.",
    why: "Ship changes people can actually absorb and use.",
    example: "A feature no one uses is technical debt wearing a ribbon.",
    accent: "tertiary",
    Icon: Users,
  },
  {
    id: "ship-learn-adapt",
    quote: "Ship fast. Learn. Adapt.",
    why: "Prefer small bets, tight feedback loops, and course-correction over perfect plans.",
    example: "Put something real in users' hands in week 2, not month 6.",
    accent: "primary",
    Icon: RefreshCw,
  },
]
