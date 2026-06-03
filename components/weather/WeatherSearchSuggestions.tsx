// Purpose: Autocomplete suggestion list for WeatherSearch city combobox.
import { cn } from "@/lib/utils"
import { formatPopulation } from "@/lib/weather-format"
import type { LocationSuggestion } from "@/lib/weather-geocode"

export function suggestionMeta(suggestion: LocationSuggestion): string | null {
  const parts: string[] = []
  if (typeof suggestion.elevationM === "number" && Number.isFinite(suggestion.elevationM)) {
    parts.push(`${Math.round(suggestion.elevationM)} m`)
  }
  const population = formatPopulation(suggestion.population)
  if (population) parts.push(population)
  if (suggestion.timezone) parts.push(suggestion.timezone)
  return parts.length > 0 ? parts.join(" · ") : null
}

type WeatherSearchSuggestionsProps = {
  listboxId: string
  city: string
  suggestions: LocationSuggestion[]
  activeIndex: number
  isLoading: boolean
  isLocating: boolean
  onUseCurrentLocation: () => void
  onSelect: (suggestion: LocationSuggestion) => void
}

export function WeatherSearchSuggestions({
  listboxId,
  city,
  suggestions,
  activeIndex,
  isLoading,
  isLocating,
  onUseCurrentLocation,
  onSelect,
}: WeatherSearchSuggestionsProps) {
  return (
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
          onClick={onUseCurrentLocation}
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
              onClick={() => onSelect(suggestion)}
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
              {meta ? <span className="mt-0.5 block text-xs text-on-surface-variant/70">{meta}</span> : null}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
