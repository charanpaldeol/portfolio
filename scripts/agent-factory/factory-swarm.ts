import { spawn } from "node:child_process"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

function parseWorkers() {
  const raw = (process.env.FACTORY_WORKERS ?? "").trim()
  const n = raw ? Number(raw) : 5
  if (!Number.isFinite(n) || n <= 0) return 5
  return Math.floor(n)
}

function nowIso() {
  return new Date().toISOString()
}

function safeBasename(input: string) {
  return input.replace(/[^a-z0-9_-]+/gi, "_")
}

async function writeIncident(args: {
  root: string
  incident: {
    kind: "worker_error" | "worker_exit"
    worker_id: string
    pid: number | null
    started_at: string
    ended_at: string
    exit_code: number | null
    signal: NodeJS.Signals | null
    error?: { message: string } | null
    log_path: string
  }
}) {
  const dir = path.join(args.root, "agents", "factory-logs", "swarm-incidents")
  await mkdir(dir, { recursive: true })
  const filename = `${nowIso().replace(/[:.]/g, "-")}.${safeBasename(args.incident.worker_id)}.${args.incident.kind}.json`
  const outPath = path.join(dir, filename)
  await writeFile(outPath, `${JSON.stringify(args.incident, null, 2)}\n`, "utf8")
}

async function main() {
  const root = process.cwd()
  const workers = parseWorkers()
  console.log(`factory:swarm: starting ${workers} worker(s)`)

  const children: Array<{ id: string; child: ReturnType<typeof spawn> }> = []

  for (let i = 0; i < workers; i += 1) {
    const id = `swarm_${String(i + 1).padStart(2, "0")}`
    const startedAt = nowIso()
    const logsDir = path.join(root, "agents", "factory-logs", "swarm-workers")
    await mkdir(logsDir, { recursive: true })
    const logPath = path.join(logsDir, `${safeBasename(id)}.log`)

    const child = spawn("pnpm", ["-s", "factory:loop"], {
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
      env: { ...process.env, FACTORY_WORKER_ID: id },
    })
    children.push({ id, child })

    const prefix = `[${id}] `
    const write = async (chunk: Buffer) => {
      const text = chunk.toString("utf8")
      process.stdout.write(prefix + text)
      await writeFile(logPath, `${prefix}${text}`, { flag: "a" })
    }
    child.stdout?.on("data", (chunk) => void write(chunk))
    child.stderr?.on("data", (chunk) => void write(chunk))

    child.on("error", (err) => {
      console.error(`factory:swarm: worker ${id} error`, err)
      void writeIncident({
        root,
        incident: {
          kind: "worker_error",
          worker_id: id,
          pid: child.pid ?? null,
          started_at: startedAt,
          ended_at: nowIso(),
          exit_code: null,
          signal: null,
          error: { message: err instanceof Error ? err.message : String(err) },
          log_path: logPath,
        },
      })
    })

    child.on("close", (code, signal) => {
      const c = code ?? 1
      console.log(`factory:swarm: worker ${id} exited (${c})`)
      if (c !== 0) {
        void writeIncident({
          root,
          incident: {
            kind: "worker_exit",
            worker_id: id,
            pid: child.pid ?? null,
            started_at: startedAt,
            ended_at: nowIso(),
            exit_code: c,
            signal: signal ?? null,
            error: null,
            log_path: logPath,
          },
        })
      }
    })
  }

  const shutdown = (signal: NodeJS.Signals) => {
    console.log(`factory:swarm: received ${signal}; shutting down`)
    for (const { child } of children) child.kill(signal)
  }

  process.on("SIGINT", () => shutdown("SIGINT"))
  process.on("SIGTERM", () => shutdown("SIGTERM"))

  const codes = await Promise.all(
    children.map(
      ({ id, child }) =>
        new Promise<number>((resolve) => {
          child.on("close", (code) => {
            const c = code ?? 1
            resolve(c)
          })
        })
    )
  )

  const worst = Math.max(0, ...codes)
  if (worst !== 0) process.exitCode = worst
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
