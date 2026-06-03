// Purpose: Autocomplete suggestion list for weather location comboboxes.
import { Clock, Loader2, MapPin, MapPinned } from "lucide-react"

import {
  weatherSearchDropdownClass,
  weatherSearchOptionActiveClass,
  weatherSearchOptionClass,
  weatherSearchOptionIdleClass,
} from "@/components/weather/weather-search-ui"
import { cn } from "@/lib/utils"
import { locationSuggestionMeta } from "@/lib/weather-format"
import type { LocationSuggestion } from "@/lib/weather-geocode"
import type { RecentLocation } from "@/lib/weather-recent"

export type LocationListboxOption =
  | { type: "current" }
  | { type: "recent"; location: RecentLocation }
  | { type: "suggestion"; suggestion: LocationSuggestion }

export function locationListboxOptionCount(options: {
  showCurrentLocation: boolean
  recentCount: number
  suggestionCount: number
}): number {
  return (options.showCurrentLocation ? 1 : 0) + options.recentCount + options.suggestionCount
}

export function resolveLocationListboxOption(
  index: number,
  options: {
    showCurrentLocation: boolean
    recent: RecentLocation[]
    suggestions: LocationSuggestion[]
  }
): LocationListboxOption | null {
  let cursor = 0
  if (options.showCurrentLocation) {
    if (index === cursor) return { type: "current" }
    cursor += 1
  }
  if (index < cursor + options.recent.length) {
    return { type: "recent", location: options.recent[index - cursor]! }
  }
  cursor += options.recent.length
  const suggestionIndex = index - cursor
  const suggestion = options.suggestions[suggestionIndex]
  return suggestion ? { type: "suggestion", suggestion } : null
}

export function locationOptionId(kind: "current" | "recent" | "suggestion", key: string | number): string {
  return `weather-location-option-${kind}-${key}`
}

function optionButtonClass(active: boolean, extra?: string) {
  return cn(
    weatherSearchOptionClass,
    "w-full",
    active ? weatherSearchOptionActiveClass : weatherSearchOptionIdleClass,
    extra
  )
}

type WeatherSearchSuggestionsProps = {
  listboxId: string
  city: string
  suggestions: LocationSuggestion[]
  recent?: RecentLocation[]
  activeIndex: number
  isLoading: boolean
  isLocating: boolean
  fetchError?: string
  showCurrentLocation?: boolean
  onUseCurrentLocation: () => void
  onSelect: (suggestion: LocationSuggestion) => void
  onSelectRecent?: (location: RecentLocation) => void
}

export function WeatherSearchSuggestions({
  listboxId,
  city,
  suggestions,
  recent = [],
  activeIndex,
  isLoading,
  isLocating,
  fetchError = "",
  showCurrentLocation = true,
  onUseCurrentLocation,
  onSelect,
  onSelectRecent,
}: WeatherSearchSuggestionsProps) {
  let nextOptionIndex = 0
  const currentLocationIndex = showCurrentLocation ? nextOptionIndex++ : -1

  return (
    <ul
      id={listboxId}
      role="listbox"
      aria-label="Location suggestions"
      className={weatherSearchDropdownClass}
    >
      {showCurrentLocation ? (
        <li role="presentation">
          <button
            type="button"
            id={locationOptionId("current", "geo")}
            role="option"
            aria-selected={activeIndex === currentLocationIndex}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            className={optionButtonClass(
              activeIndex === currentLocationIndex,
              "flex items-center gap-2.5 font-medium text-primary disabled:opacity-60"
            )}
          >
            <MapPin className="size-4 shrink-0" aria-hidden />
            {isLocating ? "Getting your location…" : "Use my current location"}
          </button>
        </li>
      ) : null}

      {recent.length > 0 ? (
        <>
          <li className="flex items-center gap-1.5 px-3 pt-2.5 pb-1 text-[11px] font-semibold tracking-wide text-on-surface-variant/80 uppercase">
            <Clock className="size-3 shrink-0" aria-hidden />
            Recent
          </li>
          {recent.map((location) => {
            const currentIndex = nextOptionIndex++
            const shortLabel = location.label.split(",")[0]?.trim() || location.label
            return (
              <li key={`${location.lat}-${location.lon}`} role="presentation">
                <button
                  type="button"
                  id={locationOptionId("recent", `${location.lat}-${location.lon}`)}
                  role="option"
                  aria-selected={activeIndex === currentIndex}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onSelectRecent?.(location)}
                  className={optionButtonClass(activeIndex === currentIndex)}
                >
                  <span className="font-medium text-on-surface">{shortLabel}</span>
                  <span className="mt-0.5 block font-mono text-xs text-on-surface-variant/70">
                    {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                  </span>
                </button>
              </li>
            )
          })}
        </>
      ) : null}

      {fetchError ? (
        <li className="px-3 py-2.5 text-sm text-destructive" role="status">
          {fetchError}
        </li>
      ) : null}

      {isLoading && city.trim().length >= 2 ? (
        <li
          className="flex items-center gap-2 px-3 py-2.5 text-sm text-on-surface-variant"
          role="status"
        >
          <Loader2 className="size-4 shrink-0 animate-spin text-primary" aria-hidden />
          Searching locations…
        </li>
      ) : null}

      {!fetchError && !isLoading && city.trim().length >= 2 && suggestions.length === 0 ? (
        <li className="px-3 py-2.5 text-sm text-on-surface-variant" role="status">
          No locations found.
        </li>
      ) : null}

      {suggestions.length > 0 ? (
        <li className="flex items-center gap-1.5 px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-on-surface-variant/80 uppercase">
          <MapPinned className="size-3 shrink-0" aria-hidden />
          Places
        </li>
      ) : null}

      {suggestions.map((suggestion) => {
        const currentIndex = nextOptionIndex++
        const meta = locationSuggestionMeta(suggestion)
        return (
          <li key={suggestion.id} role="presentation">
            <button
              type="button"
              id={locationOptionId("suggestion", suggestion.id)}
              role="option"
              aria-selected={activeIndex === currentIndex}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(suggestion)}
              className={optionButtonClass(activeIndex === currentIndex)}
            >
              <span className="block font-medium text-on-surface">{suggestion.label}</span>
              <span className="mt-0.5 block font-mono text-xs text-on-surface-variant/70">
                {suggestion.lat.toFixed(4)}, {suggestion.lon.toFixed(4)}
              </span>
              {meta ? <span className="mt-0.5 block text-xs text-on-surface-variant/60">{meta}</span> : null}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
