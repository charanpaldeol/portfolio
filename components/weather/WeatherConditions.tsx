"use client"

// Purpose: MSN-style weather readout — location header, hero temp, detail tiles, and forecast.
import type { ReactNode } from "react"

import { WeatherForecast } from "@/components/weather/WeatherForecast"
import { WeatherHourlyForecast } from "@/components/weather/WeatherHourlyForecast"
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { WindCompass } from "@/components/weather/WindCompass"
import { cn } from "@/lib/utils"
import {
  aqiSeverity,
  formatClockTime,
  formatObservedAt,
  formatPopulation,
  formatPrecipitation,
  formatPressure,
  formatTemperatureAnomaly,
  formatVisibility,
  uvSeverity,
  windDirectionLabel,
} from "@/lib/weather-format"
import type { WeatherSnapshot } from "@/lib/weather-types"
import { formatTempValue } from "@/lib/weather-units"

type WeatherConditionsProps = {
  snapshot: WeatherSnapshot
  loading?: boolean
  climateSlot?: ReactNode
}

function DetailTile({
  label,
  value,
  detail,
  badge,
  accessory,
}: {
  label: string
  value: string
  detail?: string
  badge?: { text: string; className: string }
  accessory?: ReactNode
}) {
  return (
    <article className="rounded-xl bg-surface-container-lowest/90 px-4 py-3 ring-1 ring-outline-variant/10">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">{label}</h3>
        {accessory}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <p className="text-lg font-semibold text-on-surface">{value}</p>
        {badge ? (
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", badge.className)}>
            {badge.text}
          </span>
        ) : null}
      </div>
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
    feelsLikeC,
    humidityPercent,
    windSpeedKmh,
    windDirectionDeg,
    windGustKmh,
    dewPointC,
    precipitationMm,
    precipitationSumTodayMm,
    cloudCoverPercent,
    pressureHpa,
    visibilityM,
    uvIndexMax,
    sunrise,
    sunset,
    todayHighC,
    todayLowC,
    elevationM,
    population,
    locationSource,
    airQuality,
    dailyForecast,
    hourlyForecast,
    observedAt,
    timezone,
    timezoneAbbreviation,
    source,
    isDay,
    temperatureAnomalyC,
    isDefaultLocation,
  } = snapshot

  const latLabel = lat.toFixed(4)
  const lonLabel = lon.toFixed(4)
  const updatedLabel = formatObservedAt(observedAt, timezone, timezoneAbbreviation)?.replace(/^Updated /, "")
  const windSpeed =
    typeof windSpeedKmh === "number" && Number.isFinite(windSpeedKmh) ? `${Math.round(windSpeedKmh)} km/h` : "—"
  const windGust =
    typeof windGustKmh === "number" && Number.isFinite(windGustKmh) ? `${Math.round(windGustKmh)} km/h gusts` : null
  const windDirection =
    typeof windDirectionDeg === "number" && Number.isFinite(windDirectionDeg)
      ? windDirectionLabel(windDirectionDeg)
      : null
  const humidity =
    typeof humidityPercent === "number" && Number.isFinite(humidityPercent)
      ? `${Math.round(humidityPercent)}%`
      : "—"
  const high = todayHighC != null ? formatTempValue(todayHighC, units, 0) : "—"
  const low = todayLowC != null ? formatTempValue(todayLowC, units, 0) : "—"
  const precipToday =
    precipitationSumTodayMm != null ? formatPrecipitation(precipitationSumTodayMm) : formatPrecipitation(precipitationMm)
  const precipDetail =
    precipitationMm != null && precipitationMm > 0
      ? "Currently falling"
      : dailyForecast[0]?.precipitationProbabilityPercent != null
        ? `${dailyForecast[0].precipitationProbabilityPercent}% chance today`
        : "Today total"
  const cloud =
    typeof cloudCoverPercent === "number" && Number.isFinite(cloudCoverPercent)
      ? `${Math.round(cloudCoverPercent)}%`
      : "—"
  const uvValue = typeof uvIndexMax === "number" && Number.isFinite(uvIndexMax) ? uvIndexMax.toFixed(1) : "—"
  const uvBadge = uvSeverity(uvIndexMax)
  const sunriseTime = formatClockTime(sunrise)
  const sunsetTime = formatClockTime(sunset)
  const sunDetail =
    sunriseTime && sunsetTime ? `↑ ${sunriseTime} · ↓ ${sunsetTime}` : sunriseTime ?? sunsetTime ?? undefined
  const populationLabel = formatPopulation(population)
  const elevationLabel =
    typeof elevationM === "number" && Number.isFinite(elevationM) ? `${Math.round(elevationM)} m elevation` : null
  const locationMeta = [elevationLabel, populationLabel].filter(Boolean).join(" · ")
  const locationSourceLabel =
    locationSource === "network"
      ? "Approximate network location"
      : locationSource === "gps"
        ? "GPS location"
        : null
  const aqiValue = airQuality.usAqi != null ? String(Math.round(airQuality.usAqi)) : "—"
  const aqiBadge = aqiSeverity(airQuality.usAqi)
  const aqiDetail =
    airQuality.usAqi != null
      ? `${airQuality.label}${airQuality.pm25 != null ? ` · PM2.5 ${airQuality.pm25.toFixed(1)} µg/m³` : ""}`
      : undefined
  const anomalyLabel = formatTemperatureAnomaly(temperatureAnomalyC)
  const dewPoint =
    dewPointC != null ? `${formatTempValue(dewPointC, units, 0)} dew point` : undefined
  const heroNight = isDay === false

  return (
    <section
      aria-label="Current weather conditions"
      aria-busy={loading}
      className={cn("space-y-4 transition-opacity", loading && "opacity-60")}
    >
      {isDefaultLocation ? (
        <p className="rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant ring-1 ring-outline-variant/10">
          Showing <span className="font-medium text-on-surface">{city || "New York"}</span> — search for your city or
          use your current location.
        </p>
      ) : null}

      <div className={climateSlot ? "grid gap-4 sm:grid-cols-2 sm:items-start lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" : undefined}>
        <div className="min-w-0 space-y-1">
          <h1 className="font-display text-2xl font-semibold text-on-surface md:text-3xl">
            {city ? city : "Current location"}
          </h1>
          <p className="font-mono text-xs text-on-surface-variant sm:text-sm">
            {latLabel}, {lonLabel}
          </p>
          {locationMeta ? <p className="text-xs text-on-surface-variant">{locationMeta}</p> : null}
          {locationSourceLabel ? <p className="text-xs text-on-surface-variant/80">{locationSourceLabel}</p> : null}
          {anomalyLabel ? <p className="text-sm text-primary">{anomalyLabel}</p> : null}
        </div>
        {climateSlot}
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-on-surface-variant">
        <span className="font-medium uppercase tracking-wide">{heroNight ? "Tonight" : "Current weather"}</span>
        {updatedLabel ? <span>{updatedLabel}</span> : null}
      </div>

      <div
        className={cn(
          "rounded-2xl p-4 ring-1 ring-outline-variant/10 sm:p-5",
          heroNight ? "bg-surface-container-high/80" : "bg-surface-container-low"
        )}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <span className="text-5xl leading-none md:text-6xl" aria-hidden="true">
              {condition.icon}
            </span>
            <div>
              <p className="text-5xl font-semibold leading-none text-on-surface md:text-6xl">
                {formatTempValue(temperatureC, units, 1)}
              </p>
              <p className="mt-2 text-lg font-medium text-on-surface md:text-xl">{condition.label}</p>
            </div>
          </div>

          {feelsLikeC != null ? (
            <div className="rounded-xl bg-surface-container-lowest/90 px-4 py-3 text-right ring-1 ring-outline-variant/10">
              <p className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">
                Feels like
              </p>
              <p className="mt-1 text-2xl font-semibold text-on-surface">{formatTempValue(feelsLikeC, units, 1)}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <DetailTile label="Humidity" value={humidity} detail={dewPoint ?? "Relative humidity"} />
        <DetailTile
          label="Wind"
          value={windSpeed}
          detail={[windDirection ? `From the ${windDirection}` : null, windGust].filter(Boolean).join(" · ") || undefined}
          accessory={<WindCompass degrees={windDirectionDeg} className="h-8 w-8 shrink-0" />}
        />
        <DetailTile label="High today" value={high} />
        <DetailTile label="Low today" value={low} />
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <DetailTile label="Precipitation" value={precipToday} detail={precipDetail} />
        <DetailTile
          label="UV index"
          value={uvValue}
          detail="Max today"
          badge={uvBadge ? { text: uvBadge.label, className: uvBadge.badgeClass } : undefined}
        />
        <DetailTile label="Cloud cover" value={cloud} />
        <DetailTile label="Pressure" value={formatPressure(pressureHpa)} />
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <DetailTile label="Visibility" value={formatVisibility(visibilityM)} />
        <DetailTile label="Sun" value={sunriseTime ?? sunsetTime ?? "—"} detail={sunDetail} />
        <DetailTile
          label="Air quality"
          value={aqiValue}
          detail={aqiDetail}
          badge={aqiBadge ? { text: aqiBadge.label, className: aqiBadge.badgeClass } : undefined}
        />
        <DetailTile
          label="Dew point"
          value={dewPointC != null ? formatTempValue(dewPointC, units, 1) : "—"}
          detail="Surface dew point"
        />
      </div>

      <WeatherHourlyForecast hours={hourlyForecast} />
      <WeatherForecast days={dailyForecast} />

      <p className="pt-1 text-[11px] text-on-surface-variant/75">
        Data from {source} via <code>/api/weather</code>
      </p>
    </section>
  )
}
