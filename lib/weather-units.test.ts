import { describe, expect, it } from "vitest"

import {
  formatAnomalyMessage,
  formatCurrentConditionsAria,
  formatTempParts,
  formatTempRange,
  formatTempValue,
  formatTodayRangeLabels,
  formatWindGust,
  formatWindSpeed,
  parseWeatherUnits,
  shouldShowFeelsLike,
  todayDaySpreadMessage,
  todayRangeAriaHint,
  todayRangePosition,
  todayRangeVisual,
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

describe("formatTempParts", () => {
  it("splits value and unit", () => {
    expect(formatTempParts(22, "c")).toEqual({ value: "22", unit: "°C" })
    expect(formatTempParts(22, "f")).toEqual({ value: "72", unit: "°F" })
  })
})

describe("formatTodayRangeLabels", () => {
  it("labels low and high explicitly", () => {
    expect(formatTodayRangeLabels(12, 24, "c")).toEqual({
      low: "Low 12°C",
      high: "High 24°C",
      aria: "Today low 12, high 24 Celsius",
    })
  })
})

describe("formatTempRange", () => {
  it("joins low and high labels", () => {
    expect(formatTempRange(12, 24, "c")).toBe("Low 12°C · High 24°C")
  })
})

describe("todayRangeVisual", () => {
  it("returns fraction between low and high", () => {
    const visual = todayRangeVisual(18, 12, 24)
    expect(visual?.position).toBe(0.5)
    expect(visual?.outside).toBeNull()
  })

  it("expands scale when current exceeds forecast high", () => {
    const visual = todayRangeVisual(30, 12, 24)
    expect(visual?.outside).toBe("above")
    expect(visual?.position).toBe(1)
  })

  it("hints when outside forecast range", () => {
    const visual = todayRangeVisual(30, 12, 24)!
    expect(todayRangeAriaHint(visual)).toContain("above")
  })
})

describe("todayDaySpreadMessage", () => {
  it("describes spread without repeating the hero temp", () => {
    expect(todayDaySpreadMessage(18, 12, 24, "c")).toContain("12°C")
    expect(todayDaySpreadMessage(18, 12, 24, "c")).toContain("24°C")
  })

  it("notes when warmer than forecast high", () => {
    expect(todayDaySpreadMessage(30, 12, 24, "c")).toMatch(/Warmer than today's forecast high/)
  })
})

describe("todayRangePosition", () => {
  it("delegates to todayRangeVisual", () => {
    expect(todayRangePosition(18, 12, 24)).toBe(0.5)
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

describe("shouldShowFeelsLike", () => {
  it("shows when apparent temp differs by at least 1°C", () => {
    expect(shouldShowFeelsLike(20, 21)).toBe(true)
    expect(shouldShowFeelsLike(20, 20.5)).toBe(false)
    expect(shouldShowFeelsLike(null, 21)).toBe(false)
  })
})

describe("formatCurrentConditionsAria", () => {
  it("includes feels-like and today range when provided", () => {
    const label = formatCurrentConditionsAria(20, 23, "Partly cloudy", "c", {
      includeFeelsLike: true,
      todayLowC: 15,
      todayHighC: 28,
    })
    expect(label).toContain("Partly cloudy")
    expect(label).toContain("feels like")
    expect(label).toContain("Today low")
  })
})
