// Purpose: Trip-planning hints derived from weather comparison metrics.
import { buildPackingHints } from "@/lib/weather-packing"
import type { WeatherSnapshot } from "@/lib/weather-types"

type TripPackingHintsProps = {
  locationA: WeatherSnapshot
  locationB: WeatherSnapshot
}

export function TripPackingHints({ locationA, locationB }: TripPackingHintsProps) {
  const hints = buildPackingHints(locationA, locationB)

  return (
    <section aria-label="Trip planning hints" className="rounded-xl bg-surface-container-low p-4 ring-1 ring-outline-variant/10">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-on-surface">Packing &amp; planning</h2>
      <ul className="mt-2 space-y-1.5 text-sm text-on-surface-variant">
        {hints.map((hint) => (
          <li key={hint} className="flex gap-2">
            <span aria-hidden="true" className="text-primary">
              •
            </span>
            <span>{hint}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
