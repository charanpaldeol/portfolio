# Project Governance

**Principle:** Every page and feature must be buildable by AI agents autonomously.  
**Enforcement:** Rules are enforced by code, not documentation. See "How It's Enforced" for each rule.

---

## Standards Sources

| Source | What It Covers |
|--------|---------------|
| `docs/DESIGN.md` | Editorial Expert design system — colors, typography, surfaces, components |
| `docs/code-architecture-review.md` | Architecture grades, component structure, security, testing, CI/CD |
| `components/portfolio/EditorialPageHero.tsx` | **Canonical editorial page hero** — rule, eyebrow, H1, gradient span, body (see § Editorial page hero below) |
| This file | How the above standards are enforced + AI-agent development rules |

---

## Editorial page hero (canonical UI)

**Problem this prevents:** Multiple “editorial” heroes drifted because agents copied one route (e.g. `/how-i-work`) while another route (`/what-i-bring`) was the intended visual reference.

**Source of truth**

| Artifact | Role |
|----------|------|
| `components/portfolio/EditorialPageHero.tsx` | **Single implementation** — typography, `h-[1px] w-12` rule, eyebrow caps, `text-5xl md:text-7xl` title (no extra `font-display` on the H1 unless explicitly changed here), `font-light` body, motion timings. |
| `app/what-i-bring/page.tsx` | **Proof page** — `Hero` must compose only `EditorialPageHero` so the live route and the component cannot diverge. |

**Rules (AI + humans)**

| Rule | Enforcement |
|------|-------------|
| **Any new page** that needs this large editorial hero (rule + eyebrow + gradient headline + subcopy) **must use `EditorialPageHero`**. Do not paste a duplicate `<header>` + `motion.*` block. | PR review |
| **Do not** treat `/how-i-work`, About, Blog, etc. as the default hero reference **unless the task explicitly names that page.** For “match the site editorial hero,” default to **`EditorialPageHero` / `/what-i-bring`**. | PR review |
| **To change hero styling**, edit **`EditorialPageHero.tsx`**, then **`grep` all imports** (`EditorialPageHero`) and visually verify each route (services, projects, project detail, how-i-work, what-i-bring). | PR review |

**Automated check:** `node scripts/audit.js` (mode `all`) runs **`auditEditorialHero`**: any `app/**/*.tsx` that contains `<header` + `text-5xl` + `text-editorial-gradient` but **not** `EditorialPageHero` fails the audit. Run `node scripts/audit.js hero` to execute only this rule.

**Call sites (keep in sync when the component changes):** `app/portfolio/services/ServicesContent.tsx`, `app/portfolio/projects/PortfolioProjectsContent.tsx`, `app/portfolio/projects/[slug]/ProjectDetailContent.tsx`, `app/how-i-work/page.tsx`, `app/what-i-bring/page.tsx`, plus blog, contact, projects index, tools-and-methods, how-i-think, about, experience — all must import `EditorialPageHero` for that pattern.

---

## Rules & Enforcement

### Design Rules (from docs/DESIGN.md)

| Rule | Enforcement | Blocked At |
|------|-------------|------------|
| **No hardcoded hex colors** — use design tokens only | ESLint `no-hardcoded-colors` + `scripts/audit.js design` | Pre-commit + CI |
| **No 1px borders** — use surface-container color shifts | ESLint `no-1px-borders` + `scripts/audit.js design` | Pre-commit + CI |
| **Only cn() for class construction** — no twMerge/clsx/literals | ESLint `enforce-cn-utility` + `scripts/audit.js design` | Pre-commit + CI |
| Typography follows Editorial Expert scale | Manual review | PR review |
| Ambient shadows: 40-60px blur, 4-8% opacity | Manual review | PR review |

### Architecture Rules (from docs/code-architecture-review.md)

| Rule | Enforcement | Blocked At |
|------|-------------|------------|
| **Components ≤ 300 lines** — split if larger | ESLint `component-size-limit` + `scripts/audit.js arch` | Pre-commit + CI |
| **Components accept props, never fetch** | ESLint `no-fetch-in-components` | Pre-commit + CI |
| **API routes must use Zod validation** | ESLint `api-routes-require-zod` + `scripts/audit.js arch` | Pre-commit + CI |
| **No hardcoded data in components** — move to /lib/ | `scripts/audit.js arch` | Pre-commit + CI |
| TypeScript strict mode, no `any` types | `tsc --noEmit` | Pre-commit + CI |
| Server Components by default; `"use client"` only when interactive | Manual review | PR review |

### AI-Agent Development Rules

| Rule | Enforcement | Blocked At |
|------|-------------|------------|
| **Data centralized** in `/lib/[feature]-data.ts` | `scripts/audit.js arch` (hardcoded data check) | Pre-commit + CI |
| **TypeScript interfaces** for all data + props | `tsc --noEmit --strict` | Pre-commit + CI |
| **Props-based components** | ESLint `no-fetch-in-components` | Pre-commit + CI |
| **Predictable file structure** — pages in /app, data in /lib, components in /components | Manual review | PR review |
| **File comments** explain purpose | Manual review | PR review |
| **Editorial page hero** — use `EditorialPageHero`; default visual reference is `/what-i-bring` (see § Editorial page hero) | `scripts/audit.js` (`hero` / `all`) + PR review | Pre-commit + CI |

---

## Enforcement Stack

### Layer 1: Pre-Commit (.husky/pre-commit)
Runs automatically on `git commit`:
1. `tsc --noEmit` — TypeScript strict check
2. `lint-staged` — ESLint + Prettier on changed files
3. `node scripts/audit.js` — Design + architecture compliance

