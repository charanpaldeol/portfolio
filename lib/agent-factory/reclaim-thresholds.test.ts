import { describe, expect, it } from "vitest"

import { resolveStaleThresholdMs } from "./reclaim-thresholds"

describe("reclaim-thresholds", () => {
  it("treats blank and zero as fallback with floor", () => {
    const fb = 3_600_000
    const min = 60_000
    expect(resolveStaleThresholdMs({ envValue: undefined, fallbackMs: fb, minMs: min })).toBe(fb)
    expect(resolveStaleThresholdMs({ envValue: "", fallbackMs: fb, minMs: min })).toBe(fb)
    expect(resolveStaleThresholdMs({ envValue: "   ", fallbackMs: fb, minMs: min })).toBe(fb)
    expect(resolveStaleThresholdMs({ envValue: "0", fallbackMs: fb, minMs: min })).toBe(fb)
  })

  it("uses explicit positive values with floor", () => {
    expect(
      resolveStaleThresholdMs({ envValue: "120000", fallbackMs: 3_600_000, minMs: 60_000 }),
    ).toBe(120_000)
    expect(resolveStaleThresholdMs({ envValue: "30000", fallbackMs: 3_600_000, minMs: 60_000 })).toBe(60_000)
  })
})
