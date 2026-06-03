"use client"

// Purpose: Side-by-side 48-hour hourly forecast for compare mode.
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { formatHourlyTimeLabel, formatPrecipitation } from "@/lib/weather-format"
import type { HourlyForecastHour } from "@/lib/weather-types"
import { formatTempValue } from "@/lib/weather-units"

type WeatherCompareHourlyForecastProps = {
  labelA: string
  labelB: string
  hoursA: HourlyForecastHour[]
  hoursB: HourlyForecastHour[]
}

function HourlyStrip({ hours }: { hours: HourlyForecastHour[] }) {
  const { units } = useWeatherUnits()
  if (hours.length === 0) return <p className="text-sm text-on-surface-variant">No hourly data.</p>

  return (
    <ol className="flex min-w-max gap-2">
      {hours.map((hour, index) => {
        const label = formatHourlyTimeLabel(hour.time, {
          index,
          previousTime: hours[index - 1]?.time,
        })
        const icon = !hour.isDay && hour.condition.icon === "☀️" ? "🌙" : hour.condition.icon

        return (
          <li
            key={hour.time}
            className="flex w-[4.75rem] shrink-0 flex-col items-center rounded-xl bg-surface-container-lowest/90 px-2 py-3 text-center ring-1 ring-outline-variant/10"
          >
            <span className="text-[10px] font-semibold leading-tight text-on-surface-variant">{label}</span>
            <span className="mt-1 text-2xl leading-none" aria-hidden="true">
              {icon}
            </span>
            <span className="sr-only">{hour.condition.label}</span>
            <span className="mt-2 text-sm font-semibold text-on-surface">
              {formatTempValue(hour.temperatureC, units, 0)}
            </span>
            {hour.precipitationProbabilityPercent != null && hour.precipitationProbabilityPercent > 0 ? (
              <span className="mt-1 text-[10px] text-primary">{hour.precipitationProbabilityPercent}%</span>
            ) : hour.precipitationMm != null && hour.precipitationMm > 0 ? (
              <span className="mt-1 text-[10px] text-primary">{formatPrecipitation(hour.precipitationMm)}</span>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

export function WeatherCompareHourlyForecast({
  labelA,
  labelB,
  hoursA,
  hoursB,
}: WeatherCompareHourlyForecastProps) {
  if (hoursA.length === 0 && hoursB.length === 0) return null

  return (
    <section aria-label="Hourly forecast comparison" className="space-y-3">
      <h2 className="text-sm font-medium uppercase tracking-wide text-on-surface-variant">Next 48 hours</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-on-surface">{labelA}</h3>
          <div className="overflow-x-auto pb-1">
            <HourlyStrip hours={hoursA} />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-on-surface">{labelB}</h3>
          <div className="overflow-x-auto pb-1">
            <HourlyStrip hours={hoursB} />
          </div>
        </div>
      </div>
    </section>
  )
}
