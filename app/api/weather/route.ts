// Purpose: Open-Meteo weather API — current conditions, 7-day forecast, and air quality.
import { NextResponse } from "next/server"
import { z } from "zod"

import { getWeatherData, WeatherQuerySchema } from "@/lib/weather-service"

type WeatherQuery = z.infer<typeof WeatherQuerySchema>
void (null as WeatherQuery | null)

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

  const result = await getWeatherData(parsed.data)
  return NextResponse.json(result.data, { status: result.status })
}
