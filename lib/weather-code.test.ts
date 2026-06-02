import { describe, expect, it } from "vitest"

import { weatherConditionFromCode } from "./weather-code"
import { formatObservedAt, windDirectionLabel } from "./weather-format"

describe("weatherConditionFromCode", () => {
  it("maps known WMO codes", () => {
    expect(weatherConditionFromCode(0).label).toBe("Clear sky")
    expect(weatherConditionFromCode(61).label).toBe("Slight rain")
    expect(weatherConditionFromCode(95).icon).toBe("⛈️")
  })

  it("falls back for unknown codes", () => {
    expect(weatherConditionFromCode(404).label).toBe("Unknown conditions")
  })
})

describe("windDirectionLabel", () => {
  it("maps degrees to compass labels", () => {
    expect(windDirectionLabel(0)).toBe("N")
    expect(windDirectionLabel(90)).toBe("E")
    expect(windDirectionLabel(180)).toBe("S")
  })
})

describe("formatObservedAt", () => {
  it("formats local observation time with timezone abbreviation", () => {
    const formatted = formatObservedAt("2026-06-02T23:45", "Asia/Kolkata", "GMT+5:30")
    expect(formatted).toBe("Updated 11:45 PM GMT+5:30")
  })
})
