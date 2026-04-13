# PLAN-06: Systems Thinking Visual Artifact

> Read `agents/plans/_PROJECT_CONTEXT.md` first for coding rules, file locations, and tech stack.

## Objective
Add a concrete, visual "systems thinking" artifact to the portfolio. Currently, Charan's pages describe systems thinking in words but there's no *visual proof* — no diagram, no before/after, no design system snapshot. Hiring managers and senior product roles need to see evidence of platform-level, cross-product, ecosystem thinking. This plan adds a dedicated section to the `/how-i-work` page with a visual diagram, and optionally enhances the project detail pages to show systems-level thinking per project.

## What exists today
- **How I Work**: `app/how-i-work/page.tsx` — read to understand current content and layout
- **HowIWork component**: `components/home/HowIWork.tsx` — the 6-phase pipeline + 6 expertise verticals
- **Diagram reference**: `app/internet-owned/diagrams.tsx` — excellent SVG diagram components; study this pattern
- **DiagramFigure wrapper**: first component in `diagrams.tsx` — reuse this pattern
- **Design tokens for SVG**: `styles/tailwind.css` defines `--color-diagram-*` tokens (added recently); use these via `var(--color-*)` in SVG fill/stroke props

## Steps

### Step 1 — Read existing files
Read before writing:
1. `app/how-i-work/page.tsx` + `components/home/HowIWork.tsx` — understand current structure and where to add
2. `app/internet-owned/diagrams.tsx` — study the DiagramFigure wrapper and SVG diagram pattern exactly
3. `styles/tailwind.css` — check `--color-diagram-*` and `--color-primary`, `--color-secondary` tokens
4. `components/portfolio/EditorialPageHero.tsx` — in case hero needs adjustment

### Step 2 — Create the systems diagram component
Create `components/home/SystemsThinkingDiagram.tsx` — an SVG-based diagram showing how design decisions at the component/pattern level ripple up to the product and platform level.

**Diagram concept**: "The Design Leverage Stack" — a 3-layer pyramid/stack showing:
- **Layer 1 (base)**: Design tokens → Components → Patterns (the atomic layer)
- **Layer 2 (middle)**: Features → Flows → Pages (the product layer)
- **Layer 3 (top)**: Cross-product consistency → Platform strategy → Business outcomes (the platform layer)

Arrows/connectors show how decisions in Layer 1 propagate upward and unlock speed at Layer 3.

**Implementation approach** (follow the `diagrams.tsx` pattern exactly):
```typescript
// Use CSS variable aliases like diagrams.tsx
const C = {
  primary: "var(--color-primary)",
  primaryFixed: "var(--color-primary-fixed)",       // ← hyphen, NOT camelCase
  primaryDark: "var(--color-on-primary-fixed)",      // ← hyphen
  secondary: "var(--color-secondary)",
  secondaryFixed: "var(--color-secondary-fixed)",    // ← hyphen
  onSurface: "var(--color-on-surface)",
  onSurfaceVariant: "var(--color-on-surface-variant)",
  surface: "var(--color-surface)",
  containerLow: "var(--color-surface-container-low)",
  containerHighest: "var(--color-surface-container-highest)",
} as const

// CRITICAL: CSS custom property names use hyphens (kebab-case), NEVER camelCase.
// e.g. var(--color-primary-fixed) ✅   var(--color-primaryFixed) ❌
// Cross-reference styles/tailwind.css for all valid token names before using them.
```

The SVG should be:
- `viewBox="0 0 900 400"` or similar wide format
- `role="img"` with descriptive `aria-label`
- Wrapped in the same `DiagramFigure` pattern from `diagrams.tsx` (copy that component or import from a shared location)
- Fully responsive via `className="w-full"`

Layer styling:
- Layer 1 boxes: `fill={C.primaryFixed}` with `stroke={C.primary}`
- Layer 2 boxes: `fill={C.secondaryFixed}` with `stroke={C.secondary}`
- Layer 3 boxes: `fill={C.containerLow}` with `stroke={C.containerHighest}`
- Arrow connectors: `stroke={C.onSurfaceVariant}` with arrow markers
- Text labels: `fill={C.onSurface}` for bold, `fill={C.onSurfaceVariant}` for subtext

Add a figcaption with: "How design decisions at the token level create leverage across the entire product platform"

### Step 3 — Create a "Systems Impact" data section
Create `lib/systems-thinking-data.ts`:

```typescript
export type SystemsExample = {
  id: string
  layer: "token" | "component" | "platform"
  title: string
  description: string     // 1-2 sentences on the decision
  impact: string          // 1 sentence on the downstream effect
}

export const systemsExamples: SystemsExample[] = [
  // Write 4-6 real examples from Charan's perspective:
  // - "Standardizing spacing tokens reduced design-dev negotiation by eliminating 'is this 16px or 18px?' conversations across 12 product surfaces"
  // - "Defining a reusable 'empty state' pattern eliminated 7 divergent implementations across a product suite"
  // - etc.
  // Mark with TODO for Charan to refine with real numbers
]
```

### Step 4 — Add the section to How I Work
In `app/how-i-work/page.tsx` (or the component it renders), add a new section below the existing 6-phase pipeline:

**New section heading**: "Systems Thinking in Practice"  
**Eyebrow label**: "Why token-level decisions matter"

Structure:
1. `SystemsThinkingDiagram` component (the SVG diagram)
2. Below it, a 2-3 column grid of `SystemsExample` cards (short examples from the data)
   - Each card: `layer` chip (colored by layer level) + `title` as H3 + `description` + `impact` in `text-primary font-medium`

### Step 5 — Verify and commit
```bash
pnpm tsc --noEmit
pnpm lint
node scripts/audit.js
```

Commit:
```
feat: add systems thinking visual diagram and examples to how-i-work

- Create components/home/SystemsThinkingDiagram.tsx (SVG Design Leverage Stack)
- Create lib/systems-thinking-data.ts with typed SystemsExample data
- Add "Systems Thinking in Practice" section to how-i-work page
```

## Success criteria
- `/how-i-work` page includes the SVG diagram
- Diagram is responsive (`w-full`) and has a proper `aria-label`
- Systems examples section renders below the diagram
- `pnpm build` passes
- `node scripts/audit.js` exits 0

## Constraints
- All SVG colors via `var(--color-*)` CSS variables — NO hex in TSX
- Follow the exact pattern from `app/internet-owned/diagrams.tsx`
- No 1px borders — tonal shifts only
- Server Component (diagram data is static)
- Keep component files ≤ 300 lines — the diagram SVG can be its own component
