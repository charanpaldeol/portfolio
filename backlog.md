# Backlog — cpdeol.com

**Factory:** Running a **verification goal** (calculator + weather + navbar). Source of truth: **`agents/FACTORY_GOAL.md`** and **`agents/factory-roadmap.json`**.

## Factory research intake

Optional follow-ups for the factory: use the format in **`agents/FACTORY-RESEARCH-AGENT.md`** (`### ID — title`, `- Priority:`, optional `- Command:`). **`pnpm factory:loop`** (when the queue is below the low watermark) runs optional **`FACTORY_RESEARCH_HOOK`** → **`factory:research:calc-weather-once`** (code signals) → **`factory:backlog:intake`** → **`factory:plan-next`**. Disable the built-in signals with **`FACTORY_RESEARCH_CALC_WEATHER=0`**.

### FACTORY_R_CALC_ROUTE_METADATA_V1 — Calculator: route metadata (title/description) for /calculator
- Priority: 620
- Command: pnpm -s factory:implement FACTORY_R_CALC_ROUTE_METADATA_V1
- Notes: Research signal — page is client-only; add `app/calculator/layout.tsx` with `export const metadata` (tokens only).

### FACTORY_R_CALC_KEYBOARD_A11Y_V1 — Calculator: keyboard support and visible focus for controls
- Priority: 580
- Command: pnpm -s factory:implement FACTORY_R_CALC_KEYBOARD_A11Y_V1
- Notes: Research signal — add digits/operators via keyboard where reasonable (DS tokens, a11y).

### FACTORY_R_WEATHER_API_LOCATION_V1 — Weather API: accept location (lat/lon or city) instead of fixed coordinates
- Priority: 640
- Command: pnpm -s factory:implement FACTORY_R_WEATHER_API_LOCATION_V1
- Notes: Research signal — Open-Meteo URL uses fixed NYC coordinates; wire optional query params with safe defaults.

### FACTORY_R_WEATHER_ERROR_STATE_V1 — Weather page: user-visible error when /api/weather fails or returns an error field
- Priority: 570
- Command: pnpm -s factory:implement FACTORY_R_WEATHER_ERROR_STATE_V1
- Notes: Research signal — branch on `{ error: ... }` from `loadWeatherJson` with clear error UI (DS tokens).

### FACTORY_VERIFY_CALCULATOR_V1 — Verification: calculator page at /calculator
- Priority: 1000
- Command: pnpm -s factory:implement FACTORY_VERIFY_CALCULATOR_V1
- Notes: goal-spec fallback (no cloud LLM API key; install Ollama or set keys for richer proposals)

### FACTORY_VERIFY_WEATHER_V1 — Verification: weather API + /weather page
- Priority: 990
- Command: pnpm -s factory:implement FACTORY_VERIFY_WEATHER_V1
- Notes: goal-spec fallback (no cloud LLM API key; install Ollama or set keys for richer proposals)

### FACTORY_VERIFY_NAVBAR_V1 — Verification: Calculator and Weather in Navbar
- Priority: 980
- Command: pnpm -s factory:implement FACTORY_VERIFY_NAVBAR_V1
- Notes: goal-spec fallback (no cloud LLM API key; install Ollama or set keys for richer proposals)

### FACTORY_VERIFY_CALCULATOR_V2 — Fix calculator page at /calculator
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_VERIFY_CALCULATOR_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_R_WEATHER_API_LOCATION_V2 — Wire optional query params with safe defaults for Open-Meteo URL
- Priority: 820
- Command: pnpm -s factory:implement FACTORY_R_WEATHER_API_LOCATION_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_WEATHER_V2 — Fix weather API + /weather page
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_VERIFY_WEATHER_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_CALCULATOR_V3 — Fix calculator page at /calculator
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_VERIFY_CALCULATOR_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_R_WEATHER_API_LOCATION_V3 — Wire optional query params with safe defaults for Open-Meteo URL
- Priority: 820
- Command: pnpm -s factory:implement FACTORY_R_WEATHER_API_LOCATION_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_CALCULATOR_V4 — Fix calculator page at /calculator
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_VERIFY_CALCULATOR_V4
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_CALCULATOR_V5 — Fix calculator page at /calculator
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_VERIFY_CALCULATOR_V5
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_CALCULATOR_V6 — Fix calculator page at /calculator
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_VERIFY_CALCULATOR_V6
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_CALCULATOR_V7 — Fix calculator page at /calculator
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_VERIFY_CALCULATOR_V7
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_CALCULATOR_V8 — Fix calculator page at /calculator
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_VERIFY_CALCULATOR_V8
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_CALCULATOR_V9 — Fix calculator page at /calculator
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_VERIFY_CALCULATOR_V9
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_CALCULATOR_V10 — Fix calculator page at /calculator
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_VERIFY_CALCULATOR_V10
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_CALCULATOR_V11 — Fix calculator page at /calculator
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_VERIFY_CALCULATOR_V11
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_CALCULATOR_V12 — Fix calculator page at /calculator
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_VERIFY_CALCULATOR_V12
- Notes: LLM research (remediation (goal evaluation + repo signals))

