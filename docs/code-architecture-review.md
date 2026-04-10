# Code Quality & Architecture Review

**Project:** Next.js 15 Portfolio App
**Date:** April 10, 2026
**Stack:** Next.js 15.3 · React 19 · TypeScript 5.8 · Tailwind CSS 4 · Vercel
**Last updated:** April 10, 2026 — 8 items fixed (see action items table)

---

## Executive Summary

This is a well-structured, modern portfolio site with strong tooling choices — strict TypeScript, Tailwind v4 design tokens, Radix UI for accessibility, and a solid Playwright + Vitest test harness. However, the codebase has meaningful gaps in **security (contact API)**, **test coverage (~3%)**, **CI/CD (no pipeline)**, and **component modularity (several oversized files)**. The architecture follows Next.js conventions well but would benefit from stricter separation of concerns and a few structural refactors.

### Overall Grades

| Area | Grade | Summary |
|------|-------|---------|
| **Security** | ~~C~~ → **B** | ✅ Contact API now uses Zod validation + generic error messages |
| **TypeScript Usage** | B+ | Strict mode on; some missing interfaces on config arrays |
| **Component Architecture** | ~~B~~ → **B+** | ✅ Navbar split; HowIWork styles extracted to CSS Module |
| **Server/Client Boundaries** | ~~B-~~ → **B+** | ✅ Confirmed `"use client"` already present in Navbar.tsx |
| **Accessibility** | B+ | Radix primitives, semantic HTML; missing some aria-labels |
| **Performance** | ~~B~~ → **B+** | ✅ HowIWork 327-line inline styles moved to CSS Module |
| **CSS & Design System** | ~~B~~ → **B+** | ✅ All app code standardized to `cn()`; tokens unchanged |
| **DRY / Code Reuse** | ~~C+~~ → **B** | ✅ Removed duplicate `components/home/Navbar.tsx` and `Footer.tsx` |
| **Testing** | D | Only 1 component tested; 0 API tests; limited E2E |
| **CI/CD & DevOps** | D+ | No GitHub Actions; semantic-release configured but unused |
| **Documentation** | ~~C~~ → **C+** | ✅ `.env.example` created; README still minimal |
| **Dependency Management** | B+ | Renovate configured; some unused Babel packages |

---

## 1. Critical Security Issues

### ✅ 1.1 Contact API — Missing Input Validation — FIXED
**File:** `app/api/contact/route.ts`

~~The contact endpoint uses unsafe type coercion instead of schema validation.~~

**Fixed April 10, 2026:** Replaced all type coercion with a Zod schema:
```typescript
const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  message: z.string().min(1).max(5000),
})
```
Email format is now validated, field lengths are enforced, and `safeParse` returns proper 400 errors for bad input.

### ✅ 1.2 Contact API — Error Message Leakage — FIXED
**File:** `app/api/contact/route.ts`

~~Internal error messages from Resend and JSON parsing were returned directly to the client.~~

**Fixed April 10, 2026:** Both catch blocks now return generic messages ("Failed to send message. Please try again." / "Something went wrong.") while logging the real error server-side only.

### ✅ 1.3 HTML Escaping — Incomplete — FIXED
**File:** `app/api/contact/route.ts`

~~The `escapeHtml()` function omits single-quote escaping (`'` → `&#39;`).~~

**Fixed April 10, 2026:** Added `.replace(/'/g, "&#39;")` to the escapeHtml function.

### 1.4 Environment Validation Gaps
**File:** `env.mjs`

Email environment variables (`RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`) are validated as `z.string().optional()` — no `.email()` check. A typo in the env file would silently break the contact form with no startup error.

---

## 2. Architecture & Component Structure

### 2.1 Strengths
- **Feature-based layout:** Pages live in `app/`, reusable UI in `components/`, data in `lib/` — clean and conventional.
- **Server Components by default:** Only interactive components opt into `"use client"`, keeping the JS bundle lean.
- **Design token system:** `styles/tailwind.css` defines a cohesive Editorial palette with CSS custom properties — professional and maintainable.
- **Radix UI primitives:** Accessibility comes built-in for sheets, dropdowns, navigation menus, and tooltips.

### 2.2 Oversized Components

~~**`components/layout/Navbar.tsx` (391 lines)** — This file handles branding, navigation config (130 lines of link data), desktop menu, mobile sheet, social icons, and inline CSS animations.~~

✅ **Fixed April 10, 2026** — Split into:
- `config/navigation.tsx` — typed `NavLink`/`SimpleNavLink` interfaces, `workLinks`, `ideasLinks`, social URLs
- `components/layout/navbar/BrandMark.tsx` — logo SVG component
- `components/layout/navbar/WorkPanel.tsx` — desktop dropdown with active-state logic
- `components/layout/navbar/SocialLinks.tsx` — GitHub/LinkedIn icons + CTA
- `components/layout/Navbar.tsx` — shell only (~120 lines, down from 391)
- `styles/tailwind.css` — blink cursor animation moved here as `@utility cpdeol-blink-cursor`
- Switched all `twMerge()` calls to `cn()` for consistency

