// Purpose: Derive safety notices from weather snapshot fields (no external alerts API).
import type { WeatherSnapshot } from "@/lib/weather-types"
import { formatTempValue } from "@/lib/weather-units"

const STORM_CODES = new Set([95, 96, 99])

function countSnowDays(snapshot: WeatherSnapshot): number {
  return snapshot.dailyForecast.filter((day) => !day.isPast && (day.snowfallCm ?? 0) >= 1).length
}

export function buildSafetyNotices(snapshot: WeatherSnapshot, units: "c" | "f" = "c"): string[] {
  const notices: string[] = []
  const { airQuality, temperatureC, uvIndexMax, windGustKmh, wetBulbC, dailyForecast } = snapshot

  if (airQuality.usAqi != null && airQuality.usAqi >= 150) {
    notices.push(`Air quality is unhealthy (AQI ${Math.round(airQuality.usAqi)}) — limit prolonged outdoor exertion.`)
  } else if (airQuality.usAqi != null && airQuality.usAqi >= 100) {
    notices.push(`Air quality is moderate-to-poor (AQI ${Math.round(airQuality.usAqi)}) — sensitive groups should take care.`)
  }

  if (typeof uvIndexMax === "number" && uvIndexMax >= 8) {
    notices.push(`Very high UV today (${uvIndexMax.toFixed(1)}) — sunscreen, hat, and shade recommended.`)
  }

  if (typeof temperatureC === "number") {
    if (temperatureC >= 35) {
      notices.push(`Extreme heat (${formatTempValue(temperatureC, units, 0)}) — stay hydrated and avoid midday sun.`)
    } else if (temperatureC <= -15) {
      notices.push(`Extreme cold (${formatTempValue(temperatureC, units, 0)}) — frostbite risk; cover skin.`)
    }
  }

  if (typeof wetBulbC === "number" && wetBulbC >= 32) {
    notices.push(`Dangerous humid heat (wet-bulb ${formatTempValue(wetBulbC, units, 0)}) — heat stress likely outdoors.`)
  }

  if (typeof windGustKmh === "number" && windGustKmh >= 60) {
    notices.push(`Strong wind gusts (${Math.round(windGustKmh)} km/h) — secure loose items and use caution driving.`)
  }

  if (STORM_CODES.has(snapshot.weatherCode) || dailyForecast.some((day) => STORM_CODES.has(day.weatherCode))) {
    notices.push("Thunderstorm in the forecast — seek shelter if conditions worsen.")
  }

  const snowDays = countSnowDays(snapshot)
  if (snowDays >= 2) {
    notices.push(`Snow expected on ${snowDays} upcoming days — plan for winter travel conditions.`)
  }

  return notices
}
