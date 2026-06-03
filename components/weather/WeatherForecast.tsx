"use client"

// Purpose: Compact 16-day forecast strip — future days only, rain/snow indicators.
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { formatPrecipitation, formatSnowfall, uvSeverity } from "@/lib/weather-format"
import { futureDailyForecast } from "@/lib/weather-response"
import type { DailyForecastDay } from "@/lib/weather-types"
import { formatTempValue } from "@/lib/weather-units"

type WeatherForecastProps = {
  days: DailyForecastDay[]
}

export function WeatherForecast({ days }: WeatherForecastProps) {
  const { units } = useWeatherUnits()
  const futureDays = futureDailyForecast(days)
  if (futureDays.length === 0) return null

  const rainDays = futureDays.filter((day) => (day.precipitationMm ?? 0) >= 1).length
  const snowDays = futureDays.filter((day) => (day.snowfallCm ?? 0) >= 1).length

  return (
    <section aria-label="16-day forecast" className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-medium uppercase tracking-wide text-on-surface-variant">16-day forecast</h2>
        <p className="text-xs text-on-surface-variant">
          {rainDays > 0 ? `${rainDays} rainy days` : "Mostly dry"}
          {snowDays > 0 ? ` · ${snowDays} snowy days` : ""}
        </p>
      </div>
      <div className="overflow-x-auto pb-1">
        <ol className="flex min-w-max gap-2">
          {futureDays.map((day, index) => {
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
                {day.snowfallCm != null && day.snowfallCm >= 1 ? (
                  <span className="mt-1 text-[10px] text-primary">{formatSnowfall(day.snowfallCm)}</span>
                ) : day.precipitationProbabilityPercent != null && day.precipitationProbabilityPercent > 0 ? (
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
