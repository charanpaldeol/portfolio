# Editorial page hero (canonical UI)

> **Purpose:** Require `EditorialPageHero` for editorial marketing pages so hero markup does not drift across routes.

Read when adding or editing editorial marketing pages (`app/**/*.tsx`, `components/portfolio/**`). See `CLAUDE.md` policy table.

## Source of truth

- Canonical component: `components/portfolio/EditorialPageHero.tsx`
- Default reference route: `/what-i-bring` (`app/what-i-bring/page.tsx`)

## Rule

- Any new page that needs this hero pattern must import and compose `EditorialPageHero`.
- Do not copy/paste hero markup from other routes (e.g. About, Blog, /how-i-work) unless explicitly requested.
