"use client"

// Purpose: Client-fetched climate normals slot for live weather navigation.
import { useEffect, useState } from "react"

import { WeatherClimateNormals } from "@/components/weather/WeatherClimateNormals"
import type { ClimateExtremes } from "@/lib/weather-types"

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
      <div className="grid grid-cols-2 gap-2">
        <div className="h-20 animate-pulse rounded-xl bg-surface-container-low" />
        <div className="h-20 animate-pulse rounded-xl bg-surface-container-low" />
      </div>
    )
  }

  if (!climate) return null

  return (
    <div className="space-y-2">
      {anomalyC != null && Math.abs(anomalyC) >= 0.5 ? (
        <p className="text-sm text-primary">
          {anomalyC > 0
            ? `${Math.abs(anomalyC).toFixed(1)}° warmer than typical for ${climate.currentMonth?.monthName ?? "this month"}`
            : `${Math.abs(anomalyC).toFixed(1)}° cooler than typical for ${climate.currentMonth?.monthName ?? "this month"}`}
        </p>
      ) : null}
      <WeatherClimateNormals climate={climate} layout={layout} />
    </div>
  )
}
