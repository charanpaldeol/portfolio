# PLAN-09: Mobile Audit & Performance Fixes

> Read `agents/plans/_PROJECT_CONTEXT.md` first for coding rules, file locations, and tech stack.

## Objective
The market research found that 60%+ of portfolio views happen on mobile, and Playwright mobile tests are currently commented out. This plan: enables mobile Playwright tests, adds a `<link rel="preconnect">` hint for the external icon CDN, fixes any layout issues found during mobile testing, and improves Core Web Vitals signals.

## What exists today
- **Playwright config**: `playwright.config.ts` — mobile projects are commented out
- **Existing e2e tests**: `e2e/` directory — read to understand test patterns
- **Hero component**: `components/home/Hero.tsx` — uses `cdn.simpleicons.org` with no preconnect
- **Root layout**: `app/layout.tsx` — where `<head>` additions go
- **Eye-break e2e**: `e2e/eye-break.spec.ts` — well-written; use as the test pattern reference

## Steps

### Step 1 — Read existing files
Read before writing:
1. `playwright.config.ts` — understand the full config, find the commented mobile projects
2. `e2e/eye-break.spec.ts` — study the test writing pattern
3. `e2e/accessibility.spec.ts` — study accessibility test patterns
4. `components/home/Hero.tsx` — find the simpleicons CDN usage
5. `app/layout.tsx` — understand the current `<head>` setup

### Step 2 — Enable mobile Playwright projects
In `playwright.config.ts`, uncomment (or add) mobile viewport projects. Standard setup:

```typescript
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  // ... existing config ...
  projects: [
    // existing desktop projects (keep as-is)
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    
    // Mobile — ADD THESE
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",  
      use: { ...devices["iPhone 12"] },
    },
  ],
})
```

### Step 3 — Write mobile-specific e2e tests
Create `e2e/mobile.spec.ts`:

Test these critical mobile scenarios:

```typescript
// 1. Home page renders and scrolls on mobile
test("home page loads on mobile", async ({ page }) => {
  await page.goto("/")
  // Check hero is visible
  // Check navbar hamburger menu is present (not desktop nav)
  // Check no horizontal overflow (scrollWidth === clientWidth)
})

// 2. Mobile nav opens and closes
test("mobile navigation works", async ({ page }) => {
  await page.goto("/")
  // Open mobile menu (find the sheet/hamburger trigger)
  // Verify navigation links are visible
  // Close the menu
  // Verify menu is closed
})

// 3. Key editorial pages render correctly on mobile
test.each(["/what-i-bring", "/how-i-work", "/portfolio/projects"])(
  "%s renders on mobile without overflow",
  async ({ page }, route) => {
    await page.goto(route)
    // Check page renders
    // Check no horizontal scroll
    // Check headings are visible
  }
)

// 4. Contact form is usable on mobile
test("contact form is accessible on mobile", async ({ page }) => {
  await page.goto("/contact")
  // All form fields are visible and tappable
  // Labels are associated with inputs
})

// 5. Blog article readable on mobile
test("blog article renders on mobile", async ({ page }) => {
  await page.goto("/blog/problem-framing")
  // Article content is visible
  // No text overflow
  // Font size is readable (not too small)
})
```

For the horizontal overflow check, use this utility:
```typescript
const hasHorizontalScroll = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth
)
expect(hasHorizontalScroll).toBe(false)
```

### Step 4 — Fix any failures found
Run the tests against the dev server:
```bash
pnpm dev &  # start dev server
npx playwright test --project="Mobile Chrome" e2e/mobile.spec.ts
```

If tests fail due to actual layout issues (not test setup issues), fix the layout:

**Common mobile issues to check and fix**:

1. **Horizontal overflow** — usually caused by SVG viewBox wider than screen. Fix: add `overflow-x-hidden` to the problematic container, or ensure SVGs have `max-w-full` and `className="w-full"`.

2. **Navigation** — check the mobile Navbar sheet. If hamburger menu is hidden or overlapping, fix the z-index or positioning.

3. **Long-form editorial** (internet-owned page) — the sidebar nav might overlap content on small screens. Verify it hides on mobile (it should be `hidden lg:block` or similar).

4. **Typography overflow** — check that large display text (`text-5xl`, `text-7xl`) doesn't cause horizontal scroll on 375px screens. Add `break-words` or reduce size with responsive prefix if needed.

5. **Card grids** — verify 3-column grids collapse to 1-column on mobile properly.

When fixing, keep changes minimal and targeted. Do not redesign — fix overflow/visibility only.

### Step 5 — Add preconnect for simpleicons CDN
In `app/layout.tsx`, add a `<link rel="preconnect">` hint in the `<head>`:

```typescript
// In the <head> section of the root layout
<link rel="preconnect" href="https://cdn.simpleicons.org" />
```

Also check if there are other external origins used (fonts, CDNs) and add `preconnect` for any that don't already have one.

### Step 6 — Check image optimization
In `Hero.tsx` or wherever images appear, verify:
- `next/image` is used for all `<img>` tags (it handles lazy loading, WebP, responsive sizing)
- Images have explicit `width` and `height` or `fill` prop (prevents layout shift = CLS)
- Priority images (above the fold) have `priority` prop

If any `<img>` tags exist that should be `<Image>` from `next/image`, convert them.

### Step 7 — Verify and commit
```bash
pnpm tsc --noEmit
pnpm lint
npx playwright test e2e/mobile.spec.ts  # these should pass
```

Commit:
```
fix: enable mobile Playwright tests and fix mobile layout issues

- Enable Pixel 5 and iPhone 12 Playwright projects in playwright.config.ts
- Add e2e/mobile.spec.ts with 5 mobile test scenarios
- Fix [list any specific layout fixes you made]
- Add preconnect hint for cdn.simpleicons.org in root layout
```

## Success criteria
- `playwright.config.ts` has mobile projects enabled
- `e2e/mobile.spec.ts` exists with 5+ tests
- Mobile tests pass (no horizontal overflow, nav works, pages render)
- `preconnect` hint added for simpleicons CDN
- `pnpm build` passes
- `node scripts/audit.js` exits 0

## Constraints
- Do NOT redesign anything — fix layout issues only
- Do NOT add new pages or features
- Only add `priority` to images that are genuinely above the fold (Hero)
- Keep test code clean — follow the patterns in `e2e/eye-break.spec.ts`
- Test assertions should test behavior, not implementation details (use `getByRole`, `getByText` — avoid `querySelector`)
