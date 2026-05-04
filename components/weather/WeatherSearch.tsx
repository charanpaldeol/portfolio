"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"

import { cn } from "@/lib/utils"
import { RainbowButton } from "@/registry/magicui/rainbow-button"

export function WeatherSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [city, setCity] = useState(searchParams.get("city") ?? searchParams.get("q") ?? "")
  const [lat, setLat] = useState(searchParams.get("lat") ?? searchParams.get("latitude") ?? "")
  const [lon, setLon] = useState(searchParams.get("lon") ?? searchParams.get("longitude") ?? "")
  const [mode, setMode] = useState<"city" | "coords">(lat || lon ? "coords" : "city")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (mode === "city" && city) {
      params.set("city", city)
    } else if (mode === "coords") {
      if (lat) params.set("lat", lat)
      if (lon) params.set("lon", lon)
    }
    router.push(`/weather?${params.toString()}`)
  }

  const inputClass =
    "w-full rounded-xl bg-surface-container-low px-4 py-2 text-base text-on-surface placeholder:text-on-surface-variant/50 outline-none ring-0 transition-shadow focus:ring-2 focus:ring-primary"

  return (
    <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setMode("city")}
          className={cn(
            "text-sm font-medium transition-colors pb-1",
            mode === "city" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          City Search
        </button>
        <button
          onClick={() => setMode("coords")}
          className={cn(
            "text-sm font-medium transition-colors pb-1",
            mode === "coords" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          Coordinates
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "city" ? (
          <div className="space-y-2">
            <label htmlFor="city" className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
              City Name
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. New York, London, Tokyo"
              className={inputClass}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="lat" className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                Latitude
              </label>
              <input
                id="lat"
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="40.7128"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lon" className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                Longitude
              </label>
              <input
                id="lon"
                type="text"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                placeholder="-74.0060"
                className={inputClass}
              />
            </div>
          </div>
        )}

        <div className="pt-2">
          <RainbowButton type="submit" className="w-full justify-center py-2 text-sm font-semibold">
            Update Weather
          </RainbowButton>
        </div>
      </form>
    </div>
  )
}
