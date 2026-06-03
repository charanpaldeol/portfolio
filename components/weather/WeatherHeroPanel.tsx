"use client"

// Purpose: Hero card — temperature, range, condition, wind, precipitation, climate anomaly.
import { HeroMetricChip } from "@/components/weather/HeroMetricChip"
import { TemperatureDisplay } from "@/components/weather/TemperatureDisplay"
import { useWeatherClimate } from "@/components/weather/WeatherClimateProvider"
import { WeatherUnitsToggle } from "@/components/weather/WeatherUnitsProvider"
import { WindCompass } from "@/components/weather/WindCompass"
import { cn } from "@/lib/utils"
import { classifyHeroCondition, type HeroConditionKind, inferHeroNight } from "@/lib/weather-hero"
import type { HourlyForecastHour } from "@/lib/weather-types"
import { formatAnomalyMessage, type WeatherUnits } from "@/lib/weather-units"

type WeatherHeroPanelProps = {
  conditionIcon: string
  conditionLabel: string
  temperatureC: number | null
  feelsLikeC: number | null
  todayHighC: number | null
  todayLowC: number | null
  hourlyForecast: HourlyForecastHour[]
  windDirectionDeg: number | null
  windSpeed: string
  windGust: string | null
  precipValue: string
  precipDetail?: string
  isDay: boolean | null
  observedAt: string | null
  sunrise: string | null
  sunset: string | null
  updatedLabel: string | null | undefined
  units: WeatherUnits
  refreshing?: boolean
}

// Accent token pairs per condition family — [primary glow, secondary glow].
// Inline styles use var(--token) so the design audit (hex-only) stays clean.
const HERO_ACCENTS: Record<HeroConditionKind, { day: [string, string]; night: [string, string] }> = {
  clear: { day: ["--color-tertiary", "--color-primary"], night: ["--color-secondary", "--color-primary"] },
  cloud: { day: ["--color-primary", "--color-secondary"], night: ["--color-secondary", "--color-primary"] },
  rain: { day: ["--color-secondary", "--color-primary"], night: ["--color-secondary", "--color-primary"] },
  snow: { day: ["--color-primary-fixed", "--color-secondary"], night: ["--color-secondary", "--color-primary-fixed"] },
  fog: { day: ["--color-secondary", "--color-on-surface"], night: ["--color-secondary", "--color-on-surface"] },
  storm: { day: ["--color-secondary", "--color-tertiary"], night: ["--color-secondary", "--color-tertiary"] },
}

function buildHeroTone(kind: HeroConditionKind, night: boolean) {
  const [a, b] = night ? HERO_ACCENTS[kind].night : HERO_ACCENTS[kind].day
  const i1 = night ? 34 : 26
  const i2 = night ? 20 : 15
  return {
    backdrop: `radial-gradient(118% 120% at 82% -16%, color-mix(in srgb, var(${a}) ${i1}%, transparent), transparent 46%), radial-gradient(110% 102% at -8% 114%, color-mix(in srgb, var(${b}) ${i2}%, transparent), transparent 56%)`,
    halo: `radial-gradient(circle at 50% 42%, color-mix(in srgb, var(${a}) ${night ? 48 : 42}%, transparent), transparent 70%)`,
  }
}

export function WeatherHeroPanel({
  conditionIcon,
  conditionLabel,
  temperatureC,
  feelsLikeC,
  todayHighC,
  todayLowC,
  hourlyForecast,
  windDirectionDeg,
  windSpeed,
  windGust,
  precipValue,
  precipDetail,
  isDay,
  observedAt,
  sunrise,
  sunset,
  updatedLabel,
  units,
  refreshing = false,
}: WeatherHeroPanelProps) {
  const heroNight = inferHeroNight(isDay, observedAt, sunrise, sunset)
  const conditionKind = classifyHeroCondition(conditionLabel)
  const tone = buildHeroTone(conditionKind, heroNight)
  const { climate, anomalyC } = useWeatherClimate()
  const anomalyMessage =
    anomalyC != null && Math.abs(anomalyC) >= 0.5 && climate
      ? formatAnomalyMessage(anomalyC, climate.currentMonth?.monthName ?? "this month", units)
      : null
  const precipAccent = precipDetail === "Currently falling"

  return (
    <article
      className={cn(
        "relative isolate overflow-hidden rounded-3xl p-5 ring-1 transition-shadow duration-500 sm:p-6",
        heroNight
          ? "bg-surface-container-high/95 shadow-md ring-outline-variant/15"
          : "bg-surface-container-low shadow-sm ring-outline-variant/10"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700"
        style={{ backgroundImage: tone.backdrop }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        aria-hidden="true"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/10 pb-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] text-on-surface-variant uppercase">
            <span
              className={cn("size-1.5 rounded-full bg-primary", refreshing && "animate-pulse")}
              aria-hidden="true"
            />
            {heroNight ? "Current conditions" : "Right now"}
          </span>
          {refreshing ? (
            <span className="text-[11px] font-medium text-primary">Updating…</span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {updatedLabel ? (
            <time dateTime={observedAt ?? undefined} className="text-xs text-on-surface-variant">
              {updatedLabel}
            </time>
          ) : null}
          <WeatherUnitsToggle className="shrink-0 scale-90 sm:scale-100" />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <TemperatureDisplay
            temperatureC={temperatureC}
            feelsLikeC={feelsLikeC}
            conditionLabel={conditionLabel}
            conditionIcon={conditionIcon}
            units={units}
            todayHighC={todayHighC}
            todayLowC={todayLowC}
            hourlyForecast={hourlyForecast}
            observedAt={observedAt}
            sunrise={sunrise}
            sunset={sunset}
            refreshing={refreshing}
            anomalyMessage={anomalyMessage}
          />

          <div className="hidden shrink-0 flex-col items-center gap-2.5 sm:flex lg:pt-1">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <span
                className="pointer-events-none absolute inset-0 rounded-full blur-md"
                style={{ backgroundImage: tone.halo }}
                aria-hidden="true"
              />
              <div
                className={cn(
                  "relative flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-[1.4rem] text-5xl leading-none",
                  "bg-surface-container-highest/80 ring-1 ring-outline-variant/15 backdrop-blur-md"
                )}
              >
                <span aria-hidden="true">{conditionIcon}</span>
                <span className="sr-only">{conditionLabel}</span>
              </div>
            </div>
            <p className="max-w-[7rem] text-center text-xs font-medium leading-snug text-on-surface">
              {conditionLabel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-surface-container-highest/70 px-3.5 py-3 ring-1 ring-outline-variant/10 backdrop-blur-sm transition-colors hover:bg-surface-container-highest/90">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest/70 ring-1 ring-outline-variant/10">
              <WindCompass degrees={windDirectionDeg} className="h-7 w-7 text-on-surface-variant" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">Wind</p>
              <p className="text-sm font-semibold text-on-surface">{windSpeed}</p>
              {windGust ? <p className="truncate text-[11px] text-on-surface-variant">{windGust}</p> : null}
            </div>
          </div>
          <HeroMetricChip
            label="Precipitation"
            value={precipValue}
            detail={precipDetail}
            icon="💧"
            accent={precipAccent}
          />
        </div>
      </div>
    </article>
  )
}
