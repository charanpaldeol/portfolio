import { describe, expect, it } from "vitest"

import { classifyHeroCondition, inferHeroNight } from "./weather-hero"

describe("inferHeroNight", () => {
  it("trusts API is_day when set", () => {
    expect(inferHeroNight(true, null, null, null)).toBe(false)
    expect(inferHeroNight(false, null, null, null)).toBe(true)
  })

  it("uses sunrise and sunset when is_day is unknown", () => {
    expect(
      inferHeroNight(null, "2026-06-03T22:00", "2026-06-03T06:30", "2026-06-03T20:15")
    ).toBe(true)
    expect(
      inferHeroNight(null, "2026-06-03T12:00", "2026-06-03T06:30", "2026-06-03T20:15")
    ).toBe(false)
  })
})

describe("classifyHeroCondition", () => {
  it("maps the most severe matching keyword first", () => {
    expect(classifyHeroCondition("Thunderstorm with hail")).toBe("storm")
    expect(classifyHeroCondition("Heavy snow showers")).toBe("snow")
    expect(classifyHeroCondition("Moderate drizzle")).toBe("rain")
    expect(classifyHeroCondition("Freezing fog")).toBe("snow")
    expect(classifyHeroCondition("Fog")).toBe("fog")
    expect(classifyHeroCondition("Overcast")).toBe("cloud")
    expect(classifyHeroCondition("Mainly clear")).toBe("clear")
  })

  it("defaults to cloud for empty or unknown labels", () => {
    expect(classifyHeroCondition("")).toBe("cloud")
    expect(classifyHeroCondition(null)).toBe("cloud")
    expect(classifyHeroCondition(undefined)).toBe("cloud")
  })
})
