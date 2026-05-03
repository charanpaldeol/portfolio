import { describe, expect, it } from "vitest"

import { appendFactoryResearchIntakeBlock, extractResearchIntakeSection, parseIntakeItems } from "./backlog-intake"

describe("backlog intake", () => {
  it("extracts lines under Factory research intake until next h2", () => {
    const md = `
## Other

x

## Factory research intake

### ABC_V1 — Test
- Priority: 10

## Next section

foo
`
    expect(extractResearchIntakeSection(md)).toEqual(["", "### ABC_V1 — Test", "- Priority: 10", ""])
  })

  it("parses id, title, priority, optional command", () => {
    const lines = [
      "### HUMAN_AGENT_WEB_V1 — Dual landing",
      "- Priority: 900",
      "- Command: pnpm -s factory:implement HUMAN_AGENT_WEB_V1",
    ]
    const w: string[] = []
    const items = parseIntakeItems(lines, (m) => w.push(m))
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({
      id: "HUMAN_AGENT_WEB_V1",
      title: "Dual landing",
      priority: 900,
      command: "pnpm -s factory:implement HUMAN_AGENT_WEB_V1",
    })
    expect(w).toHaveLength(0)
  })

  it("drops items without valid priority", () => {
    const lines = ["### BAD_V1 — No priority"]
    const w: string[] = []
    const items = parseIntakeItems(lines, (m) => w.push(m))
    expect(items).toHaveLength(0)
    expect(w.some((x) => x.includes("BAD_V1"))).toBe(true)
  })

  it("appendFactoryResearchIntakeBlock inserts before next h2 and dedupes by id", () => {
    const md = `# X

## Factory research intake
Intro line.

## Other
tail
`
    const r1 = appendFactoryResearchIntakeBlock({
      markdown: md,
      id: "SWARM_HEAL_V1",
      title: "Fix thing",
      priority: 900,
      command: "pnpm -s factory:stabilize",
      extraLines: ["Source: issue-swarm"],
    })
    expect(r1.appended).toBe(true)
    expect(r1.markdown).toContain("### SWARM_HEAL_V1 — Fix thing")
    expect(r1.markdown).toContain("- Source: issue-swarm")

    const r2 = appendFactoryResearchIntakeBlock({
      markdown: r1.markdown,
      id: "SWARM_HEAL_V1",
      title: "Again",
      priority: 1,
      command: "noop",
    })
    expect(r2.appended).toBe(false)
  })
})
