// Purpose: Parse Open-Meteo forecast and air-quality responses into app types.
import { weatherConditionFromCode } from "@/lib/weather-code"
import { aqiLabel } from "@/lib/weather-format"
import type { AirQualitySnapshot, DailyForecastDay } from "@/lib/weather-types"

type ForecastDaily = {
  time?: string[]
  weather_code?: number[]
  temperature_2m_max?: number[]
  temperature_2m_min?: number[]
  precipitation_sum?: number[]
  uv_index_max?: number[]
  sunrise?: string[]
  sunset?: string[]
}

export function buildDailyForecast(daily: ForecastDaily | undefined, days = 7): DailyForecastDay[] {
  const times = daily?.time ?? []
  const count = Math.min(days, times.length)

  return Array.from({ length: count }, (_, index) => {
    const date = times[index] ?? ""
    const parsed = date ? new Date(`${date}T12:00:00`) : null
    const weekday =
      parsed && !Number.isNaN(parsed.getTime())
        ? parsed.toLocaleDateString("en-US", { weekday: "short" })
        : "—"
    const code = daily?.weather_code?.[index] ?? 0
    const high = daily?.temperature_2m_max?.[index]
    const low = daily?.temperature_2m_min?.[index]
    const precip = daily?.precipitation_sum?.[index]
    const uv = daily?.uv_index_max?.[index]

    return {
      date,
      weekday,
      weatherCode: code,
      condition: weatherConditionFromCode(code),
      highC: typeof high === "number" && Number.isFinite(high) ? high : 0,
      lowC: typeof low === "number" && Number.isFinite(low) ? low : 0,
      precipitationMm: typeof precip === "number" && Number.isFinite(precip) ? precip : null,
      uvIndexMax: typeof uv === "number" && Number.isFinite(uv) ? uv : null,
    }
  })
}

export function parseAirQuality(body: {
  current?: { us_aqi?: number; pm2_5?: number }
}): AirQualitySnapshot {
  const usAqi = body.current?.us_aqi
  const pm25 = body.current?.pm2_5
  const aqi = typeof usAqi === "number" && Number.isFinite(usAqi) ? usAqi : null
  return {
    usAqi: aqi,
    pm25: typeof pm25 === "number" && Number.isFinite(pm25) ? pm25 : null,
    label: aqi != null ? aqiLabel(aqi) : "—",
  }
}
