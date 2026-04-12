import os from "node:os"

import withBundleAnalyzer from "@next/bundle-analyzer"
import { type NextConfig } from "next"

import { env } from "./env.mjs"

/** Hostnames allowed to load /_next/* in dev (HMR, chunks, CSS). See `allowedDevOrigins` in Next docs. */
const extraDevOrigins = (process.env.NEXT_DEV_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean)

/**
 * When you open the dev server as http://10.x.x.x:3000 (Network URL), the browser origin is that IP.
 * Next 15 blocks /_next/* unless the host is listed — without LAN IPs the app loads with no JS/CSS.
 */
function devLanHostnames(): string[] {
  if (process.env.NODE_ENV === "production") return []
  try {
    const nets = os.networkInterfaces()
    const hosts: string[] = []
    for (const addrs of Object.values(nets)) {
      if (!addrs) continue
      for (const addr of addrs) {
        if (addr.internal) continue
        const fam = addr.family as string | number
        const isV4 = fam === "IPv4" || fam === 4
        if (isV4) hosts.push(addr.address)
      }
    }
    return hosts
  } catch {
    /* e.g. sandboxed CI / uv_interface_addresses unavailable — fall back to env + defaults */
    return []
  }
}

const allowedDevOrigins = Array.from(
  new Set(["127.0.0.1", "localhost", "::1", ...devLanHostnames(), ...extraDevOrigins]),
)

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins,
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
