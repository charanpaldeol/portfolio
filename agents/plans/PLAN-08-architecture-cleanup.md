# PLAN-08: Architecture Cleanup — Data Extraction & Token Fixes

> Read `agents/plans/_PROJECT_CONTEXT.md` first for coding rules, file locations, and tech stack.

## Objective
Complete the remaining architecture items that are flagged in `docs/code-architecture-review.md`. These are small but they keep the audit script and CI from being fully clean. This plan is purely about code quality — no new features.

## Specific items to fix

### Item A — Extract HowIWork data arrays to lib
`components/home/HowIWork.tsx` still has `phases` and `expertise` arrays hardcoded inline (lines ~24-95). These must move to `lib/how-i-work-data.ts` per the architecture rule: "No hardcoded data in components — move to /lib/".

### Item B — Verify and fix remaining hardcoded colors
**First, verify these colors still exist** — they may have been fixed already:

```bash
grep -rn "#8a8680\|8a8680" --include="*.tsx" --include="*.ts" .
grep -rn "#0A66C2\|0A66C2\|0a66c2" --include="*.tsx" --include="*.ts" .
```

If grep returns nothing for either color → that item is already done, skip it.

If colors ARE found:
- `#8a8680` → add `--color-shell-mid: #8a8680;` to `styles/tailwind.css` and replace the hex with the token class
- `#0A66C2` → `--color-external-linkedin` already exists in `styles/tailwind.css`; replace the hex with `text-external-linkedin` or `bg-external-linkedin` (check usage context)

### Item C — Add TypeScript `as const` to readonly data arrays
Several data arrays in `/lib/` would benefit from `as const` for better type inference. This is low-risk and improves IDE experience.

## Steps

### Step 1 — Read the files that need changing
Read these in full:
1. `components/home/HowIWork.tsx` — identify the `phases` and `expertise` arrays exactly
2. `components/layout/PortfolioShell.tsx` — find the `#8a8680` usage
3. `components/layout/navbar/SocialLinks.tsx` — find the `#0A66C2` usage
4. `styles/tailwind.css` — understand where to add new tokens
5. `docs/code-architecture-review.md` section 2.2 and 6.2 for full context
6. `lib/tools-and-methods-data.ts` — example of a well-structured lib data file to follow

### Step 2 — Extract HowIWork data
Create `lib/how-i-work-data.ts`:

```typescript
// HowIWork.tsx uses LucideIcon type for icons in both arrays.
// You MUST import LucideIcon and all icon components used in the data.
import type { LucideIcon } from "lucide-react"
// Import the specific icons used in the phases and expertise arrays
// (read HowIWork.tsx first to find which icons are used, then import them here)

export type WorkPhase = {
  // Copy the exact shape from HowIWork.tsx — do not change property names
  // The phases array uses: title, description, Icon, emphasized (at minimum)
  // Read HowIWork.tsx lines 24-62 for the exact shape
  Icon: LucideIcon
  // ... other fields
}

export type ExpertiseArea = {
  // Read HowIWork.tsx lines 63-94 for the exact shape
  Icon: LucideIcon
  // ... other fields
}

export const workPhases: WorkPhase[] = [
  // Copy the array verbatim from HowIWork.tsx
]

export const expertiseAreas: ExpertiseArea[] = [
  // Copy the array verbatim from HowIWork.tsx  
]
```

**Critical:** The icon components (e.g. `Brain`, `Code2`, `Layers` from lucide-react) that are currently imported at the top of `HowIWork.tsx` must also be imported in `how-i-work-data.ts`. After moving the data, remove the icon imports from `HowIWork.tsx` (since the data — and thus icon usage — moves to the lib file), then re-import them in `lib/how-i-work-data.ts`.

Then in `HowIWork.tsx`:
1. Remove the inline arrays
2. Add import: `import { workPhases, expertiseAreas } from "@/lib/how-i-work-data"`
3. Replace inline array references with the imported names
4. Verify the component still works identically — no logic changes, just data source

### Step 3 — Fix hardcoded colors

**For `#8a8680`** (verify the exact file first):
In `styles/tailwind.css`, add to the `@theme` block:
```css
/* PortfolioShell mid-tone text — sits between on-surface and on-surface-variant */
--color-shell-mid: #8a8680;
```
Then in the component, replace `#8a8680` with the appropriate Tailwind class (e.g. `text-shell-mid` or `bg-shell-mid`).

**For `#0A66C2`** (LinkedIn blue):
This token already exists as `--color-external-linkedin: #0a66c2` in `styles/tailwind.css`.
In `SocialLinks.tsx`, replace the hardcoded hex with `text-external-linkedin` or `bg-external-linkedin` (whichever applies — read the usage).

### Step 4 — Add `as const` to lib data files
In these files, add `as const` to readonly data arrays if not already present:
- `lib/projects-data.ts`
- `lib/what-i-bring-cards.ts`
- `lib/tools-and-methods-data.ts`
- `lib/proof-metrics-data.ts`

Pattern:
```typescript
// Before
export const projects: ProjectData[] = [ ... ]

// After — keeps the explicit type annotation for clarity, adds const assertion
export const projects = [ ... ] as const satisfies ProjectData[]
// OR if satisfies causes issues:
export const projects: readonly ProjectData[] = [ ... ]
```

Only apply where TypeScript accepts it cleanly — if any `as const` causes type errors, skip that file and note it.

### Step 5 — Run audit and verify
```bash
node scripts/audit.js   # must exit 0
pnpm tsc --noEmit       # must pass
pnpm lint               # must pass
```

The audit script specifically checks for hardcoded data in components and hardcoded colors. Both should be clean after this plan.

### Step 6 — Commit
```
chore: architecture cleanup — extract HowIWork data and fix hardcoded colors

- Create lib/how-i-work-data.ts with workPhases and expertiseAreas
- Remove inline data arrays from HowIWork.tsx, import from lib
- Add --color-shell-mid token to tailwind.css, replace #8a8680
- Use existing --color-external-linkedin token in SocialLinks.tsx
- Add as const / readonly to lib data arrays where applicable

node scripts/audit.js now exits 0 on all architecture checks.
```

## Success criteria
- `node scripts/audit.js` exits 0 with no violations
- `components/home/HowIWork.tsx` has no inline data arrays
- `lib/how-i-work-data.ts` exists and exports `workPhases` and `expertiseAreas`
- No hex colors remain in `.tsx` files (verified by audit)
- `pnpm build` passes
- Visual appearance of all pages is identical to before (this is data-only cleanup)

## Constraints
- Do NOT change any component logic, layout, or visual design
- Do NOT rename any TypeScript interface properties — breaking changes would affect other agents' plans
- Only move data — never change what the data says
- If `as const` causes a TypeScript error anywhere, skip it for that file (do not fight the type system)
