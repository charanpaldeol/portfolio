import process from "node:process"

import { runCalcWeatherResearchAppend } from "@/lib/agent-factory/run-calc-weather-research-append"

async function main() {
  const root = process.cwd()
  const appended = await runCalcWeatherResearchAppend(root)
  if (appended > 0) {
    console.log(`factory:research:calc-weather: appended ${appended} block(s) to backlog.md`)
  } else {
    console.log("factory:research:calc-weather: no new signals (all present or none matched)")
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
