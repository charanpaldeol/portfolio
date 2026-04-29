import process from "node:process"

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const intervalMs = Number(process.env.FACTORY_INTERVAL_MS ?? String(60_000))

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { spawn } = await import("node:child_process")
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

