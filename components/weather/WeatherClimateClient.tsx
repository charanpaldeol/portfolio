"use client"

// Purpose: Header climate normals slot — reads shared climate fetch from WeatherClimateProvider.
import { WeatherClimateNormals } from "@/components/weather/WeatherClimateNormals"
import { useWeatherClimate } from "@/components/weather/WeatherClimateProvider"

type WeatherClimateClientProps = {
  layout?: "default" | "header"
}

export function WeatherClimateClient({ layout = "header" }: WeatherClimateClientProps) {
  const { climate, loading } = useWeatherClimate()

  if (loading) {
    return (
      <div className="min-h-[8.5rem] space-y-2" aria-hidden="true">
        <div className="h-4 w-32 animate-pulse rounded bg-surface-container-low" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-20 animate-pulse rounded-xl bg-surface-container-low" />
          <div className="h-20 animate-pulse rounded-xl bg-surface-container-low" />
        </div>
      </div>
    )
  }

  if (!climate) return <div className="min-h-[8.5rem]" aria-hidden="true" />

  return (
    <div className="min-h-[8.5rem]">
      <WeatherClimateNormals climate={climate} layout={layout} />
    </div>
  )
}
