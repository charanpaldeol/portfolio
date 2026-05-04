import type { Metadata } from "next"
import { headers } from "next/headers"

import { PageShell } from "@/components/layout/PageShell"

export const metadata: Metadata = {
  title: "Weather",
  description: "Current conditions via the site weather API.",
}

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
    next: { revalidate: 300 },
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

  if (typeof data.error === "string" && data.error.trim() !== "") {
    return (
      <PageShell>
        <main className="max-w-xl space-y-4">
          <h1 className="font-display text-3xl font-semibold text-foreground">Weather</h1>
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

  return (
    <PageShell>
      <main className="max-w-xl space-y-4">
        <h1 className="font-display text-3xl font-semibold text-foreground">Weather</h1>
        <p className="text-muted-foreground">
          Data from the internal <code className="text-foreground">/api/weather</code> route.
        </p>
        <p className="text-foreground">
          <strong>Temperature:</strong> {temp} (weather code {code})
        </p>
        <p className="text-foreground">
          <strong>Source:</strong> {source}
        </p>
      </main>
    </PageShell>
  )
}
