"use client"

// Purpose: Comfort metrics — feels-like, humidity, wet-bulb, UV (display order: 4).
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { cn } from "@/lib/utils"
import { uvSeverity } from "@/lib/weather-format"
import type { WeatherSnapshot } from "@/lib/weather-types"
import { formatTempValue } from "@/lib/weather-units"

type WeatherComfortSectionProps = {
  snapshot: Pick<
    WeatherSnapshot,
    "feelsLikeC" | "humidityPercent" | "dewPointC" | "wetBulbC" | "uvIndexMax"
  >
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

export function WeatherComfortSection({ snapshot }: WeatherComfortSectionProps) {
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
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <ComfortTile
          label="Feels like"
          value={formatTempValue(snapshot.feelsLikeC, units, 1)}
          detail="Apparent temperature"
        />
        <ComfortTile label="Humidity" value={humidity} detail={dewPoint} />
        <ComfortTile
          label="Wet-bulb"
          value={formatTempValue(snapshot.wetBulbC, units, 1)}
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
