# Recipe: Add a new content/data module (`/lib/` + component)

## Rule of thumb

- Data arrays live in `lib/<feature>-data.ts`
- Components accept props; they do not fetch
- Types/interfaces are exported with the data

## 1) Create the lib file

- `lib/<feature>-data.ts`
- Export:
  - the TypeScript types
  - the data arrays

## 2) Consume from a component

- Server Component by default
- If client behavior is required, isolate `"use client"` to the smallest leaf component.

## 3) Verify and produce proof

```bash
PLAN_ID=adhoc pnpm verify
```

