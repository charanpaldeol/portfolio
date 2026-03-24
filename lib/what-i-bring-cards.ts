export type WhatIBringArticleSection = {
  heading: string
  paragraphs: string[]
}

export type WhatIBringCard = {
  slug: string
  badge: string
  badgeClass: string
  title: string
  body: string
  sections: WhatIBringArticleSection[]
}

export const whatIBringCards: WhatIBringCard[] = [
  {
    slug: "problem-framing",
    badge: "Discovery",
    badgeClass: "bg-[#EEEDFE] text-[#534AB7]",
    title: "Problem Framing",
    body: "Map customer workflows, surface constraints, challenge the brief before accepting it. Stakeholder interviews, process mapping, gap analysis, requirements workshops. Define MVP scope and make success measurable before any solution is designed. Brings structure where none exists.",
    sections: [],
  },
  {
    slug: "solution-design",
    badge: "Design",
    badgeClass: "bg-[#EEEDFE] text-[#534AB7]",
    title: "Solution Design",
    body: "Build vs buy. Vendor selection. Architecture options. Author requirements documentation, prioritise the engineering backlog, manage scope against success criteria as requirements evolve. Every decision documented and defensible at any level — technical leads, procurement, C-suite.",
    sections: [],
  },
  {
    slug: "ai-native-delivery",
    badge: "Delivery",
    badgeClass: "bg-[#E1F5EE] text-[#085041]",
    title: "AI-Native Delivery",
    body: "Full SDLC ownership — PMP certified. Requirements through deployment. Timelines, risk, budget, resources. Familiar with AI agent frameworks, tool use patterns, and orchestration architectures. Agile or PRINCE2 depending on what the engagement needs. Experienced in regulated industries — finance, healthcare, retail.",
    sections: [],
  },
  {
    slug: "engineering-depth",
    badge: "Engineering",
    badgeClass: "bg-[#FAEEDA] text-[#854F0B]",
    title: "Engineering Depth",
    body: "Leads architecture discussions with engineering stakeholders. Evaluates technical trade-offs, pressure-tests technical decisions — won't write production code, but owns the technical direction. Layered architecture, where logic lives, backend vs database, DevOps pipelines, API contracts. Comfortable in a technical design session in the morning and an executive briefing in the afternoon.",
    sections: [],
  },
  {
    slug: "value-realization",
    badge: "Adoption",
    badgeClass: "bg-[#EEEDFE] text-[#534AB7]",
    title: "Value Realization",
    body: "Define impact hypotheses at the start. Set baselines and KPIs. Run pre and post deployment measurement, report outcomes to executive sponsors. Structured change management — ADKAR, Prosci, training design, communication planning. Adoption tracked at 30, 60, 90 days post go-live. The engagement doesn't end at deployment — it ends when the numbers move.",
    sections: [],
  },
]

export function getWhatIBringCard(slug: string): WhatIBringCard | undefined {
  return whatIBringCards.find((c) => c.slug === slug)
}

export function requireWhatIBringCard(slug: string): WhatIBringCard {
  const card = getWhatIBringCard(slug)
  if (!card) {
    throw new Error(`Missing blog card: ${slug}`)
  }
  return card
}
