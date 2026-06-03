// Purpose: Parse Open-Meteo forecast and air-quality responses into app types.
import { weatherConditionFromCode } from "@/lib/weather-code"
import { aqiLabel } from "@/lib/weather-format"
import type { AirQualitySnapshot, DailyForecastDay, HourlyForecastHour } from "@/lib/weather-types"

type ForecastDaily = {
  time?: string[]
  weather_code?: number[]
  temperature_2m_max?: number[]
  temperature_2m_min?: number[]
  precipitation_sum?: number[]
  precipitation_probability_max?: number[]
  uv_index_max?: number[]
  sunrise?: string[]
  sunset?: string[]
}

type ForecastHourly = {
  time?: string[]
  temperature_2m?: number[]
  apparent_temperature?: number[]
  weather_code?: number[]
  precipitation_probability?: number[]
  precipitation?: number[]
  wind_speed_10m?: number[]
  wind_direction_10m?: number[]
  is_day?: number[]
}

function readFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

export function buildDailyForecast(daily: ForecastDaily | undefined, days = 16): DailyForecastDay[] {
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
    const precipProb = daily?.precipitation_probability_max?.[index]
    const uv = daily?.uv_index_max?.[index]

    return {
      date,
      weekday,
      weatherCode: code,
      condition: weatherConditionFromCode(code),
      highC: typeof high === "number" && Number.isFinite(high) ? high : 0,
      lowC: typeof low === "number" && Number.isFinite(low) ? low : 0,
      precipitationMm: readFiniteNumber(precip),
      precipitationProbabilityPercent: readFiniteNumber(precipProb),
      uvIndexMax: readFiniteNumber(uv),
    }
  })
}

export function buildHourlyForecast(hourly: ForecastHourly | undefined, hours = 48): HourlyForecastHour[] {
  const times = hourly?.time ?? []
  const count = Math.min(hours, times.length)

  return Array.from({ length: count }, (_, index) => {
    const time = times[index] ?? ""
    const code = hourly?.weather_code?.[index] ?? 0
    const isDay = hourly?.is_day?.[index] === 1

    return {
      time,
      temperatureC: readFiniteNumber(hourly?.temperature_2m?.[index]),
      feelsLikeC: readFiniteNumber(hourly?.apparent_temperature?.[index]),
      weatherCode: code,
      condition: weatherConditionFromCode(code),
      precipitationProbabilityPercent: readFiniteNumber(hourly?.precipitation_probability?.[index]),
      precipitationMm: readFiniteNumber(hourly?.precipitation?.[index]),
      windSpeedKmh: readFiniteNumber(hourly?.wind_speed_10m?.[index]),
      windDirectionDeg: readFiniteNumber(hourly?.wind_direction_10m?.[index]),
      isDay,
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
