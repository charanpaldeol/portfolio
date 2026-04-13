import { expect, test } from "@playwright/test"

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const hasHorizontalScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  )
  expect(hasHorizontalScroll).toBe(false)
}

test.describe("Mobile layout & navigation", () => {
  test("home page loads on mobile with hero and menu, no horizontal overflow", async ({ page }) => {
    await page.goto("/")
    await page.locator("#page-top").scrollIntoViewIfNeeded()

    const heroHeading = page.locator("#page-top h1")
    await expect(heroHeading).toBeVisible({ timeout: 5_000 })
    await expect(heroHeading).toContainText(/charan deol/i, { timeout: 20_000 })
    await expect(page.getByRole("button", { name: /open navigation menu/i })).toBeVisible()

    await expectNoHorizontalOverflow(page)
  })

  test("mobile navigation opens, shows links, and closes", async ({ page }) => {
    await page.goto("/")

    await page.getByRole("button", { name: /open navigation menu/i }).click()

    const sheet = page.locator("div").filter({ has: page.getByRole("heading", { name: "cpdeol" }) })
    await expect(sheet.getByRole("link", { name: "Home", exact: true })).toBeVisible()
    await expect(sheet.getByRole("link", { name: "Blog", exact: true })).toBeVisible()

    // Backdrop is full-viewport; default click targets viewport center, which sits under the left sheet (w-80).
    const vp = page.viewportSize()
    if (!vp) throw new Error("expected viewport size")
    await page.getByRole("button", { name: /close navigation menu/i }).click({
      position: { x: vp.width - 24, y: Math.min(vp.height / 2, 400) },
    })

    await expect(page.getByRole("button", { name: /close navigation menu/i })).toHaveCount(0)
    await expect(sheet.getByRole("link", { name: "Home", exact: true })).toHaveCount(0)
  })

  for (const route of ["/what-i-bring", "/how-i-work", "/portfolio/projects"]) {
    test(`${route} renders on mobile without overflow`, async ({ page }) => {
      await page.goto(route)

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15_000 })
      await expectNoHorizontalOverflow(page)
    })
  }

  test("contact form is accessible on mobile", async ({ page }) => {
    await page.goto("/contact")

    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/^email$/i)).toBeVisible()
    await expect(page.getByLabel(/project details/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /send message/i })).toBeVisible()
    await expectNoHorizontalOverflow(page)
  })

  test("blog article renders readably on mobile", async ({ page }) => {
    await page.goto("/blog/problem-framing")

    await expect(page.getByRole("heading", { level: 1, name: /problem framing/i })).toBeVisible({
      timeout: 15_000,
    })

    const minFontPx = await page.evaluate(() => {
      const article = document.querySelector("article")
      if (!article) return 0
      const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const t = node.textContent?.trim() ?? ""
          return t.length > 40 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        },
      })
      const node = walker.nextNode()
      if (!node?.parentElement) return 0
      const fontSize = window.getComputedStyle(node.parentElement).fontSize
      return Number.parseFloat(fontSize) || 0
    })
    expect(minFontPx).toBeGreaterThanOrEqual(14)

    await expectNoHorizontalOverflow(page)
  })
})
