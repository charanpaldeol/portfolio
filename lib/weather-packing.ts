// Purpose: Derive trip-packing hints from a weather comparison.
import { formatTemperatureDelta } from "@/lib/weather-compare"
import type { WeatherSnapshot } from "@/lib/weather-types"
import type { WeatherUnits } from "@/lib/weather-units"

function shortPlace(city: string, fallback: string): string {
  const trimmed = city.trim()
  if (!trimmed) return fallback
  return trimmed.split(",")[0]?.trim() || fallback
}

function rainyDays(snapshot: WeatherSnapshot): number {
  return snapshot.dailyForecast.filter((day) => (day.precipitationMm ?? 0) >= 1).length
}

export function buildPackingHints(
  locationA: WeatherSnapshot,
  locationB: WeatherSnapshot,
  units: WeatherUnits = "c"
): string[] {
  const hints: string[] = []
  const labelB = shortPlace(locationB.city, "destination")

  const tempDelta = formatTemperatureDelta(locationA.temperatureC, locationB.temperatureC, labelB, units)
  if (tempDelta && tempDelta !== "About the same") {
    if (tempDelta.includes("cooler")) {
      hints.push(`Bring a layer — ${tempDelta}.`)
    } else if (tempDelta.includes("warmer")) {
      hints.push(`Pack lighter — ${tempDelta}.`)
    }
  }

  const rainA = rainyDays(locationA)
  const rainB = rainyDays(locationB)
  if (rainB >= 3 && rainB > rainA) {
    hints.push(`Rain expected on ${rainB} of the next ${locationB.dailyForecast.length || 16} days in ${labelB} — pack a rain layer.`)
  } else if (rainB >= 1 && rainA === 0) {
    hints.push(`Some rain at ${labelB} this week — a compact umbrella may help.`)
  }

  const aqiA = locationA.airQuality.usAqi
  const aqiB = locationB.airQuality.usAqi
  if (aqiA != null && aqiB != null && aqiB - aqiA >= 50) {
    hints.push(`Air quality is notably worse in ${labelB} — sensitive travelers may want a mask outdoors.`)
  }

  const uvB = locationB.uvIndexMax
  if (typeof uvB === "number" && uvB >= 8) {
    hints.push(`High UV at ${labelB} today — sunscreen and a hat recommended.`)
  }

  const zoneA = locationA.timezoneAbbreviation
  const zoneB = locationB.timezoneAbbreviation
  if (zoneA && zoneB && zoneA !== zoneB) {
    hints.push(`Time zones differ (${zoneA} vs ${zoneB}) — plan for jet lag if crossing several hours.`)
  }

  if (hints.length === 0) {
    hints.push("Conditions look broadly similar — standard travel kit should cover it.")
  }

  return hints
}
