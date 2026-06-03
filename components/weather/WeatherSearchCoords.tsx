// Purpose: Manual latitude/longitude inputs for WeatherSearch.
type WeatherSearchCoordsProps = {
  lat: string
  lon: string
  inputClass: string
  onLatChange: (value: string) => void
  onLonChange: (value: string) => void
}

export function WeatherSearchCoords({
  lat,
  lon,
  inputClass,
  onLatChange,
  onLonChange,
}: WeatherSearchCoordsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label htmlFor="lat" className="sr-only">
          Latitude
        </label>
        <input
          id="lat"
          type="text"
          value={lat}
          onChange={(event) => onLatChange(event.target.value)}
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
          onChange={(event) => onLonChange(event.target.value)}
          placeholder="Longitude"
          className={inputClass}
        />
      </div>
    </div>
  )
}
