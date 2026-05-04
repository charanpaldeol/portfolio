import { spawn } from "node:child_process"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { readFactoryGoalSpec } from "@/lib/agent-factory/goal-io"

type RoadmapItem = {
  id: string
  title: string
  spec?: { definition_of_done?: unknown }
}

type Roadmap = { items?: RoadmapItem[] }

function getItemId(): string {
  const arg = (process.argv[2] ?? "").trim()
  if (arg) return arg
  const env = (process.env.FACTORY_ITEM_ID ?? "").trim()
  if (env) return env
  throw new Error("factory:implement: missing item id (pass as argv[2] or FACTORY_ITEM_ID)")
}

async function readTextOrEmpty(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, "utf8")
  } catch {
    return ""
  }
}

async function readRoadmap(repoRoot: string): Promise<Roadmap | null> {
  try {
    const raw = await readFile(path.join(repoRoot, "agents", "factory-roadmap.json"), "utf8")
    return JSON.parse(raw) as Roadmap
  } catch {
    return null
  }
}

/** Prefer `factory-roadmap.json`; fall back to `factory-goal-spec.json` so queued goal work survives a market roadmap refresh. */
async function resolveItemForImplement(repoRoot: string, itemId: string): Promise<RoadmapItem | null> {
  const roadmap = await readRoadmap(repoRoot)
  const fromRoadmap = roadmap?.items?.find((i) => i.id === itemId)
  if (fromRoadmap) return fromRoadmap

  try {
    const goalSpec = await readFactoryGoalSpec(repoRoot)
    const fromGoal = goalSpec.roadmap_items.find((i) => i.id === itemId)
    if (!fromGoal) return null
    return {
      id: fromGoal.id,
      title: fromGoal.title,
      spec: fromGoal.spec as RoadmapItem["spec"],
    }
  } catch {
    return null
  }
}

function dodLines(item: RoadmapItem): string[] {
  const dod = item.spec?.definition_of_done
  if (!Array.isArray(dod)) return []
  return dod.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
}

function implementBackendMode() {
  return (process.env.FACTORY_IMPLEMENT_BACKEND ?? "claude").trim().toLowerCase()
}

function isCursorDelegatedBackend(mode: string) {
  return mode === "cursor" || mode === "none" || mode === "skip"
}

function isGeminiBin(bin: string): boolean {
  const base = bin.split("/").pop() ?? bin
  return base === "gemini" || base === "gemini-cli"
}

