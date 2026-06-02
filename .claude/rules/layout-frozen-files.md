# Frozen files (do not modify unless explicitly named)

> **Purpose:** List layout, design-system, and test paths agents must not edit without explicit user approval.

## Layout (frozen)

- `app/layout.tsx` (RootLayout) — must have exactly ONE `export default`
- `components/layout/GlobalChrome.tsx`
- `components/layout/PortfolioShell.tsx`
- `components/layout/Navbar.tsx`
- `components/layout/Footer.tsx`

## Legacy homepage chrome (avoid unless migrating away)

- `components/home/Navbar.tsx`
- `components/home/Footer.tsx`

## Design system (frozen)

- `design-system.ts`
- `styles/tailwind.css`

## Tests (frozen)

- `playwright.config.ts`
- `vitest.config.ts`
- `vitest.setup.ts`
- `e2e/*`
