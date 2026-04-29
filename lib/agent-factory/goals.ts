import { z } from "zod"

export const FactoryMetricsSchema = z.object({
  version: z.literal(1),
  targets: z.object({
    arr_usd: z.number().int().min(1),
  }),
  current: z.object({
    mrr_usd: z.number().min(0),
    arr_usd: z.number().min(0),
    paid_customers: z.number().int().min(0),
    active_subscriptions: z.number().int().min(0),
  }),
  updated_at: z.string(),
  notes: z.string().optional(),
})

export type FactoryMetrics = z.infer<typeof FactoryMetricsSchema>

export function computeGoalProgress(metrics: FactoryMetrics) {
  const target = metrics.targets.arr_usd
  const current = metrics.current.arr_usd
  const ratio = target > 0 ? Math.max(0, Math.min(1, current / target)) : 0
  return { target_arr_usd: target, current_arr_usd: current, ratio }
}

