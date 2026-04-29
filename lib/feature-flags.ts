function normalizeFlagEnvKey(flag: string) {
  return `FF_${flag.replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase()}`
}

function parseFlagValue(value: string | undefined) {
  if (!value) return false
  const v = value.trim().toLowerCase()
  return v === "1" || v === "true" || v === "yes" || v === "on"
}

/**
 * Server-side feature flag.
 *
 * Usage:
 *   if (featureFlag("new-testimonials")) { ... }
 *
 * Env:
 *   FF_NEW_TESTIMONIALS=1
 */
export function featureFlag(flag: string) {
  const key = normalizeFlagEnvKey(flag)
  return parseFlagValue(process.env[key])
}

