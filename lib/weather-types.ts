// Purpose: Shared weather API and UI types for forecast, air quality, and compare views.
import type { WeatherCondition } from "@/lib/weather-code"

export type HourlyForecastHour = {
  time: string
  temperatureC: number | null
  feelsLikeC: number | null
  weatherCode: number
  condition: WeatherCondition
  precipitationProbabilityPercent: number | null
  precipitationMm: number | null
  windSpeedKmh: number | null
  windDirectionDeg: number | null
  isDay: boolean
}

export type DailyForecastDay = {
  date: string
  weekday: string
  weatherCode: number
  condition: WeatherCondition
  highC: number
  lowC: number
  precipitationMm: number | null
  precipitationProbabilityPercent: number | null
  uvIndexMax: number | null
}

export type AirQualitySnapshot = {
  usAqi: number | null
  pm25: number | null
  label: string
}

export type LocationMeta = {
  elevationM: number | null
  population: number | null
  timezone: string | null
}

export type MonthlyClimateNormal = {
  month: number
  monthName: string
  meanC: number
  highC: number
  lowC: number
}

export type ClimateExtremes = {
  periodLabel: string
  hottest: MonthlyClimateNormal
  coldest: MonthlyClimateNormal
  currentMonth: MonthlyClimateNormal | null
}

export type WeatherSnapshot = {
  city: string
  lat: number
  lon: number
  temperatureC: number | null
  condition: WeatherCondition
  feelsLikeC: number | null
  humidityPercent: number | null
  windSpeedKmh: number | null
  windDirectionDeg: number | null
  windGustKmh: number | null
  dewPointC: number | null
  precipitationMm: number | null
  precipitationSumTodayMm: number | null
  cloudCoverPercent: number | null
  pressureHpa: number | null
  visibilityM: number | null
  uvIndexMax: number | null
  sunrise: string | null
  sunset: string | null
  todayHighC: number | null
  todayLowC: number | null
  elevationM: number | null
  population: number | null
  locationSource: "gps" | "network" | null
  airQuality: AirQualitySnapshot
  dailyForecast: DailyForecastDay[]
  hourlyForecast: HourlyForecastHour[]
  observedAt: string | null
  timezone: string | null
  timezoneAbbreviation: string | null
  source: string
  climateNormals: ClimateExtremes | null
  isDay: boolean | null
  temperatureAnomalyC: number | null
  isDefaultLocation: boolean
}

export type CompareMetric = {
  key: string
  label: string
  valueA: string
  valueB: string
  detailA?: string
  detailB?: string
  delta?: string | null
}
