// Purpose: Weather page — single location or MSN-style readout, or side-by-side compare.
import type { Metadata } from "next"
import { Suspense } from "react"

import { PageShell } from "@/components/layout/PageShell"
import { WeatherClientShell } from "@/components/weather/WeatherClientShell"
import { WeatherCompare } from "@/components/weather/WeatherCompare"
import { WeatherCompareSearch } from "@/components/weather/WeatherCompareSearch"
import { WeatherLiveConditions } from "@/components/weather/WeatherLiveConditions"
import { WeatherPageToolbar } from "@/components/weather/WeatherPageToolbar"
import { WeatherSearch } from "@/components/weather/WeatherSearch"
import { NOINDEX_ROBOTS, pageMetadata } from "@/lib/site-metadata"
import {
  buildCompareHrefFromSingle,
  buildCompareSwapHref,
  compareWeatherQueryFromSearchParams,
  hasCompareLocations,
  isCompareMode,
  parseWeatherPayload,
  weatherPageTitle,
} from "@/lib/weather-payload"
import {
  coordsMatch,
  getWeatherData,
  weatherQueryFromSearchParams,
} from "@/lib/weather-service"
import type { WeatherQueryParams } from "@/lib/weather-service"

function buildInitialQueryKey(query: WeatherQueryParams): string {
  const params = new URLSearchParams()
  const lat = query.lat ?? query.latitude
  const lon = query.lon ?? query.longitude
  const city = query.city ?? query.q
  if (lat) params.set("lat", lat)
  if (lon) params.set("lon", lon)
  if (city) params.set("city", city)
  if (query.approx) params.set("approx", query.approx)
  return params.toString()
}

async function loadWeatherJson(
  query: WeatherQueryParams,
  options?: { includeClimate?: boolean }
): Promise<Record<string, unknown>> {
  const result = await getWeatherData(query, options)
  if (result.status !== 200) {
    const message = typeof result.data.error === "string" ? result.data.error : "Request failed"
    return { error: message }
  }
  return result.data
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function WeatherSearchFallback() {
  return <div className="h-16 animate-pulse rounded-2xl bg-surface-container-low" />
}

function ConditionsFallback() {
  return <div className="h-96 animate-pulse rounded-2xl bg-surface-container-low" />
}

function CompareSetupBody() {
  return (
    <>
      <Suspense fallback={<WeatherSearchFallback />}>
        <WeatherCompareSearch />
      </Suspense>
      <div className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant ring-1 ring-outline-variant/10">
        <p className="font-medium text-on-surface">Compare home vs destination</p>
        <p className="mt-1">
          Pick two cities to see temperature, rain, air quality, and the 16-day forecast side by side — useful for
          packing and trip planning.
        </p>
      </div>
    </>
  )
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams
  if (isCompareMode(sp) && hasCompareLocations(sp)) {
    return pageMetadata({
      title: "Compare weather",
      description: "Side-by-side weather comparison for two locations.",
      path: "/weather",
      robots: NOINDEX_ROBOTS,
    })
  }

  const data = await loadWeatherJson(weatherQueryFromSearchParams(sp), { includeClimate: false })
  const snapshot = parseWeatherPayload(data)
  const title = weatherPageTitle(snapshot)

  return pageMetadata({
    title,
    description: snapshot
      ? `Current conditions and 16-day forecast for ${snapshot.city}.`
      : "Current conditions and location comparison via the site weather API.",
    path: "/weather",
    robots: NOINDEX_ROBOTS,
  })
}

export default async function WeatherPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const compareMode = isCompareMode(sp)

  if (compareMode && hasCompareLocations(sp)) {
    const queryA = compareWeatherQueryFromSearchParams(sp, "a")
    const queryB = compareWeatherQueryFromSearchParams(sp, "b")
    const sameLocation = coordsMatch(queryA, queryB)

    const [dataA, dataB] = sameLocation
      ? await Promise.all([
          loadWeatherJson(queryA, { includeClimate: true }),
          Promise.resolve(null as Record<string, unknown> | null),
        ]).then(([a]) => [a, a] as const)
      : await Promise.all([
          loadWeatherJson(queryA, { includeClimate: true }),
          loadWeatherJson(queryB, { includeClimate: true }),
        ])

    const locationA = parseWeatherPayload(dataA)
    const locationB = parseWeatherPayload(dataB)
    const errorA = typeof dataA.error === "string" ? dataA.error : null
    const errorB = typeof dataB.error === "string" ? dataB.error : null

    return (
      <PageShell containerClassName="pb-6 pt-4 md:pt-5">
        <WeatherClientShell>
          <div className="mx-auto w-full max-w-5xl space-y-4">
            <Suspense fallback={<WeatherSearchFallback />}>
              <WeatherCompareSearch />
            </Suspense>
            <WeatherPageToolbar />

            {errorA || errorB || !locationA || !locationB ? (
              <div role="alert" className="rounded-xl bg-destructive/10 p-4 text-foreground">
                <p className="font-medium text-foreground">Could not load comparison.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {errorA ?? errorB ?? "One or both locations could not be resolved."}
                </p>
              </div>
            ) : (
              <WeatherCompare
                locationA={locationA}
                locationB={locationB}
                swapHref={buildCompareSwapHref(sp)}
              />
            )}
          </div>
        </WeatherClientShell>
      </PageShell>
    )
  }

  if (compareMode) {
    return (
      <PageShell containerClassName="pb-6 pt-4 md:pt-5">
        <WeatherClientShell>
          <div className="mx-auto w-full max-w-5xl space-y-4">
            <CompareSetupBody />
          </div>
        </WeatherClientShell>
      </PageShell>
    )
  }

  const query = weatherQueryFromSearchParams(sp)
  const data = await loadWeatherJson(query, { includeClimate: false })
  const snapshot = parseWeatherPayload(data)
  const initialQueryKey = buildInitialQueryKey(query)
  const compareHref =
    snapshot != null ? buildCompareHrefFromSingle(snapshot.lat, snapshot.lon, snapshot.city) : "/weather?compare=1"

  return (
    <PageShell containerClassName="pb-6 pt-4 md:pt-5">
      <WeatherClientShell>
        <div className="mx-auto w-full max-w-5xl space-y-4">
          {typeof data.error === "string" && data.error.trim() !== "" ? (
            <>
              <Suspense fallback={<WeatherSearchFallback />}>
                <WeatherSearch />
              </Suspense>
              <div role="alert" className="rounded-xl bg-destructive/10 p-4 text-foreground">
                <p className="font-medium text-foreground">Could not load weather.</p>
                <p className="mt-1 text-sm text-muted-foreground">{data.error}</p>
              </div>
            </>
          ) : snapshot ? (
            <>
              <Suspense fallback={<WeatherSearchFallback />}>
                <WeatherSearch compareHref={compareHref} />
              </Suspense>
              <WeatherPageToolbar />

              <Suspense fallback={<ConditionsFallback />}>
                <WeatherLiveConditions initialSnapshot={snapshot} initialQueryKey={initialQueryKey} />
              </Suspense>
            </>
          ) : (
            <>
              <Suspense fallback={<WeatherSearchFallback />}>
                <WeatherSearch />
              </Suspense>
              <div role="alert" className="rounded-xl bg-destructive/10 p-4 text-foreground">
                <p className="font-medium text-foreground">Could not load weather.</p>
              </div>
            </>
          )}
        </div>
      </WeatherClientShell>
    </PageShell>
  )
}
