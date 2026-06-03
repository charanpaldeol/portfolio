import { describe, expect, it } from "vitest"

import { buildDailyForecast, parseAirQuality } from "./weather-response"

describe("buildDailyForecast", () => {
  it("maps daily arrays into forecast days", () => {
    const days = buildDailyForecast({
      time: ["2026-06-02", "2026-06-03"],
      weather_code: [0, 61],
      temperature_2m_max: [24, 20],
      temperature_2m_min: [12, 10],
      precipitation_sum: [0, 2.5],
      uv_index_max: [6, 4],
    })

    expect(days).toHaveLength(2)
    expect(days[0].weekday).toBe("Tue")
    expect(days[0].condition.label).toBe("Clear sky")
    expect(days[1].precipitationMm).toBe(2.5)
  })
})

describe("parseAirQuality", () => {
  it("returns AQI label from provider data", () => {
    expect(parseAirQuality({ current: { us_aqi: 49, pm2_5: 4.2 } })).toMatchObject({
      usAqi: 49,
      pm25: 4.2,
      label: "Good",
    })
  })
})
