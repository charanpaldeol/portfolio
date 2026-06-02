// Purpose: Open-Meteo weather API — current conditions, 7-day forecast, and air quality.
import { NextResponse } from "next/server"
import { z } from "zod"

import { geocodeCity, reverseGeocodeCity, type GeoPlace } from "@/lib/weather-geocode"
import { weatherConditionFromCode } from "@/lib/weather-code"
import { buildClimateArchiveUrl, parseClimateExtremes } from "@/lib/weather-climate"
import { buildDailyForecast, parseAirQuality } from "@/lib/weather-response"
import type { AirQualitySnapshot, ClimateExtremes, DailyForecastDay } from "@/lib/weather-types"

const WeatherQuerySchema = z.object({
  lat: z.string().optional(),
  lon: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  city: z.string().optional(),
  q: z.string().optional(),
  approx: z.string().optional(),
})

const DEFAULT_LAT = 40.7128
const DEFAULT_LON = -74.006

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
    precipitation?: number
    cloud_cover?: number
    pressure_msl?: number
    visibility?: number
    is_day?: number
  }
  daily?: {
    time?: string[]
    temperature_2m_max?: number[]
    temperature_2m_min?: number[]
    weather_code?: number[]
    precipitation_sum?: number[]
    uv_index_max?: number[]
    sunrise?: string[]
    sunset?: string[]
  }
}

function buildForecastUrl(lat: number, lon: number): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,precipitation,cloud_cover,pressure_msl,visibility,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,sunrise,sunset",
    timezone: "auto",
    forecast_days: "7",
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

async function resolveLocation(
  latRaw: string | undefined,
  lonRaw: string | undefined,
  cityRaw: string | undefined
): Promise<{ lat: number; lon: number; city: string; meta: GeoPlace | null } | { error: string }> {
  const latParam = parseCoord(latRaw)
  const lonParam = parseCoord(lonRaw)
  const cityQuery = (cityRaw ?? "").trim()

  if (latParam != null && lonParam != null) {
    const city = (await reverseGeocodeCity(latParam, lonParam)) || "Current location"
    return { lat: latParam, lon: lonParam, city, meta: null }
  }

  if (cityQuery) {
    const place = await geocodeCity(cityQuery)
    if (!place) {
      return { error: `Could not find a location for "${cityQuery}". Try a different spelling.` }
    }
    return { lat: place.lat, lon: place.lon, city: place.city, meta: place }
  }

  const city = (await reverseGeocodeCity(DEFAULT_LAT, DEFAULT_LON)) || "New York"
  return { lat: DEFAULT_LAT, lon: DEFAULT_LON, city, meta: null }
}

function buildWeatherPayload(
  lat: number,
  lon: number,
  city: string,
  body: ForecastBody,
  airQuality: AirQualitySnapshot,
  locationMeta: GeoPlace | null,
  locationSource: "gps" | "network" | null,
  climateNormals: ClimateExtremes | null
) {
  const current = body.current ?? {}
  const daily = body.daily ?? {}
  const weatherCode = current.weather_code ?? 0
  const dailyForecast: DailyForecastDay[] = buildDailyForecast(daily, 7)
  const elevationM =
    typeof body.elevation === "number" && Number.isFinite(body.elevation)
      ? body.elevation
      : (locationMeta?.elevationM ?? null)

  return {
    lat,
    lon,
    city,
    temperatureC: current.temperature_2m ?? null,
    feelsLikeC: current.apparent_temperature ?? null,
    humidityPercent: current.relative_humidity_2m ?? null,
    weatherCode,
    condition: weatherConditionFromCode(weatherCode),
    windSpeedKmh: current.wind_speed_10m ?? null,
    windDirectionDeg: current.wind_direction_10m ?? null,
    precipitationMm: current.precipitation ?? null,
    precipitationSumTodayMm: daily.precipitation_sum?.[0] ?? null,
    cloudCoverPercent: current.cloud_cover ?? null,
    pressureHpa: current.pressure_msl ?? null,
    visibilityM: current.visibility ?? null,
    isDay: current.is_day === 1,
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
    climateNormals,
    source: "open-meteo" as const,
    current,
    daily,
  }
}

