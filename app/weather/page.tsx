import type { Metadata } from "next"
import { headers } from "next/headers"
import { Suspense } from "react"

import { PageShell } from "@/components/layout/PageShell"
import { WeatherSearch } from "@/components/weather/WeatherSearch"
import { featureFlag } from "@/lib/feature-flags"

import { NOINDEX_ROBOTS, pageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = pageMetadata({
  title: "Weather",
  description: "Current conditions via the site weather API.",
  path: "/weather",
  robots: NOINDEX_ROBOTS,
})

function buildSearchString(sp: Record<string, string | string[] | undefined>): string {
  const qs = new URLSearchParams()
  for (const [key, val] of Object.entries(sp)) {
    if (typeof val === "string" && val.trim() !== "") qs.set(key, val)
    else if (Array.isArray(val) && typeof val[0] === "string" && val[0].trim() !== "") qs.set(key, val[0])
  }
  const s = qs.toString()
  return s ? `?${s}` : ""
}

async function loadWeatherJson(apiQuery: string): Promise<Record<string, unknown>> {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "127.0.0.1:3000"
  const proto = h.get("x-forwarded-proto") ?? "http"
  const res = await fetch(`${proto}://${host}/api/weather${apiQuery}`, {
    cache: "no-store", // Ensure we get fresh data when search params change
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    return { error: `Request failed (${res.status})${text ? `: ${text.slice(0, 200)}` : ""}` }
  }
  const json = (await res.json()) as Record<string, unknown>
  return json
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function WeatherPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const apiQuery = buildSearchString(sp)
  const data = await loadWeatherJson(apiQuery)
  const showSearch = featureFlag("weather-location-search")

  if (typeof data.error === "string" && data.error.trim() !== "") {
    return (
      <PageShell>
        <main className="max-w-xl space-y-8">
          <h1 className="font-display text-3xl font-semibold text-foreground">Weather</h1>
          
          {showSearch && (
            <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-surface-container-low" />}>
              <WeatherSearch />
            </Suspense>
          )}

          <div role="alert" className="rounded-lg bg-destructive/10 p-4 text-foreground">
            <p className="font-medium text-foreground">Could not load weather.</p>
            <p className="mt-2 text-sm text-muted-foreground">{data.error}</p>
          </div>
        </main>
      </PageShell>
    )
  }

  const tc = data.temperatureC
  const wc = data.weatherCode
  const temp =
    typeof tc === "number" && Number.isFinite(tc)
      ? `${tc}°C`
      : typeof (data.current as Record<string, unknown> | undefined)?.temperature_2m === "number"
        ? `${(data.current as { temperature_2m: number }).temperature_2m}°C`
        : "—"
  const code =
    typeof wc === "number" && Number.isFinite(wc)
      ? String(wc)
      : typeof (data.current as Record<string, unknown> | undefined)?.weather_code === "number"
        ? String((data.current as { weather_code: number }).weather_code)
        : "—"
  const source = typeof data.source === "string" ? data.source : "unknown"
  const city = typeof data.city === "string" ? data.city : ""
  const lat = typeof data.lat === "number" ? data.lat.toFixed(4) : null
  const lon = typeof data.lon === "number" ? data.lon.toFixed(4) : null

  return (
    <PageShell>
      <main className="max-w-xl space-y-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">Weather</h1>
        
        {showSearch && (
          <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-surface-container-low" />}>
            <WeatherSearch />
          </Suspense>
        )}

        <div className="space-y-4 rounded-2xl bg-surface-container-low p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-medium text-on-surface">
              {city ? `Weather in ${city}` : "Current Weather"}
            </h2>
            {lat && lon && (
              <span className="text-xs text-on-surface-variant font-mono">
                {lat}, {lon}
              </span>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">Temperature:</span>
              <div className="text-4xl font-bold text-on-surface">{temp}</div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">Condition</span>
              <div className="text-on-surface-variant">
                Weather code: <span className="font-mono">{code}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-xs text-on-surface-variant opacity-70">
            Source: <span className="font-medium text-on-surface">{source}</span> via <code>/api/weather</code>
          </div>
        </div>
      </main>
    </PageShell>
  )
}
