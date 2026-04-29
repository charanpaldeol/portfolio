import { defineConfig, devices } from "@playwright/test"

const baseURL = (process.env.PLAYWRIGHT_PROD_BASE_URL ?? process.env.DEPLOY_URL ?? "").replace(/\/+$/, "")

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.error("PLAYWRIGHT_PROD_BASE_URL (or DEPLOY_URL) is required for prod Playwright runs")
  process.exit(1)
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "line",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
})
