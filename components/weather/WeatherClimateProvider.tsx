"use client"

// Purpose: Single client fetch for /api/weather/climate — shared by header normals and context section.
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react"

import type { ClimateExtremes } from "@/lib/weather-types"

type ClimateApiResponse = {
  climateNormals: ClimateExtremes | null
  temperatureAnomalyC: number | null
}

type WeatherClimateContextValue = {
  climate: ClimateExtremes | null
  anomalyC: number | null
  loading: boolean
}

const WeatherClimateContext = createContext<WeatherClimateContextValue | null>(null)

type WeatherClimateProviderProps = {
  lat: number
  lon: number
  temperatureC: number | null
  children: ReactNode
}

export function WeatherClimateProvider({ lat, lon, temperatureC, children }: WeatherClimateProviderProps) {
  const [climate, setClimate] = useState<ClimateExtremes | null>(null)
  const [anomalyC, setAnomalyC] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    const params = new URLSearchParams({ lat: String(lat), lon: String(lon) })
    if (temperatureC != null) params.set("temperatureC", String(temperatureC))

    void fetch(`/api/weather/climate?${params.toString()}`, { signal: controller.signal })
      .then(async (res) => {
        const data = (await res.json()) as ClimateApiResponse
        setClimate(data.climateNormals ?? null)
        setAnomalyC(data.temperatureAnomalyC ?? null)
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setClimate(null)
        setAnomalyC(null)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [lat, lon, temperatureC])

  const value = useMemo(
    () => ({ climate, anomalyC, loading }),
    [climate, anomalyC, loading]
  )

  return <WeatherClimateContext.Provider value={value}>{children}</WeatherClimateContext.Provider>
}

export function useWeatherClimate(): WeatherClimateContextValue {
  const ctx = useContext(WeatherClimateContext)
  if (!ctx) {
    return { climate: null, anomalyC: null, loading: false }
  }
  return ctx
}
