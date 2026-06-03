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
  windGustKmh: number | null
  wetBulbC: number | null
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
  snowfallCm: number | null
  rainMm: number | null
  sunshineDurationSec: number | null
  daylightDurationSec: number | null
  windGustMaxKmh: number | null
  isPast: boolean
}

export type AirQualitySnapshot = {
  usAqi: number | null
  europeanAqi: number | null
  pm25: number | null
  pm10: number | null
  ozone: number | null
  nitrogenDioxide: number | null
  carbonMonoxide: number | null
  sulphurDioxide: number | null
  label: string
}

export type WeatherAlert = {
  id: string
  event: string
  headline: string
  severity: string
  urgency: string
  source: string
}

export type OnThisDayNormal = {
  monthDayLabel: string
  avgHighC: number
  avgLowC: number
  avgPrecipMm: number
  sampleYears: number
}

export type PastWeekDay = {
  date: string
  weekday: string
  highC: number | null
  lowC: number | null
  precipitationMm: number | null
}

export type MarineSnapshot = {
  waveHeightM: number | null
  wavePeriodSec: number | null
  waveDirectionDeg: number | null
  seaSurfaceTempC: number | null
}

export type MoonInfo = {
  phaseLabel: string
  icon: string
  illuminationPercent: number
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
  monthlyNormals: MonthlyClimateNormal[]
  onThisDay: OnThisDayNormal | null
}

export type WeatherSnapshot = {
  city: string
  lat: number
  lon: number
  temperatureC: number | null
  weatherCode: number
  condition: WeatherCondition
  feelsLikeC: number | null
  wetBulbC: number | null
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
  sunshineDurationSec: number | null
  daylightDurationSec: number | null
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
  pastWeek: PastWeekDay[]
  alerts: WeatherAlert[]
  safetyNotices: string[]
  marine: MarineSnapshot | null
  moon: MoonInfo | null
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
