# Editorial page hero (canonical UI)

Always apply (imported via `CLAUDE.md`). Especially when editing `app/**/*.tsx` or `components/portfolio/**/*.tsx`.

## Source of truth

- Canonical component: `components/portfolio/EditorialPageHero.tsx`
- Default reference route: `/what-i-bring` (`app/what-i-bring/page.tsx`)

## Rule

- Any new page that needs this hero pattern must import and compose `EditorialPageHero`.
- Do not copy/paste hero markup from other routes (e.g. About, Blog, /how-i-work) unless explicitly requested.
