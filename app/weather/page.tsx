import type { Metadata } from "next"
import { headers } from "next/headers"

import { PageShell } from "@/components/layout/PageShell"

export const metadata: Metadata = {
  title: "Weather",
  description: "Current conditions via the site weather API.",
}

async function loadWeatherJson(): Promise<Record<string, unknown>> {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "127.0.0.1:3000"
  const proto = h.get("x-forwarded-proto") ?? "http"
  const res = await fetch(`${proto}://${host}/api/weather`, {
    next: { revalidate: 300 },
  })
  if (!res.ok) return { error: `status ${res.status}` }
  return (await res.json()) as Record<string, unknown>
}

export default async function WeatherPage() {
  const data = await loadWeatherJson()
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
