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