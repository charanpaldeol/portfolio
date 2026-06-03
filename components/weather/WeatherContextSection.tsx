"use client"

// Purpose: Climate context — past week, monthly chart, on-this-day normals (display order: 5).
import { WeatherClimateNormals } from "@/components/weather/WeatherClimateNormals"
import { useWeatherClimate } from "@/components/weather/WeatherClimateProvider"
import { WeatherMonthlyClimateChart } from "@/components/weather/WeatherMonthlyClimateChart"
import { WeatherPastWeekTrend } from "@/components/weather/WeatherPastWeekTrend"
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { formatPrecipitation } from "@/lib/weather-format"
import type { OnThisDayNormal, PastWeekDay } from "@/lib/weather-types"
import { formatTempValue, WEATHER_TEMP_DIGITS } from "@/lib/weather-units"

type WeatherContextSectionProps = {
  pastWeek: PastWeekDay[]
}

export function WeatherContextSection({ pastWeek }: WeatherContextSectionProps) {
  const { units } = useWeatherUnits()
  const { climate, loading } = useWeatherClimate()
  const onThisDay: OnThisDayNormal | null = climate?.onThisDay ?? null

  return (
    <section aria-label="Climate context" className="space-y-4">
      <h2 className="text-sm font-medium uppercase tracking-wide text-on-surface-variant">Climate context</h2>

      <WeatherPastWeekTrend days={pastWeek} />

      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-surface-container-low" aria-hidden="true" />
      ) : climate ? (
        <div className="space-y-4 rounded-xl bg-surface-container-low p-4 ring-1 ring-outline-variant/10">
          {onThisDay ? (
            <div className="rounded-xl bg-surface-container-lowest/90 px-4 py-3 ring-1 ring-outline-variant/10">
              <h3 className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">
                Typical {onThisDay.monthDayLabel}
              </h3>
              <p className="mt-1 text-sm text-on-surface">
                High {formatTempValue(onThisDay.avgHighC, units, WEATHER_TEMP_DIGITS)} · Low{" "}
                {formatTempValue(onThisDay.avgLowC, units, WEATHER_TEMP_DIGITS)} · Precip{" "}
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
