import { describe, expect, it } from "vitest"

import { recentForLocationDropdown } from "./weather-recent"
import type { RecentLocation } from "./weather-recent"

const sample: RecentLocation[] = [
  { label: "Toronto", lat: 43.65, lon: -79.38 },
  { label: "London", lat: 51.5, lon: -0.12 },
  { label: "Tokyo", lat: 35.68, lon: 139.69 },
  { label: "Paris", lat: 48.85, lon: 2.35 },
]

describe("recentForLocationDropdown", () => {
  it("returns capped recents when the query is empty", () => {
    expect(recentForLocationDropdown(sample, "")).toHaveLength(3)
    expect(recentForLocationDropdown(sample, "  ")).toHaveLength(3)
  })

  it("hides recents while the user is typing", () => {
    expect(recentForLocationDropdown(sample, "L")).toEqual([])
    expect(recentForLocationDropdown(sample, "London")).toEqual([])
  })
})
