"use client"

// Purpose: Toolbar row — units toggle, copy link, recent locations, refresh.
import { CopyWeatherLink } from "@/components/weather/CopyWeatherLink"
import { WeatherRecentLocations } from "@/components/weather/WeatherRecentLocations"
import { WeatherUnitsToggle } from "@/components/weather/WeatherUnitsProvider"

type WeatherPageToolbarProps = {
  onRefresh?: () => void
  refreshing?: boolean
}

export function WeatherPageToolbar({ onRefresh, refreshing = false }: WeatherPageToolbarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <WeatherRecentLocations />
      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        {onRefresh ? (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            aria-busy={refreshing}
            className="text-xs font-semibold tracking-wide text-primary uppercase hover:underline disabled:opacity-60"
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        ) : null}
        <WeatherUnitsToggle />
        <CopyWeatherLink />
      </div>
    </div>
  )
}
