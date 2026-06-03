// Purpose: Recent location chips shown under the weather search bar.
"use client"

import { useCallback, useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { clearRecentLocations, loadRecentLocations, removeRecentLocation } from "@/lib/weather-recent"
import type { RecentLocation } from "@/lib/weather-recent"

type WeatherRecentChipsProps = {
  onSelect: (location: RecentLocation) => void
}

export function WeatherRecentChips({ onSelect }: WeatherRecentChipsProps) {
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
      <span className="text-xs font-medium text-on-surface-variant">Recent</span>
      {recent.map((location) => {
        const shortLabel = location.label.split(",")[0]?.trim() || location.label
        return (
          <span
            key={`${location.lat}-${location.lon}`}
            className="inline-flex overflow-hidden rounded-full bg-surface-container-low ring-1 ring-outline-variant/10 transition-shadow hover:ring-outline-variant/20"
          >
            <button
              type="button"
              onClick={() => onSelect(location)}
              className="py-1.5 pl-3 pr-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
            >
              {shortLabel}
            </button>
            <button
              type="button"
              aria-label={`Remove ${shortLabel} from recent`}
              onClick={() => {
                removeRecentLocation(location.lat, location.lon)
                window.dispatchEvent(new Event("weather-recent-changed"))
              }}
              className={cn(
                "border-l border-outline-variant/10 px-2 py-1.5 text-sm text-on-surface-variant",
                "transition-colors hover:bg-surface-container hover:text-on-surface"
              )}
            >
              ×
            </button>
          </span>
        )
      })}
      <button
        type="button"
        onClick={() => {
          clearRecentLocations()
          window.dispatchEvent(new Event("weather-recent-changed"))
        }}
        className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
      >
        Clear all
      </button>
    </div>
  )
}
