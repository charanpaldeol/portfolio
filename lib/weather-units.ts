// Purpose: Celsius/Fahrenheit helpers for weather display and URL/localStorage preference.

export type WeatherUnits = "c" | "f"

export const WEATHER_UNITS_STORAGE_KEY = "weather-units"

/** Whole degrees for hero, daily tiles, and high/low — avoids 22.3° vs 22° mismatch. */
export const WEATHER_TEMP_DIGITS = 0

const FEELS_LIKE_SHOW_THRESHOLD_C = 1

export function parseWeatherUnits(raw: string | null | undefined): WeatherUnits {
  return raw === "f" ? "f" : "c"
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9
}

export function shouldShowFeelsLike(
  temperatureC: number | null | undefined,
  feelsLikeC: number | null | undefined
): boolean {
  if (typeof temperatureC !== "number" || !Number.isFinite(temperatureC)) return false
  if (typeof feelsLikeC !== "number" || !Number.isFinite(feelsLikeC)) return false
  return Math.abs(feelsLikeC - temperatureC) >= FEELS_LIKE_SHOW_THRESHOLD_C
}

export function formatCurrentConditionsAria(
  temperatureC: number | null,
  feelsLikeC: number | null | undefined,
  conditionLabel: string,
  units: WeatherUnits,
  options?: {
    includeFeelsLike?: boolean
    todayLowC?: number | null
    todayHighC?: number | null
  }
): string | undefined {
  if (typeof temperatureC !== "number" || !Number.isFinite(temperatureC)) return undefined
  const unitWord = units === "f" ? "Fahrenheit" : "Celsius"
  const temp = formatTempValue(temperatureC, units, WEATHER_TEMP_DIGITS).replace("°", " degrees ")
  const includeFeelsLike = options?.includeFeelsLike ?? shouldShowFeelsLike(temperatureC, feelsLikeC)
  let label = `Current temperature, ${temp} ${unitWord}, ${conditionLabel}`
  if (includeFeelsLike && typeof feelsLikeC === "number" && Number.isFinite(feelsLikeC)) {
    const feels = formatTempValue(feelsLikeC, units, WEATHER_TEMP_DIGITS).replace("°", " degrees ")
    label += `, feels like ${feels} ${unitWord}`
  }
  const range = formatTodayRangeLabels(options?.todayLowC, options?.todayHighC, units)
  if (range) label += `, ${range.aria}`
  return label
}

export type TempParts = { value: string; unit: string }

export function formatTempParts(
  celsius: number | null | undefined,
  units: WeatherUnits,
  digits = WEATHER_TEMP_DIGITS
): TempParts | null {
  if (typeof celsius !== "number" || !Number.isFinite(celsius)) return null
  if (units === "f") {
    return { value: celsiusToFahrenheit(celsius).toFixed(digits), unit: "°F" }
  }
  return { value: celsius.toFixed(digits), unit: "°C" }
}

export type TodayRangeLabels = {
  low: string
  high: string
  aria: string
}

export function formatTodayRangeLabels(
  lowC: number | null | undefined,
  highC: number | null | undefined,
  units: WeatherUnits,
  digits = WEATHER_TEMP_DIGITS
): TodayRangeLabels | null {
  const low = formatTempParts(lowC, units, digits)
  const high = formatTempParts(highC, units, digits)
  if (!low || !high) return null
  return {
    low: `Low ${low.value}${low.unit}`,
    high: `High ${high.value}${high.unit}`,
    aria: `Today low ${low.value}, high ${high.value} ${units === "f" ? "Fahrenheit" : "Celsius"}`,
  }
}

export type TodayRangeVisual = {
  /** 0–1 position on the displayed track (scale includes current when outside forecast). */
  position: number
  forecastLowC: number
  forecastHighC: number
  outside: "below" | "above" | null
}

export function todayRangeVisual(
  currentC: number | null | undefined,
  lowC: number | null | undefined,
  highC: number | null | undefined
): TodayRangeVisual | null {
  if (typeof currentC !== "number" || !Number.isFinite(currentC)) return null
  if (typeof lowC !== "number" || !Number.isFinite(lowC)) return null
  if (typeof highC !== "number" || !Number.isFinite(highC)) return null

  const forecastLowC = Math.min(lowC, highC)
  const forecastHighC = Math.max(lowC, highC)
  const displayLow = Math.min(forecastLowC, currentC)
  const displayHigh = Math.max(forecastHighC, currentC)
  const span = displayHigh - displayLow
  const position = span <= 0 ? 0.5 : (currentC - displayLow) / span

  let outside: "below" | "above" | null = null
  if (currentC < forecastLowC) outside = "below"
  else if (currentC > forecastHighC) outside = "above"

  return { position, forecastLowC, forecastHighC, outside }
}