**`components/home/HowIWork.tsx` (540 lines)** — Contains 327 lines of inline `<style jsx>` plus data arrays. Extract to:
- `data/how-i-work.ts` — phases and expertise arrays
- `HowIWork.module.css` — scoped styles
- `HowIWork.tsx` — rendering logic only

### ✅ 2.3 Duplicate Files — FIXED

~~Two pairs of components exist with identical names but different purposes.~~

**Fixed April 10, 2026:** Deleted both unused files:
- ~~`components/home/Navbar.tsx`~~ — removed
- ~~`components/home/Footer.tsx`~~ — removed

`GlobalChrome` correctly imports from `components/layout/` only.

### ✅ 2.4 Missing `"use client"` Directive — ALREADY CORRECT

**Verified April 10, 2026:** `components/layout/Navbar.tsx` already has `'use client'` on line 1. No change needed.

### 2.5 Separation of Concerns

Several components mix data, styling, and rendering:
- **WhatIBring.tsx** — inline SVG icons, card styling config, layout logic, and rendering in one file. Extract icons to a shared `icons.tsx` and config to a data file.
- **ContactContent.tsx** — form state, submission logic, and presentation are coupled. Consider extracting the submission handler into a custom hook (`useContactForm`).
- **ProofMetrics.tsx** — metric data hardcoded at the top of the component. Move to `lib/metrics.ts`.

---

## 3. TypeScript Quality

### 3.1 Strengths
- `tsconfig.json` enables `strict: true` and `noUncheckedIndexedAccess: true` — excellent safety.
- Path aliases (`@/*`) configured correctly.
- Component props are generally well-typed (`PageShell`, `BlogTopicArticle`).

### 3.2 Gaps
- **Missing interfaces on config arrays:** `workLinks` in Navbar, `phases`/`expertise` in HowIWork, and card style maps in WhatIBring lack explicit TypeScript interfaces — they rely on inference, which is less self-documenting and IDE-friendly.
- ~~**`as` type assertion in contact route:** `(await request.json()) as { ... }` bypasses type safety.~~ ✅ Fixed — now uses Zod `safeParse`.
- **No `as const` assertions** on several readonly data arrays that should be immutable.
- **API route uses `Request`** instead of `NextRequest` from `next/server`, missing typed helpers.

---

## 4. Accessibility

### 4.1 Good Practices
- `role="list"` / `role="listitem"` on custom list layouts (HowIWork)
- `aria-hidden="true"` on decorative SVGs and elements
- Semantic `<nav>`, `<main>`, `<footer>` structure
- `htmlFor` on form labels; `role="status"` and `role="alert"` on form feedback (ContactContent)
- Social links have `aria-label` attributes

### 4.2 Gaps
- **WhatIBring cards:** `<Link>` elements lack `aria-label`. Add `aria-label={`Read: ${card.title}`}` for screen readers.
- **ProofMetrics cards:** No heading element — add `<h3 className="sr-only">` for each metric.
- **Home link in Navbar:** The brand logo link should have `aria-label="Home"` rather than relying on visual text alone.
- **Keyboard navigation:** No visible focus indicators tested or documented. Verify Tab order through navbar, cards, and form.

---

## 5. Performance

### 5.1 Good Patterns
- IntersectionObserver for scroll-triggered animations (HowIWork)
- `whileInView` from Framer Motion for lazy animation (ProofMetrics)
- `prefers-reduced-motion` respected in animation styles
- Server Components keep initial JS bundle small

### 5.2 Opportunities
- **327-line inline `<style jsx>` in HowIWork** increases component parse time and can't be cached separately. Extract to a CSS Module.
- **External icon CDN (cdn.simpleicons.org)** in Hero's IconCloud — no preloading or fallback. Consider self-hosting critical icons or adding `<link rel="preconnect">`.
- **No `React.memo` or `useMemo`** on expensive computations. While premature optimization should be avoided, the HowIWork phase rendering with complex styles could benefit.
- **Mobile viewports not tested** in Playwright (commented out in config).

---

## 6. CSS & Design System

### 6.1 Strengths
- Tailwind v4 native CSS `@theme` blocks — no JavaScript config needed
- Well-organized design tokens: editorial color palette, custom shadows, display typography utilities
- Consistent warm-neutral surface hierarchy

### 6.2 Inconsistencies
- **Class construction varies by file:** `cn()` (utils), `.join(" ")` (WhatIBring), `twMerge()` (Navbar), template literals (ContactContent). **Standardize on `cn()` everywhere.**
- **Hardcoded colors persist:** `#8a8680` in PortfolioShell, `#0A66C2` in Navbar social links. Move to theme tokens.
- **Inconsistent border radius:** Cards alternate between `rounded-xl` and `rounded-2xl` with no clear hierarchy. Document the scale.
- **Shadow usage unclear:** Three shadow utilities exist (`shadow-editorial`, `shadow-editorial-float`, `shadow-editorial-lg`) with no documented usage guidelines.

