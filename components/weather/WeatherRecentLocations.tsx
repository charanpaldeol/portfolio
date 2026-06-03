"use client"

// Purpose: Quick-pick recent weather locations from localStorage.
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { loadRecentLocations, type RecentLocation } from "@/lib/weather-recent"

export function WeatherRecentLocations() {
  const router = useRouter()
  const [recent, setRecent] = useState<RecentLocation[]>([])

  useEffect(() => {
    setRecent(loadRecentLocations())
  }, [])

  if (recent.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">Recent</span>
      {recent.map((location) => (
        <button
          key={`${location.lat}-${location.lon}`}
          type="button"
          onClick={() => {
            const params = new URLSearchParams()
            params.set("lat", location.lat.toFixed(4))
            params.set("lon", location.lon.toFixed(4))
            params.set("city", location.label)
            router.push(`/weather?${params.toString()}`)
          }}
          className="rounded-full bg-surface-container-low px-2.5 py-1 text-xs font-medium text-on-surface ring-1 ring-outline-variant/15 hover:bg-surface-container"
        >
          {location.label.split(",")[0]?.trim() || location.label}
        </button>
      ))}
    </div>
  )
}
