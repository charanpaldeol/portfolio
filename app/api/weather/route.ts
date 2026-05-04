import { NextResponse } from "next/server"
import { z } from "zod"

const DEFAULT_LAT = 40.7128
const DEFAULT_LON = -74.006

/** Accept known query keys only; extra params ignored (safe for forward proxies). */
const WeatherQuerySchema = z.object({
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  lat: z.string().optional(),
  lon: z.string().optional(),
  city: z.string().optional(),
  q: z.string().optional(),
})

function parseCoord(raw: string | undefined, min: number, max: number, fallback: number): number {
  if (raw == null || raw.trim() === "") return fallback
  const n = Number.parseFloat(raw)
  if (!Number.isFinite(n) || n < min || n > max) return fallback
  return n
}

async function resolveLatLon(parsed: z.infer<typeof WeatherQuerySchema>): Promise<{ lat: number; lon: number }> {
  const city = (parsed.city ?? parsed.q ?? "").trim()
  if (city) {
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      const geoRes = await fetch(geoUrl, { next: { revalidate: 3600 } })
      if (geoRes.ok) {
        const geo = (await geoRes.json()) as { results?: Array<{ latitude: number; longitude: number }> }
        const first = geo.results?.[0]
        if (first && typeof first.latitude === "number" && typeof first.longitude === "number") {
          return { lat: first.latitude, lon: first.longitude }
        }
      }
    } catch {
      // fall through to safe defaults
    }
    return { lat: DEFAULT_LAT, lon: DEFAULT_LON }
  }

  const lat = parseCoord(parsed.latitude ?? parsed.lat, -90, 90, DEFAULT_LAT)
  const lon = parseCoord(parsed.longitude ?? parsed.lon, -180, 180, DEFAULT_LON)
  return { lat, lon }
}

function buildForecastUrl(lat: number, lon: number): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,weather_code",
    timezone: "auto",
  })
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`
}

/**
 * Weather API handler with optional location query parameters.
 *
 * Query parameters (all optional):
 *   - `latitude` | `lat`: latitude value (-90 to 90); defaults to 40.7128 (NYC)
 *   - `longitude` | `lon`: longitude value (-180 to 180); defaults to -74.006 (NYC)
 *   - `city` | `q`: city name for geocoding via Open-Meteo; falls back to lat/lon defaults
 *
 * Behavior:
 *   - Unknown query params are ignored (forward-proxy safe).
 *   - Invalid coordinates clamp to valid ranges or fallback to NYC defaults.
 *   - City lookup uses Open-Meteo geocoding API (free, no credentials needed).
 *   - Provider: Open-Meteo (free, no API key required).
 *   - If upstream fetch fails, returns a mock payload for local dev/factory verification.
 *
 * Example: /api/weather?city=London or /api/weather?lat=51.5074&lon=-0.1278
 */
export async function GET(request: Request) {
  const urlObj = new URL(request.url)
  const raw = Object.fromEntries(urlObj.searchParams.entries())
  const parsed = WeatherQuerySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 })
  }
  const { lat, lon } = await resolveLatLon(parsed.data)

  const forecastUrl = buildForecastUrl(lat, lon)

  try {
    const upstream = await fetch(forecastUrl, { next: { revalidate: 600 } })
    if (!upstream.ok) throw new Error(`open-meteo status ${upstream.status}`)
    const body = (await upstream.json()) as {
      current?: { temperature_2m?: number; weather_code?: number }
    }
    const current = body.current
    const t = current?.temperature_2m
    const code = current?.weather_code
    return NextResponse.json({
      source: "open-meteo",
      lat,
      lon,
      city: parsed.data.city ?? parsed.data.q ?? "",
      temperatureC: typeof t === "number" && Number.isFinite(t) ? t : 0,
      weatherCode: typeof code === "number" && Number.isFinite(code) ? code : 0,
      current: {
        temperature_2m: current?.temperature_2m ?? null,
        weather_code: current?.weather_code ?? null,
      },
    })
  } catch {
    return NextResponse.json({
      source: "mock",
      lat,
      lon,
      city: parsed.data.city ?? parsed.data.q ?? "",
      temperatureC: 18,
      weatherCode: 0,
      current: { temperature_2m: 18, weather_code: 0 },
    })
  }
}
