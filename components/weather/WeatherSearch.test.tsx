import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { WeatherSearch } from "./WeatherSearch"

const push = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}))

describe("WeatherSearch", () => {
  beforeEach(() => {
    push.mockReset()
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.includes("/api/weather/locations")) {
          return new Response(
            JSON.stringify({
              results: [
                {
                  id: 1,
                  label: "London, England, United Kingdom",
                  lat: 51.5074,
                  lon: -0.1278,
                },
              ],
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          )
        }
        throw new Error(`Unexpected fetch: ${url}`)
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("renders top search bar by default", () => {
    render(<WeatherSearch />)
    expect(screen.getByLabelText(/search location/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /coords/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /^search$/i })).toBeInTheDocument()
  })

  it("switches to coordinates mode", () => {
    render(<WeatherSearch />)
    fireEvent.click(screen.getByRole("button", { name: /coords/i }))
    expect(screen.getByLabelText(/latitude/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/longitude/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/search location/i)).not.toBeInTheDocument()
  })

  it("shows location suggestions while typing", async () => {
    render(<WeatherSearch />)
    const input = screen.getByLabelText(/search location/i)
    fireEvent.change(input, { target: { value: "London" } })
    fireEvent.focus(input)

    await waitFor(() => {
      expect(screen.getByRole("option", { name: /london, england, united kingdom/i })).toBeInTheDocument()
    })
    expect(screen.getByRole("option", { name: /use my current location/i })).toBeInTheDocument()
  })

  it("navigates when a suggestion is selected", async () => {
    render(<WeatherSearch />)
    const input = screen.getByLabelText(/search location/i)
    fireEvent.change(input, { target: { value: "London" } })
    fireEvent.focus(input)

    const option = await screen.findByRole("option", { name: /london, england, united kingdom/i })
    fireEvent.click(option)

    expect(push).toHaveBeenCalledWith("/weather?lat=51.5074&lon=-0.1278")
  })
})
