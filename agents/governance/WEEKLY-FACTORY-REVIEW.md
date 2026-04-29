# Weekly Factory Review (Manager Ritual)

Run this once a week (or after a burst of parallel agents) to keep the factory improving instead of drifting.

## 1) Review outcomes (not diffs)

- Scan `agents/governance/reports/` for completed plan reports.
- For any plan that changed UI, open the screenshots under:
  - `agents/governance/screenshots/[PLAN_ID]/desktop/`
  - `agents/governance/screenshots/[PLAN_ID]/mobile/`

## 2) Extract learnings into guardrails

- Run: `pnpm extract-rules`
- Convert high-signal items into one of:
  - `.cursorrules` updates (behavioral constraints)
  - `scripts/audit.js` improvements (hard enforcement)
  - new/updated Playwright tests (verifiable outcomes)

## 3) Choose next work

- Re-rank `backlog.md` (top 3–5 items).
- Decide which work can run in parallel using `agents/PARALLEL-RUNS.md`.

## 4) Run the next batch

- Spawn worker agents with the plan briefs in `agents/plans/`.
- Require `PLAN_ID=PLAN-XX pnpm verify` for any UI change so proof is saved.

