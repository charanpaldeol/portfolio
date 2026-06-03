"use client"

// Purpose: Toolbar row — units toggle, copy link, recent locations.
import { CopyWeatherLink } from "@/components/weather/CopyWeatherLink"
import { WeatherRecentLocations } from "@/components/weather/WeatherRecentLocations"
import { WeatherUnitsToggle } from "@/components/weather/WeatherUnitsProvider"

export function WeatherPageToolbar() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <WeatherRecentLocations />
      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <WeatherUnitsToggle />
        <CopyWeatherLink />
      </div>
    </div>
  )
}
