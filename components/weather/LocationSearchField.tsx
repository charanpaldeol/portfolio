// Purpose: Autocomplete location field for weather search and compare flows.
"use client"

import { Loader2, Search } from "lucide-react"
import { KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from "react"

import { useLocationSuggestions } from "@/components/weather/use-location-suggestions"
import {
  locationListboxOptionCount,
  resolveLocationListboxOption,
  WeatherSearchSuggestions,
} from "@/components/weather/WeatherSearchSuggestions"
import { cn } from "@/lib/utils"
import type { LocationSuggestion } from "@/lib/weather-geocode"
import { recentForLocationDropdown, type RecentLocation } from "@/lib/weather-recent"

type LocationSearchFieldProps = {
  id: string
  label: string
  labelClassName?: string
  value: string
  onValueChange: (value: string) => void
  onSelect: (suggestion: LocationSuggestion) => void
  placeholder: string
  inputClassName: string
  showCurrentLocation?: boolean
  onUseCurrentLocation?: () => void
  isLocating?: boolean
  recentLocations?: RecentLocation[]
  onSelectRecent?: (location: RecentLocation) => void
  /** City-only fallback when Enter is pressed with no matching suggestion. */
  onCommitSearch?: () => void
  className?: string
  showLeadingIcon?: boolean
}

export function LocationSearchField({
  id,
  label,
  labelClassName = "mb-1 block text-xs font-semibold tracking-wide text-on-surface-variant uppercase",
  value,
  onValueChange,
  onSelect,
  placeholder,
  inputClassName,
  showCurrentLocation = false,
  onUseCurrentLocation,
  isLocating = false,
  recentLocations = [],
  onSelectRecent,
  onCommitSearch,
  className,
  showLeadingIcon = false,
}: LocationSearchFieldProps) {
  const listboxId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const { suggestions, isLoading, fetchError, setFetchError } = useLocationSuggestions(value, true)
  const dropdownRecent = useMemo(
    () => recentForLocationDropdown(recentLocations, value),
    [recentLocations, value]
  )

  useEffect(() => {
    setActiveIndex(-1)
  }, [dropdownRecent.length, value.trim()])

  const optionCount = useMemo(
    () =>
      locationListboxOptionCount({
        showCurrentLocation: !!showCurrentLocation,
        recentCount: dropdownRecent.length,
        suggestionCount: suggestions.length,
      }),
    [dropdownRecent.length, showCurrentLocation, suggestions.length]
  )

  const canOpenDropdown =
    !!showCurrentLocation || dropdownRecent.length > 0 || value.trim().length >= 2

  const activeDescendantId = useMemo(() => {
    if (activeIndex < 0) return undefined
    const option = resolveLocationListboxOption(activeIndex, {
      showCurrentLocation: !!showCurrentLocation,
      recent: dropdownRecent,
      suggestions,
    })
    if (!option) return undefined
    if (option.type === "current") return "weather-location-option-current-geo"
    if (option.type === "recent") {
      return `weather-location-option-recent-${option.location.lat}-${option.location.lon}`
    }
    return `weather-location-option-suggestion-${option.suggestion.id}`
  }, [activeIndex, dropdownRecent, showCurrentLocation, suggestions])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  function applyListboxOption(option: ReturnType<typeof resolveLocationListboxOption>) {
    if (!option) return
    if (option.type === "current") {
      onUseCurrentLocation?.()
      return
    }
    if (option.type === "recent") {
      onSelectRecent?.(option.location)
      setIsOpen(false)
      setActiveIndex(-1)
      return
    }
    onSelect(option.suggestion)
    setIsOpen(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false)
      setActiveIndex(-1)
      return
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!isOpen || optionCount === 0) return
      event.preventDefault()
      if (event.key === "ArrowDown") {
        setActiveIndex((index) => (index + 1) % optionCount)
      } else {
        setActiveIndex((index) => (index <= 0 ? optionCount - 1 : index - 1))
      }
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      setIsOpen(false)
      setActiveIndex(-1)

      if (isOpen && activeIndex >= 0 && optionCount > 0) {
        applyListboxOption(
          resolveLocationListboxOption(activeIndex, {
            showCurrentLocation: !!showCurrentLocation,
            recent: dropdownRecent,
            suggestions,
          })
        )
        return
      }

      const firstSuggestion = suggestions[0]
      if (firstSuggestion) {
        onSelect(firstSuggestion)
        return
      }

      onCommitSearch?.()
    }
  }

  const showDropdown = isOpen && canOpenDropdown

  return (
    <div ref={containerRef} className={cn("relative min-w-0 flex-1", className)}>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      {showLeadingIcon ? (
        <div className="flex min-w-0 flex-1 items-center gap-2.5 pl-3 pr-1">
          {isLoading || isLocating ? (
            <Loader2 className="size-[18px] shrink-0 animate-spin text-primary" aria-hidden />
          ) : (
            <Search className="size-[18px] shrink-0 text-on-surface-variant/60" aria-hidden />
          )}
          <input
            id={id}
            type="text"
            inputMode="search"
            enterKeyHint="search"
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={showDropdown ? activeDescendantId : undefined}
            aria-busy={isLoading || isLocating}
            autoComplete="off"
            value={value}
            onChange={(event) => {
              onValueChange(event.target.value)
              setFetchError("")
              if (
                event.target.value.trim().length >= 2 ||
                recentForLocationDropdown(recentLocations, event.target.value).length > 0 ||
                showCurrentLocation
              ) {
                setIsOpen(true)
              }
            }}
            onFocus={() => {
              if (canOpenDropdown) setIsOpen(true)
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={inputClassName}
          />
        </div>
      ) : (
        <input
          id={id}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={showDropdown ? activeDescendantId : undefined}
          aria-busy={isLoading || isLocating}
          autoComplete="off"
          value={value}
          onChange={(event) => {
            onValueChange(event.target.value)
            setFetchError("")
            if (
              event.target.value.trim().length >= 2 ||
              recentForLocationDropdown(recentLocations, event.target.value).length > 0 ||
              showCurrentLocation
            ) {
              setIsOpen(true)
            }
          }}
          onFocus={() => {
            if (canOpenDropdown) setIsOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={inputClassName}
        />
      )}

      {showDropdown ? (
        <WeatherSearchSuggestions
          listboxId={listboxId}
          city={value}
          suggestions={suggestions}
          recent={dropdownRecent}
          activeIndex={activeIndex}
          isLoading={isLoading}
          isLocating={isLocating}
          fetchError={fetchError}
          showCurrentLocation={showCurrentLocation}
          onUseCurrentLocation={() => onUseCurrentLocation?.()}
          onSelect={(suggestion) => {
            onSelect(suggestion)
            setIsOpen(false)
            setActiveIndex(-1)
          }}
          onSelectRecent={(location) => {
            onSelectRecent?.(location)
            setIsOpen(false)
            setActiveIndex(-1)
          }}
        />
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
