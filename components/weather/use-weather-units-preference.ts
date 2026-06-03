"use client"

// Purpose: Read °C/°F preference outside WeatherUnitsProvider (e.g. homepage teaser).
import { useEffect, useState } from "react"

import { parseWeatherUnits, WEATHER_UNITS_STORAGE_KEY, type WeatherUnits } from "@/lib/weather-units"

export function useWeatherUnitsPreference(): WeatherUnits {
  const [units, setUnits] = useState<WeatherUnits>("c")

  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("units")
      if (fromUrl === "c" || fromUrl === "f") {
        setUnits(parseWeatherUnits(fromUrl))
        return
      }
      const stored = window.localStorage.getItem(WEATHER_UNITS_STORAGE_KEY)
      setUnits(parseWeatherUnits(stored))
    } catch {
      setUnits("c")
    }
  }, [])

  return units
}
