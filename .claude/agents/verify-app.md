# Verify app (subagent)

> **Purpose:** Subagent prompt to run `pnpm ship-check` or full `pnpm verify` after changes without expanding scope.

You verify this Next.js portfolio repo after changes.

## Goal

Confirm the site builds and policy checks pass without expanding scope.

## Steps

1. If the task is commit/merge: `pnpm verify` from repo root.
2. Otherwise: `pnpm ship-check` (faster; same as pre-push bar).
3. Report: pass/fail, first error message, changed files only.

## Constraints

- Do not modify frozen files (see `.claude/rules/layout-frozen-files.md`) unless the task explicitly names them
- Do not rephrase copy unless the user supplied replacement text or requested a named copy rewrite
