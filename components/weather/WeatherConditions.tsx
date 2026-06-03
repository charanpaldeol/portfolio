"use client"

// Purpose: MSN-style weather readout — ordered sections: safety → now → trip → comfort → context → detail → meta.
import type { ReactNode } from "react"

import { WeatherComfortSection } from "@/components/weather/WeatherComfortSection"
import { WeatherContextSection } from "@/components/weather/WeatherContextSection"
import { WeatherDetailSection } from "@/components/weather/WeatherDetailSection"
import { WeatherForecast } from "@/components/weather/WeatherForecast"
import { WeatherHeroPanel } from "@/components/weather/WeatherHeroPanel"
import { WeatherHourlyForecast } from "@/components/weather/WeatherHourlyForecast"
import { WeatherMetaSection } from "@/components/weather/WeatherMetaSection"
import { WeatherSafetySection } from "@/components/weather/WeatherSafetySection"
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { formatObservedAt, formatPopulation, formatPrecipitation } from "@/lib/weather-format"
import type { WeatherSnapshot } from "@/lib/weather-types"
import { formatWindGust, formatWindSpeed, shouldShowFeelsLike } from "@/lib/weather-units"

type WeatherConditionsProps = {
  snapshot: WeatherSnapshot
  loading?: boolean
  climateSlot?: ReactNode
}

export function WeatherConditions({ snapshot, loading = false, climateSlot }: WeatherConditionsProps) {
  const { units } = useWeatherUnits()
  const {
    city,
    lat,
    lon,
    temperatureC,
    feelsLikeC,
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
    sunrise,
    sunset,
    isDefaultLocation,
    alerts,
    safetyNotices,
    pastWeek,
    hourlyForecast,
  } = snapshot

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
  const elevationLabel =
    typeof elevationM === "number" && Number.isFinite(elevationM) ? `${Math.round(elevationM)} m elevation` : null
  const populationLabel = formatPopulation(population)
  const locationMeta = [elevationLabel, populationLabel].filter(Boolean).join(" · ")
  const showFeelsLikeInHero = shouldShowFeelsLike(temperatureC, feelsLikeC)

  return (
    <div className="space-y-4" aria-busy={loading}>
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
          </div>
          {climateSlot}
        </div>

        <WeatherHeroPanel
          conditionIcon={condition.icon}
          conditionLabel={condition.label}
          temperatureC={temperatureC}
          feelsLikeC={feelsLikeC}
          todayHighC={todayHighC}
          todayLowC={todayLowC}
          hourlyForecast={hourlyForecast}
          windDirectionDeg={windDirectionDeg}
          windSpeed={windSpeed}
          windGust={windGust}
          precipValue={precipToday}
          precipDetail={precipDetail}
          isDay={isDay}
          observedAt={observedAt}
          sunrise={sunrise}
          sunset={sunset}
          updatedLabel={updatedLabel}
          units={units}
          refreshing={loading}
        />
      </section>

      <WeatherHourlyForecast hours={snapshot.hourlyForecast} />
      <WeatherForecast days={snapshot.dailyForecast} />
      <WeatherComfortSection snapshot={snapshot} showFeelsLike={!showFeelsLikeInHero} />
      <WeatherContextSection pastWeek={pastWeek} />
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
