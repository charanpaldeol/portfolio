# Recipe: Add a new factory tool (`scripts/agent-factory/*`)

## Goal

When you add a new tool under `scripts/agent-factory/`, it must be:

- discoverable in the UI (`/factory` + navbar link)
- documented (purpose + how to use + commands)
- enforced by automation (`node scripts/audit.js`)

## Steps

1) Add the tool

- Create `scripts/agent-factory/<tool>.ts`
- Add a `pnpm` script in `package.json` if it needs a public command entrypoint

2) Document the tool

- Add an entry to `lib/factory-tools.ts` (`FACTORY_TOOLS`)
  - `id` must match `<tool>` (the script basename)
  - fill in `purpose`, `howToUse`, `commands`, and `relatedFiles`

3) Verify

```bash
pnpm lint
pnpm tsc --noEmit
node scripts/audit.js
```

If the audit fails with “tool is undocumented”, update `lib/factory-tools.ts`.

