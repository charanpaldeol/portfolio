import type { WhatIBringCard } from "@/lib/what-i-bring-cards"

export const standaloneArticles: WhatIBringCard[] = [
  {
    slug: "prompt-as-design-artifact",
    badge: "AI & UX",
    badgeClass: "bg-primary-fixed text-on-primary-fixed",
    title: "The Prompt is a Design Artifact",
    body:
      "Most teams treat prompts like throwaway shell commands. In practice, a prompt is interface copy for a probabilistic system: it encodes audience, constraints, success criteria, and tone. When prompts fail, the failure is usually design clarity — not model capability.",
    sections: [
      {
        heading: "Why bad prompts produce bad outputs",
        paragraphs: [
          "When an output feels generic, contradictory, or confidently wrong, the first instinct is to blame the model. In hundreds of delivery cycles, the pattern is more boring: the prompt never defined the decision the model should optimize for, the evidence it should privilege, or the boundaries it must respect.",
          "Ambiguous prompts invite the model to guess your intent. Guessing scales poorly across teammates, across sessions, and across product surfaces. Two designers can type “make it clearer” into the same tool and get wildly different results — not because the model is unstable, but because “clear” is not a specification.",
          "Bad prompts also hide accountability. If the instruction is a paragraph of vibes, nobody can review it, version it, or improve it systematically. You end up re-typing magic spells instead of engineering a repeatable workflow. That is not AI adoption; it is AI roulette.",
          "Treat every high-stakes prompt like a design review artifact: explicit goal, explicit constraints, explicit definition of done. The model will still surprise you sometimes — but it will surprise you less often, and you will be able to iterate with intent instead of superstition.",
        ],
      },
      {
        heading: "The parallel between prompt writing and UX copy",
        paragraphs: [
          "Good UX writing is not cleverness. It is choosing the right words so the user understands what to do next, what will happen when they do it, and what “success” looks like in context. Prompts are the same contract, except the “user” is the model and the “next step” is a structured output.",
          "Microcopy teaches you to remove ambiguity without adding noise. Prompt design teaches you to remove ambiguity without turning the prompt into an unreadable legal document. Both disciplines reward compression: fewer words, higher signal, tighter coupling between intent and affordance.",
          "Voice and tone matter in product copy because they shape trust. They matter in prompts because they shape behavior: whether the model hedges, whether it role-plays, whether it stays inside policy, whether it formats output for downstream parsing. If you would not ship vague UI strings to customers, do not ship vague strings to your agents.",
          "The best teams reuse editorial standards across UI and prompts: define banned phrases, define required structure, define how citations should appear, define how uncertainty should be expressed. Consistency is not aesthetics — it is operational reliability.",
        ],
      },
      {
        heading: "Specificity: designing for the model’s mental model",
        paragraphs: [
          "Models do not “know” your product. They predict text conditioned on what you gave them. Specificity is how you import your world into that context: who the reader is, what they already believe, what constraints are non-negotiable, what inputs are authoritative, and what format downstream systems require.",
          "Specificity is also how you reduce hallucination risk. If you do not attach the source text, the model will invent plausible glue. If you do not define terms, it will choose the most common public meaning — which may not match your internal taxonomy. If you do not specify units, you will get mixed assumptions.",
          "Designers already think in mental models; prompt design forces you to externalize them. Write down the invariants: what must never change, what may change, what trade-offs are acceptable. That list becomes the backbone of your prompt library and the checklist your reviewers use.",
          "A practical test: if a new teammate can execute the task using only the prompt and the attachments, you are close. If they need a verbal sidebar, the prompt is still missing structure. Close that gap before you automate.",
        ],
      },
      {
        heading: "Iteration as core prompt design workflow",
        paragraphs: [
          "Prompts are not “written once.” They are versioned interfaces. The same way you iterate on a flow after usability testing, you iterate on a prompt after inspecting failure modes: missed constraints, wrong audience, brittle formatting, overconfidence, under-confidence, and tool misuse.",
          "Iteration should be disciplined. Capture examples: inputs, expected outputs, actual outputs, and the smallest change that fixes the class of error. Without that loop, teams tweak adjectives and hope. With it, you build a regression set — the closest thing LLM workflows have to automated tests.",
          "Iteration also reveals where the model should not be used. If the prompt requires a novel legal interpretation, or perfect domain knowledge you cannot supply, or sub-second latency with zero tolerance for variance, the design decision is to change the architecture — not to keep prompting harder.",
          "The teams that win treat prompt iteration as a product ritual: weekly review, shared library, owners, and clear promotion rules from experiment to production. That is how you turn prompting from a solo craft into an organizational capability.",
        ],
      },
      {
        heading: "A practical framework: Context → Constraint → Criteria",
        paragraphs: [
          "Context answers: who is involved, what background is true, what artifacts are authoritative, and what the reader needs to walk away believing. Constraints answer: what must not happen, what scope is excluded, what format is required, and what tools or data may be used. Criteria answer: how we judge success, what evidence counts, and how uncertainty should be surfaced.",
          "This three-part scaffold maps cleanly to design critiques. Context is the scenario. Constraints are the requirements and non-goals. Criteria are the acceptance checks. If you cannot fill all three boxes, you are not ready to automate — you are still clarifying the problem.",
          "Use the framework to standardize handoffs. Product brings context, engineering brings constraints, design brings criteria for clarity and UX quality. The prompt becomes the shared contract rather than a private incantation.",
          "If you take one habit from this article, make it this: before you ask for output, ask what decision the output supports. Prompts that serve a decision age well. Prompts that serve vibes become debt.",
        ],
      },
    ],
    relatedPrincipleIds: ["clarity", "evidence-over-opinion", "ship-learn-adapt"],
    relatedServiceIds: ["ai-native-ux"],
    relatedProjectSlugs: ["ai-customer-onboarding-agent", "fraud-detection-engine"],
    relatedPhaseSteps: ["02", "03"],
  },
  {
    slug: "why-design-systems-fail",
    badge: "Systems",
    badgeClass: "bg-secondary-fixed text-on-secondary-fixed",
    title: "Why Design Systems Fail (And What to Do Instead)",
    body:
      "Most design systems die quietly: beautiful libraries in Figma, uneven adoption in code, and endless exceptions in production. The failure mode is rarely “bad tokens.” It is missing ownership, missing parity between design and engineering reality, and missing feedback loops that keep the system honest as the product evolves.",
    sections: [
      {
        heading: "The “Figma graveyard” problem — why adoption fails",
        paragraphs: [
          "A system that lives primarily in design tools is a reference library, not an operating system. Teams will politely browse it, then copy-paste what is convenient and improvise the rest. Without a credible path from component spec to shipped UI, the library becomes aspirational art.",
          "Adoption fails when the system does not reduce real pain. If engineers still rebuild variants by hand, if designers still file one-off tickets for “special cases,” if PMs still bypass tokens to ship on time, the system is competing against incentives — and incentives win.",
          "The graveyard forms when updates are theatrical: quarterly refreshes that break ongoing work, or new guidelines nobody enforces. People learn to ignore announcements. The system becomes optional, then irrelevant.",
          "If you want adoption, measure it the same way you measure product features: time saved, defects prevented, onboarding speed, and time-to-consistency across squads. If you cannot point to those outcomes, you are running a branding exercise — not a platform investment.",
        ],
      },
      {
        heading: "Three failure modes: ownership, codegen parity, feedback loops",
        paragraphs: [
          "No ownership means nobody has authority to say yes, no, or later. Components multiply, naming diverges, and governance becomes a committee that meets monthly and decides nothing. A healthy system has a small accountable team with a mandate to curate, deprecate, and migrate.",
          "Codegen parity failure is the gap between what design promises and what production can represent. If your React primitives cannot express the states in Figma, designers will invent screens engineers cannot faithfully build — or engineers will ship simplified shadows of the spec. The system becomes a source of conflict instead of alignment.",
          "Missing feedback loops means the system does not learn from reality. Incidents, UX debt, accessibility regressions, and performance constraints should flow back into tokens and components. Without that channel, the library drifts from truth and teams revert to local fixes.",
          "Fixing these three issues is less glamorous than a token rename — but it is what separates systems that decorate roadmaps from systems that change how teams ship.",
        ],
      },
      {
        heading: "What a successful system looks like operationally",
        paragraphs: [
          "Operationally, a successful system is boring: migrations are planned, breaking changes are rare and communicated, and the default path is the right path. Engineers reach for primitives because they are faster and safer than rolling custom markup. Designers compose because variants are trustworthy.",
          "Documentation is short, searchable, and tied to examples that run in production — not screenshots from a staging theme nobody uses. Governance is lightweight: clear rules for when to extend the system versus when to ship a local exception — and a path to fold exceptions back if they repeat.",
          "The system also integrates with how decisions are made: design reviews check for pattern reuse; engineering reviews check for accessibility and performance budgets; releases include a changelog teams actually read. That rhythm is the product surrounding the library.",
          "When it works, you stop debating whether to “use the system.” The system is how work happens — because it is the fastest way to be consistent, compliant, and maintainable at the same time.",
        ],
      },
      {
        heading: "The minimum viable design system for a small team",
        paragraphs: [
          "Small teams should optimize for leverage, not completeness. Start with a tight set of primitives: type scale, spacing rhythm, color roles, focus states, and a handful of layout patterns. Add components only when you see the same UI pattern three times with three different implementations.",
          "Invest early in the integration seams: how tokens map to code, how components are tested, and how contributions are reviewed. A fifty-component library with no contribution model will collapse under its own weight faster than a fifteen-component library with a clean pipeline.",
          "Be ruthless about scope. If you are not ready to maintain data visualization, do not pretend you have a charting system. Ship one vetted pattern, document the escape hatch, and expand when the pain is proven — not predicted.",
          "Finally, assign ownership explicitly — even if it is 10% of one senior engineer and 10% of one senior designer. Ambiguous ownership is how systems become everybody’s hobby and nobody’s job.",
        ],
      },
      {
        heading: "Signals that your design system is working",
        paragraphs: [
          "You see fewer one-off CSS files and fewer “special snowflake” components hiding in feature folders. Pull requests reference system tokens and shared primitives without arguments — because the defaults are obviously correct.",
          "Onboarding accelerates. New designers produce credible screens quickly; new engineers ship accessible UI without needing a tribal map of legacy hacks. That speed is a financial signal: less rework, less design QA churn, less tech debt interest.",
          "Quality metrics move in the right direction: accessibility violations cluster and then fall; visual inconsistency bugs stop being a major category; performance budgets are easier to hit because layouts share predictable patterns.",
          "Perhaps the clearest signal is cultural: product, design, and engineering argue about user outcomes — not about whether a button radius is allowed. When the system removes low-level debates, the team’s attention returns to the product — which was the point all along.",
        ],
      },
    ],
    relatedPrincipleIds: ["less-better", "adoption-over-delivery", "clarity"],
    relatedServiceIds: ["design-systems", "fractional-leadership"],
    relatedProjectSlugs: ["landing-page-website"],
    relatedPhaseSteps: ["03", "05"],
  },
  {
    slug: "designing-for-decisions",
    badge: "Leadership",
    badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    title: "Designing for Decisions, Not Screens",
    body:
      "Junior designers ship screens. Senior designers ship clarity: the right person has the right information at the right moment to make a better decision — whether that person is a customer, an operator, or an executive sponsor. The craft is not decoration; it is reducing uncertainty under real constraints.",
    sections: [
      {
        heading: "Dashboard versus decision surface",
        paragraphs: [
          "A dashboard answers “what happened.” A decision surface answers “what should we do next, and why.” Most products accumulate dashboards because metrics are easy to agree on. Decisions are harder — they require judgment, trade-offs, and accountability — so teams hide behind charts.",
          "If your design review ends with “we need another widget,” ask what decision the widget supports. If nobody can name it, you are not designing information architecture — you are designing wallpaper.",
          "Decision surfaces are opinionated. They sequence information so the user can commit: compare options, understand risk, see recommended actions, and understand what evidence would change the recommendation. That sequencing is design work in the deepest sense.",
          "This shift changes how you measure success. Engagement with a screen is a weak proxy. Better signals are decision latency, error rate on actions, reversal rate after commitments, and downstream business outcomes tied to the moment of choice.",
        ],
      },
      {
        heading: "How to map decisions in any product flow",
        paragraphs: [
          "Start by listing decisions explicitly: approvals, purchases, escalations, configuration choices, safety overrides, and prioritization calls. For each decision, capture who decides, what inputs they trust, what would make them pause, and what “good” looks like afterward.",
          "Then map the current reality: where people pull data from, who they Slack for confirmation, what spreadsheets still exist, and what happens when the system is wrong. Those seams are where design can compress workflow — or where you discover the organization is not ready to automate trust.",
          "Prioritize decisions by frequency × consequence. High-frequency, high-consequence decisions deserve the most design investment: clear defaults, strong guardrails, and excellent explanations. Low-consequence decisions should be fast and lightweight — friction is a bug there.",
          "Finally, validate with scenarios, not personas alone. Walk a real incident, a real purchase, a real onboarding path. Decisions emerge under pressure; your map should reflect pressure, not idealized journeys.",
        ],
      },
      {
        heading: "Information architecture as decision architecture",
        paragraphs: [
          "IA is not just grouping nav items. It is structuring uncertainty. The right hierarchy makes the primary decision obvious, pushes advanced detail one deliberate step away, and prevents catastrophic mistakes with progressive disclosure rather than dense walls of fields.",
          "Labels matter because they encode mental models. If your categories match how operators think about risk, they find the right tool fast. If categories match internal org charts, users bounce around the product mirroring your politics — which is unintentional but common.",
          "Search and browse are both decision supports. Search helps when the user knows what they want. Browse helps when they are discovering what is possible. A mature IA supports both without duplicating truth in two incompatible places.",
          "When IA is working, users describe the product as “easy to reason about.” That phrase is a compliment to decision design: the product matches how humans commit under incomplete information.",
        ],
      },
      {
        heading: "Stakeholder decisions versus user decisions",
        paragraphs: [
          "User-facing decisions get most of the design attention — checkout, settings, consent. Stakeholder decisions quietly determine whether good UX ever ships: prioritization, budget, compliance posture, staffing, and timeline. Ignoring stakeholder decisions is how teams build elegant interfaces on top of shaky commitments.",
          "Design artifacts for stakeholders should reduce ambiguity in the same way UI reduces ambiguity: explicit options, trade-offs, costs, and recommended paths. A roadmap slide without trade-offs is not alignment — it is theater.",
          "Facilitation is part of the craft. Workshops, prototypes, and critique formats are tools for helping stakeholders make decisions with shared definitions of success. The designer who can run that room responsibly becomes a leader — not because of title, but because they make expensive indecision visible.",
          "Healthy teams treat both classes of decisions as design problems. The user decides whether to trust the product; the stakeholder decides whether to fund the trust-building work. Design connects them with evidence instead of vibes.",
        ],
      },
      {
        heading: "Auditing existing designs through a decisions lens",
        paragraphs: [
          "Pick a live flow and ask: at each step, what decision is being made — and what information is missing for a confident decision? Missing information shows up as hesitation, backtracking, support tickets, and “workarounds” that become unofficial product features.",
          "Look for decision debt: places where humans patch the system with meetings, spreadsheets, or expert gatekeepers. Those patches are signals that the digital experience did not carry enough authority, explanation, or control.",
          "Score the flow on decision clarity: can a first-time user predict outcomes? can a stressed user recover from errors? can an expert move fast without losing safety? The scorecard is simple, but it changes prioritization immediately — away from cosmetic polish and toward leverage.",
          "If you adopt one habit, make it this: in critiques, replace “I don’t like it” with “what decision is harder because of this?” That question trains the room to think like owners — and it trains you to design like one.",
        ],
      },
    ],
    relatedPrincipleIds: ["clarity", "empathy", "evidence-over-opinion"],
    relatedServiceIds: ["product-design-strategy", "ai-native-ux"],
    relatedProjectSlugs: [
      "real-time-analytics-dashboard",
      "compliance-risk-monitoring",
      "ai-customer-onboarding-agent",
    ],
    relatedPhaseSteps: ["02", "03"],
  },
]
