import { expect, test } from "@playwright/test"

const routes = [
  "/",
  "/what-i-bring",
  "/how-i-work",
  "/portfolio/services",
  "/portfolio/projects",
  "/blog",
  "/work-with-me",
  "/contact",
]

test.describe("Smoke: key routes render", () => {
  for (const route of routes) {
    test(`${route} renders`, async ({ page }) => {
      await page.goto(route)

      const h1 = page.locator("h1").first()
      await expect(h1).toBeVisible()

      const title = await page.title()
      expect(title.length).toBeGreaterThan(0)
    })
  }
})

