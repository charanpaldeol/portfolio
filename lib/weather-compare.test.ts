import { describe, expect, it } from "vitest"

import { weatherConditionFromCode } from "./weather-code"
import { buildCompareMetrics, formatTemperatureDelta } from "./weather-compare"
import type { WeatherSnapshot } from "./weather-types"

function snapshot(overrides: Partial<WeatherSnapshot>): WeatherSnapshot {
  return {
    city: "Place A",
    lat: 43.7,
    lon: -79.4,
    temperatureC: 20,
    condition: weatherConditionFromCode(0),
    feelsLikeC: 19,
    humidityPercent: 50,
    windSpeedKmh: 10,
    windDirectionDeg: 180,
    precipitationMm: 0,
    precipitationSumTodayMm: 0,
    cloudCoverPercent: 10,
    pressureHpa: 1015,
    visibilityM: 20000,
    uvIndexMax: 5,
    sunrise: "2026-06-02T06:00",
    sunset: "2026-06-02T20:00",
    todayHighC: 24,
    todayLowC: 14,
    elevationM: 200,
    population: null,
    locationSource: null,
    airQuality: { usAqi: 40, pm25: 4, label: "Good" },
    dailyForecast: [],
    observedAt: "2026-06-02T14:00",
    timezone: "America/Toronto",
    timezoneAbbreviation: "EDT",
    source: "open-meteo",
    climateNormals: null,
    ...overrides,
  }
}

describe("formatTemperatureDelta", () => {
  it("describes warmer destination", () => {
    expect(formatTemperatureDelta(18, 25, "Tokyo")).toBe("7° warmer in Tokyo")
  })

  it("returns null when values missing", () => {
    expect(formatTemperatureDelta(null, 25, "Tokyo")).toBeNull()
  })
})

describe("buildCompareMetrics", () => {
  it("includes temperature delta row", () => {
    const a = snapshot({ city: "Toronto", temperatureC: 18 })
    const b = snapshot({ city: "Ludhiana", temperatureC: 34 })
    const metrics = buildCompareMetrics(a, b)
    const temp = metrics.find((metric) => metric.key === "temperature")
    expect(temp?.delta).toBe("16° warmer in Ludhiana")
  })
})
