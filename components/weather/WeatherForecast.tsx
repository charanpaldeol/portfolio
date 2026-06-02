// Purpose: Compact 7-day forecast strip for the weather page.
import { formatPrecipitation, formatTemperature } from "@/lib/weather-format"
import type { DailyForecastDay } from "@/lib/weather-types"

type WeatherForecastProps = {
  days: DailyForecastDay[]
}

function formatDayHigh(celsius: number): string {
  return formatTemperature(celsius, 0).replace("°C", "°")
}

function formatDayLow(celsius: number): string {
  return formatTemperature(celsius, 0).replace("°C", "°")
}

export function WeatherForecast({ days }: WeatherForecastProps) {
  if (days.length === 0) return null

  return (
    <section aria-label="7-day forecast" className="space-y-2">
      <h2 className="text-sm font-medium uppercase tracking-wide text-on-surface-variant">7-day forecast</h2>
      <div className="overflow-x-auto pb-1">
        <ol className="flex min-w-max gap-2">
          {days.map((day, index) => (
            <li
              key={day.date}
              className="flex w-[4.75rem] shrink-0 flex-col items-center rounded-xl bg-surface-container-lowest/90 px-2 py-3 text-center ring-1 ring-outline-variant/10 sm:w-[5.25rem]"
            >
              <span className="text-[11px] font-semibold text-on-surface-variant">
                {index === 0 ? "Today" : day.weekday}
              </span>
              <span className="mt-1 text-2xl leading-none" aria-hidden="true">
                {day.condition.icon}
              </span>
              <span className="sr-only">{day.condition.label}</span>
              <span className="mt-2 text-sm font-semibold text-on-surface">{formatDayHigh(day.highC)}</span>
              <span className="text-xs text-on-surface-variant">{formatDayLow(day.lowC)}</span>
              {day.precipitationMm != null && day.precipitationMm > 0 ? (
                <span className="mt-1 text-[10px] text-primary">{formatPrecipitation(day.precipitationMm)}</span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
