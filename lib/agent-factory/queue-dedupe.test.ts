import { describe, expect, it } from "vitest"

import type { AgentFactoryQueueItem } from "./queue"
import { chooseDedupeKeepers, idVersionSuffix, queuedItemDedupeKey } from "./queue-dedupe"

function qItem(partial: Partial<AgentFactoryQueueItem> & Pick<AgentFactoryQueueItem, "id" | "title">): AgentFactoryQueueItem {
  const now = "2026-05-04T12:00:00.000Z"
  return {
    spec: {
      command: `pnpm -s factory:implement ${partial.id}`,
      require_diff: true,
    },
    status: "queued",
    priority: 850,
    created_at: now,
    updated_at: now,
    claimed_by: null,
    claimed_at: null,
    goal_revision: "rev-a",
    cancel_reason: null,
    ...partial,
  } as AgentFactoryQueueItem
}

describe("queue-dedupe", () => {
  it("queuedItemDedupeKey ignores implement id in command", () => {
    const a = qItem({ id: "FACTORY_VERIFY_CALCULATOR_V10", title: "Fix calculator" })
    const b = qItem({ id: "FACTORY_VERIFY_CALCULATOR_V11", title: "Fix calculator" })
    expect(queuedItemDedupeKey(a)).toBe(queuedItemDedupeKey(b))
  })

  it("different goal_revision does not dedupe", () => {
    const a = qItem({ id: "X_V1", title: "Same title", goal_revision: "rev-a" })
    const b = qItem({ id: "X_V2", title: "Same title", goal_revision: "rev-b" })
    expect(queuedItemDedupeKey(a)).not.toBe(queuedItemDedupeKey(b))
  })

  it("same title+revision keeps highest V suffix", () => {
    const items = [
      qItem({
        id: "FACTORY_VERIFY_CALCULATOR_V10",
        title: "Fix calculator page at /calculator",
        goal_revision: "factory-verify-calc-weather-nav-2026-05",
        created_at: "2026-05-04T01:00:00.000Z",
      }),
      qItem({
        id: "FACTORY_VERIFY_CALCULATOR_V13",
        title: "Fix calculator page at /calculator",
        goal_revision: "factory-verify-calc-weather-nav-2026-05",
        created_at: "2026-05-04T00:00:00.000Z",
      }),
    ]
    const { keepIds, cancelIds } = chooseDedupeKeepers(items)
    expect(keepIds.has("FACTORY_VERIFY_CALCULATOR_V13")).toBe(true)
    expect(cancelIds).toContain("FACTORY_VERIFY_CALCULATOR_V10")
  })

  it("idVersionSuffix", () => {
    expect(idVersionSuffix("FACTORY_VERIFY_CALCULATOR_V12")).toBe(12)
    expect(idVersionSuffix("FACTORY_FOO")).toBe(null)
  })

  it("leaves non-queued items out of groups", () => {
    const items = [
      qItem({ id: "A_V1", title: "T", status: "done" }),
      qItem({ id: "B_V2", title: "T", status: "queued" }),
    ]
    const { cancelIds } = chooseDedupeKeepers(items)
    expect(cancelIds).toEqual([])
  })
})
