import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { readFactoryGoalSpec } from "@/lib/agent-factory/goal-io"
import { resolveGoalRevision } from "@/lib/agent-factory/goal-spec"

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function queuedCount() {
  const raw = await readFile(path.join(process.cwd(), "agents", "factory-queue.json"), "utf8")
  const parsed = JSON.parse(raw) as { items?: Array<{ status?: unknown }> }
  const items = Array.isArray(parsed.items) ? parsed.items : []
  return items.filter((i) => i?.status === "queued").length
}

async function readGoalStateStatus(repoRoot: string): Promise<string | null> {
  try {
    const raw = await readFile(path.join(repoRoot, "agents", "factory-goal-state.json"), "utf8")
    const j = JSON.parse(raw) as { status?: unknown }
    return typeof j.status === "string" ? j.status : null
  } catch {
    return null
  }
}

async function readResearchLastAppended(repoRoot: string): Promise<number> {
  try {
    const raw = await readFile(path.join(repoRoot, "agents", "factory-research-last.json"), "utf8")
    const j = JSON.parse(raw) as { appended_total?: unknown }
    return typeof j.appended_total === "number" && j.appended_total >= 0 ? j.appended_total : 0
  } catch {
    return 0
  }
}

type AutonomousState = {
  stall_loops: number
  last_goal_revision: string | null
  last_statement_fp: string | null
}

async function readAutonomousState(repoRoot: string): Promise<AutonomousState> {
  try {
    const raw = await readFile(path.join(repoRoot, "agents", "factory-autonomous-state.json"), "utf8")
    const j = JSON.parse(raw) as { stall_loops?: unknown; last_goal_revision?: unknown; last_statement_fp?: unknown }
    const stall = typeof j.stall_loops === "number" && j.stall_loops >= 0 ? j.stall_loops : 0
    const last_goal_revision = typeof j.last_goal_revision === "string" ? j.last_goal_revision : null
    const last_statement_fp = typeof j.last_statement_fp === "string" ? j.last_statement_fp : null
    return { stall_loops: stall, last_goal_revision, last_statement_fp }
  } catch {
    return { stall_loops: 0, last_goal_revision: null, last_statement_fp: null }
  }
}

async function writeAutonomousState(repoRoot: string, args: AutonomousState & { updated_at: string }) {
  const { writeJsonFile } = await import("@/lib/agent-factory/storage")
  await writeJsonFile(path.join(repoRoot, "agents", "factory-autonomous-state.json"), {
    version: 1,
    stall_loops: args.stall_loops,
    last_goal_revision: args.last_goal_revision,
    last_statement_fp: args.last_statement_fp,
    updated_at: args.updated_at,
  })
}

function statementFingerprint(statement: string): string {
  return createHash("sha256").update(statement.trim(), "utf8").digest("hex").slice(0, 16)
}

