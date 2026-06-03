import { describe, expect, it } from "vitest"

import { buildDayCurveModel, isoMinutesFromMidnight, smoothDayCurvePoints } from "./weather-day-curve"
import type { HourlyForecastHour } from "./weather-types"

function hourAt(time: string, temp: number): HourlyForecastHour {
  return {
    time,
    temperatureC: temp,
    feelsLikeC: temp,
    weatherCode: 0,
    condition: { label: "Clear", icon: "☀️" },
    precipitationProbabilityPercent: null,
    precipitationMm: null,
    windSpeedKmh: null,
    windDirectionDeg: null,
    windGustKmh: null,
    wetBulbC: null,
    isDay: true,
  }
}

describe("isoMinutesFromMidnight", () => {
  it("parses local ISO time", () => {
    expect(isoMinutesFromMidnight("2026-06-03T14:30")).toBe(14 * 60 + 30)
  })
})

describe("smoothDayCurvePoints", () => {
  it("smooths interior points while keeping endpoints", () => {
    const points = [
      { minute: 0, tempC: 10 },
      { minute: 60, tempC: 20 },
      { minute: 120, tempC: 8 },
      { minute: 180, tempC: 22 },
    ]
    const smoothed = smoothDayCurvePoints(points, 1)
    expect(smoothed[0]?.tempC).toBe(10)
    expect(smoothed[smoothed.length - 1]?.tempC).toBe(22)
    expect(smoothed[1]?.tempC).not.toBe(20)
  })
})

describe("buildDayCurveModel", () => {
  it("builds path from hourly data for the day", () => {
    const hourly = Array.from({ length: 24 }, (_, h) =>
      hourAt(`2026-06-03T${String(h).padStart(2, "0")}:00`, 10 + h)
    )
    const model = buildDayCurveModel({
      hourlyForecast: hourly,
      observedAt: "2026-06-03T12:00",
      sunrise: "2026-06-03T06:00",
      sunset: "2026-06-03T20:00",
      temperatureC: 22,
      todayLowC: 10,
      todayHighC: 28,
    })
    expect(model?.pathD).toMatch(/^M /)
    expect(model?.nowChart).not.toBeNull()
    expect(model?.sunriseMinute).toBe(6 * 60)
  })

  it("synthesizes when hourly data is sparse", () => {
    const model = buildDayCurveModel({
      hourlyForecast: [],
      observedAt: "2026-06-03T15:00",
      sunrise: "2026-06-03T06:00",
      sunset: "2026-06-03T20:00",
      temperatureC: 18,
      todayLowC: 8,
      todayHighC: 26,
    })
    expect(model?.pathD.length).toBeGreaterThan(10)
  })
})
