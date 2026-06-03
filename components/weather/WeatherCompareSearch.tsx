// Purpose: Dual-location search for weather comparison mode.
"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"

import {
  LocationSearchField,
  type SelectedLocation,
  selectedLocationFromParams,
} from "@/components/weather/LocationSearchField"
import { geolocationUnsupportedMessage, resolveCurrentLocation } from "@/lib/geolocation-client"
import type { LocationSuggestion } from "@/lib/weather-geocode"
import { saveRecentLocation } from "@/lib/weather-recent"
import { RainbowButton } from "@/registry/magicui/rainbow-button"

function navigateToCompare(
  router: ReturnType<typeof useRouter>,
  a: SelectedLocation,
  b: SelectedLocation
) {
  const params = new URLSearchParams()
  params.set("compare", "1")
  params.set("lat", a.lat.toFixed(4))
  params.set("lon", a.lon.toFixed(4))
  params.set("lat2", b.lat.toFixed(4))
  params.set("lon2", b.lon.toFixed(4))
  if (a.label.trim()) params.set("city", a.label.trim())
  if (b.label.trim()) params.set("city2", b.label.trim())
  if (a.approximate) params.set("approx", "1")
  router.push(`/weather?${params.toString()}`)
}

export function WeatherCompareSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialA = selectedLocationFromParams(
    searchParams.get("lat") ?? searchParams.get("latitude"),
    searchParams.get("lon") ?? searchParams.get("longitude"),
    searchParams.get("city") ?? searchParams.get("q")
  )
  const initialB = selectedLocationFromParams(
    searchParams.get("lat2") ?? searchParams.get("latitude2"),
    searchParams.get("lon2") ?? searchParams.get("longitude2"),
    searchParams.get("city2") ?? searchParams.get("q2")
  )

  const [cityA, setCityA] = useState(
    searchParams.get("city") ?? searchParams.get("q") ?? initialA?.label ?? ""
  )
  const [cityB, setCityB] = useState(searchParams.get("city2") ?? searchParams.get("q2") ?? initialB?.label ?? "")
  const [locationA, setLocationA] = useState<SelectedLocation | null>(initialA)
  const [locationB, setLocationB] = useState<SelectedLocation | null>(initialB)
  const [locationError, setLocationError] = useState("")
  const [locationNotice, setLocationNotice] = useState("")
  const [isLocatingA, setIsLocatingA] = useState(false)
  const [isLocatingB, setIsLocatingB] = useState(false)

  const inputClass =
    "h-11 w-full rounded-xl bg-surface-container-low px-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none ring-1 ring-outline-variant/15 transition-shadow focus:ring-2 focus:ring-primary"

  function selectA(suggestion: LocationSuggestion) {
    setCityA(suggestion.label)
    setLocationA({ label: suggestion.label, lat: suggestion.lat, lon: suggestion.lon })
    setLocationError("")
  }

  function selectB(suggestion: LocationSuggestion) {
    setCityB(suggestion.label)
    setLocationB({ label: suggestion.label, lat: suggestion.lat, lon: suggestion.lon })
    setLocationError("")
  }

  function handleUseCurrentLocationForA() {
    const unsupported = geolocationUnsupportedMessage()
    if (unsupported) {
      setLocationError(unsupported)
      return
    }

    setIsLocatingA(true)
    setLocationError("")
    setLocationNotice("")

    void resolveCurrentLocation()
      .then(({ lat, lon, approximate }) => {
        const next = { label: "Current location", lat, lon, approximate }
        setLocationA(next)
        setCityA("Current location")
        if (approximate) {
          setLocationNotice("Location A uses approximate network location (GPS unavailable).")
        }
      })
      .catch(() => {
        setLocationError("Could not determine your location for Location A.")
      })
      .finally(() => {
        setIsLocatingA(false)
      })
  }

  function handleUseCurrentLocationForB() {
    const unsupported = geolocationUnsupportedMessage()
    if (unsupported) {
      setLocationError(unsupported)
      return
    }

    setIsLocatingB(true)
    setLocationError("")
    setLocationNotice("")

    void resolveCurrentLocation()
      .then(({ lat, lon, approximate }) => {
        const next = { label: "Current location", lat, lon, approximate }
        setLocationB(next)
        setCityB("Current location")
        if (approximate) {
          setLocationNotice("Location B uses approximate network location (GPS unavailable).")
        }
      })
      .catch(() => {
        setLocationError("Could not determine your location for Location B.")
      })
      .finally(() => {
        setIsLocatingB(false)
      })
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!locationA || !locationB) {
      setLocationError("Pick both locations from the suggestions before comparing.")
      return
    }
    saveRecentLocation(locationA)
    saveRecentLocation(locationB)
    navigateToCompare(router, locationA, locationB)
  }

  return (
    <header className="rounded-2xl bg-surface-container-lowest p-3 shadow-sm ring-1 ring-outline-variant/10 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-on-surface">Compare two places</p>
        <Link
          href="/weather"
          className="text-xs font-semibold tracking-wide text-primary uppercase hover:underline"
        >
          Single location
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="grid gap-3 md:grid-cols-2">
          <LocationSearchField
            id="compare-city-a"
            label="Location A"
            value={cityA}
            onValueChange={(value) => {
              setCityA(value)
              setLocationA(null)
              setLocationError("")
            }}
            onSelect={selectA}
            placeholder="Home — e.g. Brampton, Toronto"
            inputClassName={inputClass}
            showCurrentLocation
            onUseCurrentLocation={handleUseCurrentLocationForA}
            isLocating={isLocatingA}
          />
          <LocationSearchField
            id="compare-city-b"
            label="Location B"
            value={cityB}
            onValueChange={(value) => {
              setCityB(value)
              setLocationB(null)
              setLocationError("")
            }}
            onSelect={selectB}
            placeholder="Destination — e.g. Ludhiana, Tokyo"
            inputClassName={inputClass}
            showCurrentLocation
            onUseCurrentLocation={handleUseCurrentLocationForB}
            isLocating={isLocatingB}
          />
        </div>

        <div className="flex justify-end">
          <RainbowButton as="button" type="submit" className="h-11 shrink-0 px-5 text-sm font-semibold">
            Compare
          </RainbowButton>
        </div>

        {locationNotice ? <p className="text-sm text-on-surface-variant">{locationNotice}</p> : null}

        {locationError ? (
          <p role="alert" className="text-sm text-destructive">
            {locationError}
          </p>
        ) : null}
      </form>
    </header>
  )
}
