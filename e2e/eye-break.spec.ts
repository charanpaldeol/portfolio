import { expect, test } from "@playwright/test"

function stubNotifications() {
  return `
    (() => {
      const fake = function () {}
      fake.permission = "granted"
      fake.requestPermission = async () => "granted"
      window.Notification = fake
    })()
  `
}

test.describe("Eye Break Timer", () => {
  test("page loads with sliders and start button visible", async ({ page }) => {
    await page.addInitScript(stubNotifications())
    await page.goto("/eye-break")

    await expect(page.getByRole("slider", { name: /work interval/i })).toBeVisible()
    await expect(page.getByRole("slider", { name: /break duration/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /start/i })).toBeVisible()
  })

  test("after clicking Start, countdown display appears and decrements", async ({ page }) => {
    await page.addInitScript(stubNotifications())
    await page.goto("/eye-break")

    await page.getByRole("button", { name: /start/i }).click()

    const countdown = page.getByTestId("work-countdown")
    await expect(countdown).toBeVisible()
    const before = (await countdown.textContent())?.trim()

    await page.waitForTimeout(1100)
    const after = (await countdown.textContent())?.trim()

    expect(after).not.toBe(before)
  })

  test("clicking Stop resets timer to idle state", async ({ page }) => {
    await page.addInitScript(stubNotifications())
    await page.goto("/eye-break")

    await page.getByRole("button", { name: /start/i }).click()
    await page.getByRole("button", { name: /stop/i }).click()

    await expect(page.getByText("Idle")).toBeVisible()
    await expect(page.getByTestId("work-countdown")).toHaveCount(0)
  })

  test("clicking Preview shows the break overlay", async ({ page }) => {
    await page.addInitScript(stubNotifications())
    await page.goto("/eye-break")

    await page.getByRole("button", { name: /preview/i }).click()

    await expect(page.getByRole("button", { name: /skip break/i })).toBeVisible()
    await expect(page.getByText(/Look at something 20 feet away/i)).toBeVisible()
  })

  test("clicking Skip in the overlay dismisses it", async ({ page }) => {
    await page.addInitScript(stubNotifications())
    await page.goto("/eye-break")

    await page.getByRole("button", { name: /preview/i }).click()
    await page.getByRole("button", { name: /skip break/i }).click()

    await expect(page.getByRole("button", { name: /skip break/i })).toHaveCount(0)
  })
})

