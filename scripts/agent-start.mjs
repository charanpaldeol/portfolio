import { spawn } from "node:child_process"
import process from "node:process"

const BASE_URL = process.env.AGENT_BASE_URL ?? "http://127.0.0.1:3000"
const HEALTH_URL = process.env.AGENT_HEALTH_URL ?? BASE_URL
const TIMEOUT_MS = Number(process.env.AGENT_START_TIMEOUT_MS ?? "90000")

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForHttpOk(url, timeoutMs) {
  const startedAt = Date.now()
  let lastError = undefined

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: "follow" })
      if (res.ok) return
      lastError = new Error(`HTTP ${res.status} ${res.statusText}`)
    } catch (err) {
      lastError = err
    }

    await sleep(500)
  }

  throw new Error(
    `Timed out waiting for ${url} (${timeoutMs}ms). Last error: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  )
}

async function main() {
  const free = spawn("pnpm", ["dev:free3000"], { stdio: "inherit", shell: false })
  const freeExitCode = await new Promise((resolve) => free.on("close", resolve))
  if (freeExitCode !== 0) process.exitCode = 1

  const dev = spawn("pnpm", ["dev"], { stdio: "inherit", shell: false })

  const shutdown = (signal) => {
    if (dev.killed) return
    dev.kill(signal)
  }

  process.on("SIGINT", () => shutdown("SIGINT"))
  process.on("SIGTERM", () => shutdown("SIGTERM"))

  dev.on("close", (code, signal) => {
    if (signal) {
      process.exitCode = 0
      return
    }
    process.exitCode = code ?? 1
  })

  await waitForHttpOk(HEALTH_URL, TIMEOUT_MS)
  console.log(`\n✅ Agent dev server ready: ${BASE_URL}\n`)
}

main().catch((err) => {
  console.error(`\n❌ agent:start failed: ${err instanceof Error ? err.message : String(err)}\n`)
  process.exitCode = 1
})

