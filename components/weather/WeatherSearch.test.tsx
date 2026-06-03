import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
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
    window.localStorage.clear()
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

  it("renders search input without a submit button", () => {
    render(<WeatherSearch />)
    expect(screen.getByLabelText(/search location/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /^coords$/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /^place$/i })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /^search$/i })).not.toBeInTheDocument()
  })

  it("switches to coordinates mode", () => {
    render(<WeatherSearch />)
    fireEvent.click(screen.getByRole("button", { name: /^coords$/i }))
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

  it("navigates with city when a suggestion is selected", async () => {
    render(<WeatherSearch />)
    const input = screen.getByLabelText(/search location/i)
    fireEvent.change(input, { target: { value: "London" } })
    fireEvent.focus(input)

    const option = await screen.findByRole("option", { name: /london, england, united kingdom/i })
    fireEvent.click(option)

    const href = push.mock.calls[0]?.[0] as string
    const url = new URL(href, "http://localhost")
    expect(url.searchParams.get("lat")).toBe("51.5074")
    expect(url.searchParams.get("lon")).toBe("-0.1278")
    expect(url.searchParams.get("city")).toBe("London, England, United Kingdom")
  })

  it("navigates to the first suggestion on Enter", async () => {
    render(<WeatherSearch />)
    const input = screen.getByLabelText(/search location/i)
    fireEvent.change(input, { target: { value: "London" } })
    await screen.findByRole("option", { name: /london, england, united kingdom/i })
    fireEvent.keyDown(input, { key: "Enter" })

    const href = push.mock.calls[0]?.[0] as string
    const url = new URL(href, "http://localhost")
    expect(url.searchParams.get("lat")).toBe("51.5074")
    expect(url.searchParams.get("lon")).toBe("-0.1278")
    expect(url.searchParams.get("city")).toBe("London, England, United Kingdom")
  })

  it("hides recent options in the dropdown while typing", async () => {
    window.localStorage.setItem(
      "weather-recent-locations",
      JSON.stringify([
        { label: "Toronto, Ontario, Canada", lat: 43.65, lon: -79.38 },
        { label: "London, England, United Kingdom", lat: 51.5, lon: -0.12 },
      ])
    )

    render(<WeatherSearch />)
    const input = screen.getByLabelText(/search location/i)
    fireEvent.focus(input)

    await waitFor(() => {
      expect(screen.getByRole("option", { name: /toronto/i })).toBeInTheDocument()
    })

    fireEvent.change(input, { target: { value: "Lon" } })

    await waitFor(() => {
      expect(screen.queryByRole("option", { name: /toronto/i })).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /london, england, united kingdom/i })).toBeInTheDocument()
    })
  })

  it("shows coord validation error on Enter with invalid latitude", () => {
    render(<WeatherSearch />)
    fireEvent.click(screen.getByRole("button", { name: /^coords$/i }))
    fireEvent.change(screen.getByLabelText(/latitude/i), { target: { value: "120" } })
    fireEvent.change(screen.getByLabelText(/longitude/i), { target: { value: "10" } })
    fireEvent.keyDown(screen.getByLabelText(/longitude/i), { key: "Enter" })

    expect(screen.getByRole("alert")).toHaveTextContent(/latitude must be/i)
    expect(push).not.toHaveBeenCalled()
  })
})
