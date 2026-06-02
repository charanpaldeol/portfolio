/** @vitest-environment node */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { GET } = await import("./route")

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

describe("GET /api/weather/locations", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)

        if (url.includes("geocoding-api.open-meteo.com")) {
          return jsonResponse({
            results: [
              {
                id: 1264728,
                name: "Ludhiana",
                latitude: 30.91204,
                longitude: 75.85379,
                country: "India",
                admin1: "Punjab",
              },
              {
                id: 1264729,
                name: "Ludhiana District",
                latitude: 30.9167,
                longitude: 75.8333,
                country: "India",
                admin1: "Punjab",
              },
            ],
          })
        }

        throw new Error(`Unexpected fetch: ${url}`)
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it("returns empty results for short queries", async () => {
    const res = await GET(new Request("http://localhost/api/weather/locations?q=l"))
    const data = await res.json()

    expect(res.ok).toBe(true)
    expect(data.results).toEqual([])
  })

  it("returns formatted location suggestions", async () => {
    const res = await GET(new Request("http://localhost/api/weather/locations?q=ludhiana"))
    const data = await res.json()

    expect(res.ok).toBe(true)
    expect(data.results).toHaveLength(2)
    expect(data.results[0]).toMatchObject({
      id: 1264728,
      label: "Ludhiana, Punjab, India",
      lat: 30.91204,
      lon: 75.85379,
    })
  })
})
