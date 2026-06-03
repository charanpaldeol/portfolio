// Purpose: Shared weather loader for /api/weather and the /weather page (avoids SSR self-fetch).
import { z } from "zod"

import { fetchNwsAlerts } from "@/lib/weather-alerts"
import {
  buildClimateArchiveUrl,
  computeTemperatureAnomaly,
  parseClimateExtremes,
} from "@/lib/weather-climate"
import { weatherConditionFromCode } from "@/lib/weather-code"
import { geocodeCity, reverseGeocodeCity } from "@/lib/weather-geocode"
import type { GeoPlace } from "@/lib/weather-geocode"
import { fetchMarineSnapshot } from "@/lib/weather-marine"
import { moonInfoForDate } from "@/lib/weather-moon"
import {
  buildDailyForecast,
  buildHourlyForecast,
  buildPastWeek,
  parseAirQuality,
} from "@/lib/weather-response"
import { buildSafetyNotices } from "@/lib/weather-safety"
import type {
  AirQualitySnapshot,
  ClimateExtremes,
  DailyForecastDay,
  HourlyForecastHour,
  MarineSnapshot,
  PastWeekDay,
  WeatherAlert,
} from "@/lib/weather-types"

export const WeatherQuerySchema = z.object({
  lat: z.string().optional(),
  lon: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  city: z.string().optional(),
  q: z.string().optional(),
  approx: z.string().optional(),
  includeClimate: z.string().optional(),
})

export type WeatherQueryParams = z.infer<typeof WeatherQuerySchema>

export type WeatherLoadOptions = {
  includeClimate?: boolean
}

const DEFAULT_LAT = 40.7128
const DEFAULT_LON = -74.006
const FORECAST_DAYS = 16
const HOURLY_HOURS = 48
const PAST_DAYS = 7

type ForecastBody = {
  timezone?: string
  timezone_abbreviation?: string
  elevation?: number
  current?: {
    time?: string
    temperature_2m?: number
    apparent_temperature?: number
    relative_humidity_2m?: number
    weather_code?: number
    wind_speed_10m?: number
    wind_direction_10m?: number
    wind_gusts_10m?: number
    precipitation?: number
    cloud_cover?: number
    pressure_msl?: number
    visibility?: number
    dew_point_2m?: number
    is_day?: number
    wet_bulb_temperature_2m?: number
  }
  daily?: {
    time?: string[]
    temperature_2m_max?: number[]
    temperature_2m_min?: number[]
    weather_code?: number[]
    precipitation_sum?: number[]
    precipitation_probability_max?: number[]
    uv_index_max?: number[]
    sunrise?: string[]
    sunset?: string[]
    snowfall_sum?: number[]
    rain_sum?: number[]
    sunshine_duration?: number[]
    daylight_duration?: number[]
    wind_gusts_10m_max?: number[]
  }
  hourly?: {
    time?: string[]
    temperature_2m?: number[]
    apparent_temperature?: number[]
    weather_code?: number[]
    precipitation_probability?: number[]
    precipitation?: number[]
    wind_speed_10m?: number[]
    wind_direction_10m?: number[]
    wind_gusts_10m?: number[]
    wet_bulb_temperature_2m?: number[]
    is_day?: number[]
  }
}

export type WeatherDataResult = {
  status: number
  data: Record<string, unknown>
}

export type ClimateDataResult = {
  status: number
  data: { climateNormals: ClimateExtremes | null; temperatureAnomalyC: number | null }
}

