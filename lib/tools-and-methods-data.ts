/**
 * Tools & Methods data — single source of truth.
 * Organised by delivery phase to mirror the HowIWork pipeline.
 * Phase names must stay in sync with homeDeliveryPhaseTitles in home-page-sections.ts.
 */

export interface ToolGroup {
  /** Matches homeDeliveryPhaseTitles: Discover | Define | Design | Deliver | Adopt | Value */
  phase: string
  /** One sentence: when/what context for this phase's tools */
  description: string
  chips: string[]
  /** Subset of chips to visually emphasise */
  bold: string[]
}

export const toolGroups: ToolGroup[] = [
  {
    phase: "Discover",
    description:
      "Stakeholder interviews, process mapping, and problem framing before any solution is agreed.",
    chips: [
      "BPMN",
      "User story mapping",
      "Process mapping",
      "Stakeholder mapping",
      "Requirements workshops",
      "Gap analysis",
      "Miro",
      "Figma",
      "LLM-assisted research",
    ],
    bold: ["BPMN", "User story mapping", "Process mapping"],
  },
  {
    phase: "Define",
    description:
      "Translating discovery into structured requirements, business cases, and acceptance criteria.",
    chips: [
      "MoSCoW prioritisation",
      "Business requirements (BRD)",
      "User stories",
      "Acceptance criteria",
      "Business case writing",
      "Confluence",
      "Jira",
      "Power BI",
    ],
    bold: ["MoSCoW prioritisation", "Business requirements (BRD)"],
  },
  {
    phase: "Design",
    description:
      "Architecture, data models, API contracts, and integration specs — with AI capability designed in from the start.",
    chips: [
      "Solution architecture",
      "API design",
      "Data modelling",
      "Integration specs",
      "TypeScript",
      "React / Next.js",
      "Node.js",
      "PostgreSQL",
      "AWS",
      "Docker",
      "Figma",
      "OpenAI API",
      "Claude API",
      "LangChain",
    ],
    bold: ["Solution architecture", "API design", "Claude API"],
  },
  {
    phase: "Deliver",
    description:
      "Agile execution, backlog ownership, UAT, and AI agent workflows that accelerate the delivery loop.",
    chips: [
      "Agile / Scrum",
      "PRINCE2",
      "Backlog management",
      "UAT",
      "Defect triage",
      "AI agent workflows",
      "LLM orchestration",
      "Vercel",
      "GitHub Actions",
      "Cypress",
      "Playwright",
    ],
    bold: ["Agile / Scrum", "AI agent workflows", "LLM orchestration"],
  },
  {
    phase: "Adopt",
    description:
      "Training, communications, and change management that turn deployed capability into used capability.",
    chips: [
      "ADKAR",
      "Prosci",
      "Training design",
      "Communication planning",
      "Stakeholder engagement",
      "ServiceNow",
      "Salesforce",
      "Rollout planning",
    ],
    bold: ["ADKAR", "Training design"],
  },
  {
    phase: "Value",
    description:
      "KPIs tracked, outcomes evidenced, and the platform positioned for the next investment decision.",
    chips: [
      "KPI definition",
      "Value architecture",
      "OKR alignment",
      "Adoption metrics",
      "Power BI",
      "Executive reporting",
      "Business case retrospective",
    ],
    bold: ["KPI definition", "Value architecture"],
  },
]
