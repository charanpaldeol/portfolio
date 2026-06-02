import { describe, expect, it } from "vitest"

import {
  computeMonthlyNormals,
  findClimateExtremes,
  formatClimateMonthSummary,
} from "./weather-climate"

function buildSyntheticArchive() {
  const times: string[] = []
  const mean: number[] = []
  const high: number[] = []
  const low: number[] = []

  for (let year = 1991; year <= 2020; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      for (let day = 1; day <= 28; day += 1) {
        times.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
        if (month === 7) {
          mean.push(26)
          high.push(31)
          low.push(20)
        } else if (month === 1) {
          mean.push(-4)
          high.push(0)
          low.push(-8)
        } else {
          mean.push(10)
          high.push(15)
          low.push(5)
        }
      }
    }
  }

  return {
    time: times,
    temperature_2m_mean: mean,
    temperature_2m_max: high,
    temperature_2m_min: low,
  }
}

describe("computeMonthlyNormals", () => {
  it("averages daily values into monthly normals", () => {
    const months = computeMonthlyNormals(buildSyntheticArchive())
    expect(months).toHaveLength(12)
    expect(months[6]?.monthName).toBe("July")
    expect(months[6]?.meanC).toBe(26)
    expect(months[0]?.monthName).toBe("January")
    expect(months[0]?.meanC).toBe(-4)
  })
})

describe("findClimateExtremes", () => {
  it("picks hottest and coldest months by mean temperature", () => {
    const extremes = findClimateExtremes(computeMonthlyNormals(buildSyntheticArchive()))
    expect(extremes?.hottest.monthName).toBe("July")
    expect(extremes?.coldest.monthName).toBe("January")
  })
})

describe("formatClimateMonthSummary", () => {
  it("formats mean high and low", () => {
    expect(formatClimateMonthSummary({ month: 7, monthName: "July", meanC: 26, highC: 31, lowC: 20 })).toBe(
      "26.0° avg · high 31.0° · low 20.0°"
    )
  })
})
