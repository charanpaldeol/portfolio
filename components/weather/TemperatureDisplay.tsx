"use client"

// Purpose: Hero temperature — split typography, tappable units, range, feels-like.
import { DayTemperatureCurve } from "@/components/weather/DayTemperatureCurve"
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { cn } from "@/lib/utils"
import type { HourlyForecastHour } from "@/lib/weather-types"
import {
  formatCurrentConditionsAria,
  formatTempParts,
  parseWeatherUnits,
  shouldShowFeelsLike,
  WEATHER_TEMP_DIGITS,
  type WeatherUnits,
} from "@/lib/weather-units"

type TemperatureDisplayProps = {
  temperatureC: number | null
  feelsLikeC?: number | null
  conditionLabel: string
  conditionIcon?: string
  units: WeatherUnits
  todayHighC?: number | null
  todayLowC?: number | null
  hourlyForecast?: HourlyForecastHour[]
  observedAt?: string | null
  sunrise?: string | null
  sunset?: string | null
  refreshing?: boolean
  anomalyMessage?: string | null
  className?: string
}

export function TemperatureDisplay({
  temperatureC,
  feelsLikeC = null,
  conditionLabel,
  conditionIcon,
  units,
  todayHighC = null,
  todayLowC = null,
  hourlyForecast = [],
  observedAt = null,
  sunrise = null,
  sunset = null,
  refreshing = false,
  anomalyMessage = null,
  className,
}: TemperatureDisplayProps) {
  const { setUnits } = useWeatherUnits()
  const parts = formatTempParts(temperatureC, units, WEATHER_TEMP_DIGITS)
  const showFeelsLike = shouldShowFeelsLike(temperatureC, feelsLikeC)
  const feelsParts = showFeelsLike ? formatTempParts(feelsLikeC, units, WEATHER_TEMP_DIGITS) : null
  const hasRange =
    typeof todayLowC === "number" &&
    Number.isFinite(todayLowC) &&
    typeof todayHighC === "number" &&
    Number.isFinite(todayHighC)

  const ariaLabel = formatCurrentConditionsAria(temperatureC, feelsLikeC, conditionLabel, units, {
    includeFeelsLike: showFeelsLike,
    todayLowC,
    todayHighC,
  })
  const nextUnit = units === "c" ? "f" : "c"

  return (
    <div className={cn("min-w-0 flex-1", className)}>
      <div
        className={cn("transition-opacity duration-300", refreshing && "opacity-60")}
        aria-live="polite"
        aria-busy={refreshing}
      >
        {conditionIcon ? (
          <div className="mb-2 flex items-center gap-2 sm:hidden">
            <span className="text-2xl leading-none" aria-hidden="true">
              {conditionIcon}
            </span>
            <p className="text-sm font-medium text-on-surface">{conditionLabel}</p>
          </div>
        ) : null}

        {parts ? (
          <div
            className="flex items-start gap-1 font-display tabular-nums tracking-tight text-on-surface"
            aria-label={ariaLabel}
          >
            <span className="text-[3.75rem] font-semibold leading-[0.9] sm:text-[4.5rem] md:text-[5rem]">
              {parts.value}
            </span>
            <button
              type="button"
              onClick={() => setUnits(parseWeatherUnits(nextUnit))}
              className="mt-1.5 rounded-lg px-1 py-0.5 text-2xl font-medium text-on-surface-variant transition-colors hover:bg-surface-container-highest/80 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:mt-2 sm:text-3xl"
              aria-label={`Temperature in ${units === "c" ? "Celsius" : "Fahrenheit"}. Switch to ${nextUnit === "f" ? "Fahrenheit" : "Celsius"}.`}
            >
              {parts.unit}
            </button>
          </div>
        ) : (
          <p className="font-display text-5xl font-semibold text-on-surface" aria-label={ariaLabel ?? "Temperature unavailable"}>
            —
          </p>
        )}

        {hasRange ? (
          <DayTemperatureCurve
            className="mt-3 w-full"
            hourlyForecast={hourlyForecast}
            observedAt={observedAt}
            sunrise={sunrise}
            sunset={sunset}
            temperatureC={temperatureC}
            todayLowC={todayLowC}
            todayHighC={todayHighC}
          />
        ) : null}

        {anomalyMessage ? (
          <p className="mt-2 text-sm font-medium text-primary">{anomalyMessage}</p>
        ) : null}

        {feelsParts ? (
          <p className="mt-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-primary/15">
              Feels {feelsParts.value}
              <span className="text-primary/80">{feelsParts.unit}</span>
            </span>
          </p>
        ) : null}
      </div>
    </div>
  )
}
