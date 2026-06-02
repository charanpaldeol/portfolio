// Purpose: Side-by-side weather comparison for two locations.
import { WeatherForecast } from "@/components/weather/WeatherForecast"
import { buildCompareMetrics, compareSummaryLine, locationSubtitle } from "@/lib/weather-compare"
import type { CompareMetric, WeatherSnapshot } from "@/lib/weather-types"

type WeatherCompareProps = {
  locationA: WeatherSnapshot
  locationB: WeatherSnapshot
}

function CompareRow({ metric }: { metric: CompareMetric }) {
  return (
    <tr className="border-b border-outline-variant/10 last:border-b-0">
      <th scope="row" className="py-2.5 pr-3 text-left text-xs font-semibold tracking-wide text-on-surface-variant uppercase align-top sm:py-3 sm:pr-4 sm:text-[11px]">
        {metric.label}
      </th>
      <td className="py-2.5 px-2 text-sm font-medium text-on-surface align-top sm:py-3 sm:px-3">
        <span>{metric.valueA}</span>
        {metric.detailA ? <p className="mt-0.5 text-xs font-normal text-on-surface-variant">{metric.detailA}</p> : null}
      </td>
      <td className="py-2.5 pl-2 text-sm font-medium text-on-surface align-top sm:py-3 sm:pl-3">
        <span>{metric.valueB}</span>
        {metric.detailB ? <p className="mt-0.5 text-xs font-normal text-on-surface-variant">{metric.detailB}</p> : null}
      </td>
      {metric.delta ? (
        <td className="hidden py-2.5 pl-3 text-xs text-primary align-top md:table-cell sm:py-3">{metric.delta}</td>
      ) : (
        <td className="hidden py-2.5 pl-3 align-top md:table-cell sm:py-3" />
      )}
    </tr>
  )
}

function placeHeading(snapshot: WeatherSnapshot, fallback: string) {
  return snapshot.city.trim() || fallback
}

export function WeatherCompare({ locationA, locationB }: WeatherCompareProps) {
  const metrics = buildCompareMetrics(locationA, locationB)
  const summary = compareSummaryLine(locationA, locationB)
  const labelA = placeHeading(locationA, "Location A")
  const labelB = placeHeading(locationB, "Location B")

  return (
    <section aria-label="Weather comparison" className="space-y-4">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold text-on-surface md:text-3xl">Compare weather</h1>
        {summary ? <p className="text-sm text-primary">{summary}</p> : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <article className="rounded-2xl bg-surface-container-low p-4 ring-1 ring-outline-variant/10">
          <h2 className="font-display text-lg font-semibold text-on-surface">{labelA}</h2>
          <p className="mt-1 text-xs text-on-surface-variant">{locationSubtitle(locationA)}</p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-4xl" aria-hidden="true">
              {locationA.condition.icon}
            </span>
            <p className="text-4xl font-semibold leading-none text-on-surface">
              {locationA.temperatureC != null ? `${locationA.temperatureC.toFixed(1)}°C` : "—"}
            </p>
          </div>
          <p className="mt-2 text-sm text-on-surface-variant">{locationA.condition.label}</p>
        </article>

        <article className="rounded-2xl bg-surface-container-low p-4 ring-1 ring-outline-variant/10">
          <h2 className="font-display text-lg font-semibold text-on-surface">{labelB}</h2>
          <p className="mt-1 text-xs text-on-surface-variant">{locationSubtitle(locationB)}</p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-4xl" aria-hidden="true">
              {locationB.condition.icon}
            </span>
            <p className="text-4xl font-semibold leading-none text-on-surface">
              {locationB.temperatureC != null ? `${locationB.temperatureC.toFixed(1)}°C` : "—"}
            </p>
          </div>
          <p className="mt-2 text-sm text-on-surface-variant">{locationB.condition.label}</p>
        </article>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest ring-1 ring-outline-variant/10">
        <table className="min-w-full border-collapse px-1">
          <caption className="sr-only">
            Weather comparison between {labelA} and {labelB}
          </caption>
          <thead>
            <tr className="border-b border-outline-variant/15 text-left">
              <th scope="col" className="py-3 pr-3 pl-4 text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                Metric
              </th>
              <th scope="col" className="py-3 px-2 text-xs font-semibold tracking-wide text-on-surface uppercase sm:px-3">
                {labelA}
              </th>
              <th scope="col" className="py-3 px-2 text-xs font-semibold tracking-wide text-on-surface uppercase sm:px-3">
                {labelB}
              </th>
              <th scope="col" className="hidden py-3 pr-4 pl-3 text-xs font-semibold tracking-wide text-on-surface-variant uppercase md:table-cell">
                Difference
              </th>
            </tr>
          </thead>
          <tbody className="px-4">
            {metrics.map((metric) => (
              <CompareRow key={metric.key} metric={metric} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-on-surface">{labelA} — 7-day forecast</h3>
          <WeatherForecast days={locationA.dailyForecast} />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-on-surface">{labelB} — 7-day forecast</h3>
          <WeatherForecast days={locationB.dailyForecast} />
        </div>
      </div>

      <p className="pt-1 text-[11px] text-on-surface-variant/75">
        Data from {locationA.source} via <code>/api/weather</code>
      </p>
    </section>
  )
}
