# Next.js pitfalls (reference)

> **Purpose:** Incident-driven App Router guardrails — dev cache, data loading, RSC boundaries. Imported via `CLAUDE.md`.

## Local dev (`pnpm dev`)

**Symptom:** localhost returns HTML but the site looks unstyled or dead — browser console / terminal shows **`404` on `/_next/static/chunks/*` or `/_next/static/css/*`**.

**Cause:** `pnpm build` (or deleting `.next`) while **`pnpm dev` is still running** leaves the dev server serving HTML that points at chunk URLs that no longer exist.

**Recovery:**

```bash
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
rm -rf .next
pnpm dev
```

**Prevention:** Do not run `pnpm build` while `pnpm dev` is active. After `pnpm build`, restart `pnpm dev`. Smoke-check: a chunk URL from page source returns **200**.

## Server data loading

**Do not** have Server Components or `page.tsx` **HTTP-fetch this app's own Route Handlers** (e.g. `fetch(\`http://${host}/api/weather\`)`). Nested self-requests in dev drop fields, time out, or race.

**Do** put shared loader logic in `lib/*-service.ts` (see `lib/weather-service.ts`) and call it from both the Route Handler and the page. Reserve `fetch('/api/…')` for **client components** and external callers only.

## Server / client boundaries

**Symptom:** **“Application error: a server-side exception has occurred”** — terminal often shows:

```text
Error: Functions are not valid as a child of Client Components.
```

**Cause:** A Server Component passed a **function** to a Client Component (render props, callbacks, non-serializable props).

**Do instead:**

- Keep **`page.tsx` as a Server Component**; interactivity in leaf **`"use client"`** components.
- Pass **serializable props** or **server-rendered slots** (`climateSlot={<ServerChild />}`) — never functions.
- **`useSearchParams()`** must sit inside **`<Suspense>`** (see `WeatherClientShell`, `WeatherSearch`).
- After RSC splits: **`curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/<route>`** must be **200** — `pnpm build` alone does not catch serialization errors.

**Reference:** `WeatherLiveConditions` + `WeatherClimateClient` — not render-prop wrappers from `page.tsx`.

**Client module boundaries:** Never export server-callable helpers from `"use client"` files — shared logic belongs in `lib/`.
