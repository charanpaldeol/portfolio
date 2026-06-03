// Purpose: Daylight, moon, and data attribution (display order: 7).
import { WeatherAttribution } from "@/components/weather/WeatherAttribution"
import { formatClockTime, formatDuration } from "@/lib/weather-format"
import type { MoonInfo } from "@/lib/weather-types"

type WeatherMetaSectionProps = {
  sunrise: string | null
  sunset: string | null
  sunshineDurationSec: number | null
  daylightDurationSec: number | null
  moon: MoonInfo | null
}

export function WeatherMetaSection({
  sunrise,
  sunset,
  sunshineDurationSec,
  daylightDurationSec,
  moon,
}: WeatherMetaSectionProps) {
  const sunriseTime = formatClockTime(sunrise)
  const sunsetTime = formatClockTime(sunset)
  const sunDetail =
    sunriseTime && sunsetTime ? `↑ ${sunriseTime} · ↓ ${sunsetTime}` : sunriseTime ?? sunsetTime ?? undefined

  return (
    <section aria-label="Daylight and moon" className="space-y-3">
      <h2 className="text-sm font-medium uppercase tracking-wide text-on-surface-variant">Day &amp; night</h2>
      <div className="grid gap-2.5 sm:grid-cols-3">
        <article className="rounded-xl bg-surface-container-lowest/90 px-4 py-3 ring-1 ring-outline-variant/10">
          <h3 className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">Sun</h3>
          <p className="mt-1 text-lg font-semibold text-on-surface">{sunriseTime ?? sunsetTime ?? "—"}</p>
          {sunDetail ? <p className="mt-0.5 text-xs text-on-surface-variant">{sunDetail}</p> : null}
        </article>
        <article className="rounded-xl bg-surface-container-lowest/90 px-4 py-3 ring-1 ring-outline-variant/10">
          <h3 className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">Daylight</h3>
          <p className="mt-1 text-lg font-semibold text-on-surface">{formatDuration(daylightDurationSec)}</p>
          <p className="mt-0.5 text-xs text-on-surface-variant">
            Sunshine {formatDuration(sunshineDurationSec)}
          </p>
        </article>
        {moon ? (
          <article className="rounded-xl bg-surface-container-lowest/90 px-4 py-3 ring-1 ring-outline-variant/10">
            <h3 className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">Moon</h3>
            <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-on-surface">
              <span aria-hidden="true">{moon.icon}</span>
              {moon.phaseLabel}
            </p>
            <p className="mt-0.5 text-xs text-on-surface-variant">{moon.illuminationPercent}% lit</p>
          </article>
        ) : null}
      </div>
      <WeatherAttribution />
    </section>
  )
}