## Manual / later

### Planner inputs
- **Roadmap**: `agents/factory-roadmap.json` (curated, deterministic list of tasks)
- **Queue**: `agents/factory-queue.json`
- **Runs**: `agents/factory-runs.json`
- **Notes**: `backlog.md` is read by `factory:plan-next` for deterministic “repo state” (no LLM calls)

### Troubleshooting
- **Run logs**: `agents/factory-logs/<run_id>.log`
- **If a task/run is stale**: run `pnpm factory:reclaim`. Configure thresholds with:
  - `FACTORY_STALE_CLAIM_MS` (default 15m)
  - `FACTORY_STALE_RUN_MS` (default 60m)


### Factory dashboard (EvidencePack app)
- [ ] Seed the data files (checked into repo):
  - [ ] `agents/factory-queue.json`
  - [ ] `agents/factory-runs.json`
- [ ] Use the protected UI at `/evidencepack/app/factory` to:
  - [ ] Add tasks, set `in_progress`, mark `done`
  - [ ] Append a run log entry (minimal fields)
- [ ] If you need direct API access (requires EvidencePack auth + access):
  - [ ] `GET /api/evidencepack/factory/state?limitRuns=25`
  - [ ] `POST /api/evidencepack/factory/tasks` (title, priority, spec)
  - [ ] `PATCH /api/evidencepack/factory/tasks/:id/status` (status)
  - [ ] `POST /api/evidencepack/factory/runs` (item_id, branch, worktree_path, status, ...)

### Swarm runner (multi-worker)
- [ ] Start a local swarm (N workers):
  - [ ] `FACTORY_WORKERS=5 pnpm -s factory:swarm`
  - [ ] Optional tuning: `FACTORY_INTERVAL_MS=60000`, `FACTORY_QUEUE_LOW_WATERMARK=20`, `FACTORY_QUEUE_TARGET_SIZE=100`
- [ ] Confirm worker heartbeats appear:
  - [ ] Files written to `agents/factory-logs/heartbeats/<worker_id>.json`
  - [ ] Dashboard shows a “Workers” panel; stale if heartbeat is older than ~15s
- [ ] Concurrency safety notes:
  - [ ] Queue claims use `claimed_by` + `claimed_at` and an on-disk lock file (`agents/factory-queue.json.lock`)
  - [ ] Runs writes are guarded by `agents/factory-runs.json.lock`
  - [ ] If a process dies mid-write, locks auto-break after ~30s (stale lock TTL)


## EvidencePack — build roadmap expansions

### EP_REVENUE_PRICING_PAGE_V1 — Revenue loop: pricing page v1 (EvidencePack)

- Priority: 1000
- Added: 2026-04-29T20:44:29.507Z

**Definition of done**
- [ ] Pricing page exists with one clear plan and CTA into EvidencePack
- [ ] CTA leads to login/signup entrypoint
- [ ] No placeholder links or dead ends

**Implementation notes**
- [ ] (Agent) Break into smaller PR-sized tasks
- [ ] (Agent) Identify required env vars / manual setup and record here

### EVIDENCEPACK_R19_REVENUE_PRICING_PAGE_V1 — EvidencePack: pricing page v1

- Priority: 1000
- Added: 2026-04-30T03:13:17.450Z

**Definition of done**
- [ ] Pricing page exists with one clear plan and CTA
- [ ] CTA leads to login/signup entrypoint
- [ ] No placeholder links or dead ends

**Implementation notes**
- [ ] (Agent) Break into smaller PR-sized tasks
- [ ] (Agent) Identify required env vars / manual setup and record here

### EVIDENCEPACK_R24_REVENUE_AUTH_MAGIC_LINK_V1 — EvidencePack: magic-link auth v1

- Priority: 990
- Added: 2026-04-30T03:27:07.017Z

**Definition of done**
- [ ] User can request a magic link and establish a session cookie
- [ ] After login, user is redirected into the app
- [ ] Auth failure states are handled

**Implementation notes**
- [ ] (Agent) Break into smaller PR-sized tasks
- [ ] (Agent) Identify required env vars / manual setup and record here