/** @deprecated Prefer todayRangeVisual — returns position only. */
export function todayRangePosition(
  currentC: number | null | undefined,
  lowC: number | null | undefined,
  highC: number | null | undefined
): number | null {
  return todayRangeVisual(currentC, lowC, highC)?.position ?? null
}

export function todayRangeAriaHint(visual: TodayRangeVisual): string {
  if (visual.outside === "below") {
    return "Current temperature is below today's forecast low."
  }
  if (visual.outside === "above") {
    return "Current temperature is above today's forecast high."
  }
  const pct = Math.round(visual.position * 100)
  if (pct <= 20) return "Current temperature is near today's low."
  if (pct >= 80) return "Current temperature is near today's high."
  return "Current temperature is between today's low and high."
}

/** Plain-language line under today's low/high — the hero already shows current temp. */
export function todayDaySpreadMessage(
  currentC: number | null | undefined,
  lowC: number | null | undefined,
  highC: number | null | undefined,
  units: WeatherUnits
): string | null {
  const visual = todayRangeVisual(currentC, lowC, highC)
  const labels = formatTodayRangeLabels(lowC, highC, units)
  if (!visual || !labels) return null

  const low = formatTempValue(visual.forecastLowC, units)
  const high = formatTempValue(visual.forecastHighC, units)

  if (visual.outside === "below") {
    return `Cooler than today's forecast low of ${low}.`
  }
  if (visual.outside === "above") {
    return `Warmer than today's forecast high of ${high}.`
  }
  if (visual.position <= 0.2) {
    return `Near today's low — high expected around ${high}.`
  }
  if (visual.position >= 0.8) {
    return `Near today's high — low was around ${low}.`
  }
  return `Forecast between ${low} and ${high} today.`
}

/** @deprecated Use formatTodayRangeLabels — kept for callers that need a single string. */
export function formatTempRange(
  lowC: number | null | undefined,
  highC: number | null | undefined,
  units: WeatherUnits,
  digits = WEATHER_TEMP_DIGITS
): string | null {
  const labels = formatTodayRangeLabels(lowC, highC, units, digits)
  if (!labels) return null
  return `${labels.low} · ${labels.high}`
}

export function formatTempValue(
  celsius: number | null | undefined,
  units: WeatherUnits,
  digits = WEATHER_TEMP_DIGITS
): string {
  const parts = formatTempParts(celsius, units, digits)
  if (!parts) return "—"
  return `${parts.value}${parts.unit}`
}

export function formatTempDelta(celsiusDelta: number, units: WeatherUnits): string {
  const value = units === "f" ? Math.round(celsiusDelta * (9 / 5)) : Math.round(celsiusDelta)
  const sign = value > 0 ? "+" : ""
  const suffix = units === "f" ? "°F" : "°"
  return `${sign}${value}${suffix}`
}

function kmhToMph(kmh: number): number {
  return kmh * 0.621371
}

export function formatWindSpeed(kmh: number | null | undefined, units: WeatherUnits): string {
  if (typeof kmh !== "number" || !Number.isFinite(kmh)) return "—"
  if (units === "f") return `${Math.round(kmhToMph(kmh))} mph`
  return `${Math.round(kmh)} km/h`
}

export function formatWindGust(kmh: number | null | undefined, units: WeatherUnits): string | null {
  if (typeof kmh !== "number" || !Number.isFinite(kmh)) return null
  if (units === "f") return `${Math.round(kmhToMph(kmh))} mph gusts`
  return `${Math.round(kmh)} km/h gusts`
}

export function formatAnomalyMessage(
  anomalyC: number,
  monthName: string,
  units: WeatherUnits = "c"
): string {
  const magnitude =
    units === "f"
      ? Math.abs(celsiusToFahrenheit(anomalyC) - celsiusToFahrenheit(0)).toFixed(1)
      : Math.abs(anomalyC).toFixed(1)
  const suffix = units === "f" ? "°F" : "°"
  return anomalyC > 0
    ? `${magnitude}${suffix} warmer than typical for ${monthName}`
    : `${magnitude}${suffix} cooler than typical for ${monthName}`
}
