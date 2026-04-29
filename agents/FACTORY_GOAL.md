# Factory Goal — EvidencePack → $1M revenue

## North star

- **Target**: $1,000,000 ARR (annual recurring revenue)
- **Product**: EvidencePack (security questionnaire automation with citations + exports)
- **Site**: cpdeol.com

## What “done” means (in order)

1. **Self-serve revenue loop works end-to-end**
  - Pricing → login → checkout → subscription recorded → paid access unlocks app
2. **Core product loop delivers enterprise value**
  - Upload docs (PDF) → ingest text → draft answers with citations → review → export
3. **Exports are buyer-ready**
  - Answered questionnaire CSV/XLSX + evidence pack ZIP
4. **Scale + reliability**
  - Observability, audit trail, retries, low-touch ops, swarmable factory

## How progress is measured

- **ARR** = MRR × 12
- **MRR** = sum(active subscriptions)
- **Conversion** = paid subscribers / signups

## Factory behavior

- Always prefer tasks that increase revenue or unblock revenue.
- If a task requires manual setup (Stripe keys, DB migrations, etc.), record it in `backlog.md` and continue with other work.