import process from "node:process"

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function queuedCount() {
  const { readFile } = await import("node:fs/promises")
  const path = await import("node:path")
  const raw = await readFile(path.join(process.cwd(), "agents", "factory-queue.json"), "utf8")
  const parsed = JSON.parse(raw) as { items?: Array<{ status?: unknown }> }
  const items = Array.isArray(parsed.items) ? parsed.items : []
  return items.filter((i) => i?.status === "queued").length
}

async function main() {
  const intervalMs = Number(process.env.FACTORY_INTERVAL_MS ?? String(60_000))
  const lowWatermark = Number(process.env.FACTORY_QUEUE_LOW_WATERMARK ?? String(20))
  const reclaimCooldownMs = Number(process.env.FACTORY_RECLAIM_COOLDOWN_MS ?? String(5 * 60_000))
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

    const count = await queuedCount()
    if (count < lowWatermark) {
      const plan = spawn("pnpm", ["-s", "factory:plan-next"], { stdio: "inherit", shell: false })
      const planCode = await new Promise<number>((resolve) => plan.on("close", (c) => resolve(c ?? 1)))
      if (planCode !== 0) {
        process.exitCode = planCode
        return
      }
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

