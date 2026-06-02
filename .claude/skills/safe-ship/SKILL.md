---
name: safe-ship
description: Pre-push discipline for this repo — verify, commit scope, and files that must never be committed. Use when committing or pushing changes.
---

# Safe ship

## Before commit

1. Run `pnpm verify` and ensure it passes (full bar — see `CLAUDE.md` → Verify). A partial `tsc`/`lint`/`audit` run is not commit-ready.
2. Confirm only intended files changed (`git status`, `git diff`).
3. Never commit: `.env`, `.env.local`, `.env*.local`, `.env.factory`, secrets, or `docs/C Deol OH.docx`.

## Commit message

- Use conventional style: `feat:`, `fix:`, `chore:`, `docs:`
- One sentence focusing on **why**, not a file list

## Before push

- Ensure branch is up to date with `origin/main` if merging to main

## Scope

- Only change files required for the task; if the prompt names specific files, stay within that list
- Stop and ask if a frozen file must change (see `.claude/rules/layout-frozen-files.md`)
