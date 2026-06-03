// Purpose: Manual latitude/longitude inputs for WeatherSearch.
import { KeyboardEvent } from "react"

type WeatherSearchCoordsProps = {
  lat: string
  lon: string
  inputClass: string
  coordError?: string
  onLatChange: (value: string) => void
  onLonChange: (value: string) => void
  onEnterCommit?: () => void
  attached?: boolean
  showInlineError?: boolean
}

function handleCoordEnter(event: KeyboardEvent<HTMLInputElement>, onEnterCommit?: () => void) {
  if (event.key !== "Enter") return
  event.preventDefault()
  onEnterCommit?.()
}

export function WeatherSearchCoords({
  lat,
  lon,
  inputClass,
  coordError,
  onLatChange,
  onLonChange,
  onEnterCommit,
  attached = false,
  showInlineError = true,
}: WeatherSearchCoordsProps) {
  return (
    <div className={attached ? "min-w-0 flex-1" : "space-y-2"}>
      <div
        className={
          attached
            ? "grid h-12 min-w-0 grid-cols-2 divide-x divide-outline-variant/10 sm:h-[52px]"
            : "grid grid-cols-2 gap-2"
        }
      >
        <div>
          <label htmlFor="lat" className="sr-only">
            Latitude
          </label>
          <input
            id="lat"
            type="text"
            inputMode="decimal"
            value={lat}
            onChange={(event) => onLatChange(event.target.value)}
            onKeyDown={(event) => handleCoordEnter(event, onEnterCommit)}
            placeholder="Latitude (-90 to 90)"
            aria-invalid={coordError ? true : undefined}
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
            inputMode="decimal"
            value={lon}
            onChange={(event) => onLonChange(event.target.value)}
            onKeyDown={(event) => handleCoordEnter(event, onEnterCommit)}
            placeholder="Longitude (-180 to 180)"
            aria-invalid={coordError ? true : undefined}
            className={inputClass}
          />
        </div>
      </div>
      {showInlineError && coordError ? (
        <p role="alert" className="text-sm text-destructive">
          {coordError}
        </p>
      ) : null}
    </div>
  )
}
