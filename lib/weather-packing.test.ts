import { describe, expect, it } from "vitest"

import { buildPackingHints } from "./weather-packing"
import { testWeatherSnapshot } from "./weather-test-fixtures"

function snapshot(overrides: Parameters<typeof testWeatherSnapshot>[0]) {
  return testWeatherSnapshot({ city: "Toronto", ...overrides })
}

describe("buildPackingHints", () => {
  it("suggests layers when destination is cooler", () => {
    const hints = buildPackingHints(
      snapshot({ city: "Toronto", temperatureC: 24 }),
      snapshot({ city: "Ludhiana", temperatureC: 10 })
    )
    expect(hints.some((hint) => hint.includes("layer"))).toBe(true)
  })

  it("preserves destination capitalization in temperature hints", () => {
    const hints = buildPackingHints(
      snapshot({ city: "Toronto", temperatureC: 18 }),
      snapshot({ city: "Ludhiana, Punjab, India", temperatureC: 27 })
    )
    expect(hints.some((hint) => hint.includes("Ludhiana"))).toBe(true)
    expect(hints.some((hint) => hint.includes("ludhiana"))).toBe(false)
  })
})
