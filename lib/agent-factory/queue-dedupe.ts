import type { AgentFactoryQueueItem } from "./queue"

/** Queued duplicate key: same title + goal_revision (collapses V10…V13 “same fix” spam). */
export function queuedItemDedupeKey(item: AgentFactoryQueueItem): string {
  const rev = (item.goal_revision ?? "").trim()
  return `${item.title.trim()}\0${rev}`
}

/** Numeric V suffix in FACTORY_*_V12 ids; null if none. */
export function idVersionSuffix(id: string): number | null {
  const m = /_V(\d+)$/i.exec(id)
  if (!m) return null
  const n = Number(m[1])
  return Number.isFinite(n) ? n : null
}

/**
 * Among duplicate queued rows, keep the best candidate: highest _V##_ suffix, else newest created_at.
 * Returns { keepIds, cancelIds } — cancelIds should be marked cancelled with cancel_reason.
 */
export function chooseDedupeKeepers(items: AgentFactoryQueueItem[]): {
  keepIds: Set<string>
  cancelIds: string[]
} {
  const queued = items.filter((it) => it.status === "queued")
  const byKey = new Map<string, AgentFactoryQueueItem[]>()
  for (const it of queued) {
    const k = queuedItemDedupeKey(it)
    const list = byKey.get(k) ?? []
    list.push(it)
    byKey.set(k, list)
  }

  const keepIds = new Set<string>()
  const cancelIds: string[] = []

  for (const group of Array.from(byKey.values())) {
    if (group.length <= 1) {
      keepIds.add(group[0]!.id)
      continue
    }
    const sorted = group.slice().sort((a: AgentFactoryQueueItem, b: AgentFactoryQueueItem) => {
      const va = idVersionSuffix(a.id)
      const vb = idVersionSuffix(b.id)
      if (va != null && vb != null && va !== vb) return vb - va
      if (va != null && vb == null) return -1
      if (va == null && vb != null) return 1
      return b.created_at.localeCompare(a.created_at)
    })
    const keeper = sorted[0]!
    keepIds.add(keeper.id)
    for (const it of sorted.slice(1)) {
      cancelIds.push(it.id)
    }
  }

  return { keepIds, cancelIds }
}
