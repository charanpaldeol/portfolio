import withBundleAnalyzer from "@next/bundle-analyzer"
import { type NextConfig } from "next"

import { env } from "./env.mjs"

/** Hostnames allowed to load /_next/* in dev (e.g. LAN IP). Comma-separated. Enables strict dev origin checks when set. */
const allowedDevOrigins = (process.env.NEXT_DEV_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean)

const config: NextConfig = {
  reactStrictMode: true,
  ...(allowedDevOrigins.length > 0 ? { allowedDevOrigins } : {}),
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  rewrites: async () => [
    { source: "/healthz", destination: "/api/health" },
    { source: "/api/healthz", destination: "/api/health" },
    { source: "/health", destination: "/api/health" },
    { source: "/ping", destination: "/api/health" },
  ],
}

export default env.ANALYZE ? withBundleAnalyzer({ enabled: env.ANALYZE })(config) : config