function buildForecastUrl(lat: number, lon: number): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,cloud_cover,pressure_msl,visibility,dew_point_2m,is_day,wet_bulb_temperature_2m",
    hourly:
      "temperature_2m,apparent_temperature,weather_code,precipitation_probability,precipitation,wind_speed_10m,wind_direction_10m,wind_gusts_10m,wet_bulb_temperature_2m,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,sunrise,sunset,snowfall_sum,rain_sum,sunshine_duration,daylight_duration,wind_gusts_10m_max",
    timezone: "auto",
    forecast_days: String(FORECAST_DAYS),
    past_days: String(PAST_DAYS),
  })
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`
}

function buildAirQualityUrl(lat: number, lon: number): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "us_aqi,european_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,carbon_monoxide,sulphur_dioxide",
    timezone: "auto",
  })
  return `https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`
}

function parseCoord(raw: string | undefined): number | null {
  if (!raw) return null
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : null
}

function hasLocationParams(raw: WeatherQueryParams): boolean {
  return !!(
    (raw.lat ?? raw.latitude)?.trim() ||
    (raw.lon ?? raw.longitude)?.trim() ||
    (raw.city ?? raw.q)?.trim()
  )
}

async function resolveLocation(
  latRaw: string | undefined,
  lonRaw: string | undefined,
  cityRaw: string | undefined
): Promise<{ lat: number; lon: number; city: string; meta: GeoPlace | null; isDefaultLocation: boolean } | { error: string }> {
  const latParam = parseCoord(latRaw)
  const lonParam = parseCoord(lonRaw)
  const cityQuery = (cityRaw ?? "").trim()

  if (latParam != null && lonParam != null) {
    const city = (await reverseGeocodeCity(latParam, lonParam)) || "Current location"
    return { lat: latParam, lon: lonParam, city, meta: null, isDefaultLocation: false }
  }

  if (cityQuery) {
    const place = await geocodeCity(cityQuery)
    if (!place) {
      return { error: `Could not find a location for "${cityQuery}". Try a different spelling.` }
    }
    return { lat: place.lat, lon: place.lon, city: place.city, meta: place, isDefaultLocation: false }
  }

  const city = (await reverseGeocodeCity(DEFAULT_LAT, DEFAULT_LON)) || "New York"
  return { lat: DEFAULT_LAT, lon: DEFAULT_LON, city, meta: null, isDefaultLocation: true }
}

function buildWeatherPayload(
  lat: number,
  lon: number,
  city: string,
  body: ForecastBody,
  airQuality: AirQualitySnapshot,
  locationMeta: GeoPlace | null,
  locationSource: "gps" | "network" | null,
  climateNormals: ClimateExtremes | null,
  isDefaultLocation: boolean,
  extras: {
    alerts: WeatherAlert[]
    marine: MarineSnapshot | null
  }
) {
  const current = body.current ?? {}
  const daily = body.daily ?? {}
  const weatherCode = current.weather_code ?? 0
  const dailyForecast: DailyForecastDay[] = buildDailyForecast(daily, FORECAST_DAYS + PAST_DAYS)
  const hourlyForecast: HourlyForecastHour[] = buildHourlyForecast(body.hourly, HOURLY_HOURS)
  const pastWeek: PastWeekDay[] = buildPastWeek(daily)
  const elevationM =
    typeof body.elevation === "number" && Number.isFinite(body.elevation)
      ? body.elevation
      : (locationMeta?.elevationM ?? null)
  const temperatureC = current.temperature_2m ?? null
  const temperatureAnomalyC = computeTemperatureAnomaly(temperatureC, climateNormals?.currentMonth ?? null)
  const snapshotBase = {
    lat,
    lon,
    city,
    temperatureC,
    weatherCode,
    feelsLikeC: current.apparent_temperature ?? null,
    wetBulbC: current.wet_bulb_temperature_2m ?? null,
    humidityPercent: current.relative_humidity_2m ?? null,
    condition: weatherConditionFromCode(weatherCode),
    windSpeedKmh: current.wind_speed_10m ?? null,
    windDirectionDeg: current.wind_direction_10m ?? null,
    windGustKmh: current.wind_gusts_10m ?? null,
    dewPointC: current.dew_point_2m ?? null,
    precipitationMm: current.precipitation ?? null,
    precipitationSumTodayMm: daily.precipitation_sum?.[PAST_DAYS] ?? daily.precipitation_sum?.[0] ?? null,
    cloudCoverPercent: current.cloud_cover ?? null,
    pressureHpa: current.pressure_msl ?? null,
    visibilityM: current.visibility ?? null,
    isDay: current.is_day === 1 ? true : current.is_day === 0 ? false : null,
    todayHighC: daily.temperature_2m_max?.[PAST_DAYS] ?? daily.temperature_2m_max?.[0] ?? null,
    todayLowC: daily.temperature_2m_min?.[PAST_DAYS] ?? daily.temperature_2m_min?.[0] ?? null,
    uvIndexMax: daily.uv_index_max?.[PAST_DAYS] ?? daily.uv_index_max?.[0] ?? null,
    sunshineDurationSec: daily.sunshine_duration?.[PAST_DAYS] ?? daily.sunshine_duration?.[0] ?? null,
    daylightDurationSec: daily.daylight_duration?.[PAST_DAYS] ?? daily.daylight_duration?.[0] ?? null,
    sunrise: daily.sunrise?.[PAST_DAYS] ?? daily.sunrise?.[0] ?? null,
    sunset: daily.sunset?.[PAST_DAYS] ?? daily.sunset?.[0] ?? null,
    observedAt: current.time ?? null,
    timezone: body.timezone ?? null,
    timezoneAbbreviation: body.timezone_abbreviation ?? null,
    elevationM,
    population: locationMeta?.population ?? null,
    locationSource,
    airQuality,
    dailyForecast,
    hourlyForecast,
    pastWeek,
    alerts: extras.alerts,
    marine: extras.marine,
    moon: moonInfoForDate(),
    climateNormals,
    temperatureAnomalyC,
    isDefaultLocation,
    source: "open-meteo" as const,
    current,
    daily,
  }

  return {
    ...snapshotBase,
    safetyNotices: buildSafetyNotices({
      ...snapshotBase,
      safetyNotices: [],
    }),
  }
}

function mockClimateNormals(): ClimateExtremes {
  const monthlyNormals = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    monthName: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][index] ?? "—",
    meanC: index === 6 ? 24.5 : index === 0 ? 1.2 : 12,
    highC: index === 6 ? 29.8 : index === 0 ? 4.8 : 18,
    lowC: index === 6 ? 19.2 : index === 0 ? -2.1 : 8,
  }))
  return {
    periodLabel: "1991–2020",
    hottest: monthlyNormals[6] ?? monthlyNormals[0]!,
    coldest: monthlyNormals[0] ?? monthlyNormals[0]!,
    currentMonth: monthlyNormals[5] ?? null,
    monthlyNormals,
    onThisDay: {
      monthDayLabel: "June 2",
      avgHighC: 26,
      avgLowC: 16,
      avgPrecipMm: 2.1,
      sampleYears: 30,
    },
  }
}

function mockPayload(lat: number, lon: number, city: string, isDefaultLocation: boolean) {
  const climateNormals = mockClimateNormals()
  const body: ForecastBody = {
    timezone: "America/New_York",
    timezone_abbreviation: "EDT",
    elevation: 10,
    current: {
      time: "2026-06-02T14:30",
      temperature_2m: 22,
      apparent_temperature: 21,
      relative_humidity_2m: 55,
      weather_code: 1,
      wind_speed_10m: 8,
      wind_direction_10m: 180,
      wind_gusts_10m: 14,
      precipitation: 0,
      cloud_cover: 25,
      pressure_msl: 1015,
      visibility: 20000,
      dew_point_2m: 12,
      is_day: 1,
      wet_bulb_temperature_2m: 18,
    },
    hourly: {
      time: Array.from({ length: 48 }, (_, index) => `2026-06-02T${String(index % 24).padStart(2, "0")}:00`),
      temperature_2m: Array.from({ length: 48 }, () => 20 + Math.random() * 4),
      apparent_temperature: Array.from({ length: 48 }, () => 19 + Math.random() * 4),
      weather_code: Array.from({ length: 48 }, () => 1),
      precipitation_probability: Array.from({ length: 48 }, () => 10),
      precipitation: Array.from({ length: 48 }, () => 0),
      wind_speed_10m: Array.from({ length: 48 }, () => 8),
      wind_direction_10m: Array.from({ length: 48 }, () => 180),
      wind_gusts_10m: Array.from({ length: 48 }, () => 14),
      wet_bulb_temperature_2m: Array.from({ length: 48 }, () => 17),
      is_day: Array.from({ length: 48 }, (_, index) => (index >= 6 && index <= 20 ? 1 : 0)),
    },
    daily: {
      time: Array.from({ length: PAST_DAYS + 16 }, (_, index) => {
        const day = 2 + index - PAST_DAYS
        return `2026-06-${String(Math.max(1, day)).padStart(2, "0")}`
      }),
      weather_code: Array.from({ length: PAST_DAYS + 16 }, (_, index) => [1, 2, 3, 61, 2, 1, 0, 1][index % 8] ?? 1),
      temperature_2m_max: Array.from({ length: PAST_DAYS + 16 }, () => 24),
      temperature_2m_min: Array.from({ length: PAST_DAYS + 16 }, () => 15),
      precipitation_sum: Array.from({ length: PAST_DAYS + 16 }, () => 0),
      precipitation_probability_max: Array.from({ length: PAST_DAYS + 16 }, () => 10),
      uv_index_max: Array.from({ length: PAST_DAYS + 16 }, () => 6),
      sunrise: Array.from({ length: PAST_DAYS + 16 }, () => "2026-06-02T05:45"),
      sunset: Array.from({ length: PAST_DAYS + 16 }, () => "2026-06-02T20:15"),
      snowfall_sum: Array.from({ length: PAST_DAYS + 16 }, () => 0),
      rain_sum: Array.from({ length: PAST_DAYS + 16 }, () => 0),
      sunshine_duration: Array.from({ length: PAST_DAYS + 16 }, () => 28_800),
      daylight_duration: Array.from({ length: PAST_DAYS + 16 }, () => 52_200),
      wind_gusts_10m_max: Array.from({ length: PAST_DAYS + 16 }, () => 22),
    },
  }

  return buildWeatherPayload(
    lat,
    lon,
    city,
    body,
    {
      usAqi: 42,
      europeanAqi: 35,
      pm25: 5.2,
      pm10: 12,
      ozone: 45,
      nitrogenDioxide: 8,
      carbonMonoxide: 200,
      sulphurDioxide: 1,
      label: "Good",
    },
    null,
    null,
    climateNormals,
    isDefaultLocation,
    { alerts: [], marine: null }
  )
}

function readSearchParam(
  sp: Record<string, string | string[] | undefined>,
  key: keyof WeatherQueryParams
): string | undefined {
  const val = sp[key]
  if (typeof val === "string" && val.trim() !== "") return val
  if (Array.isArray(val) && typeof val[0] === "string" && val[0].trim() !== "") return val[0]
  return undefined
}

export function weatherQueryFromSearchParams(
  sp: Record<string, string | string[] | undefined>
): WeatherQueryParams {
  return {
    lat: readSearchParam(sp, "lat"),
    lon: readSearchParam(sp, "lon"),
    latitude: readSearchParam(sp, "latitude"),
    longitude: readSearchParam(sp, "longitude"),
    city: readSearchParam(sp, "city"),
    q: readSearchParam(sp, "q"),
    approx: readSearchParam(sp, "approx"),
    includeClimate: readSearchParam(sp, "includeClimate"),
  }
}

export function coordsMatch(
  a: { lat?: string; lon?: string; latitude?: string; longitude?: string },
  b: { lat?: string; lon?: string; latitude?: string; longitude?: string }
): boolean {
  const latA = parseCoord(a.lat ?? a.latitude)
  const lonA = parseCoord(a.lon ?? a.longitude)
  const latB = parseCoord(b.lat ?? b.latitude)
  const lonB = parseCoord(b.lon ?? b.longitude)
  if (latA == null || lonA == null || latB == null || lonB == null) return false
  return latA.toFixed(4) === latB.toFixed(4) && lonA.toFixed(4) === lonB.toFixed(4)
}

function shouldIncludeClimate(raw: WeatherQueryParams, options?: WeatherLoadOptions): boolean {
  if (options?.includeClimate === false) return false
  if (raw.includeClimate === "0") return false
  return true
}

export async function getClimateData(lat: number, lon: number, temperatureC?: number | null): Promise<ClimateDataResult> {
  if (process.env.WEATHER_USE_MOCK === "1") {
    const climateNormals = mockClimateNormals()
    return {
      status: 200,
      data: {
        climateNormals,
        temperatureAnomalyC: computeTemperatureAnomaly(temperatureC ?? null, climateNormals.currentMonth),
      },
    }
  }

  try {
    const climateRes = await fetch(buildClimateArchiveUrl(lat, lon), { next: { revalidate: 86_400 } })
    const climateNormals = climateRes.ok
      ? parseClimateExtremes((await climateRes.json()) as { daily?: Record<string, unknown> })
      : null

    return {
      status: climateRes.ok ? 200 : 502,
      data: {
        climateNormals,
        temperatureAnomalyC: computeTemperatureAnomaly(temperatureC ?? null, climateNormals?.currentMonth ?? null),
      },
    }
  } catch {
    return {
      status: 502,
      data: { climateNormals: null, temperatureAnomalyC: null },
    }
  }
}

export async function getWeatherData(
  raw: WeatherQueryParams,
  options?: WeatherLoadOptions
): Promise<WeatherDataResult> {
  const parsed = WeatherQuerySchema.safeParse(raw)
  if (!parsed.success) {
    return { status: 400, data: { error: "Invalid query parameters" } }
  }

  const latRaw = parsed.data.lat ?? parsed.data.latitude
  const lonRaw = parsed.data.lon ?? parsed.data.longitude
  const cityRaw = parsed.data.city ?? parsed.data.q
  const includeClimate = shouldIncludeClimate(parsed.data, options)
  const locationSource =
    parsed.data.approx === "1" ? ("network" as const) : latRaw && lonRaw ? ("gps" as const) : null

  const resolved = await resolveLocation(latRaw, lonRaw, cityRaw)
  if ("error" in resolved) {
    return { status: 404, data: { error: resolved.error } }
  }

  const { lat, lon, city, meta, isDefaultLocation } = resolved

  if (process.env.WEATHER_USE_MOCK === "1") {
    return { status: 200, data: { ...mockPayload(lat, lon, city, isDefaultLocation), source: "mock" } }
  }

  try {
    const [forecastRes, airQualityRes, climateRes, marine, alerts] = await Promise.all([
      fetch(buildForecastUrl(lat, lon), { next: { revalidate: 300 } }),
      fetch(buildAirQualityUrl(lat, lon), { next: { revalidate: 300 } }),
      includeClimate ? fetch(buildClimateArchiveUrl(lat, lon), { next: { revalidate: 86_400 } }) : Promise.resolve(null),
      fetchMarineSnapshot(lat, lon),
      fetchNwsAlerts(lat, lon),
    ])

    if (!forecastRes.ok) {
      const text = await forecastRes.text().catch(() => "")
      return {
        status: 502,
        data: {
          error: `Weather provider error (${forecastRes.status})${text ? `: ${text.slice(0, 120)}` : ""}`,
        },
      }
    }

    const body = (await forecastRes.json()) as ForecastBody
    const airQuality = airQualityRes.ok
      ? parseAirQuality((await airQualityRes.json()) as Parameters<typeof parseAirQuality>[0])
      : {
          usAqi: null,
          europeanAqi: null,
          pm25: null,
          pm10: null,
          ozone: null,
          nitrogenDioxide: null,
          carbonMonoxide: null,
          sulphurDioxide: null,
          label: "—",
        }
    const climateNormals =
      climateRes?.ok === true
        ? parseClimateExtremes((await climateRes.json()) as { daily?: Record<string, unknown> })
        : null

    return {
      status: 200,
      data: buildWeatherPayload(
        lat,
        lon,
        city,
        body,
        airQuality,
        meta,
        locationSource,
        climateNormals,
        isDefaultLocation,
        { alerts, marine }
      ),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return { status: 502, data: { error: `Failed to fetch weather: ${message}` } }
  }
}

export function isDefaultWeatherQuery(raw: WeatherQueryParams): boolean {
  return !hasLocationParams(raw)
}

export { DEFAULT_LAT, DEFAULT_LON }
