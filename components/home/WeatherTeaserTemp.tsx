"use client"

// Purpose: Client-side temp label for homepage weather teaser (respects units preference).
import { useWeatherUnitsPreference } from "@/components/weather/use-weather-units-preference"
import { formatTempValue, WEATHER_TEMP_DIGITS } from "@/lib/weather-units"

type WeatherTeaserTempProps = {
  temperatureC: number
}

export function WeatherTeaserTemp({ temperatureC }: WeatherTeaserTempProps) {
  const units = useWeatherUnitsPreference()
  return <>{formatTempValue(temperatureC, units, WEATHER_TEMP_DIGITS)}</>
}
