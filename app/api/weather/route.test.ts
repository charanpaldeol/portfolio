/** @vitest-environment node */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { GET } = await import("./route")

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

const forecastBody = {
  timezone: "Europe/London",
  timezone_abbreviation: "GMT+1",
  elevation: 35,
  current: {
    time: "2026-06-02T14:30",
    temperature_2m: 12,
    apparent_temperature: 11,
    relative_humidity_2m: 68,
    weather_code: 3,
    wind_speed_10m: 12.5,
    wind_direction_10m: 225,
    precipitation: 0.2,
    cloud_cover: 88,
    pressure_msl: 1018,
    visibility: 15000,
    is_day: 1,
  },
  daily: {
    time: ["2026-06-02", "2026-06-03", "2026-06-04", "2026-06-05", "2026-06-06", "2026-06-07", "2026-06-08"],
    weather_code: [3, 3, 61, 2, 1, 0, 2],
    temperature_2m_max: [16, 18, 15, 17, 19, 21, 20],
    temperature_2m_min: [9, 10, 8, 9, 11, 12, 11],
    precipitation_sum: [1.2, 0, 3.5, 0, 0, 0, 0.4],
    uv_index_max: [4, 5, 3, 6, 7, 8, 6],
    sunrise: [
      "2026-06-02T04:45",
      "2026-06-03T04:45",
      "2026-06-04T04:44",
      "2026-06-05T04:44",
      "2026-06-06T04:44",
      "2026-06-07T04:43",
      "2026-06-08T04:43",
    ],
    sunset: [
      "2026-06-02T21:15",
      "2026-06-03T21:16",
      "2026-06-04T21:16",
      "2026-06-05T21:17",
      "2026-06-06T21:17",
      "2026-06-07T21:18",
      "2026-06-08T21:18",
    ],
  },
}

const airQualityBody = {
  current: { us_aqi: 55, pm2_5: 8.1 },
}

describe("GET /api/weather", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)

        if (url.includes("geocoding-api.open-meteo.com")) {
          return jsonResponse({
            results: [
              {
                id: 2643743,
                name: "London",
                latitude: 51.5074,
                longitude: -0.1278,
                country: "United Kingdom",
                admin1: "England",
                elevation: 25,
                population: 8982000,
                timezone: "Europe/London",
              },
            ],
          })
        }

        if (url.includes("reverse-geocode-client")) {
          return jsonResponse({
            city: "New York",
            locality: "New York",
            principalSubdivision: "New York",
            countryName: "United States",
          })
        }

        if (url.includes("air-quality-api.open-meteo.com")) {
          return jsonResponse(airQualityBody)
        }

        if (url.includes("archive-api.open-meteo.com")) {
          const times: string[] = []
          const mean: number[] = []
          const high: number[] = []
          const low: number[] = []
          for (let year = 1991; year <= 2020; year += 1) {
            for (let month = 1; month <= 12; month += 1) {
              for (let day = 1; day <= 28; day += 1) {
                times.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
                mean.push(month === 7 ? 26 : month === 1 ? -4 : 10)
                high.push(month === 7 ? 31 : month === 1 ? 0 : 15)
                low.push(month === 7 ? 20 : month === 1 ? -8 : 5)
              }
            }
          }
          return jsonResponse({
            daily: {
              time: times,
              temperature_2m_mean: mean,
              temperature_2m_max: high,
              temperature_2m_min: low,
            },
          })
        }

        if (url.includes("api.open-meteo.com/v1/forecast")) {
          return jsonResponse(forecastBody)
        }

        throw new Error(`Unexpected fetch: ${url}`)
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it("returns enriched weather details for default coordinates", async () => {
    const res = await GET(new Request("http://localhost/api/weather"))
    const data = await res.json()

    expect(res.ok).toBe(true)
    expect(data.city).toBe("New York, New York, United States")
    expect(data.condition.label).toBe("Overcast")
    expect(data.feelsLikeC).toBe(11)
    expect(data.humidityPercent).toBe(68)
    expect(data.windSpeedKmh).toBe(12.5)
    expect(data.todayHighC).toBe(16)
    expect(data.todayLowC).toBe(9)
    expect(data.observedAt).toBe("2026-06-02T14:30")
    expect(data.timezoneAbbreviation).toBe("GMT+1")
    expect(data.elevationM).toBe(35)
    expect(data.cloudCoverPercent).toBe(88)
    expect(data.pressureHpa).toBe(1018)
    expect(data.uvIndexMax).toBe(4)
    expect(data.sunrise).toBe("2026-06-02T04:45")
    expect(data.sunset).toBe("2026-06-02T21:15")
    expect(data.airQuality.usAqi).toBe(55)
    expect(data.dailyForecast).toHaveLength(7)
    expect(data.dailyForecast[0].highC).toBe(16)
    expect(data.climateNormals?.hottest.monthName).toBe("July")
    expect(data.climateNormals?.coldest.monthName).toBe("January")
    expect(data.climateNormals?.hottest.meanC).toBe(26)
  })

  it("resolves city search to coordinates and a formatted place name", async () => {
    const res = await GET(new Request("http://localhost/api/weather?city=London"))
    const data = await res.json()

    expect(res.ok).toBe(true)
    expect(data.city).toBe("London, England, United Kingdom")
    expect(data.lat).toBe(51.5074)
    expect(data.lon).toBe(-0.1278)
    expect(data.population).toBe(8982000)
  })

  it("reverse-geocodes explicit coordinates", async () => {
    const res = await GET(new Request("http://localhost/api/weather?lat=40.7128&lon=-74.006"))
    const data = await res.json()

    expect(res.ok).toBe(true)
    expect(data.city).toBe("New York, New York, United States")
    expect(data.locationSource).toBe("gps")
  })

  it("marks network location when approx=1", async () => {
    const res = await GET(new Request("http://localhost/api/weather?lat=40.7128&lon=-74.006&approx=1"))
    const data = await res.json()

    expect(res.ok).toBe(true)
    expect(data.locationSource).toBe("network")
  })
})
