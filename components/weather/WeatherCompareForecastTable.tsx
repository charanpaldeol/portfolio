"use client"

// Purpose: Unified side-by-side daily forecast table for compare mode.
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { formatPrecipitation } from "@/lib/weather-format"
import type { DailyForecastDay } from "@/lib/weather-types"
import { formatTempValue } from "@/lib/weather-units"

type WeatherCompareForecastTableProps = {
  labelA: string
  labelB: string
  daysA: DailyForecastDay[]
  daysB: DailyForecastDay[]
}

export function WeatherCompareForecastTable({
  labelA,
  labelB,
  daysA,
  daysB,
}: WeatherCompareForecastTableProps) {
  const { units } = useWeatherUnits()
  const count = Math.max(daysA.length, daysB.length)
  if (count === 0) return null

  return (
    <section aria-label="Combined 16-day forecast comparison" className="space-y-2">
      <h2 className="text-sm font-medium uppercase tracking-wide text-on-surface-variant">16-day forecast</h2>
      <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest ring-1 ring-outline-variant/10">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-outline-variant/15 text-left">
              <th scope="col" className="py-3 pr-3 pl-4 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Day
              </th>
              <th scope="col" className="py-3 px-2 text-xs font-semibold uppercase tracking-wide text-on-surface">
                {labelA}
              </th>
              <th scope="col" className="py-3 pr-4 pl-2 text-xs font-semibold uppercase tracking-wide text-on-surface">
                {labelB}
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: count }, (_, index) => {
              const dayA = daysA[index]
              const dayB = daysB[index]
              const dayLabel = index === 0 ? "Today" : dayA?.weekday ?? dayB?.weekday ?? "—"

              return (
                <tr key={`${dayA?.date ?? "a"}-${dayB?.date ?? "b"}-${index}`} className="border-b border-outline-variant/10 last:border-b-0">
                  <th scope="row" className="py-2.5 pr-3 pl-4 text-left text-xs font-semibold text-on-surface-variant">
                    {dayLabel}
                  </th>
                  <td className="py-2.5 px-2 text-on-surface">
                    {dayA ? (
                      <div className="flex items-center gap-2">
                        <span aria-hidden="true">{dayA.condition.icon}</span>
                        <span>
                          {formatTempValue(dayA.highC, units, 0)} / {formatTempValue(dayA.lowC, units, 0)}
                        </span>
                        {dayA.precipitationProbabilityPercent != null && dayA.precipitationProbabilityPercent > 0 ? (
                          <span className="text-xs text-primary">{dayA.precipitationProbabilityPercent}%</span>
                        ) : dayA.precipitationMm != null && dayA.precipitationMm > 0 ? (
                          <span className="text-xs text-primary">{formatPrecipitation(dayA.precipitationMm)}</span>
                        ) : null}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-2.5 pr-4 pl-2 text-on-surface">
                    {dayB ? (
                      <div className="flex items-center gap-2">
                        <span aria-hidden="true">{dayB.condition.icon}</span>
                        <span>
                          {formatTempValue(dayB.highC, units, 0)} / {formatTempValue(dayB.lowC, units, 0)}
                        </span>
                        {dayB.precipitationProbabilityPercent != null && dayB.precipitationProbabilityPercent > 0 ? (
                          <span className="text-xs text-primary">{dayB.precipitationProbabilityPercent}%</span>
                        ) : dayB.precipitationMm != null && dayB.precipitationMm > 0 ? (
                          <span className="text-xs text-primary">{formatPrecipitation(dayB.precipitationMm)}</span>
                        ) : null}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
