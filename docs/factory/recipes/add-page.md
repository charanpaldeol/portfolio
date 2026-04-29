# Recipe: Add a new page (App Router)

## 1) Read first

- `agents/plans/_PROJECT_CONTEXT.md` (rules + file map)
- `config/navigation.tsx` (if the page should appear in nav)
- `components/layout/PageShell.tsx` + `components/portfolio/EditorialPageHero.tsx` (canonical structure)

## 2) Create the route

- Add `app/<route>/page.tsx`
- If the page is content-heavy, create `app/<route>/<RouteContent>.tsx` and keep `page.tsx` thin.

## 3) Add metadata

Use `export const metadata` with title + description.

## 4) Wire navigation (if needed)

Update `config/navigation.tsx` using the existing typed link structures.

## 5) Verify

```bash
PLAN_ID=adhoc pnpm verify
```

