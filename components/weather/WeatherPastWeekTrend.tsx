"use client"

// Purpose: Past 7 days temperature trend strip.
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { formatPrecipitation } from "@/lib/weather-format"
import type { PastWeekDay } from "@/lib/weather-types"
import { formatTempValue } from "@/lib/weather-units"

type WeatherPastWeekTrendProps = {
  days: PastWeekDay[]
}

export function WeatherPastWeekTrend({ days }: WeatherPastWeekTrendProps) {
  const { units } = useWeatherUnits()
  if (days.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-on-surface">Past week</h3>
      <div className="overflow-x-auto pb-1">
        <ol className="flex min-w-max gap-2">
          {days.map((day) => (
            <li
              key={day.date}
              className="flex w-[4.5rem] shrink-0 flex-col items-center rounded-xl bg-surface-container-lowest/90 px-2 py-3 text-center ring-1 ring-outline-variant/10"
            >
              <span className="text-[10px] font-semibold text-on-surface-variant">{day.weekday}</span>
              <span className="mt-2 text-sm font-semibold text-on-surface">
                {formatTempValue(day.highC, units, 0)}
              </span>
              <span className="text-xs text-on-surface-variant">{formatTempValue(day.lowC, units, 0)}</span>
              {day.precipitationMm != null && day.precipitationMm > 0 ? (
                <span className="mt-1 text-[10px] text-primary">{formatPrecipitation(day.precipitationMm)}</span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
