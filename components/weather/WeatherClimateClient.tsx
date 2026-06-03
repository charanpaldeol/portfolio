"use client"

// Purpose: Client-fetched climate normals slot for live weather navigation.
import { useEffect, useState } from "react"

import { WeatherClimateNormals } from "@/components/weather/WeatherClimateNormals"
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import type { ClimateExtremes } from "@/lib/weather-types"
import { formatAnomalyMessage } from "@/lib/weather-units"

type WeatherClimateClientProps = {
  lat: number
  lon: number
  temperatureC: number | null
  layout?: "default" | "header"
}

type ClimateResponse = {
  climateNormals: ClimateExtremes | null
  temperatureAnomalyC: number | null
}

export function WeatherClimateClient({
  lat,
  lon,
  temperatureC,
  layout = "header",
}: WeatherClimateClientProps) {
  const { units } = useWeatherUnits()
  const [climate, setClimate] = useState<ClimateExtremes | null>(null)
  const [anomalyC, setAnomalyC] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
    })
    if (temperatureC != null) params.set("temperatureC", String(temperatureC))

    void fetch(`/api/weather/climate?${params.toString()}`, { signal: controller.signal })
      .then(async (res) => {
        const data = (await res.json()) as ClimateResponse
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

  if (loading) {
    return (
      <div className="min-h-[8.5rem] space-y-2" aria-hidden="true">
        <div className="h-4 w-32 animate-pulse rounded bg-surface-container-low" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-20 animate-pulse rounded-xl bg-surface-container-low" />
          <div className="h-20 animate-pulse rounded-xl bg-surface-container-low" />
        </div>
      </div>
    )
  }

  if (!climate) return <div className="min-h-[8.5rem]" aria-hidden="true" />

  return (
    <div className="min-h-[8.5rem] space-y-2">
      {anomalyC != null && Math.abs(anomalyC) >= 0.5 ? (
        <p className="text-sm text-primary">
          {formatAnomalyMessage(anomalyC, climate.currentMonth?.monthName ?? "this month", units)}
        </p>
      ) : null}
      <WeatherClimateNormals climate={climate} layout={layout} />
    </div>
  )
}
