import { deliveryPhasesById } from "@/lib/delivery-taxonomy"

export type WorkflowPhase = {
  id: string
  title: string
  description: string
  howAIHelps: string
  tools: string[]
  humanPart: string
  /** Step IDs from the canonical delivery model in `how-i-work-data.ts` ("01"–"06"). */
  relatedPhaseSteps?: readonly string[]
  /** Project slugs that demonstrate this workflow phase in practice. */
  relatedProjectSlugs?: readonly string[]
}

export type AIPhilosophyPoint = {
  id: string
  title: string
  body: string
}

export const workflowPhases: WorkflowPhase[] = [
  {
    id: "discovery-research",
    title: deliveryPhasesById.discover.label,
    description:
      "Before pixels or PRDs, I stay close to the problem: interviews, desk research, and the messy signals that do not yet form a story. The goal is not more transcripts — it is a defensible read on what people need and what the business can credibly ship.",
    howAIHelps:
      "I use models to cluster themes across long interview sets, draft follow-up question banks, and pressure-test whether my synthesis is overfitting to a loud anecdote. That frees time for listening again with fresh ears instead of drowning in note-taking.",
    tools: ["Claude", "Granola", "Notion AI", "Otter.ai"],
    humanPart:
      "Choosing who to talk to, what to ask, and which tensions matter is judgment work. AI cannot replace the trust you earn in a room or the instinct to dig when an answer feels too tidy.",
    relatedPhaseSteps: ["01"],
    relatedProjectSlugs: ["distributed-order-fulfillment", "fraud-detection-engine"],
  },
  {
    id: "problem-framing",
    title: deliveryPhasesById.define.label,
    description:
      "Good delivery starts with a problem statement everyone can argue with productively. I treat framing as a design activity: boundaries, assumptions, success signals, and the risks we are willing to name out loud.",
    howAIHelps:
      "I generate variants of the problem statement, red-team assumptions, and draft decision memos in different tones — crisp exec summary versus engineering detail. The point is speed through alternatives, not outsourcing the stance I take in the meeting.",
    tools: ["Claude", "ChatGPT", "Cursor"],
    humanPart:
      "Stakeholder alignment and picking the hypothesis portfolio are human calls. AI helps me think in parallel; it does not decide what is worth funding.",
    relatedPhaseSteps: ["02"],
    relatedProjectSlugs: ["kyc-aml-automation", "compliance-risk-monitoring"],
  },
  {
    id: "ideation-concept",
    title: deliveryPhasesById.design.label,
    description:
      "This is where exploration should feel abundant: flows, narratives, and rough IA before anything is precious. I want enough divergence to surprise the team, then a disciplined path to convergence.",
    howAIHelps:
      "I use AI to sketch narrative arcs, list edge cases, and compare mental models across personas. In Figma, AI-assisted layout exploration speeds early directions — always as disposable scaffolding, never as the final visual language.",
    tools: ["Claude", "Figma", "Figma AI", "ChatGPT"],
    humanPart:
      "Taste, brand coherence, and the courage to kill weak directions stay with the designer. AI broadens the menu; I still own the edit.",
    relatedPhaseSteps: ["03"],
    relatedProjectSlugs: ["landing-page-website", "ai-customer-onboarding-agent"],
  },
  {
    id: "prototyping-iteration",
    title: deliveryPhasesById.deliver.label,
    description:
      "I like prototypes that earn their keep: clickable enough to learn, thin enough to throw away. When the risk is interaction or narrative, I bias to something people can react to — not a slide that pretends to be a product.",
    howAIHelps:
      "Cursor is where AI shows up hardest for me: shipping throwaway UI in React, wiring stub data, and iterating with designers and PMs in the same artifact. The loop tightens from days to hours, with guardrails on scope so we do not prototype fiction.",
    tools: ["Cursor", "Claude", "GitHub Copilot", "Figma"],
    humanPart:
      "Defining what we are trying to learn from each build — and when to stop coding and go talk to a human — is still the craft. Speed without a learning plan is just busywork.",
    relatedPhaseSteps: ["04"],
    relatedProjectSlugs: ["ai-customer-onboarding-agent", "high-performance-ecommerce-checkout"],
  },
  {
    id: "adoption-enablement",
    title: deliveryPhasesById.adopt.label,
    description:
      "Adoption is where intent becomes behavior. I treat enablement as product work: clear rollout paths, role-based messaging, and support plans that make the change usable under real operating pressure.",
    howAIHelps:
      "I use AI to draft training outlines, implementation runbooks, and support macros tailored to each audience, then sharpen manually for accountability and tone. It is strong at consistency across many touchpoints once decisions are set.",
    tools: ["Claude", "Cursor", "Notion AI", "Linear"],
    humanPart:
      "Change leadership, stakeholder trust, and what we explicitly ask teams to do differently remain human responsibilities. AI can structure the materials, but not carry the commitment.",
    relatedPhaseSteps: ["05"],
    relatedProjectSlugs: ["cloud-security-compliance-automation", "hr-management-system"],
  },
  {
    id: "value-realization",
    title: deliveryPhasesById.value.label,
    description:
      "Value is where delivery earns the next investment. I focus on outcome evidence: what changed, what did not, and where we should compound gains in the next cycle.",
    howAIHelps:
      "I use models to summarize outcome trends, draft executive readouts, and generate follow-on experiment options from KPI movement. AI accelerates synthesis so we can spend more time deciding the next bet.",
    tools: ["Claude", "Notion AI", "Linear", "Looker Studio"],
    humanPart:
      "Interpreting tradeoffs, choosing what to fund next, and owning the narrative with leadership are human calls. Metrics inform judgment; they do not replace it.",
    relatedPhaseSteps: ["06"],
    relatedProjectSlugs: ["cloud-security-compliance-automation", "compliance-risk-monitoring"],
  },
]

export const philosophyPoints: AIPhilosophyPoint[] = [
  {
    id: "loop-vs-direction",
    title: "Accelerate the loop; own the direction",
    body:
      "AI-native delivery is a different operating model: shorter feedback loops, stricter risk controls, and measurable value at each boundary. I use AI to compress time inside a direction I have already argued for — not to skip the argument.",
  },
  {
    id: "prompt-as-artifact",
    title: "The prompt is a design artifact",
    body:
      "How you ask shapes what you get. I refine prompts the way I refine flows: constraints, examples, success criteria, and explicit failure modes. Reusable prompts become shared team leverage, not private magic spells.",
  },
  {
    id: "native-not-dependent",
    title: "AI-native is not AI-dependent",
    body:
      "There are moments — ethics calls, brand-sensitive visuals, fragile stakeholder dynamics — where the best tool is silence and a whiteboard. Knowing when not to reach for a model is as important as knowing when to.",
  },
]
