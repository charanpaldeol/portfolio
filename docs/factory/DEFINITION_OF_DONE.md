# Definition of Done (Factory)

For any change intended to be merged:

- `pnpm verify` passes.
- If UI changed: screenshots exist under `agents/governance/screenshots/[PLAN_ID]/desktop` and `.../mobile`.
- Governance checklist items for the plan pass (`agents/governance/REVIEW-CHECKLIST.md`).
- No frozen files were modified unless explicitly allowed by the prompt.
- Factory tooling documentation is updated (`lib/factory-tools.ts` + `/factory`).
- **New user-visible UI** from the factory: default to `lib/feature-flags.ts` + `FF_*` env (ship off, toggle on in prod) **or** the task explicitly waives flags — note which in `definition_of_done` / the completion report. See `docs/factory/FACTORY_MERGE_POLICY.md`.

