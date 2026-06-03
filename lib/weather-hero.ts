// Purpose: Hero panel helpers — night inference when is_day is unknown.

function isoMinutes(isoLocal: string): number | null {
  const match = isoLocal.match(/T(\d{2}):(\d{2})/)
  if (!match) return null
  return Number(match[1]) * 60 + Number(match[2])
}

/** Night styling when API is_day is missing — uses observed time vs sunrise/sunset. */
export function inferHeroNight(
  isDay: boolean | null,
  observedAt: string | null | undefined,
  sunrise: string | null | undefined,
  sunset: string | null | undefined
): boolean {
  if (isDay === false) return true
  if (isDay === true) return false

  const now = observedAt ? isoMinutes(observedAt) : null
  const rise = sunrise ? isoMinutes(sunrise) : null
  const set = sunset ? isoMinutes(sunset) : null
  if (now == null || rise == null || set == null) return false

  return now < rise || now >= set
}

/** Coarse weather family used to tint the hero backdrop. */
export type HeroConditionKind = "clear" | "cloud" | "rain" | "snow" | "fog" | "storm"

/** Classify a human condition label into a backdrop family (order matters: most severe first). */
export function classifyHeroCondition(label: string | null | undefined): HeroConditionKind {
  const text = (label ?? "").toLowerCase()
  if (!text) return "cloud"
  if (/(thunder|storm|lightning|squall)/.test(text)) return "storm"
  if (/(snow|sleet|blizzard|flurr|ice|icy|freezing)/.test(text)) return "snow"
  if (/(rain|drizzle|shower|precip)/.test(text)) return "rain"
  if (/(fog|mist|haze|smoke)/.test(text)) return "fog"
  if (/(cloud|overcast)/.test(text)) return "cloud"
  return "clear"
}
