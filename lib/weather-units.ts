// Purpose: Celsius/Fahrenheit helpers for weather display and URL/localStorage preference.

export type WeatherUnits = "c" | "f"

export const WEATHER_UNITS_STORAGE_KEY = "weather-units"

export function parseWeatherUnits(raw: string | null | undefined): WeatherUnits {
  return raw === "f" ? "f" : "c"
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9
}

export function formatTempValue(
  celsius: number | null | undefined,
  units: WeatherUnits,
  digits = 0
): string {
  if (typeof celsius !== "number" || !Number.isFinite(celsius)) return "—"
  if (units === "f") return `${celsiusToFahrenheit(celsius).toFixed(digits)}°F`
  return `${celsius.toFixed(digits)}°C`
}

export function formatTempDelta(celsiusDelta: number, units: WeatherUnits): string {
  const value = units === "f" ? Math.round(celsiusDelta * (9 / 5)) : Math.round(celsiusDelta)
  const sign = value > 0 ? "+" : ""
  const suffix = units === "f" ? "°F" : "°"
  return `${sign}${value}${suffix}`
}

function kmhToMph(kmh: number): number {
  return kmh * 0.621371
}

export function formatWindSpeed(kmh: number | null | undefined, units: WeatherUnits): string {
  if (typeof kmh !== "number" || !Number.isFinite(kmh)) return "—"
  if (units === "f") return `${Math.round(kmhToMph(kmh))} mph`
  return `${Math.round(kmh)} km/h`
}

export function formatWindGust(kmh: number | null | undefined, units: WeatherUnits): string | null {
  if (typeof kmh !== "number" || !Number.isFinite(kmh)) return null
  if (units === "f") return `${Math.round(kmhToMph(kmh))} mph gusts`
  return `${Math.round(kmh)} km/h gusts`
}

export function formatAnomalyMessage(
  anomalyC: number,
  monthName: string,
  units: WeatherUnits = "c"
): string {
  const magnitude =
    units === "f"
      ? Math.abs(celsiusToFahrenheit(anomalyC) - celsiusToFahrenheit(0)).toFixed(1)
      : Math.abs(anomalyC).toFixed(1)
  const suffix = units === "f" ? "°F" : "°"
  return anomalyC > 0
    ? `${magnitude}${suffix} warmer than typical for ${monthName}`
    : `${magnitude}${suffix} cooler than typical for ${monthName}`
}
