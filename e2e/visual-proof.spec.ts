import { expect, test } from "@playwright/test"
import fs from "node:fs/promises"
import path from "node:path"

const routesToCapture = [
  { route: "/", name: "home" },
  { route: "/what-i-bring", name: "what-i-bring" },
  { route: "/how-i-work", name: "how-i-work" },
  { route: "/portfolio/services", name: "services" },
  { route: "/portfolio/projects", name: "projects" },
  { route: "/blog", name: "blog" },
  { route: "/contact", name: "contact" },
]

test.describe("Visual proof: key pages screenshots", () => {
  test("capture screenshots", async ({ page }, testInfo) => {
    const project = testInfo.project.name
    const shouldRun = project === "chromium" || project === "Mobile Chrome"
    test.skip(!shouldRun, "Capture screenshots only for desktop + mobile Chromium.")

    const planId = process.env.PLAN_ID ?? "adhoc"
    const outDir = path.join(
      process.cwd(),
      "agents",
      "governance",
      "screenshots",
      planId,
      project === "chromium" ? "desktop" : "mobile",
    )

    await fs.mkdir(outDir, { recursive: true })

    for (const item of routesToCapture) {
      await page.goto(item.route)
      await expect(page.locator("h1").first()).toBeVisible()
      await page.screenshot({
        path: path.join(outDir, `${item.name}.png`),
        fullPage: true,
      })
    }
  })
})

