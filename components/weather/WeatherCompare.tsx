// Purpose: Side-by-side weather comparison for two locations.
"use client"

import Link from "next/link"

import { TripPackingHints } from "@/components/weather/TripPackingHints"
import { WeatherCompareForecastTable } from "@/components/weather/WeatherCompareForecastTable"
import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { buildCompareMetrics, compareSummaryLine, locationSubtitle } from "@/lib/weather-compare"
import { formatLocalTime } from "@/lib/weather-format"
import type { CompareMetric, WeatherSnapshot } from "@/lib/weather-types"
import { formatTempValue } from "@/lib/weather-units"

type WeatherCompareProps = {
  locationA: WeatherSnapshot
  locationB: WeatherSnapshot
  swapHref: string
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
        <td className="py-2.5 pl-3 text-xs text-primary align-top md:table-cell sm:py-3">{metric.delta}</td>
      ) : (
        <td className="hidden py-2.5 pl-3 align-top md:table-cell sm:py-3" />
      )}
    </tr>
  )
}

function placeHeading(snapshot: WeatherSnapshot, fallback: string) {
  return snapshot.city.trim() || fallback
}

export function WeatherCompare({ locationA, locationB, swapHref }: WeatherCompareProps) {
  const { units } = useWeatherUnits()
  const metrics = buildCompareMetrics(locationA, locationB, units)
  const summary = compareSummaryLine(locationA, locationB, units)
  const labelA = placeHeading(locationA, "Location A")
  const labelB = placeHeading(locationB, "Location B")
  const localTimeA = formatLocalTime(locationA.observedAt, locationA.timezoneAbbreviation)
  const localTimeB = formatLocalTime(locationB.observedAt, locationB.timezoneAbbreviation)

  return (
    <section aria-label="Weather comparison" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-semibold text-on-surface md:text-3xl">Compare weather</h1>
          {summary ? <p className="text-sm text-primary">{summary}</p> : null}
          {localTimeA && localTimeB ? (
            <p className="text-sm text-on-surface-variant">
              Local time — {labelA}: {localTimeA} · {labelB}: {localTimeB}
            </p>
          ) : null}
        </div>
        <Link
          href={swapHref}
          className="text-xs font-semibold tracking-wide text-primary uppercase hover:underline"
        >
          Swap places
        </Link>
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
              {formatTempValue(locationA.temperatureC, units, 1)}
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
              {formatTempValue(locationB.temperatureC, units, 1)}
            </p>
          </div>
          <p className="mt-2 text-sm text-on-surface-variant">{locationB.condition.label}</p>
        </article>
      </div>

      <TripPackingHints locationA={locationA} locationB={locationB} />

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

      <WeatherCompareForecastTable labelA={labelA} labelB={labelB} daysA={locationA.dailyForecast} daysB={locationB.dailyForecast} />

      <p className="pt-1 text-[11px] text-on-surface-variant/75">
        Data from {locationA.source} via <code>/api/weather</code>
      </p>
    </section>
  )
}
