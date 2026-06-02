// Purpose: Shared geocoding helpers for weather location search and labels.

export type GeoPlace = {
  lat: number
  lon: number
  city: string
  elevationM?: number | null
  population?: number | null
  timezone?: string | null
}

export type LocationSuggestion = {
  id: number
  label: string
  lat: number
  lon: number
  elevationM?: number | null
  population?: number | null
  timezone?: string | null
}

export function formatPlaceName(parts: {
  name?: string
  admin1?: string
  country?: string
}): string {
  const clean = (value?: string) => {
    if (typeof value !== "string") return ""
    return value
      .replace(/\s*\(the\)\s*$/i, "")
      .replace(/\s+/g, " ")
      .trim()
  }

  const segments = [parts.name, parts.admin1, parts.country]
    .map(clean)
    .filter((part) => part !== "")
  return segments.join(", ")
}

type OpenMeteoResult = {
  id?: number
  name?: string
  latitude?: number
  longitude?: number
  country?: string
  admin1?: string
  elevation?: number
  population?: number
  timezone?: string
}

async function fetchOpenMeteoResults(query: string, count: number): Promise<OpenMeteoResult[]> {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=${count}`
  const geoRes = await fetch(geoUrl, { next: { revalidate: 3600 } })
  if (!geoRes.ok) return []

  const geo = (await geoRes.json()) as { results?: OpenMeteoResult[] }
  return geo.results ?? []
}

export async function searchLocations(query: string, limit = 8): Promise<LocationSuggestion[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  const results = await fetchOpenMeteoResults(trimmed, limit)
  return results
    .filter(
      (result): result is OpenMeteoResult & { id: number; name: string; latitude: number; longitude: number } =>
        typeof result.id === "number" &&
        typeof result.name === "string" &&
        typeof result.latitude === "number" &&
        typeof result.longitude === "number"
    )
    .map((result) => ({
      id: result.id,
      label: formatPlaceName({
        name: result.name,
        admin1: result.admin1,
        country: result.country,
      }),
      lat: result.latitude,
      lon: result.longitude,
      elevationM:
        typeof result.elevation === "number" && Number.isFinite(result.elevation) ? result.elevation : null,
      population:
        typeof result.population === "number" && Number.isFinite(result.population) ? result.population : null,
      timezone: typeof result.timezone === "string" && result.timezone.trim() !== "" ? result.timezone : null,
    }))
}

export async function geocodeCity(query: string): Promise<GeoPlace | null> {
  const [first] = await searchLocations(query, 1)
  if (!first) return null

  return {
    lat: first.lat,
    lon: first.lon,
    city: first.label,
    elevationM: first.elevationM ?? null,
    population: first.population ?? null,
    timezone: first.timezone ?? null,
  }
}

export async function reverseGeocodeCity(lat: number, lon: number): Promise<string> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    localityLanguage: "en",
  })
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?${params.toString()}`
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return ""
    const data = (await res.json()) as {
      city?: string
      locality?: string
      principalSubdivision?: string
      countryName?: string
    }
    return formatPlaceName({
      name: data.city ?? data.locality,
      admin1: data.principalSubdivision,
      country: data.countryName,
    })
  } catch {
    return ""
  }
}
