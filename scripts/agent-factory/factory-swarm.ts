import { spawn } from "node:child_process"
import process from "node:process"

function parseWorkers() {
  const raw = (process.env.FACTORY_WORKERS ?? "").trim()
  const n = raw ? Number(raw) : 5
  if (!Number.isFinite(n) || n <= 0) return 5
  return Math.floor(n)
}

async function main() {
  const workers = parseWorkers()
  console.log(`factory:swarm: starting ${workers} worker(s)`)

  const children: Array<{ id: string; child: ReturnType<typeof spawn> }> = []

  for (let i = 0; i < workers; i += 1) {
    const id = `swarm_${String(i + 1).padStart(2, "0")}`
    const child = spawn("pnpm", ["-s", "factory:loop"], {
      stdio: "inherit",
      shell: false,
      env: { ...process.env, FACTORY_WORKER_ID: id },
    })
    children.push({ id, child })
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
            console.log(`factory:swarm: worker ${id} exited (${c})`)
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

import { spawn } from "node:child_process"
import process from "node:process"

function parseWorkers() {
  const raw = (process.env.FACTORY_WORKERS ?? "").trim()
  const n = raw ? Number(raw) : 5
  if (!Number.isFinite(n) || n <= 0) return 5
  return Math.floor(n)
}

async function main() {
  const workers = parseWorkers()
  console.log(`factory:swarm: starting ${workers} worker(s)`)

  const children: Array<{ id: string; child: ReturnType<typeof spawn> }> = []

  for (let i = 0; i < workers; i += 1) {
    const id = `swarm_${String(i + 1).padStart(2, "0")}`
    const child = spawn("pnpm", ["-s", "factory:loop"], {
      stdio: "inherit",
      shell: false,
      env: { ...process.env, FACTORY_WORKER_ID: id },
    })
    children.push({ id, child })
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
            console.log(`factory:swarm: worker ${id} exited (${c})`)
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

