import { describe, expect, it } from "vitest"

import {
  buildCompareLocationQuery,
  hasCompareLocations,
  isCompareMode,
  parseWeatherPayload,
} from "./weather-payload"

describe("parseWeatherPayload", () => {
  it("maps API JSON to a snapshot", () => {
    const snapshot = parseWeatherPayload({
      city: "Toronto",
      lat: 43.7,
      lon: -79.4,
      temperatureC: 22,
      weatherCode: 0,
      condition: { label: "Clear sky", icon: "☀️" },
      source: "open-meteo",
    })

    expect(snapshot?.city).toBe("Toronto")
    expect(snapshot?.temperatureC).toBe(22)
  })
})

describe("compare query helpers", () => {
  it("detects compare mode from compare flag", () => {
    expect(isCompareMode({ compare: "1" })).toBe(true)
  })

  it("builds separate API queries for A and B", () => {
    const sp = {
      compare: "1",
      lat: "43.7000",
      lon: "-79.4000",
      lat2: "30.9000",
      lon2: "75.8500",
      city: "Toronto",
      city2: "Ludhiana",
    }

    expect(buildCompareLocationQuery(sp, "a")).toBe("?lat=43.7000&lon=-79.4000&city=Toronto")
    expect(buildCompareLocationQuery(sp, "b")).toBe("?lat=30.9000&lon=75.8500&city=Ludhiana")
    expect(hasCompareLocations(sp)).toBe(true)
  })
})
