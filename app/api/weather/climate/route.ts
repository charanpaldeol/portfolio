// Purpose: Climate normals API — deferred load for faster initial weather paint.
import { NextResponse } from "next/server"
import { z } from "zod"

import { getClimateData } from "@/lib/weather-service"

const ClimateQuerySchema = z.object({
  lat: z.string(),
  lon: z.string(),
  temperatureC: z.string().optional(),
})

export async function GET(request: Request) {
  const urlObj = new URL(request.url)
  const raw = Object.fromEntries(urlObj.searchParams.entries())
  const parsed = ClimateQuerySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 })
  }

  const lat = Number.parseFloat(parsed.data.lat)
  const lon = Number.parseFloat(parsed.data.lon)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 })
  }

  const temperatureC = parsed.data.temperatureC ? Number.parseFloat(parsed.data.temperatureC) : null
  const result = await getClimateData(lat, lon, temperatureC)

  return NextResponse.json(result.data, { status: result.status })
}
