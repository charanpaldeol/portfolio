// Purpose: Fetch active US NWS weather alerts for a coordinate (api.weather.gov).
import type { WeatherAlert } from "@/lib/weather-types"

const NWS_USER_AGENT = "cpdeol.com weather (portfolio contact@cpdeol.com)"

export function isUsCoordinates(lat: number, lon: number): boolean {
  return lat >= 18 && lat <= 72 && lon >= -180 && lon <= -50
}

type NwsAlertsBody = {
  features?: Array<{
    id?: string
    properties?: {
      event?: string
      headline?: string
      severity?: string
      urgency?: string
      senderName?: string
    }
  }>
}

export async function fetchNwsAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
  if (!isUsCoordinates(lat, lon)) return []

  try {
    const url = `https://api.weather.gov/alerts/active?point=${lat.toFixed(4)},${lon.toFixed(4)}`
    const res = await fetch(url, {
      headers: {
        Accept: "application/geo+json",
        "User-Agent": NWS_USER_AGENT,
      },
      next: { revalidate: 300 },
    })
    if (!res.ok) return []

    const body = (await res.json()) as NwsAlertsBody
    const features = body.features ?? []

    return features
      .map((feature, index) => {
        const props = feature.properties
        if (!props?.event) return null
        return {
          id: feature.id ?? `nws-${index}`,
          event: props.event,
          headline: props.headline ?? props.event,
          severity: props.severity ?? "Unknown",
          urgency: props.urgency ?? "Unknown",
          source: props.senderName ?? "NWS",
        } satisfies WeatherAlert
      })
      .filter((alert): alert is WeatherAlert => alert != null)
      .slice(0, 8)
  } catch {
    return []
  }
}
