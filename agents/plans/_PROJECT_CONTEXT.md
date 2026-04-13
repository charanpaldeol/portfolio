# Shared Project Context — Read This First

## What you're working on
This is **cpdeol.com** — the personal portfolio site for **Charan Pal Deol**, a senior product designer and engineer who works at the intersection of product strategy, AI-native delivery, design systems, and engineering. The site is used for both job opportunities and consulting client acquisition.

## Working directory
```
/Users/al/Projects AI/Portfolio/portfolio
```
All file paths in plans are relative to this root.

## Tech stack
- **Framework**: Next.js 15.3, App Router, React 19
- **Language**: TypeScript 5.8, strict mode (`tsconfig.json` has `strict: true`, `noUncheckedIndexedAccess: true`)
- **Styles**: Tailwind CSS v4 — tokens defined as CSS custom properties in `styles/tailwind.css`
- **Package manager**: pnpm
- **Testing**: Vitest (unit), Playwright (e2e)
- **Deployment**: Vercel

## Critical coding rules (enforced by ESLint + pre-commit)

### Colors — NEVER use hex values in .tsx/.ts files
All colors must use design token classes from `styles/tailwind.css`:
- Backgrounds: `bg-surface`, `bg-surface-container-low`, `bg-surface-container`, `bg-primary`, `bg-secondary`, `bg-tertiary`, `bg-inverse-surface`
- Text: `text-on-surface`, `text-on-surface-variant`, `text-primary`, `text-secondary`, `text-tertiary`
- Accents: `bg-primary-fixed`, `bg-secondary-fixed`, `bg-tertiary-fixed`
If you need a color that doesn't exist as a token, add it to `styles/tailwind.css` first (the CSS file may use hex values — only TSX/JSX files cannot).

### Class construction — ALWAYS use `cn()`
```typescript
import { cn } from "@/lib/utils"
// ✅ correct
cn("flex items-center", isActive && "text-primary")
// ❌ wrong — template literals, twMerge(), clsx()
`flex ${isActive ? "text-primary" : ""}`
```

### No 1px borders
Do not use `border`, `border-2`, `divide-*` for layout containment. Use background color shifts instead:
```
✅ bg-surface-container-low on bg-surface background
✅ outline outline-1 outline-outline-variant/15 (ghost border, accessibility fallback only)
❌ border border-gray-200
```

### Component size
Components in `/components/` must be ≤ 300 lines. If your component exceeds this, split into sub-components.

### Data layer
- All data arrays go in `/lib/[feature]-data.ts`
- Components accept props only — they never call `fetch()`, `useQuery()`, etc.
- Define TypeScript interfaces for all data shapes

### EditorialPageHero — canonical hero component
Any page that needs a large editorial hero (eyebrow label + large H1 + gradient span + subtext) MUST use:
```typescript
import { EditorialPageHero } from "@/components/portfolio/EditorialPageHero"
```
Do NOT duplicate this pattern inline. Read the component first to understand its props.

### Server vs Client components
- Default to Server Components (no directive needed)
- Add `"use client"` only when you need: `useState`, `useEffect`, event handlers, browser APIs, Framer Motion animations
- Keep `"use client"` components as leaf nodes — don't make whole pages client components

## Key file locations
```
app/                          ← Next.js App Router pages
components/
  home/                       ← Homepage sections
  layout/                     ← Navbar, Footer, shells
  portfolio/                  ← Editorial hero + shared portfolio components
  ui/                         ← Radix UI primitives
  magicui/                    ← Animation components
lib/
  utils.ts                    ← cn() utility
  projects-data.ts            ← Project case study data
  what-i-bring-cards.ts       ← Service cards + blog article data
  tools-and-methods-data.ts   ← Toolkit data
  proof-metrics-data.ts       ← Metrics data
  home-page-sections.ts       ← Homepage section config
  eslint-rules/               ← Custom ESLint rules (do not modify)
styles/
  tailwind.css                ← Design tokens (CSS custom properties)
docs/
  DESIGN.md                   ← Design system rules
  GOVERNANCE.md               ← Architecture + enforcement rules
  code-architecture-review.md ← Architecture review with grades
config/
  navigation.tsx              ← Typed nav links and social URLs
scripts/
  audit.js                    ← Run: node scripts/audit.js (must exit 0)
```

## Design system palette (reference)
- **Primary** `#00694c` — forest green, trust/expertise, main CTAs
- **Secondary** `#584fbc` — purple, modernity/vision
- **Tertiary** `#755700` — amber, authority/warmth
- **Surface** `#fcf9f5` — warm white editorial canvas
- **On-surface** `#1b1c1a` — near-black body text (NOT pure black)
- **On-surface-variant** `#5c5d59` — secondary text, labels

## Typography scale
- Display: Manrope ExtraBold — large commanding headlines
- Headline: Manrope Bold — section markers
- Body: Inter Regular — readable paragraphs
- Label: Inter SemiBold — chips, metadata, eyebrow text

## Before you finish
Run these checks:
```bash
pnpm tsc --noEmit    # must pass with 0 errors
pnpm lint            # must pass with 0 errors (warnings are OK)
node scripts/audit.js  # must exit 0 (no violations)
```

## Commit format
```bash
git add [specific files only — not git add -A unless you've verified all changes]
git commit -m "$(cat <<'EOF'
feat/fix: [short description]

[optional body]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```
Push to `main` (this repo uses direct-to-main workflow).
