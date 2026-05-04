import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { WeatherSearch } from "./WeatherSearch"

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}))

describe("WeatherSearch", () => {
  it("renders city search by default", () => {
    render(<WeatherSearch />)
    expect(screen.getByLabelText(/city name/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /city search/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /coordinates/i })).toBeInTheDocument()
  })

  it("switches to coordinates mode", () => {
    render(<WeatherSearch />)
    fireEvent.click(screen.getByRole("button", { name: /coordinates/i }))
    expect(screen.getByLabelText(/latitude/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/longitude/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/city name/i)).not.toBeInTheDocument()
  })

  it("updates city input value", () => {
    render(<WeatherSearch />)
    const input = screen.getByLabelText(/city name/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: "London" } })
    expect(input.value).toBe("London")
  })
})
