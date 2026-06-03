"use client"

// Purpose: MSN-style weather readout — ordered sections: safety → now → trip → comfort → context → detail → meta.
import type { ReactNode } from "react"

import { WeatherComfortSection } from "@/components/weather/WeatherComfortSection"
import { WeatherContextSection } from "@/components/weather/WeatherContextSection"
import { WeatherDetailSection } from "@/components/weather/WeatherDetailSection"
import { WeatherForecast } from "@/components/weather/WeatherForecast"
import { WeatherHourlyForecast } from "@/components/weather/WeatherHourlyForecast"
import { WeatherMetaSection } from "@/components/weather/WeatherMetaSection"
import { WeatherSafetySection } from "@/components/weather/WeatherSafetySection"
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { WindCompass } from "@/components/weather/WindCompass"
import { cn } from "@/lib/utils"
import {
  formatObservedAt,
  formatPopulation,
  formatPrecipitation,
  formatTemperatureAnomaly,
} from "@/lib/weather-format"
import type { WeatherSnapshot } from "@/lib/weather-types"
import { formatTempValue, formatWindGust, formatWindSpeed } from "@/lib/weather-units"

type WeatherConditionsProps = {
  snapshot: WeatherSnapshot
  loading?: boolean
  climateSlot?: ReactNode
}

function NowTile({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <article className="rounded-xl bg-surface-container-lowest/90 px-4 py-3 ring-1 ring-outline-variant/10">
      <h3 className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">{label}</h3>
      <p className="mt-1 text-lg font-semibold text-on-surface">{value}</p>
      {detail ? <p className="mt-0.5 text-xs text-on-surface-variant">{detail}</p> : null}
    </article>
  )
}

export function WeatherConditions({ snapshot, loading = false, climateSlot }: WeatherConditionsProps) {
  const { units } = useWeatherUnits()
  const {
    city,
    lat,
    lon,
    temperatureC,
    condition,
    windSpeedKmh,
    windDirectionDeg,
    windGustKmh,
    precipitationMm,
    precipitationSumTodayMm,
    dailyForecast,
    todayHighC,
    todayLowC,
    elevationM,
    population,
    locationSource,
    observedAt,
    timezone,
    timezoneAbbreviation,
    isDay,
    temperatureAnomalyC,
    isDefaultLocation,
    alerts,
    safetyNotices,
    pastWeek,
  } = snapshot

  const heroNight = isDay === false
  const updatedLabel = formatObservedAt(observedAt, timezone, timezoneAbbreviation)?.replace(/^Updated /, "")
  const windSpeed = formatWindSpeed(windSpeedKmh, units)
  const windGust = formatWindGust(windGustKmh, units)
  const precipToday =
    precipitationSumTodayMm != null ? formatPrecipitation(precipitationSumTodayMm) : formatPrecipitation(precipitationMm)
  const precipDetail =
    precipitationMm != null && precipitationMm > 0
      ? "Currently falling"
      : dailyForecast.find((day) => !day.isPast)?.precipitationProbabilityPercent != null
        ? `${dailyForecast.find((day) => !day.isPast)?.precipitationProbabilityPercent}% chance today`
        : "Today total"
  const anomalyLabel = formatTemperatureAnomaly(
    temperatureAnomalyC,
    units,
    snapshot.climateNormals?.currentMonth?.monthName ?? "this month"
  )
  const elevationLabel =
    typeof elevationM === "number" && Number.isFinite(elevationM) ? `${Math.round(elevationM)} m elevation` : null
  const populationLabel = formatPopulation(population)
  const locationMeta = [elevationLabel, populationLabel].filter(Boolean).join(" · ")

  return (
    <div className={cn("space-y-4 transition-opacity", loading && "opacity-60")} aria-busy={loading}>
      <WeatherSafetySection alerts={alerts} safetyNotices={safetyNotices} />

      <section aria-label="Current weather conditions" className="space-y-4">
        {isDefaultLocation ? (
          <p className="rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant ring-1 ring-outline-variant/10">
            Showing <span className="font-medium text-on-surface">{city || "New York"}</span> — search for your city or
            use your current location.
          </p>
        ) : null}

        <div
          className={
            climateSlot ? "grid gap-4 sm:grid-cols-2 sm:items-start lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" : undefined
          }
        >
          <div className="min-w-0 space-y-1">
            <h1 className="font-display text-2xl font-semibold text-on-surface md:text-3xl">
              {city ? city : "Current location"}
            </h1>
            <p className="font-mono text-xs text-on-surface-variant sm:text-sm">
              {lat.toFixed(4)}, {lon.toFixed(4)}
            </p>
            {locationMeta ? <p className="text-xs text-on-surface-variant">{locationMeta}</p> : null}
            {locationSource === "gps" ? (
              <p className="text-xs text-on-surface-variant/80">GPS location</p>
            ) : locationSource === "network" ? (
              <p className="text-xs text-on-surface-variant/80">Approximate network location</p>
            ) : null}
            {anomalyLabel ? <p className="text-sm text-primary">{anomalyLabel}</p> : null}
          </div>
          {climateSlot}
        </div>

        <div className="flex items-center justify-between gap-3 text-sm text-on-surface-variant">
          <span className="font-medium uppercase tracking-wide">{heroNight ? "Tonight" : "Now"}</span>
          {updatedLabel ? <span>{updatedLabel}</span> : null}
        </div>

        <div
          className={cn(
            "rounded-2xl p-4 ring-1 ring-outline-variant/10 sm:p-5",
            heroNight ? "bg-surface-container-high/80" : "bg-surface-container-low"
          )}
        >
          <div className="flex flex-wrap items-end gap-4">
            <span className="text-5xl leading-none md:text-6xl" aria-hidden="true">
              {condition.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-5xl font-semibold leading-none text-on-surface md:text-6xl">
                {formatTempValue(temperatureC, units, 1)}
              </p>
              <p className="mt-2 text-lg font-medium text-on-surface md:text-xl">{condition.label}</p>
            </div>
            <WindCompass degrees={windDirectionDeg} className="h-12 w-12 shrink-0" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          <NowTile label="High today" value={todayHighC != null ? formatTempValue(todayHighC, units, 0) : "—"} />
          <NowTile label="Low today" value={todayLowC != null ? formatTempValue(todayLowC, units, 0) : "—"} />
          <NowTile label="Wind" value={windSpeed} detail={windGust ?? undefined} />
          <NowTile label="Precipitation" value={precipToday} detail={precipDetail} />
        </div>
      </section>

      <WeatherHourlyForecast hours={snapshot.hourlyForecast} />
      <WeatherForecast days={snapshot.dailyForecast} />
      <WeatherComfortSection snapshot={snapshot} />
      <WeatherContextSection
        lat={snapshot.lat}
        lon={snapshot.lon}
        temperatureC={snapshot.temperatureC}
        pastWeek={pastWeek}
      />
      <WeatherDetailSection
        pressureHpa={snapshot.pressureHpa}
        visibilityM={snapshot.visibilityM}
        cloudCoverPercent={snapshot.cloudCoverPercent}
        airQuality={snapshot.airQuality}
        marine={snapshot.marine}
      />
      <WeatherMetaSection
        sunrise={snapshot.sunrise}
        sunset={snapshot.sunset}
        sunshineDurationSec={snapshot.sunshineDurationSec}
        daylightDurationSec={snapshot.daylightDurationSec}
        moon={snapshot.moon}
      />
    </div>
  )
}
