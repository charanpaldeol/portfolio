import { describe, expect, it } from "vitest"

import {
  evaluateFactoryGoalStatus,
  parseGoalAcceptanceCommands,
  resolveGoalRevision,
  roadmapItemHasGoalTrace,
  validateRoadmapItemsTraceToGoal,
} from "./goal-spec"

describe("resolveGoalRevision", () => {
  it("uses explicit goal_revision when set", () => {
    expect(
      resolveGoalRevision({
        version: 1,
        statement: "Same text",
        goal_revision: "rev-a",
        roadmap_items: [],
      }),
    ).toBe("rev-a")
  })

  it("falls back to hash when goal_revision omitted", () => {
    const r = resolveGoalRevision({
      version: 1,
      statement: "North star A",
      roadmap_items: [],
    })
    expect(r.startsWith("h_")).toBe(true)
    expect(r).not.toBe(
      resolveGoalRevision({
        version: 1,
        statement: "North star B",
        roadmap_items: [],
      }),
    )
  })
})

describe("parseGoalAcceptanceCommands", () => {
  it("flattens string and arrays", () => {
    expect(
      parseGoalAcceptanceCommands({
        version: 1,
        statement: "x",
        goal_acceptance: ["pnpm -s tsc", " true "],
        roadmap_items: [],
      }),
    ).toEqual(["pnpm -s tsc", "true"])
  })
})

describe("validateRoadmapItemsTraceToGoal", () => {
  it("fails when trace text shares no goal keyword (length ≥4)", () => {
    const r = validateRoadmapItemsTraceToGoal({
      statement: "Ship calculator and weather pages",
      items: [
        {
          id: "BAD",
          title: "t",
          priority: 1,
          traces_goal: "Unrelated work only here",
        },
      ],
    })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.join(" ")).toContain("BAD")
  })

  it("passes when traces_goal overlaps a statement token", () => {
    const r = validateRoadmapItemsTraceToGoal({
      statement: "Ship calculator and weather pages",
      items: [
        {
          id: "OK",
          title: "t",
          priority: 1,
          traces_goal: "Delivers the calculator experience",
        },
      ],
    })
    expect(r.ok).toBe(true)
  })
})

describe("roadmapItemHasGoalTrace", () => {
  it("true when traces_goal is set", () => {
    expect(
      roadmapItemHasGoalTrace({
        id: "X",
        title: "t",
        priority: 1,
        traces_goal: "Supports north star delivery.",
      }),
    ).toBe(true)
  })

  it("true when first definition_of_done exists", () => {
    expect(
      roadmapItemHasGoalTrace({
        id: "X",
        title: "t",
        priority: 1,
        spec: { definition_of_done: ["First bullet"] },
      }),
    ).toBe(true)
  })

  it("false when neither trace nor first DoD", () => {
    expect(
      roadmapItemHasGoalTrace({
        id: "X",
        title: "t",
        priority: 1,
        spec: { definition_of_done: [] },
      }),
    ).toBe(false)
  })
})

describe("evaluateFactoryGoalStatus", () => {
  it("blocked when any linked item failed", () => {
    const r = evaluateFactoryGoalStatus({
      statement: "Ship feature",
      roadmapItems: [
        { id: "A", title: "Ta" },
        { id: "B", title: "Tb" },
      ],
      queue: {
        byId: new Map([
          ["A", { status: "done" }],
          ["B", { status: "failed" }],
        ]),
      },
    })
    expect(r.status).toBe("blocked")
    expect(r.roadmap_not_done.some((x) => x.id === "B")).toBe(true)
    expect(r.summary).toContain("B: Tb [failed]")
  })

  it("met when all done", () => {
    const r = evaluateFactoryGoalStatus({
      statement: "Ship feature",
      roadmapItems: [{ id: "A", title: "Ta" }],
      queue: { byId: new Map([["A", { status: "done" }]]) },
    })
    expect(r.status).toBe("met")
    expect(r.roadmap_not_done).toEqual([])
  })

  it("active when roadmap item not in queue", () => {
    const r = evaluateFactoryGoalStatus({
      statement: "Ship feature",
      roadmapItems: [
        { id: "A", title: "Ta" },
        { id: "B", title: "Tb" },
      ],
      queue: { byId: new Map([["A", { status: "done" }]]) },
    })
    expect(r.status).toBe("active")
    expect(r.roadmap_not_done.find((x) => x.id === "B")?.queue_status).toBe("missing")
    expect(r.summary).toContain("B: Tb [missing]")
  })
})
