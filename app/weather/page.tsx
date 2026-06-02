// Purpose: Weather page — single location or MSN-style readout, or side-by-side compare.
import type { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import { Suspense } from "react"

import { PageShell } from "@/components/layout/PageShell"
import { WeatherCompare } from "@/components/weather/WeatherCompare"
import { WeatherCompareSearch } from "@/components/weather/WeatherCompareSearch"
import { WeatherConditions } from "@/components/weather/WeatherConditions"
import { WeatherSearch } from "@/components/weather/WeatherSearch"
import { NOINDEX_ROBOTS, pageMetadata } from "@/lib/site-metadata"
import {
  buildCompareHrefFromSingle,
  buildCompareLocationQuery,
  buildWeatherApiQuery,
  hasCompareLocations,
  isCompareMode,
  parseWeatherPayload,
} from "@/lib/weather-payload"

export const metadata: Metadata = pageMetadata({
  title: "Weather",
  description: "Current conditions and location comparison via the site weather API.",
  path: "/weather",
  robots: NOINDEX_ROBOTS,
})

async function loadWeatherJson(apiQuery: string): Promise<Record<string, unknown>> {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "127.0.0.1:3000"
  const proto = h.get("x-forwarded-proto") ?? "http"
  const res = await fetch(`${proto}://${host}/api/weather${apiQuery}`, {
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    return { error: `Request failed (${res.status})${text ? `: ${text.slice(0, 200)}` : ""}` }
  }
  return (await res.json()) as Record<string, unknown>
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function WeatherSearchFallback() {
  return <div className="h-16 animate-pulse rounded-2xl bg-surface-container-low" />
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
          Pick two cities to see temperature, rain, air quality, and the 7-day forecast side by side — useful for
          packing and trip planning.
        </p>
      </div>
    </>
  )
}

export default async function WeatherPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const compareMode = isCompareMode(sp)

  if (compareMode && hasCompareLocations(sp)) {
    const [dataA, dataB] = await Promise.all([
      loadWeatherJson(buildCompareLocationQuery(sp, "a")),
      loadWeatherJson(buildCompareLocationQuery(sp, "b")),
    ])
    const locationA = parseWeatherPayload(dataA)
    const locationB = parseWeatherPayload(dataB)
    const errorA = typeof dataA.error === "string" ? dataA.error : null
    const errorB = typeof dataB.error === "string" ? dataB.error : null

    return (
      <PageShell containerClassName="pb-6 pt-4 md:pt-5">
        <div className="mx-auto w-full max-w-5xl space-y-4">
          <Suspense fallback={<WeatherSearchFallback />}>
            <WeatherCompareSearch />
          </Suspense>

          {errorA || errorB || !locationA || !locationB ? (
            <div role="alert" className="rounded-xl bg-destructive/10 p-4 text-foreground">
              <p className="font-medium text-foreground">Could not load comparison.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {errorA ?? errorB ?? "One or both locations could not be resolved."}
              </p>
            </div>
          ) : (
            <WeatherCompare locationA={locationA} locationB={locationB} />
          )}
        </div>
      </PageShell>
    )
  }

  if (compareMode) {
    return (
      <PageShell containerClassName="pb-6 pt-4 md:pt-5">
        <div className="mx-auto w-full max-w-5xl space-y-4">
          <CompareSetupBody />
        </div>
      </PageShell>
    )
  }

  const apiQuery = buildWeatherApiQuery(sp)
  const data = await loadWeatherJson(apiQuery)
  const snapshot = parseWeatherPayload(data)
  const compareHref =
    snapshot != null ? buildCompareHrefFromSingle(snapshot.lat, snapshot.lon, snapshot.city) : "/weather?compare=1"

  return (
    <PageShell containerClassName="pb-6 pt-4 md:pt-5">
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
              <WeatherSearch />
            </Suspense>

            <div className="flex justify-end">
              <Link
                href={compareHref}
                className="text-xs font-semibold tracking-wide text-primary uppercase hover:underline"
              >
                Compare with another place
              </Link>
            </div>

            <WeatherConditions snapshot={snapshot} />
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
    </PageShell>
  )
}
