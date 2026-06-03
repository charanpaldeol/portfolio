"use client"

// Purpose: Client-side weather refresh and conditions body for /weather single-location mode.
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { WeatherClimateClient } from "@/components/weather/WeatherClimateClient"
import { WeatherConditions } from "@/components/weather/WeatherConditions"
import { parseWeatherPayload } from "@/lib/weather-payload"
import type { WeatherSnapshot } from "@/lib/weather-types"

type WeatherLiveConditionsProps = {
  initialSnapshot: WeatherSnapshot
  initialQueryKey: string
}

function buildQueryKey(searchParams: URLSearchParams): string {
  const params = new URLSearchParams()
  for (const key of ["lat", "lon", "latitude", "longitude", "city", "q", "approx"]) {
    const value = searchParams.get(key)
    if (value) params.set(key, value)
  }
  return params.toString()
}

export function WeatherLiveConditions({ initialSnapshot, initialQueryKey }: WeatherLiveConditionsProps) {
  const searchParams = useSearchParams()
  const queryKey = useMemo(() => buildQueryKey(searchParams), [searchParams])
  const [snapshot, setSnapshot] = useState(initialSnapshot)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSnapshot(initialSnapshot)
  }, [initialSnapshot])

  useEffect(() => {
    if (queryKey === initialQueryKey) return

    const controller = new AbortController()
    setLoading(true)

    const params = new URLSearchParams(queryKey)
    params.set("includeClimate", "0")

    void fetch(`/api/weather?${params.toString()}`, { signal: controller.signal })
      .then(async (res) => {
        const data = (await res.json()) as Record<string, unknown>
        const parsed = parseWeatherPayload(data)
        if (parsed) setSnapshot(parsed)
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [initialQueryKey, queryKey])

  return (
    <WeatherConditions
      snapshot={snapshot}
      loading={loading}
      climateSlot={
        <WeatherClimateClient
          lat={snapshot.lat}
          lon={snapshot.lon}
          temperatureC={snapshot.temperatureC}
          layout="header"
        />
      }
    />
  )
}
