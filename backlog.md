## EvidencePack — manual ops checklist (do later)

### Billing (Stripe)
- [ ] Create Stripe Product + recurring Price; set `STRIPE_PRICE_ID`
- [ ] Set `STRIPE_SECRET_KEY` in Vercel env
- [ ] Create Stripe webhook endpoint → `POST /api/evidencepack/billing/webhook`
- [ ] Set `STRIPE_WEBHOOK_SECRET` in Vercel env
- [ ] Set `SITE_URL` (e.g. `https://cpdeol.com`)

### Auth (magic link)
- [ ] Set `EVIDENCEPACK_AUTH_SECRET` (random 32+ chars) in Vercel env
- [ ] Set Resend vars: `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (for magic links)

### Storage (Vercel Blob)
- [ ] Create Blob token; set `BLOB_READ_WRITE_TOKEN` in Vercel env

### Database (Neon)
- [ ] Ensure `DATABASE_URL` is set in Vercel env
- [ ] Run migrations:
  - [ ] `db/evidencepack_waitlist.sql`
  - [ ] `db/evidencepack_invites.sql`
  - [ ] `db/evidencepack_files.sql`
  - [ ] `db/evidencepack_questionnaires.sql`
  - [ ] `db/evidencepack_billing.sql`

### QA / smoke
- [ ] Hit `GET /api/evidencepack/health` to confirm config readiness
- [ ] Run a full flow in prod:
  - [ ] Login magic link → `/evidencepack/app`
  - [ ] Upload PDF + CSV
  - [ ] Save questionnaire → list → export CSV
  - [ ] Billing page → checkout session creation

## Agent Factory — manual ops checklist (do later)

### Git / CI credentials
- [ ] Ensure CI (or local) has Git push credentials for `git push -u origin <branch>` used by `pnpm factory:run-once`
- [ ] Decide branch naming + protection rules for `agent/*` branches in the remote

### Running the factory indefinitely
- **Start**: `pnpm factory:loop`
- **Stop**: `Ctrl+C` (or set `FACTORY_MAX_RUNS` to a finite number)
- **Key env vars**:
  - **`FACTORY_MAX_RUNS`**: If set, stops after N runs (otherwise runs forever)
  - **`FACTORY_INTERVAL_MS`**: Sleep between runs (default `60000`)
  - **`FACTORY_QUEUE_LOW_WATERMARK`**: When queued work is below this, the loop calls `factory:plan-next` (default `20`)
  - **`FACTORY_QUEUE_TARGET_SIZE`**: Planner tries to enqueue up to this many queued items when refilling (default `100`)

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
