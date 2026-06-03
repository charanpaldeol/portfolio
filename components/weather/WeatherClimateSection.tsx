// Purpose: Deferred climate normals for /weather (streams after current conditions).
import { WeatherClimateNormals } from "@/components/weather/WeatherClimateNormals"
import { getClimateData } from "@/lib/weather-service"
import type { ClimateExtremes } from "@/lib/weather-types"

type WeatherClimateSectionProps = {
  lat: number
  lon: number
  temperatureC: number | null
  layout?: "default" | "header"
  anomalyC?: number | null
}

export async function WeatherClimateSection({
  lat,
  lon,
  temperatureC,
  layout = "default",
  anomalyC,
}: WeatherClimateSectionProps) {
  const result = await getClimateData(lat, lon, temperatureC)
  const climate = result.data.climateNormals
  if (!climate) return null

  const anomaly = anomalyC ?? result.data.temperatureAnomalyC

  return (
    <div className="space-y-2">
      {anomaly != null && Math.abs(anomaly) >= 0.5 ? (
        <p className="text-sm text-primary">
          {anomaly > 0
            ? `${Math.abs(anomaly).toFixed(1)}° warmer than typical for ${climate.currentMonth?.monthName ?? "this month"}`
            : `${Math.abs(anomaly).toFixed(1)}° cooler than typical for ${climate.currentMonth?.monthName ?? "this month"}`}
        </p>
      ) : null}
      <WeatherClimateNormals climate={climate} layout={layout} />
    </div>
  )
}

export type { ClimateExtremes }
