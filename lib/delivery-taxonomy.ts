export type DeliveryPhaseId = "discover" | "define" | "design" | "deliver" | "adopt" | "value"

export type DeliveryPhaseDefinition = {
  id: DeliveryPhaseId
  step: string
  label: string
  shortDefinition: string
}

export const deliveryPhases: readonly DeliveryPhaseDefinition[] = [
  {
    id: "discover",
    step: "01",
    label: "Discover",
    shortDefinition: "Understand users, constraints, and the problem worth solving.",
  },
  {
    id: "define",
    step: "02",
    label: "Define",
    shortDefinition: "Align goals, scope, and success criteria before building.",
  },
  {
    id: "design",
    step: "03",
    label: "Design",
    shortDefinition: "Shape the solution across experience, architecture, and decisions.",
  },
  {
    id: "deliver",
    step: "04",
    label: "Deliver",
    shortDefinition: "Ship reliable increments with fast feedback and clear ownership.",
  },
  {
    id: "adopt",
    step: "05",
    label: "Adopt",
    shortDefinition: "Enable teams to change behavior and use the solution well.",
  },
  {
    id: "value",
    step: "06",
    label: "Value",
    shortDefinition: "Measure outcomes and compound gains through iteration.",
  },
] as const

export const deliveryPhasesById: Readonly<Record<DeliveryPhaseId, DeliveryPhaseDefinition>> =
  Object.fromEntries(deliveryPhases.map((phase) => [phase.id, phase])) as Record<
    DeliveryPhaseId,
    DeliveryPhaseDefinition
  >

export const deliveryPhaseTitles = deliveryPhases.map((phase) => phase.label)
