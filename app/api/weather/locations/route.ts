// Purpose: Location autocomplete for weather city search.
import { NextResponse } from "next/server"
import { z } from "zod"

import { searchLocations } from "@/lib/weather-geocode"

const LocationsQuerySchema = z.object({
  q: z.string().optional(),
  limit: z.string().optional(),
})

function parseLimit(raw: string | undefined): number {
  if (!raw) return 8
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 1) return 8
  return Math.min(n, 10)
}

/**
 * GET /api/weather/locations?q=ludhiana
 * Returns matching places for the weather search dropdown.
 */
export async function GET(request: Request) {
  const urlObj = new URL(request.url)
  const raw = Object.fromEntries(urlObj.searchParams.entries())
  const parsed = LocationsQuerySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 })
  }

  const query = (parsed.data.q ?? "").trim()
  if (query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const results = await searchLocations(query, parseLimit(parsed.data.limit))
  return NextResponse.json({ results })
}
