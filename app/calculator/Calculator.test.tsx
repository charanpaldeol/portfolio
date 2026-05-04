import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import CalculatorPage from "./page"

describe("CalculatorPage", () => {
  it("renders title and initial display", () => {
    render(<CalculatorPage />)
    expect(screen.getByRole("heading", { name: /calculator/i })).toBeInTheDocument()
    expect(screen.getByTestId("calc-display")).toHaveTextContent("0")
  })

  it("shows digits after button presses", async () => {
    const user = userEvent.setup()
    render(<CalculatorPage />)
    await user.click(screen.getByRole("button", { name: "1" }))
    await user.click(screen.getByRole("button", { name: "2" }))
    expect(screen.getByTestId("calc-display")).toHaveTextContent("12")
  })

  it("evaluates 2 + 2 = 4", async () => {
    const user = userEvent.setup()
    render(<CalculatorPage />)
    await user.click(screen.getByRole("button", { name: "2" }))
    await user.click(screen.getByRole("button", { name: "+" }))
    await user.click(screen.getByRole("button", { name: "2" }))
    await user.click(screen.getByRole("button", { name: "=" }))
    expect(screen.getByTestId("calc-display")).toHaveTextContent("4")
  })

  it("clears with C", async () => {
    const user = userEvent.setup()
    render(<CalculatorPage />)
    await user.click(screen.getByRole("button", { name: "5" }))
    expect(screen.getByTestId("calc-display")).toHaveTextContent("5")
    await user.click(screen.getByRole("button", { name: "C" }))
    expect(screen.getByTestId("calc-display")).toHaveTextContent("0")
  })

  it("handles digit keys from keyboard", () => {
    render(<CalculatorPage />)
    fireEvent.keyDown(window, { key: "7", bubbles: true })
    fireEvent.keyDown(window, { key: "8", bubbles: true })
    expect(screen.getByTestId("calc-display")).toHaveTextContent("78")
  })
})
