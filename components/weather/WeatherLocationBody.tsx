"use client"

// Purpose: Single-location weather body — toolbar, live refresh, and conditions.
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"

import { WeatherClimateClient } from "@/components/weather/WeatherClimateClient"
import { WeatherClimateProvider } from "@/components/weather/WeatherClimateProvider"
import { WeatherConditions } from "@/components/weather/WeatherConditions"
import { WeatherPageToolbar } from "@/components/weather/WeatherPageToolbar"
import { parseWeatherPayload } from "@/lib/weather-payload"
import type { WeatherSnapshot } from "@/lib/weather-types"

const AUTO_REFRESH_MS = 15 * 60 * 1000

type WeatherLocationBodyProps = {
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

async function fetchWeatherSnapshot(queryKey: string): Promise<WeatherSnapshot | null> {
  const params = new URLSearchParams(queryKey)
  params.set("includeClimate", "0")
  const res = await fetch(`/api/weather?${params.toString()}`)
  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok) {
    const message = typeof data.error === "string" ? data.error : "Could not refresh weather."
    throw new Error(message)
  }
  return parseWeatherPayload(data)
}

export function WeatherLocationBody({ initialSnapshot, initialQueryKey }: WeatherLocationBodyProps) {
  const searchParams = useSearchParams()
  const queryKey = useMemo(() => buildQueryKey(searchParams), [searchParams])
  const [snapshot, setSnapshot] = useState(initialSnapshot)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setSnapshot(initialSnapshot)
    setError(null)
  }, [initialSnapshot])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const next = await fetchWeatherSnapshot(queryKey)
      if (next) setSnapshot(next)
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Could not refresh weather."
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [queryKey])

  useEffect(() => {
    if (queryKey === initialQueryKey) return

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    const params = new URLSearchParams(queryKey)
    params.set("includeClimate", "0")

    void fetch(`/api/weather?${params.toString()}`, { signal: controller.signal })
      .then(async (res) => {
        const data = (await res.json()) as Record<string, unknown>
        if (!res.ok) {
          const message = typeof data.error === "string" ? data.error : "Could not load weather."
          throw new Error(message)
        }
        const parsed = parseWeatherPayload(data)
        if (parsed) setSnapshot(parsed)
      })
      .catch((fetchError) => {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return
        const message = fetchError instanceof Error ? fetchError.message : "Could not load weather."
        setError(message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [initialQueryKey, queryKey])

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refresh()
    }, AUTO_REFRESH_MS)
    return () => window.clearInterval(timer)
  }, [refresh])

  return (
    <>
      <WeatherPageToolbar onRefresh={() => void refresh()} refreshing={loading} />
      {error ? (
        <div role="alert" className="rounded-xl bg-destructive/10 p-4 text-foreground">
          <p className="font-medium text-foreground">Could not update weather.</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
      ) : null}
      <WeatherClimateProvider
        lat={snapshot.lat}
        lon={snapshot.lon}
        temperatureC={snapshot.temperatureC}
      >
        <WeatherConditions
          snapshot={snapshot}
          loading={loading}
          climateSlot={<WeatherClimateClient layout="header" />}
        />
      </WeatherClimateProvider>
    </>
  )
}
