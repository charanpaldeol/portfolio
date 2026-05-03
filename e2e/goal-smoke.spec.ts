import { expect, test } from "@playwright/test"

/**
 * Goal-critical DOM and API checks aligned with `agents/factory-goal-spec.json`
 * roadmap ids FACTORY_VERIFY_* (calculator, weather API + page, navbar).
 * Run via `pnpm e2e:goal-smoke`; included in `pnpm verify` (Phase A2–A3).
 */

test.describe("FACTORY_VERIFY_CALCULATOR_V1", () => {
  test("/calculator renders and evaluates 2+2", async ({ page }) => {
    await page.goto("/calculator")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()

    await page.getByRole("button", { name: "2" }).click()
    await page.getByRole("button", { name: "+", exact: true }).click()
    await page.getByRole("button", { name: "2" }).click()
    await page.getByRole("button", { name: "=", exact: true }).click()

    await expect(page.getByTestId("calc-display")).toHaveText("4")
  })
})

test.describe("FACTORY_VERIFY_WEATHER_V1", () => {
  test("GET /api/weather returns JSON with temperature and source", async ({ request }) => {
    const res = await request.get("/api/weather")
    expect(res.ok()).toBeTruthy()
    const data = (await res.json()) as Record<string, unknown>
    expect(typeof data.temperatureC).toBe("number")
    expect(typeof data.weatherCode).toBe("number")
    expect(data.source === "open-meteo" || data.source === "mock").toBeTruthy()
  })

  test("/weather shows human-readable weather from API", async ({ page }) => {
    await page.goto("/weather")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.getByText("Temperature:", { exact: false })).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText("Source:", { exact: false })).toBeVisible()
  })
})

test.describe("FACTORY_VERIFY_NAVBAR_V1", () => {
  test("desktop top nav links Calculator and Weather with hrefs", async ({ page }) => {
    await page.goto("/")
    const header = page.locator("header")
    const calc = header.getByRole("link", { name: "Calculator", exact: true })
    const weather = header.getByRole("link", { name: "Weather", exact: true })
    await expect(calc).toBeVisible()
    await expect(weather).toBeVisible()
    await expect(calc).toHaveAttribute("href", "/calculator")
    await expect(weather).toHaveAttribute("href", "/weather")
  })

  test("mobile sheet links Calculator and Weather with same hrefs", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")
    await page.getByRole("button", { name: /open navigation menu/i }).click()
    const sheet = page.locator("div").filter({ has: page.getByRole("heading", { name: "cpdeol" }) })
    const calc = sheet.getByRole("link", { name: "Calculator", exact: true })
    const weather = sheet.getByRole("link", { name: "Weather", exact: true })
    await expect(calc).toBeVisible()
    await expect(weather).toBeVisible()
    await expect(calc).toHaveAttribute("href", "/calculator")
    await expect(weather).toHaveAttribute("href", "/weather")
  })
})
