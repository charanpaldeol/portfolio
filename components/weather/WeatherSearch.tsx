// Purpose: Top search bar for weather — MSN-style location lookup with autocomplete.
"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, KeyboardEvent, useEffect, useId, useRef, useState } from "react"

import { WeatherSearchCoords } from "@/components/weather/WeatherSearchCoords"
import { WeatherSearchSuggestions } from "@/components/weather/WeatherSearchSuggestions"
import { geolocationUnsupportedMessage, resolveCurrentLocation } from "@/lib/geolocation-client"
import { cn } from "@/lib/utils"
import type { LocationSuggestion } from "@/lib/weather-geocode"
import { buildCompareHrefFromSearchParams, navigateToWeatherCoords } from "@/lib/weather-payload"
import { saveRecentLocation } from "@/lib/weather-recent"
import { RainbowButton } from "@/registry/magicui/rainbow-button"

type LocationsResponse = {
  results?: LocationSuggestion[]
}

export function WeatherSearch({ compareHref }: { compareHref?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const listboxId = useId()
  const containerRef = useRef<HTMLDivElement>(null)

  const [city, setCity] = useState(searchParams.get("city") ?? searchParams.get("q") ?? "")
  const [lat, setLat] = useState(searchParams.get("lat") ?? searchParams.get("latitude") ?? "")
  const [lon, setLon] = useState(searchParams.get("lon") ?? searchParams.get("longitude") ?? "")
  const [showCoords, setShowCoords] = useState(false)

  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [locationError, setLocationError] = useState("")
  const [locationNotice, setLocationNotice] = useState("")
  const [isLocating, setIsLocating] = useState(false)

  useEffect(() => {
    if (showCoords || city.trim().length < 2) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({ q: city.trim() })
        const res = await fetch(`/api/weather/locations?${params.toString()}`, {
          signal: controller.signal,
        })
        if (!res.ok) {
          setSuggestions([])
          return
        }
        const data = (await res.json()) as LocationsResponse
        setSuggestions(data.results ?? [])
        setActiveIndex(-1)
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setSuggestions([])
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }, 300)

    return () => {
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [city, showCoords])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  function selectSuggestion(suggestion: LocationSuggestion) {
    setCity(suggestion.label)
    setIsOpen(false)
    setSuggestions([])
    saveRecentLocation({ label: suggestion.label, lat: suggestion.lat, lon: suggestion.lon })
    navigateToWeatherCoords(router, suggestion.lat, suggestion.lon)
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
      .then(({ lat, lon, approximate }) => {
        setIsOpen(false)
        if (approximate) {
          setLocationNotice("Using approximate network location (GPS unavailable on this device).")
        }
        saveRecentLocation({ label: "Current location", lat, lon })
        navigateToWeatherCoords(router, lat, lon, { approximate })
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!showCoords) {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        selectSuggestion(suggestions[activeIndex])
        return
      }
      if (suggestions[0]) {
        selectSuggestion(suggestions[0])
        return
      }
    }

    const params = new URLSearchParams()
    if (showCoords) {
      if (lat) params.set("lat", lat)
      if (lon) params.set("lon", lon)
    } else if (city) {
      params.set("city", city)
    }
    router.push(`/weather?${params.toString()}`)
  }

  function handleCityKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || showCoords) return

    const optionCount = suggestions.length
    if (optionCount === 0) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % optionCount)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => (index <= 0 ? optionCount - 1 : index - 1))
    } else if (event.key === "Escape") {
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }

  const inputClass =
    "h-11 w-full rounded-xl bg-surface-container-low px-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none ring-1 ring-outline-variant/15 transition-shadow focus:ring-2 focus:ring-primary"

  const showDropdown = !showCoords && isOpen

  const resolvedCompareHref = compareHref ?? buildCompareHrefFromSearchParams(searchParams)

  return (
    <header className="rounded-2xl bg-surface-container-lowest p-3 shadow-sm ring-1 ring-outline-variant/10 sm:p-4">
      <div className="mb-2 flex justify-end">
        <Link
          href={resolvedCompareHref}
          className="text-xs font-semibold tracking-wide text-primary uppercase hover:underline"
        >
          Compare two places
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div ref={containerRef} className="relative min-w-0 flex-1">
            {!showCoords ? (
              <>
                <label htmlFor="city" className="sr-only">
                  Search location
                </label>
                <input
                  id="city"
                  type="search"
                  role="combobox"
                  aria-expanded={showDropdown}
                  aria-controls={listboxId}
                  aria-autocomplete="list"
                  autoComplete="off"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value)
                    setIsOpen(true)
                    setLocationError("")
                    if (e.target.value.trim().length >= 2) setIsLoading(true)
                  }}
                  onFocus={() => setIsOpen(true)}
                  onKeyDown={handleCityKeyDown}
                  placeholder="Search city or place — e.g. Brampton, Ludhiana, Tokyo"
                  className={inputClass}
                />

                {showDropdown ? (
                  <WeatherSearchSuggestions
                    listboxId={listboxId}
                    city={city}
                    suggestions={suggestions}
                    activeIndex={activeIndex}
                    isLoading={isLoading}
                    isLocating={isLocating}
                    onUseCurrentLocation={handleUseCurrentLocation}
                    onSelect={selectSuggestion}
                  />
                ) : null}
              </>
            ) : (
              <WeatherSearchCoords
                lat={lat}
                lon={lon}
                inputClass={inputClass}
                onLatChange={setLat}
                onLonChange={setLon}
              />
            )}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {!showCoords ? (
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="h-11 rounded-xl px-3 text-xs font-semibold tracking-wide text-primary uppercase ring-1 ring-outline-variant/15 hover:bg-surface-container-low disabled:opacity-60"
              >
                {isLocating ? "Locating…" : "My location"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setShowCoords((value) => !value)}
              aria-pressed={showCoords}
              className={cn(
                "h-11 rounded-xl px-3 text-xs font-semibold tracking-wide uppercase transition-colors ring-1 ring-outline-variant/15",
                showCoords
                  ? "bg-surface-container-high text-on-surface"
                  : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
              )}
            >
              Coords
            </button>
            <RainbowButton as="button" type="submit" className="h-11 shrink-0 px-5 text-sm font-semibold">
              Search
            </RainbowButton>
          </div>
        </div>

        {locationNotice ? (
          <p className="text-sm text-on-surface-variant">{locationNotice}</p>
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
