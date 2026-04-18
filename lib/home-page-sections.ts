import { deliveryPhaseTitles } from "@/lib/delivery-taxonomy"

/**
 * Homepage-only anchors and labels — keeps jump nav and teasers in sync.
 */

export const homeJumpNavLinks = [
  { href: "#page-top", label: "Start" },
  { href: "#what-i-bring", label: "What I bring" },
  { href: "#how-i-think", label: "Principles" },
  { href: "#how-i-work", label: "Execution" },
  { href: "#proof-of-work", label: "Outcomes" },
  { href: "#writing", label: "Insights" },
  { href: "#contact-cta", label: "Contact" },
] as const

/** Phase titles — same order as the pipeline on /how-i-work */
export const homeDeliveryPhaseTitles = deliveryPhaseTitles

/** Pulled from components/home/HowIWork.tsx (blockquote) */
export const homeHowIWorkPullQuote =
  "I stay in the room until the outcome is real" as const

/** Pulled from app/how-i-work/page.tsx EditorialPageHero description */
export const homeHowIWorkIntro =
  "End-to-end ownership, measured outcomes, and clean handoffs only when the value is real." as const

/** Same string as Work → How I work in config/navigation.tsx (avoid importing that module on the home page). */
export const homeHowIWorkNavDescription =
  "See the full delivery model" as const
