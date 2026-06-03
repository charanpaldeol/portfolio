// Purpose: Client-side recent location history for weather search (localStorage).

export type RecentLocation = {
  label: string
  lat: number
  lon: number
}

export const WEATHER_RECENT_STORAGE_KEY = "weather-recent-locations"
const MAX_RECENT = 5

export function loadRecentLocations(): RecentLocation[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(WEATHER_RECENT_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (item): item is RecentLocation =>
          !!item &&
          typeof item === "object" &&
          typeof (item as RecentLocation).label === "string" &&
          typeof (item as RecentLocation).lat === "number" &&
          typeof (item as RecentLocation).lon === "number"
      )
      .slice(0, MAX_RECENT)
  } catch {
    return []
  }
}

export function saveRecentLocation(location: RecentLocation): void {
  if (typeof window === "undefined") return
  const label = location.label.trim()
  if (!label) return

  const next: RecentLocation = {
    label,
    lat: location.lat,
    lon: location.lon,
  }

  const existing = loadRecentLocations().filter(
    (item) => item.lat.toFixed(4) !== next.lat.toFixed(4) || item.lon.toFixed(4) !== next.lon.toFixed(4)
  )
  const merged = [next, ...existing].slice(0, MAX_RECENT)

  try {
    window.localStorage.setItem(WEATHER_RECENT_STORAGE_KEY, JSON.stringify(merged))
  } catch {
    // ignore quota errors
  }
}
