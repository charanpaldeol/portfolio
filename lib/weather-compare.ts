// Purpose: Build comparison rows and temperature deltas for two weather snapshots.
import {
  formatClockTime,
  formatObservedAt,
  formatPrecipitation,
  formatPressure,
  formatTemperature,
  formatVisibility,
  windDirectionLabel,
} from "@/lib/weather-format"
import type { CompareMetric, WeatherSnapshot } from "@/lib/weather-types"

export function formatTemperatureDelta(
  valueA: number | null,
  valueB: number | null,
  placeBLabel: string
): string | null {
  if (valueA == null || valueB == null) return null
  const diff = valueB - valueA
  if (Math.abs(diff) < 0.5) return "About the same"
  const rounded = Math.abs(Math.round(diff))
  return diff > 0 ? `${rounded}° warmer in ${placeBLabel}` : `${rounded}° cooler in ${placeBLabel}`
}

function formatPercent(value: number | null): string {
  return typeof value === "number" && Number.isFinite(value) ? `${Math.round(value)}%` : "—"
}

function formatWind(snapshot: WeatherSnapshot): { value: string; detail?: string } {
  const speed =
    typeof snapshot.windSpeedKmh === "number" && Number.isFinite(snapshot.windSpeedKmh)
      ? `${Math.round(snapshot.windSpeedKmh)} km/h`
      : "—"
  const direction =
    typeof snapshot.windDirectionDeg === "number" && Number.isFinite(snapshot.windDirectionDeg)
      ? windDirectionLabel(snapshot.windDirectionDeg)
      : null
  return { value: speed, detail: direction ? `From the ${direction}` : undefined }
}

function formatSun(snapshot: WeatherSnapshot): { value: string; detail?: string } {
  const sunrise = formatClockTime(snapshot.sunrise)
  const sunset = formatClockTime(snapshot.sunset)
  const detail =
    sunrise && sunset ? `↑ ${sunrise} · ↓ ${sunset}` : sunrise ?? sunset ?? undefined
  return { value: sunrise ?? sunset ?? "—", detail }
}

function formatAirQuality(snapshot: WeatherSnapshot): { value: string; detail?: string } {
  const aqi = snapshot.airQuality.usAqi
  const value = aqi != null ? String(Math.round(aqi)) : "—"
  const detail =
    aqi != null
      ? `${snapshot.airQuality.label}${snapshot.airQuality.pm25 != null ? ` · PM2.5 ${snapshot.airQuality.pm25.toFixed(1)} µg/m³` : ""}`
      : undefined
  return { value, detail }
}

function formatHighLow(snapshot: WeatherSnapshot): string {
  const high =
    snapshot.todayHighC != null ? formatTemperature(snapshot.todayHighC, 0).replace("°C", "°") : "—"
  const low =
    snapshot.todayLowC != null ? formatTemperature(snapshot.todayLowC, 0).replace("°C", "°") : "—"
  return `${high} / ${low}`
}

function shortPlaceLabel(city: string, fallback: string): string {
  const trimmed = city.trim()
  if (!trimmed) return fallback
  const first = trimmed.split(",")[0]?.trim()
  return first || fallback
}

export function buildCompareMetrics(a: WeatherSnapshot, b: WeatherSnapshot): CompareMetric[] {
  const labelB = shortPlaceLabel(b.city, "Location B")
  const windA = formatWind(a)
  const windB = formatWind(b)
  const sunA = formatSun(a)
  const sunB = formatSun(b)
  const airA = formatAirQuality(a)
  const airB = formatAirQuality(b)

  return [
    {
      key: "temperature",
      label: "Current temp",
      valueA: formatTemperature(a.temperatureC, 1),
      valueB: formatTemperature(b.temperatureC, 1),
      delta: formatTemperatureDelta(a.temperatureC, b.temperatureC, labelB),
    },
    {
      key: "condition",
      label: "Conditions",
      valueA: `${a.condition.icon} ${a.condition.label}`,
      valueB: `${b.condition.icon} ${b.condition.label}`,
    },
    {
      key: "feelsLike",
      label: "Feels like",
      valueA: formatTemperature(a.feelsLikeC, 1),
      valueB: formatTemperature(b.feelsLikeC, 1),
      delta: formatTemperatureDelta(a.feelsLikeC, b.feelsLikeC, labelB),
    },
    {
      key: "highLow",
      label: "High / low today",
      valueA: formatHighLow(a),
      valueB: formatHighLow(b),
    },
    {
      key: "humidity",
      label: "Humidity",
      valueA: formatPercent(a.humidityPercent),
      valueB: formatPercent(b.humidityPercent),
    },
    {
      key: "wind",
      label: "Wind",
      valueA: windA.value,
      valueB: windB.value,
      detailA: windA.detail,
      detailB: windB.detail,
    },
    {
      key: "precipitation",
      label: "Precipitation today",
      valueA: formatPrecipitation(a.precipitationSumTodayMm ?? a.precipitationMm),
      valueB: formatPrecipitation(b.precipitationSumTodayMm ?? b.precipitationMm),
    },
    {
      key: "uv",
      label: "UV index (max)",
      valueA:
        typeof a.uvIndexMax === "number" && Number.isFinite(a.uvIndexMax) ? a.uvIndexMax.toFixed(1) : "—",
      valueB:
        typeof b.uvIndexMax === "number" && Number.isFinite(b.uvIndexMax) ? b.uvIndexMax.toFixed(1) : "—",
    },
    {
      key: "cloud",
      label: "Cloud cover",
      valueA: formatPercent(a.cloudCoverPercent),
      valueB: formatPercent(b.cloudCoverPercent),
    },
    {
      key: "pressure",
      label: "Pressure",
      valueA: formatPressure(a.pressureHpa),
      valueB: formatPressure(b.pressureHpa),
    },
    {
      key: "visibility",
      label: "Visibility",
      valueA: formatVisibility(a.visibilityM),
      valueB: formatVisibility(b.visibilityM),
    },
    {
      key: "sun",
      label: "Sun",
      valueA: sunA.value,
      valueB: sunB.value,
      detailA: sunA.detail,
      detailB: sunB.detail,
    },
    {
      key: "airQuality",
      label: "Air quality",
      valueA: airA.value,
      valueB: airB.value,
      detailA: airA.detail,
      detailB: airB.detail,
    },
  ]
}

export function compareSummaryLine(a: WeatherSnapshot, b: WeatherSnapshot): string | null {
  return formatTemperatureDelta(a.temperatureC, b.temperatureC, shortPlaceLabel(b.city, "Location B"))
}

export function locationSubtitle(snapshot: WeatherSnapshot): string {
  const parts = [`${snapshot.lat.toFixed(4)}, ${snapshot.lon.toFixed(4)}`]
  const updated = formatObservedAt(
    snapshot.observedAt,
    snapshot.timezone,
    snapshot.timezoneAbbreviation
  )
  if (updated) parts.push(updated.replace(/^Updated /, ""))
  if (snapshot.timezoneAbbreviation) parts.push(snapshot.timezoneAbbreviation)
  return parts.join(" · ")
}
