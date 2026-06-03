"use client"

// Purpose: 12-month climate normals bar chart.
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import type { MonthlyClimateNormal } from "@/lib/weather-types"
import { formatTempValue } from "@/lib/weather-units"

type WeatherMonthlyClimateChartProps = {
  months: MonthlyClimateNormal[]
  periodLabel: string
}

export function WeatherMonthlyClimateChart({ months, periodLabel }: WeatherMonthlyClimateChartProps) {
  const { units } = useWeatherUnits()
  if (months.length === 0) return null

  const maxHigh = Math.max(...months.map((month) => month.highC))
  const minLow = Math.min(...months.map((month) => month.lowC))
  const span = Math.max(maxHigh - minLow, 1)

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-on-surface">Monthly climate</h3>
        <p className="text-[11px] text-on-surface-variant">{periodLabel} · ERA5</p>
      </div>
      <div className="overflow-x-auto pb-1">
        <ol className="flex min-w-max gap-1.5">
          {months.map((month) => {
            const lowPct = ((month.lowC - minLow) / span) * 100
            const highPct = ((month.highC - minLow) / span) * 100
            const barHeight = Math.max(highPct - lowPct, 8)

            return (
              <li
                key={month.month}
                className="flex w-10 flex-col items-center text-center"
                title={`${month.monthName}: ${formatTempValue(month.meanC, units, 0)} avg`}
              >
                <span className="text-[10px] font-semibold text-on-surface">
                  {formatTempValue(month.highC, units, 0)}
                </span>
                <div className="relative mt-1 flex h-16 w-3 items-end justify-center rounded-full bg-surface-container-high">
                  <div
                    className="absolute w-3 rounded-full bg-primary/70"
                    style={{ bottom: `${lowPct}%`, height: `${barHeight}%` }}
                  />
                </div>
                <span className="mt-1 text-[10px] text-on-surface-variant">
                  {formatTempValue(month.lowC, units, 0)}
                </span>
                <span className="mt-0.5 text-[10px] font-medium text-on-surface-variant">
                  {month.monthName.slice(0, 3)}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
