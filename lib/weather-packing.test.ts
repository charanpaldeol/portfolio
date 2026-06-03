import { describe, expect, it } from "vitest"

import { weatherConditionFromCode } from "./weather-code"
import { buildPackingHints } from "./weather-packing"
import type { WeatherSnapshot } from "./weather-types"

function snapshot(overrides: Partial<WeatherSnapshot>): WeatherSnapshot {
  return {
    city: "Toronto",
    lat: 43.7,
    lon: -79.4,
    temperatureC: 18,
    condition: weatherConditionFromCode(0),
    feelsLikeC: 17,
    humidityPercent: 50,
    windSpeedKmh: 10,
    windDirectionDeg: 180,
    windGustKmh: null,
    dewPointC: null,
    precipitationMm: 0,
    precipitationSumTodayMm: 0,
    cloudCoverPercent: 10,
    pressureHpa: 1015,
    visibilityM: 20000,
    uvIndexMax: 5,
    sunrise: null,
    sunset: null,
    todayHighC: 22,
    todayLowC: 12,
    elevationM: null,
    population: null,
    locationSource: null,
    airQuality: { usAqi: 40, pm25: 4, label: "Good" },
    dailyForecast: [],
    hourlyForecast: [],
    observedAt: null,
    timezone: null,
    timezoneAbbreviation: "EDT",
    source: "open-meteo",
    climateNormals: null,
    isDay: true,
    temperatureAnomalyC: null,
    isDefaultLocation: false,
    ...overrides,
  }
}

describe("buildPackingHints", () => {
  it("suggests layers when destination is cooler", () => {
    const hints = buildPackingHints(
      snapshot({ city: "Toronto", temperatureC: 24 }),
      snapshot({ city: "Ludhiana", temperatureC: 10 })
    )
    expect(hints.some((hint) => hint.includes("layer"))).toBe(true)
  })
})
