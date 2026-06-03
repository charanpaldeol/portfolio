"use client"

// Purpose: Pressure, visibility, pollutants, marine (display order: 6).
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { cn } from "@/lib/utils"
import { aqiSeverity, formatPressure, formatVisibility, windDirectionLabel } from "@/lib/weather-format"
import type { AirQualitySnapshot, MarineSnapshot } from "@/lib/weather-types"
import { formatTempValue } from "@/lib/weather-units"

type WeatherDetailSectionProps = {
  pressureHpa: number | null
  visibilityM: number | null
  cloudCoverPercent: number | null
  airQuality: AirQualitySnapshot
  marine: MarineSnapshot | null
}

function DetailTile({
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

function pollutantLine(label: string, value: number | null, unit: string): string | null {
  if (value == null) return null
  return `${label} ${value.toFixed(label === "CO" ? 0 : 1)} ${unit}`
}

export function WeatherDetailSection({
  pressureHpa,
  visibilityM,
  cloudCoverPercent,
  airQuality,
  marine,
}: WeatherDetailSectionProps) {
  const { units } = useWeatherUnits()
  const cloud =
    typeof cloudCoverPercent === "number" && Number.isFinite(cloudCoverPercent)
      ? `${Math.round(cloudCoverPercent)}%`
      : "—"
  const aqiValue = airQuality.usAqi != null ? String(Math.round(airQuality.usAqi)) : "—"
  const aqiBadge = aqiSeverity(airQuality.usAqi)
  const pollutants = [
    pollutantLine("PM2.5", airQuality.pm25, "µg/m³"),
    pollutantLine("PM10", airQuality.pm10, "µg/m³"),
    pollutantLine("O₃", airQuality.ozone, "µg/m³"),
    pollutantLine("NO₂", airQuality.nitrogenDioxide, "µg/m³"),
    pollutantLine("CO", airQuality.carbonMonoxide, "µg/m³"),
    pollutantLine("SO₂", airQuality.sulphurDioxide, "µg/m³"),
  ].filter(Boolean)

  return (
    <section aria-label="Details" className="space-y-2">
      <h2 className="text-sm font-medium uppercase tracking-wide text-on-surface-variant">Details</h2>
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <DetailTile label="Pressure" value={formatPressure(pressureHpa)} />
        <DetailTile label="Visibility" value={formatVisibility(visibilityM)} />
        <DetailTile label="Cloud cover" value={cloud} />
        <DetailTile
          label="Air quality"
          value={aqiValue}
          detail={pollutants.join(" · ") || airQuality.label}
          badge={aqiBadge ? { text: aqiBadge.label, className: aqiBadge.badgeClass } : undefined}
        />
      </div>
      {marine?.waveHeightM != null ? (
        <div className="rounded-xl bg-surface-container-low px-4 py-3 ring-1 ring-outline-variant/10">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-on-surface">Coastal / marine</h3>
          <p className="mt-1 text-sm text-on-surface">
            Waves {marine.waveHeightM.toFixed(1)} m
            {marine.wavePeriodSec != null ? ` · ${marine.wavePeriodSec.toFixed(0)} s period` : ""}
            {marine.waveDirectionDeg != null
              ? ` · from ${windDirectionLabel(marine.waveDirectionDeg)}`
              : ""}
            {marine.seaSurfaceTempC != null
              ? ` · sea ${formatTempValue(marine.seaSurfaceTempC, units, 0)}`
              : ""}
          </p>
        </div>
      ) : null}
    </section>
  )
}
