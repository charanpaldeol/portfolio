# Recipe: Add a new API route (`app/api/*/route.ts`)

## Non-negotiables

- Import `zod`
- Validate request bodies with `schema.safeParse()`
- Never leak internal errors to the client (generic messages only)

## Skeleton

```ts
import { z } from "zod"

const schema = z.object({
  // ...
})

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 })

    // ...
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}
```

## Verify

```bash
pnpm verify
```

