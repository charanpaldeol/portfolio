# START HERE (Agents)

If you are an autonomous agent working in this repo, start with:

1) `agents/plans/_PROJECT_CONTEXT.md` (rules + file map)\n
2) `agents/governance/REVIEW-CHECKLIST.md` (acceptance criteria)\n
3) One plan brief under `agents/plans/PLAN-*.md`

## Golden paths

- **Run the dev server**: `pnpm agent:start`
- **Verify work**: `pnpm verify`
- **Fast route sanity**: `pnpm e2e:smoke`
- **If UI changed**: `PLAN_ID=PLAN-XX pnpm verify` to generate screenshots for governance.

## Governance handoff

- Write your completion report using `agents/governance/REPORT-TEMPLATE.md`
- Save it to `agents/governance/reports/PLAN-XX-status.md`
- Request governance review. Do not commit unless governance explicitly approves.

