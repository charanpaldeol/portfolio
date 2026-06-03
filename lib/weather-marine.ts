// Purpose: Fetch coastal marine conditions from Open-Meteo Marine API.
import type { MarineSnapshot } from "@/lib/weather-types"

type MarineBody = {
  current?: {
    wave_height?: number
    wave_period?: number
    wave_direction?: number
    sea_surface_temperature?: number
  }
}

export function buildMarineUrl(lat: number, lon: number): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "wave_height,wave_period,wave_direction,sea_surface_temperature",
    timezone: "auto",
  })
  return `https://marine-api.open-meteo.com/v1/marine?${params.toString()}`
}

export function parseMarineSnapshot(body: MarineBody): MarineSnapshot | null {
  const current = body.current
  if (!current) return null

  const waveHeightM =
    typeof current.wave_height === "number" && Number.isFinite(current.wave_height)
      ? current.wave_height
      : null

  if (waveHeightM == null) return null

  return {
    waveHeightM,
    wavePeriodSec:
      typeof current.wave_period === "number" && Number.isFinite(current.wave_period)
        ? current.wave_period
        : null,
    waveDirectionDeg:
      typeof current.wave_direction === "number" && Number.isFinite(current.wave_direction)
        ? current.wave_direction
        : null,
    seaSurfaceTempC:
      typeof current.sea_surface_temperature === "number" && Number.isFinite(current.sea_surface_temperature)
        ? current.sea_surface_temperature
        : null,
  }
}

export async function fetchMarineSnapshot(lat: number, lon: number): Promise<MarineSnapshot | null> {
  try {
    const res = await fetch(buildMarineUrl(lat, lon), { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return parseMarineSnapshot((await res.json()) as MarineBody)
  } catch {
    return null
  }
}
