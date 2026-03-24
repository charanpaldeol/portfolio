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
    sections: [
      {
        heading: "Workflows, constraints, and the real brief",
        paragraphs: [
          "Most initiatives arrive with a preferred solution already implied. The work starts by mapping how customers and teams actually operate, naming constraints that never made it into the slide deck, and testing whether the stated problem is the one worth solving.",
          "Stakeholder interviews, process mapping, gap analysis, and requirements workshops turn opinion into a shared picture of the current state. That picture is what makes it possible to challenge the brief without derailing alignment.",
        ],
      },
      {
        heading: "MVP scope and measurable success",
        paragraphs: [
          "Before design or build, MVP scope should be explicit: what is in, what is out, and what would falsify the approach. Success criteria need to be measurable so tradeoffs later are anchored to outcomes, not politics.",
          "Where the problem space is fuzzy, this phase is what replaces endless debate with a clear problem statement, a bounded first release, and agreement on how you will know it worked.",
        ],
      },
    ],
  },
  {
    slug: "solution-design",
    badge: "Design",
    badgeClass: "bg-[#EEEDFE] text-[#534AB7]",
    title: "Solution Design",
    body: "Build vs buy. Vendor selection. Architecture options. Author requirements documentation, prioritise the engineering backlog, manage scope against success criteria as requirements evolve. Every decision documented and defensible at any level — technical leads, procurement, C-suite.",
    sections: [
      {
        heading: "Build vs buy and architecture options",
        paragraphs: [
          "Solution design is where strategy meets constraints: whether to build, buy, or combine both; which vendors fit your risk profile; and which architecture patterns match volume, latency, security, and cost realities.",
          "Options are compared on a transparent basis so technical leads, procurement, and the C-suite are looking at the same facts, not parallel narratives.",
        ],
      },
      {
        heading: "Requirements, backlog, and evolving scope",
        paragraphs: [
          "Authoring requirements documentation and prioritising the engineering backlog keeps intent aligned with capacity. As learning lands, requirements change — the discipline is to manage scope against the success criteria you agreed up front, not against whoever argued last.",
          "Every major decision stays documented: context, alternatives considered, and rationale. That record is what makes audits, handovers, and late-stage questions survivable.",
        ],
      },
    ],
  },
  {
    slug: "ai-native-delivery",
    badge: "Delivery",
    badgeClass: "bg-[#E1F5EE] text-[#085041]",
    title: "AI-Native Delivery",
    body: "Full SDLC ownership — PMP certified. Requirements through deployment. Timelines, risk, budget, resources. Familiar with AI agent frameworks, tool use patterns, and orchestration architectures. Agile or PRINCE2 depending on what the engagement needs. Experienced in regulated industries — finance, healthcare, retail.",
    sections: [
      {
        heading: "Full SDLC ownership",
        paragraphs: [
          "Delivery spans requirements through deployment: timelines, risk, budget, and resources under clear ownership. PMP certification backs a structured approach to planning, dependencies, and stakeholder communication while the team executes.",
          "The goal is predictable progress without hiding uncertainty — risks named early, decisions logged, and scope changes visible to everyone who depends on the outcome.",
        ],
      },
      {
        heading: "AI-native execution context",
        paragraphs: [
          "AI-native delivery assumes familiarity with agent frameworks, tool-use patterns, and orchestration architectures, so integration decisions are made with eyes open on reliability, observability, and operational cost.",
          "Methodology follows the engagement: Agile where iteration and feedback dominate, PRINCE2 where governance and stage gates are non-negotiable. Regulated industries — finance, healthcare, retail — add compliance, data handling, and audit trails as first-class constraints, not afterthoughts.",
        ],
      },
    ],
  },
  {
    slug: "engineering-depth",
    badge: "Engineering",
    badgeClass: "bg-[#FAEEDA] text-[#854F0B]",
    title: "Engineering Depth",
    body: "Leads architecture discussions with engineering stakeholders. Evaluates technical trade-offs, pressure-tests technical decisions — won't write production code, but owns the technical direction. Layered architecture, where logic lives, backend vs database, DevOps pipelines, API contracts. Comfortable in a technical design session in the morning and an executive briefing in the afternoon.",
    sections: [
      {
        heading: "Technical direction without owning the keyboard",
        paragraphs: [
          "This role sits in architecture discussions with engineering stakeholders: clarifying trade-offs, pressure-testing assumptions, and making sure decisions survive contact with production reality. Production code stays with engineers; technical direction and coherence stay explicitly owned.",
          "Topics include layered architecture, where business logic belongs, how responsibilities split between backend and database, how DevOps pipelines need to behave, and how API contracts keep consumers and providers aligned.",
        ],
      },
      {
        heading: "One narrative from design session to executive briefing",
        paragraphs: [
          "The same themes that matter in a technical design session — boundaries, failure modes, cost of change — are translated for executive briefings without dumbing down or inventing false certainty.",
          "That continuity reduces the classic gap between what leadership approved and what engineering was asked to build.",
        ],
      },
    ],
  },
  {
    slug: "value-realization",
    badge: "Adoption",
    badgeClass: "bg-[#EEEDFE] text-[#534AB7]",
    title: "Value Realization",
    body: "Define impact hypotheses at the start. Set baselines and KPIs. Run pre and post deployment measurement, report outcomes to executive sponsors. Structured change management — ADKAR, Prosci, training design, communication planning. Adoption tracked at 30, 60, 90 days post go-live. The engagement doesn't end at deployment — it ends when the numbers move.",
    sections: [
      {
        heading: "Hypotheses, baselines, and evidence",
        paragraphs: [
          "Value realization starts by defining impact hypotheses and the baselines that will prove or disprove them. KPIs are chosen so pre- and post-deployment measurement is credible, not cosmetic.",
          "Results are reported to executive sponsors in the same language as the original commitments — what changed, by how much, and what still needs attention.",
        ],
      },
      {
        heading: "Change management and adoption over time",
        paragraphs: [
          "Structured change management — ADKAR, Prosci, training design, communication planning — connects the launch to how people actually work. Adoption is tracked at 30, 60, and 90 days post go-live so early enthusiasm does not mask a slow return to old habits.",
          "The engagement does not end at deployment; it ends when the numbers move and the new way of working holds without heroic effort.",
        ],
      },
    ],
  },
]
