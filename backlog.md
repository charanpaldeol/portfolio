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