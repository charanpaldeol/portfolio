import { describe, expect, it } from "vitest"

import { collectCalcWeatherSignals } from "@/lib/agent-factory/research-calc-weather-signals"

describe("collectCalcWeatherSignals", () => {
  it("returns metadata + keyboard signals for minimal client calculator", () => {
    const sig = collectCalcWeatherSignals({
      calculatorPageSource: '"use client"\nexport default function X() { return null }',
      weatherPageSource: "export default async function WeatherPage() { const data = await loadWeatherJson()\nreturn (<main>{data.x}</main>) }",
      weatherRouteSource: "latitude=40.7128&longitude=-74.006",
      calculatorHasServerLayout: false,
    })
    const ids = sig.map((s) => s.id)
    expect(ids).toContain("FACTORY_R_CALC_ROUTE_METADATA_V1")
    expect(ids).toContain("FACTORY_R_CALC_KEYBOARD_A11Y_V1")
    expect(ids).toContain("FACTORY_R_WEATHER_API_LOCATION_V1")
    expect(ids).toContain("FACTORY_R_WEATHER_ERROR_STATE_V1")
  })

  it("skips metadata signal when calculator layout exists", () => {
    const sig = collectCalcWeatherSignals({
      calculatorPageSource: '"use client"',
      weatherPageSource: "",
      weatherRouteSource: "",
      calculatorHasServerLayout: true,
    })
    expect(sig.find((s) => s.id === "FACTORY_R_CALC_ROUTE_METADATA_V1")).toBeUndefined()
  })
})
