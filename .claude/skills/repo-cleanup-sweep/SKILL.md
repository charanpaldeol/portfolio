---
name: repo-cleanup-sweep
description: Find and remove stale references, align docs with .claude/ layout, and run cleanup scripts. Use during repo hygiene.
---

# Repo cleanup sweep

> **Purpose:** Hygiene pass for stale paths, `.claude/` layout, and safe cleanup scripts.

## When to use

- After removing legacy tooling or routes
- When README or scripts reference missing paths
- Before standardizing agent setup

## Checklist

1. Search for dead references:

   ```bash
   rg "agents/|factory-tools|/factory" --glob '!node_modules' --glob '!.next'
   ```

2. Confirm Claude layout exists:

   - `.claude/rules/` — project rules
   - `.claude/skills/` — task skills (`SKILL.md` per folder)
   - `.claude/agents/` — subagent prompts
   - `.claude/hooks/` — optional shell scripts
   - `CLAUDE.md` — always-on project context

3. Remove local generated artifacts (safe):

   ```bash
   pnpm clean
   ```

4. Update docs if paths moved:

   - `README.md` — agent entrypoints and verify commands
   - `docs/GOVERNANCE.md`
   - `scripts/extract-rules.mjs` — reports under `docs/governance/reports/`

5. When touching any file, add or update its purpose header per `project-standards.md` § File purpose.

## Do not

- Edit frozen layout or design-system files without explicit approval
- Reintroduce root `agents/` unless the user requests it
