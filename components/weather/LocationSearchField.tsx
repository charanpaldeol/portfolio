// Purpose: Autocomplete location field for weather search and compare flows.
"use client"

import { KeyboardEvent, useEffect, useId, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { formatPopulation } from "@/lib/weather-format"
import type { LocationSuggestion } from "@/lib/weather-geocode"

type LocationsResponse = {
  results?: LocationSuggestion[]
}

type LocationSearchFieldProps = {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  onSelect: (suggestion: LocationSuggestion) => void
  placeholder: string
  inputClassName: string
  showCurrentLocation?: boolean
  onUseCurrentLocation?: () => void
  isLocating?: boolean
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

export function LocationSearchField({
  id,
  label,
  value,
  onValueChange,
  onSelect,
  placeholder,
  inputClassName,
  showCurrentLocation = false,
  onUseCurrentLocation,
  isLocating = false,
}: LocationSearchFieldProps) {
  const listboxId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    if (value.trim().length < 2) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({ q: value.trim() })
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
  }, [value])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return
    const optionCount = suggestions.length + (showCurrentLocation ? 1 : 0)
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
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault()
      if (showCurrentLocation && activeIndex === 0) {
        onUseCurrentLocation?.()
        return
      }
      const suggestionIndex = showCurrentLocation ? activeIndex - 1 : activeIndex
      const suggestion = suggestions[suggestionIndex]
      if (suggestion) {
        onSelect(suggestion)
        setIsOpen(false)
        setSuggestions([])
      }
    }
  }

  const showDropdown = isOpen

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <label htmlFor={id} className="mb-1 block text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
        {label}
      </label>
      <input
        id={id}
        type="search"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-autocomplete="list"
        autoComplete="off"
        value={value}
        onChange={(event) => {
          onValueChange(event.target.value)
          setIsOpen(true)
          if (event.target.value.trim().length >= 2) setIsLoading(true)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputClassName}
      />

      {showDropdown ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={`${label} suggestions`}
          className="absolute top-full z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-outline-variant/20 bg-surface-container-lowest py-1 shadow-lg"
        >
          {showCurrentLocation ? (
            <li role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={activeIndex === 0}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onUseCurrentLocation?.()}
                disabled={isLocating}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-primary transition-colors hover:bg-surface-container-low disabled:opacity-60"
              >
                <span aria-hidden="true">📍</span>
                {isLocating ? "Getting your location…" : "Use my current location"}
              </button>
            </li>
          ) : null}

          {isLoading && value.trim().length >= 2 ? (
            <li className="px-4 py-2 text-sm text-on-surface-variant">Searching locations…</li>
          ) : null}

          {!isLoading && value.trim().length >= 2 && suggestions.length === 0 ? (
            <li className="px-4 py-2 text-sm text-on-surface-variant">No locations found.</li>
          ) : null}

          {suggestions.map((suggestion, index) => {
            const optionIndex = showCurrentLocation ? index + 1 : index
            const meta = suggestionMeta(suggestion)
            return (
              <li key={suggestion.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={activeIndex === optionIndex}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onSelect(suggestion)
                    setIsOpen(false)
                    setSuggestions([])
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-container-low",
                    activeIndex === optionIndex
                      ? "bg-surface-container-low text-on-surface"
                      : "text-on-surface-variant"
                  )}
                >
                  <span className="block font-medium text-on-surface">{suggestion.label}</span>
                  <span className="mt-0.5 block font-mono text-xs text-on-surface-variant/80">
                    {suggestion.lat.toFixed(4)}, {suggestion.lon.toFixed(4)}
                  </span>
                  {meta ? <span className="mt-0.5 block text-xs text-on-surface-variant/70">{meta}</span> : null}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

export type SelectedLocation = {
  label: string
  lat: number
  lon: number
  approximate?: boolean
}

export function selectedLocationFromParams(
  lat: string | null,
  lon: string | null,
  city: string | null
): SelectedLocation | null {
  const latNum = lat ? Number.parseFloat(lat) : Number.NaN
  const lonNum = lon ? Number.parseFloat(lon) : Number.NaN
  if (Number.isFinite(latNum) && Number.isFinite(lonNum)) {
    return { label: city?.trim() || "", lat: latNum, lon: lonNum }
  }
  return null
}
