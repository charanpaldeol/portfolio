import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { z } from "zod"

function nowIso() {
  return new Date().toISOString()
}

async function spawnCapture(cmd: string, argv: string[], cwd: string) {
  const { spawn } = await import("node:child_process")
  return await new Promise<{ code: number; stdout: string; stderr: string }>((resolve) => {
    const child = spawn(cmd, argv, { cwd, shell: false })
    let stdout = ""
    let stderr = ""
    child.stdout?.on("data", (c) => (stdout += c.toString("utf8")))
    child.stderr?.on("data", (c) => (stderr += c.toString("utf8")))
    child.on("close", (c) => resolve({ code: c ?? 1, stdout, stderr }))
  })
}

async function resolveRepoRoot(startCwd: string) {
  const envRoot = (process.env.FACTORY_ROOT ?? "").trim()
  if (envRoot) return envRoot

  const top = await spawnCapture("git", ["rev-parse", "--show-toplevel"], startCwd)
  if (top.code !== 0) throw new Error(`factory:learn: failed to resolve repo root (git rev-parse exit ${top.code})`)
  return top.stdout.trim()
}

const LearningFileSchema = z.object({
  version: z.literal(1),
  updated_at: z.string().datetime(),
  entries: z.array(
    z.object({
      id: z.string().min(1),
      source: z.enum(["github_pr_comment"]),
      pr_number: z.number().int().positive(),
      pr_url: z.string().url(),
      author: z.string().min(1),
      body: z.string().min(1),
      created_at: z.string().datetime(),
    }),
  ),
})

async function readLearningFile(p: string) {
  try {
    const raw = await readFile(p, "utf8")
    return LearningFileSchema.parse(JSON.parse(raw) as unknown)
  } catch {
    return LearningFileSchema.parse({ version: 1, updated_at: nowIso(), entries: [] })
  }
}

async function main() {
  const startCwd = process.cwd()
  const repoRoot = await resolveRepoRoot(startCwd)

  const limit = Math.max(1, Math.min(50, Number(process.env.FACTORY_LEARN_LIMIT ?? "10") || 10))
  const outPath = path.join(repoRoot, "agents", "factory-learnings.json")

  const list = await spawnCapture("gh", ["pr", "list", "--state", "merged", "--limit", String(limit), "--json", "number,url"], repoRoot)
  if (list.code !== 0) throw new Error(`gh pr list failed (exit ${list.code}): ${list.stderr || list.stdout}`.trim())

  const prs = z.array(z.object({ number: z.number(), url: z.string().url() })).parse(JSON.parse(list.stdout) as unknown)

  const file = await readLearningFile(outPath)
  const existingIds = new Set(file.entries.map((e) => e.id))

  const nextEntries = [...file.entries]

  for (const pr of prs) {
    const reviews = await spawnCapture("gh", ["pr", "view", String(pr.number), "--json", "reviews,comments"], repoRoot)
    if (reviews.code !== 0) continue

    const parsed = JSON.parse(reviews.stdout) as {
      reviews?: Array<{ author?: { login?: string }; body?: string; submittedAt?: string }>
    }
    const rs = Array.isArray(parsed.reviews) ? parsed.reviews : []

    for (const r of rs) {
      const author = r.author?.login?.trim()
      const body = (r.body ?? "").trim()
      const submittedAt = r.submittedAt
      if (!author || !body || !submittedAt) continue

      const id = `gh_pr_${pr.number}_${author}_${submittedAt}`
      if (existingIds.has(id)) continue

      nextEntries.unshift({
        id,
        source: "github_pr_comment",
        pr_number: pr.number,
        pr_url: pr.url,
        author,
        body: body.slice(0, 4000),
        created_at: submittedAt,
      })
      existingIds.add(id)
    }
  }

  await mkdir(path.dirname(outPath), { recursive: true })
  const nextFile = LearningFileSchema.parse({
    version: 1,
    updated_at: nowIso(),
    entries: nextEntries.slice(0, 500),
  })
  await writeFile(outPath, `${JSON.stringify(nextFile, null, 2)}\n`, "utf8")
  console.log(`factory:learn: wrote ${outPath} (entries=${nextFile.entries.length})`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