---

## 7. Testing — Major Gap

### 7.1 Current State
| Layer | Files | Coverage |
|-------|-------|----------|
| Unit tests | 1 file (Button) — 3 assertions | ~3% of components |
| E2E tests | 2 files (example + eye-break) | ~10% of pages |
| Storybook stories | 1 file (Button) | ~3% of components |
| API route tests | 0 | 0% |

### 7.2 Quality of Existing Tests
- **Button.test.tsx** tests class names rather than behavior (implementation detail testing). Uses `container.querySelector()` instead of semantic queries from Testing Library.
- **eye-break.spec.ts** is well-written with 5 meaningful interaction tests — this should be the pattern for other pages.
- **No coverage reporter installed** — `@vitest/coverage-v8` is missing from dependencies, so `pnpm test:coverage` won't produce reports.

### 7.3 Recommended Test Priorities
1. **Contact API route** — user input, validation, error handling, Resend integration (mock)
2. **Navbar** — navigation, mobile menu, active states
3. **ContactContent** — form submission, validation feedback, error states
4. **All page routes** — E2E smoke tests ensuring pages render without errors
5. **Accessibility tests** — add `@axe-core/playwright` to E2E suite

---

## 8. CI/CD — Missing Pipeline

### 8.1 Current State
- **No `.github/workflows/` directory exists.** There is no automated pipeline for testing, linting, or deployment.
- `semantic-release` is fully configured in `package.json` but has no triggering workflow.
- Renovate is active for dependency updates but PRs aren't validated by CI.

### 8.2 Recommended Minimum Pipeline
```
.github/workflows/
├── ci.yml          # lint + typecheck + unit tests on every PR
├── e2e.yml         # Playwright tests on every PR (can run in parallel)
└── release.yml     # semantic-release on merge to main
```

Each PR should pass: `pnpm lint && pnpm tsc --noEmit && pnpm test && pnpm build`

---

## 9. Documentation

### 9.1 What Exists
- `.cursorrules` — comprehensive AI development guidelines with architecture diagram and frozen-file list. Excellent.
- `docs/DESIGN.md` — ✅ Added April 10, 2026. Full design system strategy: Editorial Expert north star, color/surface philosophy, typography scale, elevation rules, component guidelines, and do/don'ts.
- `docs/` — directory structure for ADRs, specs, stories, and research (mostly empty placeholders).
- `README.md` — contains only `# portfolio`. Not useful.

### 9.2 What's Missing
- ~~**`.env.example`**~~ ✅ Created April 10, 2026 — documents all three Resend variables with placeholder values and comments.
- **Setup guide** — how to clone, install, and run locally
- **Component documentation** — Storybook is installed but only 1 story exists
- **API documentation** — endpoints, request/response shapes, error codes
- **Contributing guidelines** — for future collaborators

---

## 10. Dependency Health

### 10.1 Good
- All major dependencies are current (Next.js 15.3, React 19, TypeScript 5.8, Playwright 1.52)
- Renovate handles automated updates with sensible grouping
- `pnpm` lockfile for deterministic installs
- Node engine constraint (`>= 20.0.0`)

### 10.2 Concerns
- **7 Babel packages** (`@babel/plugin-*`) — Next.js 15 uses SWC by default. These may be unnecessary unless Storybook requires them. Audit and remove if unused.
- **`patch-package`** — indicates workarounds for dependency bugs. Document what each patch fixes and check if upstream fixes exist.
- **Missing `@vitest/coverage-v8`** — blocks coverage reporting despite `test:coverage` script existing.

---

## Top 10 Action Items (Priority Order)

| # | Status | Action | Impact | Effort |
|---|--------|--------|--------|--------|
| 1 | ✅ Done | ~~Add Zod validation to contact API route~~ | Security fix | Small |
| 2 | ✅ Done | ~~Stop leaking error messages to client~~ | Security fix | Small |
| 3 | ✅ Done | ~~Add `"use client"` to `Navbar.tsx`~~ (already present) | Bug prevention | Trivial |
| 4 | ⬜ Todo | Create GitHub Actions CI pipeline | DevOps foundation | Medium |
| 5 | ⬜ Todo | Add unit tests for contact API + key components | Quality assurance | Medium |
| 6 | ✅ Done | ~~Split Navbar.tsx into sub-components + config~~ | Maintainability | Medium |
| 7 | ✅ Done | ~~Extract HowIWork inline styles to CSS Module~~ | Performance + readability | Small |
| 8 | ✅ Done | ~~Remove duplicate Navbar/Footer files~~ | Clarity | Trivial |
| 9 | ✅ Done | ~~Standardize class construction to `cn()`~~ | Consistency | Small |
| 10 | ✅ Done | ~~Create `.env.example`~~ (README still needs work) | Onboarding | Small |

---

*Review conducted via static analysis of the full codebase. No runtime testing was performed during this review.*
