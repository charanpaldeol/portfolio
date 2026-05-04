/**
 * Resolve reclaim thresholds for factory-reclaim.
 * Guards against FACTORY_STALE_RUN_MS=0 or empty string (immediate stale reclaim).
 */

export function resolveStaleThresholdMs(args: { envValue: string | undefined; fallbackMs: number; minMs: number }): number {
  const t = (args.envValue ?? "").trim()
  if (!t) return Math.max(args.minMs, args.fallbackMs)
  const n = Number(t)
  if (!Number.isFinite(n) || n <= 0) return Math.max(args.minMs, args.fallbackMs)
  return Math.max(args.minMs, n)
}
