// Purpose: Top search bar for weather — MSN-style location lookup with autocomplete.
"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, KeyboardEvent, useEffect, useId, useRef, useState } from "react"

import { geolocationUnsupportedMessage, resolveCurrentLocation } from "@/lib/geolocation-client"
import { cn } from "@/lib/utils"
import { formatPopulation } from "@/lib/weather-format"
import type { LocationSuggestion } from "@/lib/weather-geocode"
import { RainbowButton } from "@/registry/magicui/rainbow-button"

type LocationsResponse = {
  results?: LocationSuggestion[]
}

function suggestionMeta(suggestion: LocationSuggestion): string | null {
  const parts: string[] = []
  if (typeof suggestion.elevationM === "number" && Number.isFinite(suggestion.elevationM)) {
    parts.push(`${Math.round(suggestion.elevationM)} m`)
  }
  const population = formatPopulation(suggestion.population)
  if (population) parts.push(population)
  if (suggestion.timezone) parts.push(suggestion.timezone)
  return parts.length > 0 ? parts.join(" · ") : null
}

function navigateToCoords(
  router: ReturnType<typeof useRouter>,
  lat: number,
  lon: number,
   options?: { approximate?: boolean }
) {
  const params = new URLSearchParams()
  params.set("lat", lat.toFixed(4))
  params.set("lon", lon.toFixed(4))
  if (options?.approximate) params.set("approx", "1")
  router.push(`/weather?${params.toString()}`)
}

export function WeatherSearch() {
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
    navigateToCoords(router, suggestion.lat, suggestion.lon)
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
        navigateToCoords(router, lat, lon, { approximate })
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

  const compareHref = (() => {
    const params = new URLSearchParams()
    params.set("compare", "1")
    const currentLat = searchParams.get("lat") ?? searchParams.get("latitude")
    const currentLon = searchParams.get("lon") ?? searchParams.get("longitude")
    const currentCity = searchParams.get("city") ?? searchParams.get("q")
    if (currentLat && currentLon) {
      params.set("lat", currentLat)
      params.set("lon", currentLon)
      if (currentCity) params.set("city", currentCity)
    }
    return `/weather?${params.toString()}`
  })()

  return (
    <header className="rounded-2xl bg-surface-container-lowest p-3 shadow-sm ring-1 ring-outline-variant/10 sm:p-4">
      <div className="mb-2 flex justify-end">
        <Link
          href={compareHref}
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
                  <ul
                    id={listboxId}
                    role="listbox"
                    aria-label="Location suggestions"
                    className="absolute top-full z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-outline-variant/20 bg-surface-container-lowest py-1 shadow-lg"
                  >
                    <li role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={false}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={handleUseCurrentLocation}
                        disabled={isLocating}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-primary transition-colors hover:bg-surface-container-low disabled:opacity-60"
                      >
                        <span aria-hidden="true">📍</span>
                        {isLocating ? "Getting your location…" : "Use my current location"}
                      </button>
                    </li>

                    {isLoading && city.trim().length >= 2 ? (
                      <li className="px-4 py-2 text-sm text-on-surface-variant">Searching locations…</li>
                    ) : null}

                    {!isLoading && city.trim().length >= 2 && suggestions.length === 0 ? (
                      <li className="px-4 py-2 text-sm text-on-surface-variant">No locations found.</li>
                    ) : null}

                    {suggestions.map((suggestion, index) => {
                      const meta = suggestionMeta(suggestion)
                      return (
                      <li key={suggestion.id} role="presentation">
                        <button
                          type="button"
                          role="option"
                          aria-selected={activeIndex === index}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => selectSuggestion(suggestion)}
                          className={cn(
                            "w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-container-low",
                            activeIndex === index
                              ? "bg-surface-container-low text-on-surface"
                              : "text-on-surface-variant"
                          )}
                        >
                          <span className="block font-medium text-on-surface">{suggestion.label}</span>
                          <span className="mt-0.5 block font-mono text-xs text-on-surface-variant/80">
                            {suggestion.lat.toFixed(4)}, {suggestion.lon.toFixed(4)}
                          </span>
                          {meta ? (
                            <span className="mt-0.5 block text-xs text-on-surface-variant/70">{meta}</span>
                          ) : null}
                        </button>
                      </li>
                      )
                    })}
                  </ul>
                ) : null}
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="lat" className="sr-only">
                    Latitude
                  </label>
                  <input
                    id="lat"
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="Latitude"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="lon" className="sr-only">
                    Longitude
                  </label>
                  <input
                    id="lon"
                    type="text"
                    value={lon}
                    onChange={(e) => setLon(e.target.value)}
                    placeholder="Longitude"
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
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
