# Backlog — cpdeol.com

**Factory:** **Incremental product work** on calculator + weather + nav (`goal_revision` **`factory-calc-weather-incremental-2026-05`**). Source of truth: **`agents/factory-goal-spec.json`**, **`agents/factory-roadmap.json`**, and **`agents/FACTORY_GOAL.md`**.

Rows below marked *historical* belong to the earlier verification sprint; the **live queue** follows the seven roadmap IDs in `factory-roadmap.json` (weather location search, error UX, calc polish, a11y/keyboard, API query params, calc metadata, nav discoverability).

## Factory research intake

ARCHIVED: All research intake items removed on 2026-05-04. The factory is focused on executing the 7 roadmap items in `agents/factory-roadmap.json`:
- FACTORY_WEATHER_LOCATION_SEARCH_V1 (done)
- FACTORY_WEATHER_ERROR_UX_V1 (queued)
- FACTORY_CALC_UI_POLISH_V1 (queued)
- FACTORY_CALC_A11Y_KEYBOARD_V1 (queued)
- FACTORY_WEATHER_API_QUERY_V1 (queued)
- FACTORY_CALC_ROUTE_METADATA_V1 (queued)
- FACTORY_NAV_CALC_WEATHER_DISCOVER_V1 (queued)

To re-enable research proposals, either:
1. Set env var `FACTORY_RESEARCH_CALC_WEATHER=1` before running `factory:research:once`
2. Ensure Ollama is running locally (preferred over Claude/OpenAI for cost/speed)
3. Or set `OPENAI_API_KEY` for cloud LLM fallback

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
