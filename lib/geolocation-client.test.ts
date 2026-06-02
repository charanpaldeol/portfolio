import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  fetchApproximateLocation,
  geolocationErrorMessage,
  getDeviceLocation,
  resolveCurrentLocation,
} from "./geolocation-client"

describe("geolocationErrorMessage", () => {
  it("describes permission denied", () => {
    const error = { code: 1, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError
    expect(geolocationErrorMessage(error)).toMatch(/blocked/i)
  })

  it("describes position unavailable", () => {
    const error = { code: 2, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError
    expect(geolocationErrorMessage(error)).toMatch(/GPS location is unavailable/i)
  })
})

describe("fetchApproximateLocation", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            latitude: 43.72,
            longitude: -79.83,
            city: "Brampton",
            principalSubdivision: "Ontario",
            countryName: "Canada",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns coordinates from network lookup", async () => {
    const result = await fetchApproximateLocation()
    expect(result.lat).toBe(43.72)
    expect(result.lon).toBe(-79.83)
    expect(result.label).toContain("Brampton")
  })
})

describe("resolveCurrentLocation", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("falls back to network location when GPS is unavailable", async () => {
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (_success: PositionCallback, error: PositionErrorCallback) => {
          error({ code: 2, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError)
        },
        watchPosition: (_success: PositionCallback, error: PositionErrorCallback) => {
          error({ code: 2, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError)
          return 1
        },
        clearWatch: vi.fn(),
      },
    })

    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({ latitude: 51.5, longitude: -0.12, city: "London", countryName: "United Kingdom" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
    )

    const result = await resolveCurrentLocation()
    expect(result.approximate).toBe(true)
    expect(result.lat).toBe(51.5)
    expect(result.lon).toBe(-0.12)
  })

  it("uses GPS when available on first attempt", async () => {
    vi.stubGlobal("window", { ...window, isSecureContext: true })
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (success: PositionCallback) => {
          success({
            coords: { latitude: 30.9, longitude: 75.8, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
            timestamp: Date.now,
          } as GeolocationPosition)
        },
        watchPosition: vi.fn(),
        clearWatch: vi.fn(),
      },
    })

    const result = await resolveCurrentLocation()
    expect(result.approximate).toBe(false)
    expect(result.lat).toBe(30.9)
    expect(result.lon).toBe(75.8)
  })
})

describe("getDeviceLocation", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("throws permission errors immediately", async () => {
    vi.stubGlobal("window", { ...window, isSecureContext: true })
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (_success: PositionCallback, error: PositionErrorCallback) => {
          error({ code: 1, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError)
        },
        watchPosition: vi.fn(),
        clearWatch: vi.fn(),
      },
    })

    await expect(getDeviceLocation()).rejects.toMatchObject({ code: 1 })
  })
})
