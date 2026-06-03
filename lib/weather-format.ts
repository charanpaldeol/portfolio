// Purpose: Format wind, time, and temperature strings for the weather page.
import { formatAnomalyMessage, type WeatherUnits } from "@/lib/weather-units"

const COMPASS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"] as const

export function windDirectionLabel(degrees: number): string {
  if (!Number.isFinite(degrees)) return "—"
  const index = Math.round(((degrees % 360) + 360) % 360 / 22.5) % 16
  return COMPASS[index] ?? "—"
}

export function formatTemperature(celsius: number | null | undefined, digits = 0): string {
  if (typeof celsius !== "number" || !Number.isFinite(celsius)) return "—"
  return `${celsius.toFixed(digits)}°C`
}

export function formatClockTime(isoLocal: string | null | undefined): string | null {
  if (!isoLocal) return null
  const match = isoLocal.match(/T(\d{2}):(\d{2})/)
  if (!match) return null
  const hour24 = Number(match[1])
  const minute = match[2]
  const hour12 = hour24 % 12 || 12
  const ampm = hour24 >= 12 ? "PM" : "AM"
  return `${hour12}:${minute} ${ampm}`
}

export function formatVisibility(meters: number | null | undefined): string {
  if (typeof meters !== "number" || !Number.isFinite(meters)) return "—"
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
  return `${Math.round(meters)} m`
}

export function formatPressure(hpa: number | null | undefined): string {
  if (typeof hpa !== "number" || !Number.isFinite(hpa)) return "—"
  return `${Math.round(hpa)} hPa`
}

export function formatPrecipitation(mm: number | null | undefined): string {
  if (typeof mm !== "number" || !Number.isFinite(mm)) return "—"
  if (mm === 0) return "0 mm"
  return `${mm.toFixed(mm < 10 ? 1 : 0)} mm`
}

export function formatPopulation(count: number | null | undefined): string | null {
  if (typeof count !== "number" || !Number.isFinite(count) || count <= 0) return null
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M people`
  if (count >= 1_000) return `${Math.round(count / 1_000)}k people`
  return `${count.toLocaleString("en-US")} people`
}

export function aqiLabel(usAqi: number): string {
  if (usAqi <= 50) return "Good"
  if (usAqi <= 100) return "Moderate"
  if (usAqi <= 150) return "Unhealthy for sensitive groups"
  if (usAqi <= 200) return "Unhealthy"
  if (usAqi <= 300) return "Very unhealthy"
  return "Hazardous"
}

export function formatObservedAt(
  observedAt: string | null | undefined,
  _timezone: string | null | undefined,
  timezoneAbbreviation: string | null | undefined
): string | null {
  if (!observedAt) return null

  const time = formatClockTime(observedAt)
  if (!time) return null
  const zone = timezoneAbbreviation?.trim()

  return zone ? `Updated ${time} ${zone}` : `Updated ${time}`
}

export function formatLocalTime(
  observedAt: string | null | undefined,
  timezoneAbbreviation: string | null | undefined
): string | null {
  const time = formatClockTime(observedAt)
  if (!time) return null
  const zone = timezoneAbbreviation?.trim()
  return zone ? `${time} ${zone}` : time
}

export function formatTemperatureAnomaly(
  anomalyC: number | null | undefined,
  units: WeatherUnits = "c",
  monthName = "this month"
): string | null {
  if (typeof anomalyC !== "number" || !Number.isFinite(anomalyC)) return null
  if (Math.abs(anomalyC) < 0.5) return "Near typical for this month"
  return formatAnomalyMessage(anomalyC, monthName, units)
}

export function formatDuration(seconds: number | null | undefined): string {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) return "—"
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  if (hours <= 0) return `${minutes}m`
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
}

export function formatSnowfall(cm: number | null | undefined): string {
  if (typeof cm !== "number" || !Number.isFinite(cm)) return "—"
  if (cm === 0) return "0 cm"
  return `${cm.toFixed(cm < 10 ? 1 : 0)} cm`
}

export function formatHourlyTimeLabel(
  time: string,
  options?: { previousTime?: string; index?: number }
): string {
  if (options?.index === 0) return "Now"
  const clock = formatClockTime(time)
  if (!clock) return time.slice(11, 16)

  const date = time.slice(0, 10)
  const prevDate = options?.previousTime?.slice(0, 10)
  if (prevDate && date !== prevDate) {
    const weekday = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" })
    return `${weekday} ${clock}`
  }

  return clock
}

export type SeverityStyle = {
  label: string
  badgeClass: string
  textClass: string
}

export function uvSeverity(uv: number | null | undefined): SeverityStyle | null {
  if (typeof uv !== "number" || !Number.isFinite(uv)) return null
  if (uv <= 2) return { label: "Low", badgeClass: "bg-primary/15 text-primary", textClass: "text-primary" }
  if (uv <= 5) return { label: "Moderate", badgeClass: "bg-secondary-fixed text-on-secondary-fixed", textClass: "text-on-surface" }
  if (uv <= 7) return { label: "High", badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed", textClass: "text-on-surface" }
  if (uv <= 10) return { label: "Very high", badgeClass: "bg-destructive/15 text-destructive", textClass: "text-destructive" }
  return { label: "Extreme", badgeClass: "bg-destructive/20 text-destructive", textClass: "text-destructive" }
}

export function aqiSeverity(usAqi: number | null | undefined): SeverityStyle | null {
  if (typeof usAqi !== "number" || !Number.isFinite(usAqi)) return null
  if (usAqi <= 50) return { label: "Good", badgeClass: "bg-primary/15 text-primary", textClass: "text-primary" }
  if (usAqi <= 100) return { label: "Moderate", badgeClass: "bg-secondary-fixed text-on-secondary-fixed", textClass: "text-on-surface" }
  if (usAqi <= 150) return { label: "Sensitive", badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed", textClass: "text-on-surface" }
  if (usAqi <= 200) return { label: "Unhealthy", badgeClass: "bg-destructive/15 text-destructive", textClass: "text-destructive" }
  if (usAqi <= 300) return { label: "Very unhealthy", badgeClass: "bg-destructive/20 text-destructive", textClass: "text-destructive" }
  return { label: "Hazardous", badgeClass: "bg-destructive/25 text-destructive", textClass: "text-destructive" }
}
