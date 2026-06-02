// Purpose: MSN-style weather readout — location header, hero temp, detail tiles, and forecast.
import { WeatherForecast } from "@/components/weather/WeatherForecast"
import {
  aqiLabel,
  formatClockTime,
  formatObservedAt,
  formatPopulation,
  formatPrecipitation,
  formatPressure,
  formatTemperature,
  formatVisibility,
  windDirectionLabel,
} from "@/lib/weather-format"
import type { WeatherSnapshot } from "@/lib/weather-types"

type WeatherConditionsProps = {
  snapshot: WeatherSnapshot
}

function DetailTile({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <article className="rounded-xl bg-surface-container-lowest/90 px-4 py-3 ring-1 ring-outline-variant/10">
      <h3 className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">{label}</h3>
      <p className="mt-1 text-lg font-semibold text-on-surface">{value}</p>
      {detail ? <p className="mt-0.5 text-xs text-on-surface-variant">{detail}</p> : null}
    </article>
  )
}

export function WeatherConditions({ snapshot }: WeatherConditionsProps) {
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
    observedAt,
    timezone,
    timezoneAbbreviation,
    source,
  } = snapshot

  const latLabel = lat.toFixed(4)
  const lonLabel = lon.toFixed(4)
  const updatedLabel = formatObservedAt(observedAt, timezone, timezoneAbbreviation)?.replace(/^Updated /, "")
  const windSpeed =
    typeof windSpeedKmh === "number" && Number.isFinite(windSpeedKmh) ? `${Math.round(windSpeedKmh)} km/h` : "—"
  const windDirection =
    typeof windDirectionDeg === "number" && Number.isFinite(windDirectionDeg)
      ? windDirectionLabel(windDirectionDeg)
      : null
  const humidity =
    typeof humidityPercent === "number" && Number.isFinite(humidityPercent)
      ? `${Math.round(humidityPercent)}%`
      : "—"
  const high = todayHighC != null ? formatTemperature(todayHighC, 0).replace("°C", "°") : "—"
  const low = todayLowC != null ? formatTemperature(todayLowC, 0).replace("°C", "°") : "—"
  const precipNow = formatPrecipitation(precipitationMm)
  const precipToday =
    precipitationSumTodayMm != null ? formatPrecipitation(precipitationSumTodayMm) : precipNow
  const cloud =
    typeof cloudCoverPercent === "number" && Number.isFinite(cloudCoverPercent)
      ? `${Math.round(cloudCoverPercent)}%`
      : "—"
  const uv =
    typeof uvIndexMax === "number" && Number.isFinite(uvIndexMax) ? uvIndexMax.toFixed(1) : "—"
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
  const aqiDetail =
    airQuality.usAqi != null
      ? `${airQuality.label}${airQuality.pm25 != null ? ` · PM2.5 ${airQuality.pm25.toFixed(1)} µg/m³` : ""}`
      : undefined

  return (
    <section aria-label="Current weather conditions" className="space-y-4">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold text-on-surface md:text-3xl">
          {city ? city : "Current location"}
        </h1>
        <p className="font-mono text-xs text-on-surface-variant sm:text-sm">
          {latLabel}, {lonLabel}
        </p>
        {locationMeta ? <p className="text-xs text-on-surface-variant">{locationMeta}</p> : null}
        {locationSourceLabel ? (
          <p className="text-xs text-on-surface-variant/80">{locationSourceLabel}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-on-surface-variant">
        <span className="font-medium uppercase tracking-wide">Current weather</span>
        {updatedLabel ? <span>{updatedLabel}</span> : null}
      </div>

      <div className="rounded-2xl bg-surface-container-low p-4 ring-1 ring-outline-variant/10 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <span className="text-5xl leading-none md:text-6xl" aria-hidden="true">
              {condition.icon}
            </span>
            <div>
              <p className="text-5xl font-semibold leading-none text-on-surface md:text-6xl">
                {formatTemperature(temperatureC, 1)}
              </p>
              <p className="mt-2 text-lg font-medium text-on-surface md:text-xl">{condition.label}</p>
            </div>
          </div>

          {feelsLikeC != null ? (
            <div className="rounded-xl bg-surface-container-lowest/90 px-4 py-3 text-right ring-1 ring-outline-variant/10">
              <p className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">
                Feels like
              </p>
              <p className="mt-1 text-2xl font-semibold text-on-surface">{formatTemperature(feelsLikeC, 1)}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <DetailTile label="Humidity" value={humidity} detail="Relative humidity" />
        <DetailTile
          label="Wind"
          value={windSpeed}
          detail={windDirection ? `From the ${windDirection}` : undefined}
        />
        <DetailTile label="High today" value={high} />
        <DetailTile label="Low today" value={low} />
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <DetailTile
          label="Precipitation"
          value={precipToday}
          detail={precipitationMm != null && precipitationMm > 0 ? "Currently falling" : "Today total"}
        />
        <DetailTile label="UV index" value={uv} detail="Max today" />
        <DetailTile label="Cloud cover" value={cloud} />
        <DetailTile label="Pressure" value={formatPressure(pressureHpa)} />
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <DetailTile label="Visibility" value={formatVisibility(visibilityM)} />
        <DetailTile label="Sun" value={sunriseTime ?? sunsetTime ?? "—"} detail={sunDetail} />
        <DetailTile
          label="Air quality"
          value={aqiValue}
          detail={aqiDetail ?? (airQuality.usAqi != null ? aqiLabel(airQuality.usAqi) : undefined)}
        />
      </div>

      <WeatherForecast days={dailyForecast} />

      <p className="pt-1 text-[11px] text-on-surface-variant/75">
        Data from {source} via <code>/api/weather</code>
      </p>
    </section>
  )
}
