// Purpose: Safety alerts and computed hazard notices (display order: 1).
import type { WeatherAlert } from "@/lib/weather-types"

type WeatherSafetySectionProps = {
  alerts: WeatherAlert[]
  safetyNotices: string[]
}

export function WeatherSafetySection({ alerts, safetyNotices }: WeatherSafetySectionProps) {
  if (alerts.length === 0 && safetyNotices.length === 0) return null

  return (
    <section aria-label="Safety and alerts" className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          role="alert"
          className="rounded-xl bg-destructive/10 px-4 py-3 ring-1 ring-destructive/20"
        >
          <p className="text-sm font-semibold text-destructive">{alert.event}</p>
          <p className="mt-1 text-sm text-on-surface">{alert.headline}</p>
          <p className="mt-1 text-xs text-on-surface-variant">
            {alert.severity} · {alert.source}
          </p>
        </div>
      ))}
      {safetyNotices.length > 0 ? (
        <div className="rounded-xl bg-surface-container-low px-4 py-3 ring-1 ring-outline-variant/10">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-on-surface">Safety notices</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-on-surface-variant">
            {safetyNotices.map((notice) => (
              <li key={notice} className="flex gap-2">
                <span aria-hidden="true" className="text-destructive">
                  !
                </span>
                <span>{notice}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