async function main() {
  const root = process.cwd()
  const intervalMs = Number(process.env.FACTORY_INTERVAL_MS ?? String(60_000))
  const lowWatermark = Number(process.env.FACTORY_QUEUE_LOW_WATERMARK ?? String(20))
  const reclaimCooldownMs = Number(process.env.FACTORY_RECLAIM_COOLDOWN_MS ?? String(5 * 60_000))
  const stallThreshold = Number(process.env.FACTORY_AUTONOMOUS_STALL_LOOPS ?? String(0))
  let lastReclaimErrorAt = 0

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { spawn } = await import("node:child_process")

    try {
      const reclaim = spawn("pnpm", ["-s", "factory:reclaim"], { stdio: "inherit", shell: false })
      const reclaimCode = await new Promise<number>((resolve) => reclaim.on("close", (c) => resolve(c ?? 1)))
      if (reclaimCode !== 0) {
        const now = Date.now()
        if (now - lastReclaimErrorAt > reclaimCooldownMs) {
          lastReclaimErrorAt = now
          console.warn(`factory: reclaim failed (exit ${reclaimCode}); continuing loop`)
        }
      }
    } catch (err) {
      const now = Date.now()
      if (now - lastReclaimErrorAt > reclaimCooldownMs) {
        lastReclaimErrorAt = now
        console.warn("factory: reclaim threw; continuing loop", err)
      }
    }

    try {
      const evalGoal = spawn("pnpm", ["-s", "factory:evaluate-goal"], { stdio: "inherit", shell: false })
      const evalCode = await new Promise<number>((resolve) => evalGoal.on("close", (c) => resolve(c ?? 1)))
      if (evalCode !== 0) console.warn(`factory: evaluate-goal exited ${evalCode}; continuing loop`)
    } catch (err) {
      console.warn("factory: evaluate-goal threw; continuing loop", err)
    }

    const goalStatus = await readGoalStateStatus(root)
    const qBefore = await queuedCount()
    const pipelineOff = ["0", "false", "no", "off"].includes((process.env.FACTORY_RESEARCH_PIPELINE ?? "").trim().toLowerCase())

    let goalRevision = ""
    let statementFp = ""
    try {
      const spec = await readFactoryGoalSpec(root)
      goalRevision = resolveGoalRevision(spec)
      statementFp = statementFingerprint(spec.statement)
    } catch {
      // goal spec missing — stall reset fields stay empty; research/implement may still warn elsewhere
    }

    if (!pipelineOff && qBefore < lowWatermark) {
      try {
        const research = spawn("pnpm", ["-s", "factory:research-once"], { stdio: "inherit", shell: false })
        const researchCode = await new Promise<number>((resolve) => research.on("close", (c) => resolve(c ?? 1)))
        if (researchCode !== 0) console.warn(`factory: research-once exited ${researchCode}; continuing`)
      } catch (err) {
        console.warn("factory: research-once threw; continuing", err)
      }

      try {
        const intake = spawn("pnpm", ["-s", "factory:backlog:intake"], { stdio: "inherit", shell: false })
        const intakeCode = await new Promise<number>((resolve) => intake.on("close", (c) => resolve(c ?? 1)))
        if (intakeCode !== 0) console.warn(`factory: backlog:intake exited ${intakeCode}; continuing`)
      } catch (err) {
        console.warn("factory: backlog:intake threw; continuing", err)
      }

      const plan = spawn("pnpm", ["-s", "factory:plan-next"], { stdio: "inherit", shell: false })
      const planCode = await new Promise<number>((resolve) => plan.on("close", (c) => resolve(c ?? 1)))
      if (planCode !== 0) {
        process.exitCode = planCode
        return
      }

      const qAfter = await queuedCount()
      const researchAppended = await readResearchLastAppended(root)
      const auto = await readAutonomousState(root)
      let stall = auto.stall_loops

      const goalContextChanged =
        (goalRevision && auto.last_goal_revision !== goalRevision) ||
        (statementFp && auto.last_statement_fp !== statementFp)
      if (goalContextChanged) {
        stall = 0
        console.log("factory: loop: goal_revision or goal statement changed — reset autonomous stall counter")
      }

      if (qAfter > qBefore || researchAppended > 0) {
        stall = 0
      } else if (stallThreshold > 0 && goalStatus === "met" && qAfter === 0 && researchAppended === 0) {
        stall += 1
        if (stall >= stallThreshold) {
          console.log(
            `factory: loop: autonomous stall (${stall}/${stallThreshold}): goal met, queue empty, research added nothing — exiting (set FACTORY_AUTONOMOUS_STALL_LOOPS=0 to run forever)`,
          )
          await writeAutonomousState(root, {
            stall_loops: stall,
            last_goal_revision: goalRevision || auto.last_goal_revision,
            last_statement_fp: statementFp || auto.last_statement_fp,
            updated_at: new Date().toISOString(),
          })
          return
        }
      }

      await writeAutonomousState(root, {
        stall_loops: stall,
        last_goal_revision: goalRevision || auto.last_goal_revision,
        last_statement_fp: statementFp || auto.last_statement_fp,
        updated_at: new Date().toISOString(),
      })
    }

    const child = spawn("pnpm", ["-s", "factory:run-once"], { stdio: "inherit", shell: false })
    const code = await new Promise<number>((resolve) => child.on("close", (c) => resolve(c ?? 1)))
    if (code !== 0) {
      process.exitCode = code
      return
    }

    await sleep(intervalMs)
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
