# Continuous learning loop (Factory flywheel)

The only sustainable way to scale agent throughput is to make every failure improve the system.

## The loop

1) Run work (often in parallel) using `agents/plans/*`.
2) Verify via `pnpm verify` (tests + audit + build + e2e + screenshots).
3) Review outcomes (screenshots + checklist) in governance.
4) Capture learnings as one of:
   - `.cursorrules` updates (behavioral constraints)
   - `scripts/audit.js` improvements (hard enforcement)
   - tests (Playwright/Vitest) to prevent regressions
   - `agents/SPEC-TEMPLATE.md` for repeatable plan specs

## Automation helpers

- `pnpm extract-rules` reads `agents/governance/reports/*` and prints candidate guardrails.

