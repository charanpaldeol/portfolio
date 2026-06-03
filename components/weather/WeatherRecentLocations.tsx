"use client"

// Purpose: Quick-pick recent weather locations from localStorage.
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { clearRecentLocations, loadRecentLocations, removeRecentLocation } from "@/lib/weather-recent"
import type { RecentLocation } from "@/lib/weather-recent"

export function WeatherRecentLocations() {
  const router = useRouter()
  const [recent, setRecent] = useState<RecentLocation[]>([])

  const reload = useCallback(() => {
    setRecent(loadRecentLocations())
  }, [])

  useEffect(() => {
    reload()
    window.addEventListener("storage", reload)
    window.addEventListener("weather-recent-changed", reload)
    return () => {
      window.removeEventListener("storage", reload)
      window.removeEventListener("weather-recent-changed", reload)
    }
  }, [reload])

  if (recent.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">Recent</span>
      {recent.map((location) => (
        <span key={`${location.lat}-${location.lon}`} className="inline-flex items-center">
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams()
              params.set("lat", location.lat.toFixed(4))
              params.set("lon", location.lon.toFixed(4))
              params.set("city", location.label)
              router.push(`/weather?${params.toString()}`)
            }}
            className="rounded-l-full bg-surface-container-low py-1 pl-2.5 pr-1.5 text-xs font-medium text-on-surface ring-1 ring-outline-variant/15 hover:bg-surface-container"
          >
            {location.label.split(",")[0]?.trim() || location.label}
          </button>
          <button
            type="button"
            aria-label={`Remove ${location.label.split(",")[0]?.trim() || location.label} from recent`}
            onClick={() => {
              removeRecentLocation(location.lat, location.lon)
              window.dispatchEvent(new Event("weather-recent-changed"))
            }}
            className="rounded-r-full bg-surface-container-low py-1 pr-2 pl-1 text-xs text-on-surface-variant ring-1 ring-l-0 ring-outline-variant/15 hover:bg-surface-container hover:text-on-surface"
          >
            ×
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={() => {
          clearRecentLocations()
          window.dispatchEvent(new Event("weather-recent-changed"))
        }}
        className="text-[10px] font-semibold tracking-wide text-primary uppercase hover:underline"
      >
        Clear
      </button>
    </div>
  )
}
