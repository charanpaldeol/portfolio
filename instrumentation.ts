import { registerOTel } from "@vercel/otel"

export function register() {
  try {
    registerOTel("next-app")
  } catch (err) {
    console.warn(
      "[instrumentation] OpenTelemetry registration skipped:",
      err instanceof Error ? err.message : err,
    )
  }
}
