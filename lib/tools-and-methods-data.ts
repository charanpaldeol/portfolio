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
  /** Step IDs from the canonical six-phase operating model ("01"–"06"). */
  relatedPhaseSteps?: readonly string[]
  /** Project slugs that are strong examples of this phase in practice. */
  relatedProjectSlugs?: readonly string[]
}

export const toolGroups = [
  {
    phase: "Discover",
    description:
      "Stakeholder interviews, process mapping, and problem framing before any solution is agreed — including supply chain and fulfilment discovery (warehouse-to-dispatch workflows, inventory truth gaps, and logistics partner handoffs) when programmes depend on physical operations.",
    chips: [
      "BPMN",
      "User story mapping",
      "Process mapping",
      "Stakeholder mapping",
      "Requirements workshops",
      "Gap analysis",
      "Supply Chain Visibility & Fulfilment",
      "Miro",
      "Figma",
      "LLM-assisted research",
    ],
    bold: ["BPMN", "User story mapping", "Process mapping"],
    relatedPhaseSteps: ["01"],
    relatedProjectSlugs: ["distributed-order-fulfillment", "kyc-aml-automation"],
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
    relatedPhaseSteps: ["02"],
    relatedProjectSlugs: ["credit-risk-underwriting", "payment-settlement-platform"],
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
    relatedPhaseSteps: ["03"],
    relatedProjectSlugs: ["api-first-banking-microservices", "event-streaming-pipeline"],
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
    relatedPhaseSteps: ["04"],
    relatedProjectSlugs: ["ai-customer-onboarding-agent", "high-performance-ecommerce-checkout"],
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
    relatedPhaseSteps: ["05"],
    relatedProjectSlugs: ["hr-management-system", "cloud-security-compliance-automation"],
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
    relatedPhaseSteps: ["06"],
    relatedProjectSlugs: ["compliance-risk-monitoring", "distributed-order-fulfillment"],
  },
] as const satisfies readonly ToolGroup[]
