import process from "node:process"

const BASE_URL = (process.env.DEPLOY_URL ?? "").replace(/\/+$/, "")
if (!BASE_URL) {
  console.error("DEPLOY_URL is required, e.g. DEPLOY_URL=https://cpdeol.com pnpm deploy:smoke")
  process.exit(1)
}

const routes = ["/", "/what-i-bring", "/how-i-work", "/portfolio/services", "/portfolio/projects", "/blog", "/contact"]

async function main() {
  const failures = []
  for (const route of routes) {
    const url = `${BASE_URL}${route}`
    try {
      const res = await fetch(url, { redirect: "follow" })
      if (!res.ok) failures.push(`${url} → HTTP ${res.status}`)
      else console.log(`✅ ${url} → ${res.status}`)
    } catch (err) {
      failures.push(`${url} → ${(err instanceof Error ? err.message : String(err))}`)
    }
  }

  if (failures.length) {
    console.error("\n❌ Deploy smoke failed:\n")
    for (const f of failures) console.error(`- ${f}`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