function mockPayload(lat: number, lon: number, city: string) {
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
      precipitation: 0,
      cloud_cover: 25,
      pressure_msl: 1015,
      visibility: 20000,
      is_day: 1,
    },
    daily: {
      time: ["2026-06-02", "2026-06-03", "2026-06-04", "2026-06-05", "2026-06-06", "2026-06-07", "2026-06-08"],
      weather_code: [1, 2, 3, 61, 2, 1, 0],
      temperature_2m_max: [24, 26, 23, 22, 25, 27, 28],
      temperature_2m_min: [15, 16, 14, 13, 15, 17, 18],
      precipitation_sum: [0, 0.2, 1.5, 4, 0, 0, 0],
      uv_index_max: [6, 7, 5, 4, 6, 8, 8],
      sunrise: [
        "2026-06-02T05:45",
        "2026-06-03T05:45",
        "2026-06-04T05:44",
        "2026-06-05T05:44",
        "2026-06-06T05:44",
        "2026-06-07T05:43",
        "2026-06-08T05:43",
      ],
      sunset: [
        "2026-06-02T20:15",
        "2026-06-03T20:16",
        "2026-06-04T20:16",
        "2026-06-05T20:17",
        "2026-06-06T20:17",
        "2026-06-07T20:18",
        "2026-06-08T20:18",
      ],
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
    {
      periodLabel: "1991–2020",
      hottest: { month: 7, monthName: "July", meanC: 24.5, highC: 29.8, lowC: 19.2 },
      coldest: { month: 1, monthName: "January", meanC: 1.2, highC: 4.8, lowC: -2.1 },
    }
  )
}

/**
 * GET /api/weather
 * Query: lat, lon (or latitude, longitude), city (or q), approx=1 for network location.
 */
export async function GET(request: Request) {
  const urlObj = new URL(request.url)
  const raw = Object.fromEntries(urlObj.searchParams.entries())
  const parsed = WeatherQuerySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 })
  }

  const latRaw = parsed.data.lat ?? parsed.data.latitude
  const lonRaw = parsed.data.lon ?? parsed.data.longitude
  const cityRaw = parsed.data.city ?? parsed.data.q
  const locationSource =
    parsed.data.approx === "1" ? ("network" as const) : latRaw && lonRaw ? ("gps" as const) : null

  const resolved = await resolveLocation(latRaw, lonRaw, cityRaw)
  if ("error" in resolved) {
    return NextResponse.json({ error: resolved.error }, { status: 404 })
  }

  const { lat, lon, city, meta } = resolved

  if (process.env.WEATHER_USE_MOCK === "1") {
    return NextResponse.json({ ...mockPayload(lat, lon, city), source: "mock" })
  }

  try {
    const [forecastRes, airQualityRes, climateRes] = await Promise.all([
      fetch(buildForecastUrl(lat, lon), { next: { revalidate: 300 } }),
      fetch(buildAirQualityUrl(lat, lon), { next: { revalidate: 300 } }),
      fetch(buildClimateArchiveUrl(lat, lon), { next: { revalidate: 86_400 } }),
    ])

    if (!forecastRes.ok) {
      const text = await forecastRes.text().catch(() => "")
      return NextResponse.json(
        { error: `Weather provider error (${forecastRes.status})${text ? `: ${text.slice(0, 120)}` : ""}` },
        { status: 502 }
      )
    }

    const body = (await forecastRes.json()) as ForecastBody
    const airQuality = airQualityRes.ok
      ? parseAirQuality((await airQualityRes.json()) as { current?: { us_aqi?: number; pm2_5?: number } })
      : { usAqi: null, pm25: null, label: "—" }
    const climateNormals = climateRes.ok
      ? parseClimateExtremes((await climateRes.json()) as { daily?: Record<string, unknown> })
      : null

    return NextResponse.json(
      buildWeatherPayload(lat, lon, city, body, airQuality, meta, locationSource, climateNormals)
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Failed to fetch weather: ${message}` }, { status: 502 })
  }
}
