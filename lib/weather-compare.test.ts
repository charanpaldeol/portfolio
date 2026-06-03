import { describe, expect, it } from "vitest"

import { buildCompareMetrics, formatTemperatureDelta } from "./weather-compare"
import { testWeatherSnapshot } from "./weather-test-fixtures"

function snapshot(overrides: Parameters<typeof testWeatherSnapshot>[0]) {
  return testWeatherSnapshot(overrides)
}

describe("formatTemperatureDelta", () => {
  it("describes warmer destination", () => {
    expect(formatTemperatureDelta(18, 25, "Tokyo")).toBe("7° warmer in Tokyo")
  })

  it("returns null when values missing", () => {
    expect(formatTemperatureDelta(null, 25, "Tokyo")).toBeNull()
  })

  it("uses Fahrenheit suffix when units are f", () => {
    expect(formatTemperatureDelta(18, 25, "Tokyo", "f")).toBe("13°F warmer in Tokyo")
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
