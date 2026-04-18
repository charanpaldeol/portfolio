export type UxMetricDefinition = {
  id: string
  label: string
  baseline: string
  target: string
}

/**
 * Baseline metrics to compare before/after UX updates.
 * Values are intentionally string-based so they can store "unknown" until instrumented.
 */
export const UX_BASELINE_METRICS: readonly UxMetricDefinition[] = [
  {
    id: "home_to_services_ctr",
    label: "Home -> services click-through rate",
    baseline: "unknown",
    target: ">= +20% from baseline",
  },
  {
    id: "home_to_contact_ctr",
    label: "Home -> contact click-through rate",
    baseline: "unknown",
    target: ">= +15% from baseline",
  },
  {
    id: "contact_form_completion_rate",
    label: "Contact form completion rate",
    baseline: "unknown",
    target: ">= +10% from baseline",
  },
  {
    id: "services_to_case_study_ctr",
    label: "Services -> case study click-through rate",
    baseline: "unknown",
    target: ">= +20% from baseline",
  },
  {
    id: "depth_to_how_i_work",
    label: "Home section depth to How I deliver",
    baseline: "unknown",
    target: ">= +15% from baseline",
  },
] as const

export function withAttribution(path: string, params: Record<string, string>): string {
  const url = new URL(path, "https://cpdeol.com")
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return `${url.pathname}${url.search}`
}
