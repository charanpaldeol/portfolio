---
name: safe-ship
description: Pre-push discipline for this repo — ship-check, verify on commit, scope, and files that must never be committed. Use when committing or pushing changes.
---

# Safe ship

> **Purpose:** Pre-commit and pre-push checklist — tiered verify, scope, secrets, and frozen files.

## Before push

1. Run `pnpm ship-check` and ensure it passes (`tsc`, `lint`, `audit`, `build` — matches Vercel).
2. Confirm only intended files changed (`git status`, `git diff`).
3. Never commit: `.env`, `.env.local`, `.env*.local`, `.env.factory`, secrets, or `docs/C Deol OH.docx`.

## Before commit (user asked to commit)

1. Run `pnpm verify` and ensure it passes (includes e2e unless `FACTORY_SKIP_E2E=1`).
2. Same scope and secrets checks as above.

Do **not** use `FACTORY_SKIP_E2E` for normal agent commits.

## Commit message

- Use conventional style: `feat:`, `fix:`, `chore:`, `docs:`
- One sentence focusing on **why**, not a file list

## Before push to main

- Ensure branch is up to date with `origin/main` if merging to main

## Scope

- Only change files required for the task; if the prompt names specific files, stay within that list
- Stop and ask if a frozen file must change (see `.claude/rules/layout-frozen-files.md`)
