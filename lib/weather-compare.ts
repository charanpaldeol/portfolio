// Purpose: Build comparison rows and temperature deltas for two weather snapshots.
import { formatClimateMonthSummary } from "@/lib/weather-climate"
import {
  formatClockTime,
  formatLocalTime,
  formatObservedAt,
  formatPrecipitation,
  formatPressure,
  formatVisibility,
  windDirectionLabel,
} from "@/lib/weather-format"
import type { CompareMetric, WeatherSnapshot } from "@/lib/weather-types"
import { formatTempValue, formatWindGust, formatWindSpeed, type WeatherUnits } from "@/lib/weather-units"

export function formatTemperatureDelta(
  valueA: number | null,
  valueB: number | null,
  placeBLabel: string,
  units: WeatherUnits = "c"
): string | null {
  if (valueA == null || valueB == null) return null
  const diff = valueB - valueA
  if (Math.abs(diff) < 0.5) return "About the same"
  const rounded = units === "f" ? Math.abs(Math.round(diff * (9 / 5))) : Math.abs(Math.round(diff))
  const suffix = units === "f" ? "°F" : "°"
  return diff > 0 ? `${rounded}${suffix} warmer in ${placeBLabel}` : `${rounded}${suffix} cooler in ${placeBLabel}`
}

function formatPercent(value: number | null): string {
  return typeof value === "number" && Number.isFinite(value) ? `${Math.round(value)}%` : "—"
}

function formatWind(snapshot: WeatherSnapshot, units: WeatherUnits): { value: string; detail?: string } {
  const speed = formatWindSpeed(snapshot.windSpeedKmh, units)
  const gust = formatWindGust(snapshot.windGustKmh, units)
  const direction =
    typeof snapshot.windDirectionDeg === "number" && Number.isFinite(snapshot.windDirectionDeg)
      ? windDirectionLabel(snapshot.windDirectionDeg)
      : null
  const detail = [direction ? `From the ${direction}` : null, gust].filter(Boolean).join(" · ") || undefined
  return { value: speed, detail }
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

function formatHighLow(snapshot: WeatherSnapshot, units: WeatherUnits): string {
  const high =
    snapshot.todayHighC != null ? formatTempValue(snapshot.todayHighC, units, 0) : "—"
  const low =
    snapshot.todayLowC != null ? formatTempValue(snapshot.todayLowC, units, 0) : "—"
  return `${high} / ${low}`
}

function shortPlaceLabel(city: string, fallback: string): string {
  const trimmed = city.trim()
  if (!trimmed) return fallback
  const first = trimmed.split(",")[0]?.trim()
  return first || fallback
}

export function buildCompareMetrics(
  a: WeatherSnapshot,
  b: WeatherSnapshot,
  units: WeatherUnits = "c"
): CompareMetric[] {
  const labelB = shortPlaceLabel(b.city, "Location B")
  const windA = formatWind(a, units)
  const windB = formatWind(b, units)
  const sunA = formatSun(a)
  const sunB = formatSun(b)
  const airA = formatAirQuality(a)
  const airB = formatAirQuality(b)

  return [
    {
      key: "localTime",
      label: "Local time",
      valueA: formatLocalTime(a.observedAt, a.timezoneAbbreviation) ?? "—",
      valueB: formatLocalTime(b.observedAt, b.timezoneAbbreviation) ?? "—",
    },
    {
      key: "temperature",
      label: "Current temp",
      valueA: formatTempValue(a.temperatureC, units, 1),
      valueB: formatTempValue(b.temperatureC, units, 1),
      delta: formatTemperatureDelta(a.temperatureC, b.temperatureC, labelB, units),
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
      valueA: formatTempValue(a.feelsLikeC, units, 1),
      valueB: formatTempValue(b.feelsLikeC, units, 1),
      delta: formatTemperatureDelta(a.feelsLikeC, b.feelsLikeC, labelB, units),
    },
    {
      key: "wetBulb",
      label: "Wet-bulb",
      valueA: formatTempValue(a.wetBulbC, units, 1),
      valueB: formatTempValue(b.wetBulbC, units, 1),
    },
    {
      key: "highLow",
      label: "High / low today",
      valueA: formatHighLow(a, units),
      valueB: formatHighLow(b, units),
    },
    {
      key: "humidity",
      label: "Humidity",
      valueA: formatPercent(a.humidityPercent),
      valueB: formatPercent(b.humidityPercent),
    },
    {
      key: "dewPoint",
      label: "Dew point",
      valueA: formatTempValue(a.dewPointC, units, 1),
      valueB: formatTempValue(b.dewPointC, units, 1),
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
    {
      key: "hottestMonth",
      label: "Hottest month",
      valueA: a.climateNormals?.hottest.monthName ?? "—",
      valueB: b.climateNormals?.hottest.monthName ?? "—",
      detailA: a.climateNormals ? formatClimateMonthSummary(a.climateNormals.hottest, units) : undefined,
      detailB: b.climateNormals ? formatClimateMonthSummary(b.climateNormals.hottest, units) : undefined,
    },
    {
      key: "coldestMonth",
      label: "Coldest month",
      valueA: a.climateNormals?.coldest.monthName ?? "—",
      valueB: b.climateNormals?.coldest.monthName ?? "—",
      detailA: a.climateNormals ? formatClimateMonthSummary(a.climateNormals.coldest, units) : undefined,
      detailB: b.climateNormals ? formatClimateMonthSummary(b.climateNormals.coldest, units) : undefined,
    },
  ]
}

export function compareSummaryLine(
  a: WeatherSnapshot,
  b: WeatherSnapshot,
  units: WeatherUnits = "c"
): string | null {
  return formatTemperatureDelta(a.temperatureC, b.temperatureC, shortPlaceLabel(b.city, "Location B"), units)
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
