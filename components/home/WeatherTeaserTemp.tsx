"use client"

// Purpose: Client-side temp label for homepage weather teaser (respects units preference).
import { useEffect, useState } from "react"

import { formatTempValue, parseWeatherUnits, WEATHER_UNITS_STORAGE_KEY } from "@/lib/weather-units"

type WeatherTeaserTempProps = {
  temperatureC: number
}

export function WeatherTeaserTemp({ temperatureC }: WeatherTeaserTempProps) {
  const [units, setUnits] = useState<"c" | "f">("c")

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(WEATHER_UNITS_STORAGE_KEY)
      setUnits(parseWeatherUnits(stored))
    } catch {
      setUnits("c")
    }
  }, [])

  return <>{formatTempValue(temperatureC, units, 0)}</>
}
