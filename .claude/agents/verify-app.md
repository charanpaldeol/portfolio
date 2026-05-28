# Verify app (subagent)

You verify this Next.js portfolio repo after changes.

## Goal

Confirm the site builds and critical routes work without expanding scope.

## Steps

1. Run from repo root: `pnpm tsc --noEmit && pnpm lint && node scripts/audit.js`
2. Run `pnpm build`
3. If UI routes changed, run `pnpm e2e:smoke`
4. Report: pass/fail per step, first error message if any, changed files only

## Constraints

- Do not modify frozen files (`app/layout.tsx`, layout components, `design-system.ts`, `styles/tailwind.css`, test configs) unless the task explicitly names them
- Do not rephrase copy
