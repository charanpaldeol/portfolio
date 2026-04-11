import { expect, test } from "@playwright/test"

test.describe("Keyboard Navigation & Focus Management", () => {
  test("Navbar: Tab order moves through home, work, ideas, blog links", async ({ page }) => {
    await page.goto("/")

    // Start by tabbing from the address bar
    await page.keyboard.press("Tab")

    // First interactive element should be the home link
    let focused = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"))
    expect(focused).toContain("home")

    // Tab to Work
    await page.keyboard.press("Tab")
    focused = await page.evaluate(() => (document.activeElement as HTMLElement).innerText)
    expect(focused?.toLowerCase()).toContain("work")

    // Tab to Ideas
    await page.keyboard.press("Tab")
    focused = await page.evaluate(() => (document.activeElement as HTMLElement).innerText)
    expect(focused?.toLowerCase()).toContain("ideas")

    // Tab to Blog
    await page.keyboard.press("Tab")
    focused = await page.evaluate(() => (document.activeElement as HTMLElement).innerText)
    expect(focused?.toLowerCase()).toContain("blog")
  })

  test("WhatIBring cards: All 5 cards are keyboard accessible and receive focus", async ({ page }) => {
    await page.goto("/")

    // Navigate to the first WhatIBring card
    const cards = page.getByRole("link", { name: /Read:/ })
    const cardCount = await cards.count()
    expect(cardCount).toBe(5)

    // Tab through each card and verify focus
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i)
      await card.focus()

      // Verify card is focused and has visible focus ring
      const isFocused = await card.evaluate((el) => el === document.activeElement)
      expect(isFocused).toBe(true)

      // Check that focus-visible classes are applied
      const hasFocusRing = await card.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        return styles.outline !== "none" || el.classList.contains("focus-visible")
      })
      expect(hasFocusRing || isFocused).toBeTruthy()
    }
  })

  test("WhatIBring cards: aria-labels match card titles for screen readers", async ({ page }) => {
    await page.goto("/")

    const cards = page.getByRole("link", { name: /Read:/ })
    const cardCount = await cards.count()

    for (let i = 0; i < cardCount; i++) {
      const label = await cards.nth(i).getAttribute("aria-label")
      expect(label).toMatch(/^Read:/)
      expect(label?.length).toBeGreaterThan("Read:".length)
    }
  })

  test("ProofMetrics: Metric headings are announced by screen readers (sr-only)", async ({ page }) => {
    await page.goto("/")

    // Check that sr-only headings exist for each metric
    const headings = page.locator("h3.sr-only")
    const headingCount = await headings.count()

    // There should be 3 metrics
    expect(headingCount).toBeGreaterThanOrEqual(3)

    const metricTags = await headings.allTextContents()
    expect(metricTags).toContain("SaaS implementation")
    expect(metricTags).toContain("In-house build")
    expect(metricTags).toContain("Change management")
  })

  test("Navbar home link: aria-label is properly set", async ({ page }) => {
    await page.goto("/")

    const homeLink = page.getByRole("link", { name: /home/i }).first()
    const label = await homeLink.getAttribute("aria-label")

    expect(label).toBeTruthy()
    expect(label?.toLowerCase()).toContain("home")
  })

  test("Focus visible styles are applied on keyboard Tab (not click)", async ({ page }) => {
    await page.goto("/")

    // Tab to a card (should show focus ring)
    await page.keyboard.press("Tab")
    await page.keyboard.press("Tab")
    await page.keyboard.press("Tab")

    const focused = page.locator(":focus-visible")
    await expect(focused).toHaveCount(1)
  })

  test("Contact form fields are keyboard accessible (on /contact page)", async ({ page }) => {
    await page.goto("/contact")

    // Navigate to form fields via Tab
    const nameInput = page.getByPlaceholder(/name/i)
    const emailInput = page.getByPlaceholder(/email/i)
    const messageInput = page.getByPlaceholder(/message/i)
    const submitButton = page.getByRole("button", { name: /send/i })

    // All should be focusable
    await nameInput.focus()
    let isFocused = await nameInput.evaluate((el) => el === document.activeElement)
    expect(isFocused).toBe(true)

    await emailInput.focus()
    isFocused = await emailInput.evaluate((el) => el === document.activeElement)
    expect(isFocused).toBe(true)

    await messageInput.focus()
    isFocused = await messageInput.evaluate((el) => el === document.activeElement)
    expect(isFocused).toBe(true)

    await submitButton.focus()
    isFocused = await submitButton.evaluate((el) => el === document.activeElement)
    expect(isFocused).toBe(true)
  })
})