async function main() {
  const itemId = getItemId()
  const worktree = process.cwd()
  const repoRoot = (process.env.FACTORY_ROOT ?? worktree).trim() || worktree

  const item = await resolveItemForImplement(repoRoot, itemId)
  if (!item) {
    console.error(`factory:implement: item not found in agents/factory-roadmap.json or agents/factory-goal-spec.json: ${itemId}`)
    process.exitCode = 1
    return
  }

  const dod = dodLines(item)
  const goal = (await readTextOrEmpty(path.join(repoRoot, "agents", "FACTORY_GOAL.md"))).trim()
  const developerSkill = (
    await readTextOrEmpty(path.join(repoRoot, "agents", "SKILL-developer.md"))
  ).trim()

  const prompt = [
    "You are the Developer agent inside the cpdeol.com factory runner.",
    "Implement the smallest vertical slice that satisfies the Definition of Done.",
    "",
    "## Product goal (north star)",
    goal || "(see agents/FACTORY_GOAL.md)",
    "",
    "## Task",
    `- Item ID: ${item.id}`,
    `- Title: ${item.title}`,
    "",
    "## Definition of done",
    ...(dod.length > 0 ? dod.map((d) => `- ${d}`) : ["- (no DoD bullets — infer from title)"]),
    "",
    "## Operating rules",
    "- You are inside a git worktree at the current working directory.",
    "- Stack: Next.js 15 App Router, TypeScript strict, Tailwind, pnpm.",
    "- Use Read/Edit/Write to change files. Read before you write.",
    "- Code must pass `pnpm tsc` and `pnpm lint` with zero errors.",
    "- UI under `app/` or `components/` is covered by `pnpm e2e:goal-smoke` (included in `pnpm verify`); see `e2e/goal-smoke.spec.ts` and `agents/factory-goal-spec.json`.",
    "- DO NOT run: git commit, git push, pnpm install, pnpm build. The factory runs these after you.",
    "- DO NOT add new npm dependencies unless absolutely required.",
    "- DO NOT only edit backlog/ or files under agents/. Those are non-shipping. Touch real source under app/, components/, lib/, or scripts/.",
    "- If the task is genuinely impossible without manual setup (e.g. live Stripe keys, DB migrations), write ONE short paragraph to `backlog/<itemId>.md` describing what is blocked, then exit normally. Do not fabricate. Do not edit the shared backlog.md.",
    "- When done, print a one-line summary of what you changed.",
    "",
    "## Developer playbook (excerpt)",
    developerSkill ? developerSkill.slice(0, 4000) : "(see agents/SKILL-developer.md)",
  ].join("\n")

  const backend = implementBackendMode()
  if (isCursorDelegatedBackend(backend)) {
    const outDir = path.join(repoRoot, "agents", "factory-logs")
    await mkdir(outDir, { recursive: true })
    const outPath = path.join(outDir, `cursor-task-${item.id}.md`)
    await writeFile(
      outPath,
      `# Cursor / manual handoff — ${item.id}\n\n${prompt}\n`,
      "utf8",
    )
    console.log(
      [
        `factory:implement: FACTORY_IMPLEMENT_BACKEND=${backend} — skipped external CLI (no Claude).`,
        ``,
        `Implement this task in Cursor (or your editor), then commit your changes onto the branch \`factory:run-once\` will use as the worktree base (usually local \`main\`) before the next run.`,
        ``,
        `Current directory (often a git worktree checkout):`,
        `  ${worktree}`,
        ``,
        `Saved full prompt for copy/paste:`,
        `  ${outPath}`,
      ].join("\n"),
    )
    return
  }

  let claudeBin = (process.env.FACTORY_CLAUDE_BIN || "claude").trim()

  // Resolve relative paths from repo root
  if (claudeBin.startsWith("./") || claudeBin.startsWith("../")) {
    claudeBin = path.resolve(repoRoot, claudeBin)
  }

  const allowedTools =
    process.env.FACTORY_IMPLEMENT_ALLOWED_TOOLS || "Read Edit Write Glob Grep Bash"
  const implementModel = (process.env.FACTORY_IMPLEMENT_MODEL || "").trim()

  // Build CLI args based on which binary is being used.
  // Gemini CLI: --prompt requires a value; stdin carries the task; --yolo auto-approves all edits.
  // Claude Code: -p is a mode flag (no value); --dangerously-skip-permissions; --allowedTools.
  // FACTORY_IMPLEMENT_MODEL selects the model for either backend.
  const args: string[] = isGeminiBin(claudeBin)
    ? [
        "--prompt", "",          // headless mode; actual prompt arrives via stdin
        "--yolo",                // auto-approve all tool calls (equiv. to --dangerously-skip-permissions)
        ...(implementModel ? ["-m", implementModel] : []),
      ]
    : [
        "-p",
        "--dangerously-skip-permissions",
        "--allowedTools", allowedTools,
        ...(implementModel ? ["--model", implementModel] : []),
      ]

  const timeoutMs = (() => {
    const raw = Number(process.env.FACTORY_IMPLEMENT_TIMEOUT_MS ?? String(15 * 60_000))
    return Number.isFinite(raw) && raw > 0 ? raw : 15 * 60_000
  })()

  console.log(`factory:implement: invoking ${claudeBin} for ${item.id} (timeout ${timeoutMs}ms)`)

  const code = await new Promise<number>((resolve) => {
    const child = spawn(claudeBin, args, { cwd: worktree, stdio: ["pipe", "inherit", "inherit"], shell: false })
    const stdin = child.stdin
    if (!stdin) {
      console.error("factory:implement: stdin pipe unavailable")
      resolve(1)
      return
    }
    stdin.write(prompt, "utf8")
    stdin.end()
    const timer = setTimeout(() => {
      console.error(`factory:implement: timeout after ${timeoutMs}ms; killing ${claudeBin}`)
      child.kill("SIGKILL")
    }, timeoutMs)
    child.on("close", (c) => {
      clearTimeout(timer)
      resolve(c ?? 1)
    })
    child.on("error", (err) => {
      clearTimeout(timer)
      console.error(`factory:implement: failed to spawn ${claudeBin}`, err)
      resolve(1)
    })
  })

  if (code !== 0) {
    console.error(`factory:implement: ${claudeBin} exited with code ${code}`)
    process.exitCode = code
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
