// Purpose: Shared weather loader for /api/weather and the /weather page (avoids SSR self-fetch).
import { z } from "zod"

import {
  buildClimateArchiveUrl,
  computeTemperatureAnomaly,
  parseClimateExtremes,
} from "@/lib/weather-climate"
import { weatherConditionFromCode } from "@/lib/weather-code"
import { geocodeCity, reverseGeocodeCity } from "@/lib/weather-geocode"
import type { GeoPlace } from "@/lib/weather-geocode"
import { buildDailyForecast, buildHourlyForecast, parseAirQuality } from "@/lib/weather-response"
import type { AirQualitySnapshot, ClimateExtremes, DailyForecastDay, HourlyForecastHour } from "@/lib/weather-types"

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
      "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,cloud_cover,pressure_msl,visibility,dew_point_2m,is_day",
    hourly:
      "temperature_2m,apparent_temperature,weather_code,precipitation_probability,precipitation,wind_speed_10m,wind_direction_10m,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,sunrise,sunset",
    timezone: "auto",
    forecast_days: String(FORECAST_DAYS),
  })
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`
}

function buildAirQualityUrl(lat: number, lon: number): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "us_aqi,pm2_5",
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
  isDefaultLocation: boolean
) {
  const current = body.current ?? {}
  const daily = body.daily ?? {}
  const weatherCode = current.weather_code ?? 0
  const dailyForecast: DailyForecastDay[] = buildDailyForecast(daily, FORECAST_DAYS)
  const hourlyForecast: HourlyForecastHour[] = buildHourlyForecast(body.hourly, HOURLY_HOURS)
  const elevationM =
    typeof body.elevation === "number" && Number.isFinite(body.elevation)
      ? body.elevation
      : (locationMeta?.elevationM ?? null)
  const temperatureC = current.temperature_2m ?? null
  const temperatureAnomalyC = computeTemperatureAnomaly(temperatureC, climateNormals?.currentMonth ?? null)

  return {
    lat,
    lon,
    city,
    temperatureC,
    feelsLikeC: current.apparent_temperature ?? null,
    humidityPercent: current.relative_humidity_2m ?? null,
    weatherCode,
    condition: weatherConditionFromCode(weatherCode),
    windSpeedKmh: current.wind_speed_10m ?? null,
    windDirectionDeg: current.wind_direction_10m ?? null,
    windGustKmh: current.wind_gusts_10m ?? null,
    dewPointC: current.dew_point_2m ?? null,
    precipitationMm: current.precipitation ?? null,
    precipitationSumTodayMm: daily.precipitation_sum?.[0] ?? null,
    cloudCoverPercent: current.cloud_cover ?? null,
    pressureHpa: current.pressure_msl ?? null,
    visibilityM: current.visibility ?? null,
    isDay: current.is_day === 1 ? true : current.is_day === 0 ? false : null,
    todayHighC: daily.temperature_2m_max?.[0] ?? null,
    todayLowC: daily.temperature_2m_min?.[0] ?? null,
    uvIndexMax: daily.uv_index_max?.[0] ?? null,
    sunrise: daily.sunrise?.[0] ?? null,
    sunset: daily.sunset?.[0] ?? null,
    observedAt: current.time ?? null,
    timezone: body.timezone ?? null,
    timezoneAbbreviation: body.timezone_abbreviation ?? null,
    elevationM,
    population: locationMeta?.population ?? null,
    locationSource,
    airQuality,
    dailyForecast,
    hourlyForecast,
    climateNormals,
    temperatureAnomalyC,
    isDefaultLocation,
    source: "open-meteo" as const,
    current,
    daily,
  }
}

function mockClimateNormals(): ClimateExtremes {
  return {
    periodLabel: "1991–2020",
    hottest: { month: 7, monthName: "July", meanC: 24.5, highC: 29.8, lowC: 19.2 },
    coldest: { month: 1, monthName: "January", meanC: 1.2, highC: 4.8, lowC: -2.1 },
    currentMonth: { month: 6, monthName: "June", meanC: 22, highC: 26, lowC: 18 },
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
      is_day: Array.from({ length: 48 }, (_, index) => (index >= 6 && index <= 20 ? 1 : 0)),
    },
    daily: {
      time: Array.from({ length: 16 }, (_, index) => {
        const day = 2 + index
        return `2026-06-${String(day).padStart(2, "0")}`
      }),
      weather_code: [1, 2, 3, 61, 2, 1, 0, 1, 2, 3, 61, 2, 1, 0, 1, 2],
      temperature_2m_max: [24, 26, 23, 22, 25, 27, 28, 24, 26, 23, 22, 25, 27, 28, 24, 26],
      temperature_2m_min: [15, 16, 14, 13, 15, 17, 18, 15, 16, 14, 13, 15, 17, 18, 15, 16],
      precipitation_sum: [0, 0.2, 1.5, 4, 0, 0, 0, 0, 0.2, 1.5, 4, 0, 0, 0, 0, 0.2],
      precipitation_probability_max: [5, 10, 40, 80, 15, 5, 0, 5, 10, 40, 80, 15, 5, 0, 5, 10],
      uv_index_max: [6, 7, 5, 4, 6, 8, 8, 6, 7, 5, 4, 6, 8, 8, 6, 7],
      sunrise: Array.from({ length: 16 }, () => "2026-06-02T05:45"),
      sunset: Array.from({ length: 16 }, () => "2026-06-02T20:15"),
    },
  }

  return buildWeatherPayload(
    lat,
    lon,
    city,
    body,
    { usAqi: 42, pm25: 5.2, label: "Good" },
    null,
    null,
    climateNormals,
    isDefaultLocation
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
    const fetches: [Promise<Response>, Promise<Response>, Promise<Response> | null] = [
      fetch(buildForecastUrl(lat, lon), { next: { revalidate: 300 } }),
      fetch(buildAirQualityUrl(lat, lon), { next: { revalidate: 300 } }),
      includeClimate ? fetch(buildClimateArchiveUrl(lat, lon), { next: { revalidate: 86_400 } }) : null,
    ]

    const [forecastRes, airQualityRes, climateRes] = await Promise.all([
      fetches[0],
      fetches[1],
      fetches[2] ?? Promise.resolve(null),
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
      ? parseAirQuality((await airQualityRes.json()) as { current?: { us_aqi?: number; pm2_5?: number } })
      : { usAqi: null, pm25: null, label: "—" }
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
        isDefaultLocation
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
