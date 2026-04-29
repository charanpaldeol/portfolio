import process from "node:process"

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function sh(cmd) {
  const { spawn } = await import("node:child_process")
  return await new Promise((resolve) => {
    const child = spawn(cmd, { stdio: "inherit", shell: true })
    child.on("close", (code) => resolve(code ?? 1))
  })
}

async function main() {
  const intervalMs = Number(process.env.FACTORY_INTERVAL_MS ?? String(30 * 60 * 1000))
  const deployUrl = (process.env.DEPLOY_URL ?? "").trim()

  // eslint-disable-next-line no-constant-condition
  while (true) {
    console.log("\n🏭 factory: starting verify\n")
    const verify = await sh("pnpm -s verify")
    if (verify !== 0) {
      console.error(`\n❌ factory: verify failed (exit ${verify})\n`)
    } else {
      console.log("\n✅ factory: verify passed\n")
    }

    if (deployUrl) {
      console.log("\n🏭 factory: starting deploy smoke\n")
      const smoke = await sh(`DEPLOY_URL="${deployUrl}" pnpm -s deploy:smoke`)
      if (smoke !== 0) {
        console.error(`\n❌ factory: deploy smoke failed (exit ${smoke})\n`)
      } else {
        console.log("\n✅ factory: deploy smoke passed\n")
      }
    } else {
      console.log("\nℹ️ factory: DEPLOY_URL not set; skipping deploy smoke\n")
    }

    console.log(`\n⏳ factory: sleeping ${Math.round(intervalMs / 1000)}s\n`)
    await sleep(intervalMs)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

