# Worker Agent Completion Report — Template

**How to use:** When you finish your plan's work (before committing anything), copy this template, fill it in, and save it as:
```
agents/governance/reports/PLAN-[XX]-status.md
```
Then notify the governance agent: "Governance review requested for PLAN-[XX]. Report at agents/governance/reports/PLAN-[XX]-status.md"

---

```markdown
# Completion Report — PLAN-[XX]: [Plan Title]
**Date:** [today's date]
**Agent:** Worker Agent for PLAN-[XX]
**Round:** [1 — increment each time you resubmit after revision]
**Status:** READY FOR REVIEW

## What I built
[2-4 sentences summarising what was implemented. Be specific.]

## Files created
- `[path/to/new/file.ts]` — [what it contains]
- `[path/to/new/component.tsx]` — [what it does]

## Files modified
- `[path/to/existing/file.tsx]` — [what changed and why]

## Files NOT touched (intentionally)
- [Any file from the plan you deliberately skipped and why]

## Automated checks I ran
- `pnpm tsc --noEmit`: PASS ✅ | FAIL ❌ — [paste errors if fail]
- `pnpm lint`: PASS ✅ | FAIL ❌ — [paste errors if fail]  
- `node scripts/audit.js`: PASS ✅ | FAIL ❌ — [paste violations if fail]
- `pnpm build`: PASS ✅ | FAIL ❌ — [paste errors if fail]

## Plan acceptance criteria — self-check
[Copy the "Success criteria" section from your plan and mark each:]
- [criterion 1]: PASS ✅ | PARTIAL ⚠️ | FAIL ❌
- [criterion 2]: ...

## Known issues or TODOs left for Charan
[List any placeholder content, TODO comments, or decisions you left for Charan]

## Anything governance should pay attention to
[Flag any unusual decisions you made or areas where you were uncertain]

## Previous review feedback addressed (Round 2+ only)
[If this is a resubmission: list each piece of feedback and how you addressed it]
```
