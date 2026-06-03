import { describe, expect, it } from "vitest"

import {
  formatAnomalyMessage,
  formatTempValue,
  formatWindGust,
  formatWindSpeed,
  parseWeatherUnits,
} from "./weather-units"

describe("parseWeatherUnits", () => {
  it("defaults to celsius", () => {
    expect(parseWeatherUnits(null)).toBe("c")
    expect(parseWeatherUnits("c")).toBe("c")
  })

  it("parses fahrenheit", () => {
    expect(parseWeatherUnits("f")).toBe("f")
  })
})

describe("formatTempValue", () => {
  it("formats celsius and fahrenheit", () => {
    expect(formatTempValue(20, "c", 1)).toBe("20.0°C")
    expect(formatTempValue(20, "f", 1)).toBe("68.0°F")
  })
})

describe("formatWindSpeed", () => {
  it("formats km/h and mph", () => {
    expect(formatWindSpeed(10, "c")).toBe("10 km/h")
    expect(formatWindSpeed(10, "f")).toBe("6 mph")
  })
})

describe("formatWindGust", () => {
  it("formats gust strings", () => {
    expect(formatWindGust(20, "c")).toBe("20 km/h gusts")
    expect(formatWindGust(20, "f")).toBe("12 mph gusts")
  })
})

describe("formatAnomalyMessage", () => {
  it("describes warm and cool anomalies in chosen units", () => {
    expect(formatAnomalyMessage(2, "June", "c")).toBe("2.0° warmer than typical for June")
    expect(formatAnomalyMessage(-2, "January", "f")).toBe("3.6°F cooler than typical for January")
  })
})
