export type WorkflowPhase = {
  id: string
  title: string
  description: string
  howAIHelps: string
  tools: string[]
  humanPart: string
}

export type AIPhilosophyPoint = {
  id: string
  title: string
  body: string
}

export const workflowPhases: WorkflowPhase[] = [
  {
    id: "discovery-research",
    title: "Discovery & research",
    description:
      "Before pixels or PRDs, I stay close to the problem: interviews, desk research, and the messy signals that do not yet form a story. The goal is not more transcripts — it is a defensible read on what people need and what the business can credibly ship.",
    howAIHelps:
      "I use models to cluster themes across long interview sets, draft follow-up question banks, and pressure-test whether my synthesis is overfitting to a loud anecdote. That frees time for listening again with fresh ears instead of drowning in note-taking.",
    tools: ["Claude", "Granola", "Notion AI", "Otter.ai"],
    humanPart:
      "Choosing who to talk to, what to ask, and which tensions matter is judgment work. AI cannot replace the trust you earn in a room or the instinct to dig when an answer feels too tidy.",
  },
  {
    id: "problem-framing",
    title: "Problem framing",
    description:
      "Good delivery starts with a problem statement everyone can argue with productively. I treat framing as a design activity: boundaries, assumptions, success signals, and the risks we are willing to name out loud.",
    howAIHelps:
      "I generate variants of the problem statement, red-team assumptions, and draft decision memos in different tones — crisp exec summary versus engineering detail. The point is speed through alternatives, not outsourcing the stance I take in the meeting.",
    tools: ["Claude", "ChatGPT", "Cursor"],
    humanPart:
      "Stakeholder alignment and picking the hypothesis portfolio are human calls. AI helps me think in parallel; it does not decide what is worth funding.",
  },
  {
    id: "ideation-concept",
    title: "Ideation & concept design",
    description:
      "This is where exploration should feel abundant: flows, narratives, and rough IA before anything is precious. I want enough divergence to surprise the team, then a disciplined path to convergence.",
    howAIHelps:
      "I use AI to sketch narrative arcs, list edge cases, and compare mental models across personas. In Figma, AI-assisted layout exploration speeds early directions — always as disposable scaffolding, never as the final visual language.",
    tools: ["Claude", "Figma", "Figma AI", "ChatGPT"],
    humanPart:
      "Taste, brand coherence, and the courage to kill weak directions stay with the designer. AI broadens the menu; I still own the edit.",
  },
  {
    id: "prototyping-iteration",
    title: "Prototyping & iteration",
    description:
      "I like prototypes that earn their keep: clickable enough to learn, thin enough to throw away. When the risk is interaction or narrative, I bias to something people can react to — not a slide that pretends to be a product.",
    howAIHelps:
      "Cursor is where AI shows up hardest for me: shipping throwaway UI in React, wiring stub data, and iterating with designers and PMs in the same artifact. The loop tightens from days to hours, with guardrails on scope so we do not prototype fiction.",
    tools: ["Cursor", "Claude", "GitHub Copilot", "Figma"],
    humanPart:
      "Defining what we are trying to learn from each build — and when to stop coding and go talk to a human — is still the craft. Speed without a learning plan is just busywork.",
  },
  {
    id: "handoff-documentation",
    title: "Handoff & documentation",
    description:
      "Handoff is where ambiguity becomes cost. I write for the team that has to live with the decision next quarter, not just the sprint review tomorrow.",
    howAIHelps:
      "I draft specs, acceptance criteria, and component notes from structured notes and Figma context, then tighten manually for tone and accountability. AI is excellent at consistency and completeness checks once the intent is clear.",
    tools: ["Claude", "Cursor", "Notion AI", "Linear"],
    humanPart:
      "Ownership of tradeoffs, risk language, and what we are explicitly not solving stays human. Documentation is a promise — AI helps draft it, but my signature is on the outcome.",
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