If anything fails → **commit blocked**.

### Layer 2: ESLint Rules (lib/eslint-rules/)
Six custom rules that reference specific sections of design.md and code-architecture-review.md:

| Rule File | What It Catches | Standard |
|-----------|----------------|----------|
| `no-hardcoded-colors.js` | Hex literals (#rrggbb) | DESIGN.md § 2 |
| `no-1px-borders.js` | Border classes + inline borders | DESIGN.md § 2 No-Line Rule |
| `enforce-cn-utility.js` | twMerge(), clsx(), template className | code-arch § 6.2 |
| `component-size-limit.js` | Files > 300 lines in /components/ | code-arch § 2.2 |
| `no-fetch-in-components.js` | fetch/axios/useQuery in /components/ | code-arch § 2.5 |
| `api-routes-require-zod.js` | Missing Zod import in /app/api/ routes | code-arch § 1.1 |

### Layer 3: Audit Script (scripts/audit.js)
Scans the full codebase for violations beyond what ESLint catches:
```bash
node scripts/audit.js          # all audits (design + arch + editorial hero)
node scripts/audit.js design   # design only
node scripts/audit.js arch     # architecture only
node scripts/audit.js hero     # editorial hero duplicate detection only
```
Exit code 1 if violations found → blocks CI.

### Layer 4: CI/CD (GitHub Actions)
Add to `.github/workflows/ci.yml`:
```yaml
- name: Audit compliance
  run: node scripts/audit.js
```
Combined with branch protection → **PRs cannot merge with violations**.

---

## How to Add a New Feature (AI Agent Workflow)

**Pattern:** Data → Page → Component → Validate

```
1. Create /lib/[feature]-data.ts
   - Define TypeScript interface
   - Export data array

2. Create /app/[route]/page.tsx
   - Import data from /lib
   - Pass to components as props
   - If the page needs the canonical editorial hero → import EditorialPageHero from
     @/components/portfolio/EditorialPageHero (see § Editorial page hero)

3. Create /components/[Feature].tsx (if reusable)
   - Accept data as props
   - Use cn() for classes
   - Use design tokens for colors

4. Validate
   - pnpm tsc --noEmit        (types)
   - pnpm lint                 (ESLint rules)
   - node scripts/audit.js     (design + arch)
```

---

## Quick Checklist (Before Every Commit)

```
[ ] No hex colors (use design tokens)
[ ] No 1px borders (use surface shifts)
[ ] cn() for all class construction
[ ] Components ≤ 300 lines
[ ] Components don't fetch data
[ ] API routes use Zod
[ ] Data lives in /lib/, not in components
[ ] TypeScript passes (no any)
[ ] node scripts/audit.js passes
[ ] If the task adds or changes a **large editorial hero**, it uses `EditorialPageHero` and matches the § Editorial page hero rules (do not copy a different route’s hero as the template unless the prompt names it)
```

---

## Agent factory — merge policy and preflight

Autonomous **`pnpm factory:run-once`** / **`factory:loop`** workers use documented env for merge vs PR, money-moving defaults, optional post-merge deploy smoke, and preflight checks. **New user-visible** factory work should default to **`lib/feature-flags.ts`** + **`FF_*`** unless the task waives flags.

| Doc | Purpose |
|-----|---------|
| **`docs/factory/FACTORY_MERGE_POLICY.md`** | `FACTORY_MERGE_STRATEGY`, `FACTORY_MONEY_MOVING_PROD`, PR vs direct, UAT env, **`FF_*`** norm for shipped UI |
| **`docs/factory/FACTORY_VERIFY_GATE.md`** | `pnpm verify` in the worktree + preflight pointer |
| **`pnpm factory:preflight`** | Fail-fast worker checks (also run at the start of each `factory:run-once`) |

---

## File Map

```
docs/
├── DESIGN.md                    ← Design standards (source of truth)
├── code-architecture-review.md  ← Architecture standards (source of truth)
└── GOVERNANCE.md                ← THIS FILE: enforcement + AI-agent rules

lib/eslint-rules/                ← Real ESLint rules that block commits
├── index.js
├── no-hardcoded-colors.js       (DESIGN.md § 2)
├── no-1px-borders.js            (DESIGN.md § 2 No-Line Rule)
├── enforce-cn-utility.js        (code-arch § 6.2)
├── component-size-limit.js      (code-arch § 2.2)
├── no-fetch-in-components.js    (code-arch § 2.5)
└── api-routes-require-zod.js    (code-arch § 1.1)

scripts/
└── audit.js                     ← Codebase-wide compliance scanner

.husky/
└── pre-commit                   ← Runs tsc + lint + audit on every commit

lib/
└── projects-data.ts             ← Example: centralized data (single source of truth)

components/portfolio/
└── EditorialPageHero.tsx        ← Canonical editorial page hero (see § Editorial page hero)
```

---

## When Rules Change

1. Update the source standard (`DESIGN.md` or `code-architecture-review.md`)
2. Update the enforcement code (`lib/eslint-rules/` or `scripts/audit.js`)
3. Update this file's table (one line)
4. Done — **3 places max, all co-located in docs/ and lib/**

**Exception — editorial page hero:** If only the marketing hero block changes, update `components/portfolio/EditorialPageHero.tsx` (and this file’s § Editorial page hero if the *process* changes). Automated duplicate detection is in `scripts/audit.js` (`auditEditorialHero`); ESLint has no equivalent rule.

---

*Last updated: 2026-04-11*
