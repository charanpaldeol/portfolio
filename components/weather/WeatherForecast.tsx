"use client"

// Purpose: Compact 16-day forecast strip for the weather page.
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { formatPrecipitation, uvSeverity } from "@/lib/weather-format"
import type { DailyForecastDay } from "@/lib/weather-types"
import { formatTempValue } from "@/lib/weather-units"

type WeatherForecastProps = {
  days: DailyForecastDay[]
}

export function WeatherForecast({ days }: WeatherForecastProps) {
  const { units } = useWeatherUnits()
  if (days.length === 0) return null

  return (
    <section aria-label="16-day forecast" className="space-y-2">
      <h2 className="text-sm font-medium uppercase tracking-wide text-on-surface-variant">16-day forecast</h2>
      <div className="overflow-x-auto pb-1">
        <ol className="flex min-w-max gap-2">
          {days.map((day, index) => {
            const uvBadge = uvSeverity(day.uvIndexMax)
            return (
              <li
                key={day.date}
                className="flex w-[5rem] shrink-0 flex-col items-center rounded-xl bg-surface-container-lowest/90 px-2 py-3 text-center ring-1 ring-outline-variant/10 sm:w-[5.5rem]"
              >
                <span className="text-[11px] font-semibold text-on-surface-variant">
                  {index === 0 ? "Today" : day.weekday}
                </span>
                <span className="mt-1 text-2xl leading-none" aria-hidden="true">
                  {day.condition.icon}
                </span>
                <span className="sr-only">{day.condition.label}</span>
                <span className="mt-2 text-sm font-semibold text-on-surface">
                  {formatTempValue(day.highC, units, 0)}
                </span>
                <span className="text-xs text-on-surface-variant">{formatTempValue(day.lowC, units, 0)}</span>
                {day.precipitationProbabilityPercent != null && day.precipitationProbabilityPercent > 0 ? (
                  <span className="mt-1 text-[10px] text-primary">{day.precipitationProbabilityPercent}%</span>
                ) : day.precipitationMm != null && day.precipitationMm > 0 ? (
                  <span className="mt-1 text-[10px] text-primary">{formatPrecipitation(day.precipitationMm)}</span>
                ) : null}
                {day.uvIndexMax != null && day.uvIndexMax > 0 ? (
                  <span
                    className="mt-1 text-[10px] font-medium text-on-surface-variant"
                    title={uvBadge?.label ?? "UV index"}
                  >
                    UV {day.uvIndexMax.toFixed(0)}
                  </span>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
