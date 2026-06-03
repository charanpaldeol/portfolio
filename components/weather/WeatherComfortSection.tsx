"use client"

// Purpose: Comfort metrics — feels-like, humidity, wet-bulb, UV (display order: 4).
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { cn } from "@/lib/utils"
import { uvSeverity } from "@/lib/weather-format"
import type { WeatherSnapshot } from "@/lib/weather-types"
import { formatTempValue, WEATHER_TEMP_DIGITS } from "@/lib/weather-units"

type WeatherComfortSectionProps = {
  snapshot: Pick<
    WeatherSnapshot,
    "feelsLikeC" | "humidityPercent" | "dewPointC" | "wetBulbC" | "uvIndexMax"
  >
  /** Hide feels-like tile when the hero already shows it. */
  showFeelsLike?: boolean
}

function ComfortTile({
  label,
  value,
  detail,
  badge,
}: {
  label: string
  value: string
  detail?: string
  badge?: { text: string; className: string }
}) {
  return (
    <article className="rounded-xl bg-surface-container-lowest/90 px-4 py-3 ring-1 ring-outline-variant/10">
      <h3 className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">{label}</h3>
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

export function WeatherComfortSection({ snapshot, showFeelsLike = true }: WeatherComfortSectionProps) {
  const { units } = useWeatherUnits()
  const humidity =
    typeof snapshot.humidityPercent === "number" && Number.isFinite(snapshot.humidityPercent)
      ? `${Math.round(snapshot.humidityPercent)}%`
      : "—"
  const dewPoint =
    snapshot.dewPointC != null ? `${formatTempValue(snapshot.dewPointC, units, 0)} dew point` : "Relative humidity"
  const uvValue =
    typeof snapshot.uvIndexMax === "number" && Number.isFinite(snapshot.uvIndexMax)
      ? snapshot.uvIndexMax.toFixed(1)
      : "—"
  const uvBadge = uvSeverity(snapshot.uvIndexMax)

  return (
    <section aria-label="Comfort" className="space-y-2">
      <h2 className="text-sm font-medium uppercase tracking-wide text-on-surface-variant">Comfort</h2>
      <div
        className={cn(
          "grid gap-2.5",
          showFeelsLike ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3"
        )}
      >
        {showFeelsLike ? (
          <ComfortTile
            label="Feels like"
            value={formatTempValue(snapshot.feelsLikeC, units, WEATHER_TEMP_DIGITS)}
            detail="Apparent temperature"
          />
        ) : null}
        <ComfortTile label="Humidity" value={humidity} detail={dewPoint} />
        <ComfortTile
          label="Wet-bulb"
          value={formatTempValue(snapshot.wetBulbC, units, WEATHER_TEMP_DIGITS)}
          detail="Heat stress indicator"
        />
        <ComfortTile
          label="UV index"
          value={uvValue}
          detail="Max today"
          badge={uvBadge ? { text: uvBadge.label, className: uvBadge.badgeClass } : undefined}
        />
      </div>
    </section>
  )
}
