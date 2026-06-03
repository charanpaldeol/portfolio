"use client"

// Purpose: Climate context — past week, monthly chart, on-this-day normals (display order: 5).
import { useEffect, useState } from "react"

import { WeatherClimateNormals } from "@/components/weather/WeatherClimateNormals"
import { WeatherMonthlyClimateChart } from "@/components/weather/WeatherMonthlyClimateChart"
import { WeatherPastWeekTrend } from "@/components/weather/WeatherPastWeekTrend"
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { formatPrecipitation } from "@/lib/weather-format"
import type { ClimateExtremes, OnThisDayNormal, PastWeekDay } from "@/lib/weather-types"
import { formatAnomalyMessage, formatTempValue } from "@/lib/weather-units"

type WeatherContextSectionProps = {
  lat: number
  lon: number
  temperatureC: number | null
  pastWeek: PastWeekDay[]
}

type ClimateResponse = {
  climateNormals: ClimateExtremes | null
  temperatureAnomalyC: number | null
}

export function WeatherContextSection({ lat, lon, temperatureC, pastWeek }: WeatherContextSectionProps) {
  const { units } = useWeatherUnits()
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

  const onThisDay: OnThisDayNormal | null = climate?.onThisDay ?? null

  return (
    <section aria-label="Climate context" className="space-y-4">
      <h2 className="text-sm font-medium uppercase tracking-wide text-on-surface-variant">Climate context</h2>

      <WeatherPastWeekTrend days={pastWeek} />

      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-surface-container-low" aria-hidden="true" />
      ) : climate ? (
        <div className="space-y-4 rounded-xl bg-surface-container-low p-4 ring-1 ring-outline-variant/10">
          {anomalyC != null && Math.abs(anomalyC) >= 0.5 ? (
            <p className="text-sm text-primary">
              {formatAnomalyMessage(anomalyC, climate.currentMonth?.monthName ?? "this month", units)}
            </p>
          ) : null}

          {onThisDay ? (
            <div className="rounded-xl bg-surface-container-lowest/90 px-4 py-3 ring-1 ring-outline-variant/10">
              <h3 className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">
                Typical {onThisDay.monthDayLabel}
              </h3>
              <p className="mt-1 text-sm text-on-surface">
                High {formatTempValue(onThisDay.avgHighC, units, 0)} · Low{" "}
                {formatTempValue(onThisDay.avgLowC, units, 0)} · Precip{" "}
                {formatPrecipitation(onThisDay.avgPrecipMm)}
              </p>
              <p className="mt-0.5 text-xs text-on-surface-variant">
                {onThisDay.sampleYears}-year average ({climate.periodLabel})
              </p>
            </div>
          ) : null}

          <WeatherClimateNormals climate={climate} layout="default" />
          <WeatherMonthlyClimateChart months={climate.monthlyNormals} periodLabel={climate.periodLabel} />
        </div>
      ) : null}
    </section>
  )
}
