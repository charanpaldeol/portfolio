// Purpose: Homepage teaser — compact current-conditions card linking to /weather.
import Link from "next/link"

import { weatherConditionFromCode } from "@/lib/weather-code"
import { getWeatherData } from "@/lib/weather-service"

export async function WeatherTeaser() {
  const result = await getWeatherData({}, { includeClimate: false })
  if (result.status !== 200) return null

  const data = result.data
  const city = typeof data.city === "string" ? data.city : "New York"
  const temperatureC = typeof data.temperatureC === "number" ? data.temperatureC : null
  const weatherCode = typeof data.weatherCode === "number" ? data.weatherCode : 0
  const condition = weatherConditionFromCode(weatherCode)
  const lat = typeof data.lat === "number" ? data.lat : null
  const lon = typeof data.lon === "number" ? data.lon : null

  const href =
    lat != null && lon != null
      ? `/weather?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}&city=${encodeURIComponent(city)}`
      : "/weather"

  const cityShort = city.split(",")[0]?.trim() || city
  const tempLabel = temperatureC != null ? `${Math.round(temperatureC)}°C` : "—"

  return (
    <section aria-label="Weather teaser" className="rounded-2xl bg-surface-container-low p-4 ring-1 ring-outline-variant/10 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none" aria-hidden="true">
            {condition.icon}
          </span>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Live weather</p>
            <p className="mt-1 text-lg font-semibold text-on-surface">
              {cityShort} · {tempLabel}
            </p>
            <p className="text-sm text-on-surface-variant">{condition.label}</p>
          </div>
        </div>
        <Link
          href={href}
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Full forecast →
        </Link>
      </div>
    </section>
  )
}
