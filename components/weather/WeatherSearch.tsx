// Purpose: Top search bar for weather — MSN-style location lookup with autocomplete.
"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useCallback, useEffect, useState } from "react"

import { LocationSearchField } from "@/components/weather/LocationSearchField"
import { weatherSearchCompoundClass, weatherSearchInputClass } from "@/components/weather/weather-search-ui"
import { WeatherRecentChips } from "@/components/weather/WeatherRecentChips"
import { WeatherSearchCoords } from "@/components/weather/WeatherSearchCoords"
import { WeatherSearchModeToggle } from "@/components/weather/WeatherSearchModeToggle"
import { geolocationUnsupportedMessage, resolveCurrentLocation } from "@/lib/geolocation-client"
import type { LocationSuggestion } from "@/lib/weather-geocode"
import {
  buildCompareHrefFromSearchParams,
  navigateToWeatherCoords,
  parseWeatherCoords,
  weatherSearchParamsKey,
} from "@/lib/weather-payload"
import { loadRecentLocations, saveRecentLocation } from "@/lib/weather-recent"
import type { RecentLocation } from "@/lib/weather-recent"

function readCityFromParams(sp: URLSearchParams): string {
  return sp.get("city") ?? sp.get("q") ?? ""
}

function readCoordFromParams(sp: URLSearchParams, primary: string, alt: string): string {
  return sp.get(primary) ?? sp.get(alt) ?? ""
}

export function WeatherSearch({ compareHref }: { compareHref?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paramsKey = weatherSearchParamsKey(searchParams)

  const [city, setCity] = useState(() => readCityFromParams(searchParams))
  const [lat, setLat] = useState(() => readCoordFromParams(searchParams, "lat", "latitude"))
  const [lon, setLon] = useState(() => readCoordFromParams(searchParams, "lon", "longitude"))
  const [showCoords, setShowCoords] = useState(false)
  const [recentLocations, setRecentLocations] = useState<RecentLocation[]>([])
  const [locationError, setLocationError] = useState("")
  const [locationNotice, setLocationNotice] = useState("")
  const [coordError, setCoordError] = useState("")
  const [isLocating, setIsLocating] = useState(false)

  useEffect(() => {
    setCity(readCityFromParams(searchParams))
    setLat(readCoordFromParams(searchParams, "lat", "latitude"))
    setLon(readCoordFromParams(searchParams, "lon", "longitude"))
  }, [paramsKey])

  const reloadRecent = useCallback(() => {
    setRecentLocations(loadRecentLocations())
  }, [])

  useEffect(() => {
    reloadRecent()
    window.addEventListener("storage", reloadRecent)
    window.addEventListener("weather-recent-changed", reloadRecent)
    return () => {
      window.removeEventListener("storage", reloadRecent)
      window.removeEventListener("weather-recent-changed", reloadRecent)
    }
  }, [reloadRecent])

  const searchCompoundClass = weatherSearchCompoundClass
  const inputAttachedClass = weatherSearchInputClass

  const resolvedCompareHref = compareHref ?? buildCompareHrefFromSearchParams(searchParams)

  function navigateToRecent(location: RecentLocation) {
    setCity(location.label)
    setLocationError("")
    setCoordError("")
    saveRecentLocation(location)
    navigateToWeatherCoords(router, location.lat, location.lon, { city: location.label })
  }

  function selectSuggestion(suggestion: LocationSuggestion) {
    setCity(suggestion.label)
    setLocationError("")
    setCoordError("")
    saveRecentLocation({ label: suggestion.label, lat: suggestion.lat, lon: suggestion.lon })
    navigateToWeatherCoords(router, suggestion.lat, suggestion.lon, { city: suggestion.label })
  }

  function commitCitySearch() {
    if (!city.trim()) return
    const params = new URLSearchParams()
    params.set("city", city.trim())
    router.push(`/weather?${params.toString()}`)
  }

  function handleUseCurrentLocation() {
    const unsupported = geolocationUnsupportedMessage()
    if (unsupported) {
      setLocationError(unsupported)
      setLocationNotice("")
      return
    }

    setIsLocating(true)
    setLocationError("")
    setLocationNotice("")

    void resolveCurrentLocation()
      .then(({ lat: resolvedLat, lon: resolvedLon, approximate }) => {
        if (approximate) {
          setLocationNotice("Using approximate network location (GPS unavailable on this device).")
        }
        const label = "Current location"
        saveRecentLocation({ label, lat: resolvedLat, lon: resolvedLon })
        navigateToWeatherCoords(router, resolvedLat, resolvedLon, {
          city: label,
          approximate,
        })
      })
      .catch(() => {
        setLocationError(
          "Could not determine your location. Enable system Location Services, or search for a city instead."
        )
      })
      .finally(() => {
        setIsLocating(false)
      })
  }

  function submitCoords() {
    setCoordError("")
    setLocationError("")
    const parsed = parseWeatherCoords(lat, lon)
    if ("error" in parsed) {
      setCoordError(parsed.error)
      return
    }
    navigateToWeatherCoords(router, parsed.lat, parsed.lon, { city: city.trim() || undefined })
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault()
    if (showCoords) submitCoords()
  }

  return (
    <header className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-on-surface">Find weather for a place</p>
        <Link
          href={resolvedCompareHref}
          className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Compare two places
        </Link>
      </div>
      <form onSubmit={handleFormSubmit} className="space-y-3">
        <div className={searchCompoundClass}>
          <WeatherSearchModeToggle
            variant="attached"
            mode={showCoords ? "coords" : "place"}
            onModeChange={(next) => {
              setShowCoords(next === "coords")
              setCoordError("")
            }}
          />
          {!showCoords ? (
            <LocationSearchField
              id="city"
              label="Search location"
              labelClassName="sr-only"
              className="flex-1"
              value={city}
              onValueChange={(value) => {
                setCity(value)
                setLocationError("")
                setCoordError("")
              }}
              onSelect={selectSuggestion}
              onCommitSearch={commitCitySearch}
              placeholder="City or place — Brampton, Tokyo, Ludhiana…"
              inputClassName={inputAttachedClass}
              showLeadingIcon
              showCurrentLocation
              onUseCurrentLocation={handleUseCurrentLocation}
              isLocating={isLocating}
              recentLocations={recentLocations}
              onSelectRecent={navigateToRecent}
            />
          ) : (
            <WeatherSearchCoords
              lat={lat}
              lon={lon}
              attached
              showInlineError={false}
              inputClass={inputAttachedClass}
              coordError={coordError}
              onLatChange={(value) => {
                setLat(value)
                setCoordError("")
              }}
              onLonChange={(value) => {
                setLon(value)
                setCoordError("")
              }}
              onEnterCommit={submitCoords}
            />
          )}
        </div>

        {showCoords && coordError ? (
          <p role="alert" className="text-sm text-destructive">
            {coordError}
          </p>
        ) : null}

        {showCoords && !coordError ? (
          <p className="text-xs text-on-surface-variant">Press Enter in a coordinate field to go.</p>
        ) : null}

        <WeatherRecentChips onSelect={navigateToRecent} />

        {locationNotice ? (
          <p className="text-sm text-on-surface-variant" role="status">
            {locationNotice}
          </p>
        ) : null}

        {locationError ? (
          <p role="alert" className="text-sm text-destructive">
            {locationError}
          </p>
        ) : null}
      </form>
    </header>
  )
}
