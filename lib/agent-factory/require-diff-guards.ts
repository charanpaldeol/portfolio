/**
 * Gates for factory `require_diff`: refuse commits that only touch meta/non-shipping files
 * or that do not touch product/tooling roots (app, components, lib, etc.).
 */

const DEFAULT_MEANINGFUL_PREFIXES = [
  "app/",
  "components/",
  "lib/",
  "config/",
  "scripts/",
  "e2e/",
  "public/",
] as const

/** Git porcelain paths (repo-relative, forward slashes). */
export function isNonShippingPath(p: string): boolean {
  const norm = p.replaceAll("\\", "/")
  return (
    norm === "backlog.md" ||
    norm.startsWith("agents/") ||
    norm === "README.md" ||
    norm.startsWith("docs/") ||
    norm === ".gitignore"
  )
}

function parseExtraPrefixes(raw: string | undefined): string[] {
  const t = (raw ?? "").trim()
  if (!t) return []
  return t
    .split(",")
    .map((s) => s.trim().replaceAll("\\", "/"))
    .filter(Boolean)
    .map((s) => (s.endsWith("/") ? s : `${s}/`))
}

export function meaningfulPathPrefixes(): string[] {
  const extra = parseExtraPrefixes(process.env.FACTORY_MEANINGFUL_PATH_PREFIXES)
  return [...DEFAULT_MEANINGFUL_PREFIXES, ...extra]
}

/** True if at least one path lies under a shipping root (UI, APIs, libs, factory scripts, e2e, assets). */
export function hasMeaningfulShippingPath(paths: string[], prefixes?: readonly string[]): boolean {
  const pre = prefixes ?? meaningfulPathPrefixes()
  return paths.some((p) => {
    const norm = p.replaceAll("\\", "/")
    return pre.some((prefix) => {
      if (prefix.endsWith("/")) {
        const dirOrFileRoot = prefix.slice(0, -1)
        return norm === dirOrFileRoot || norm.startsWith(prefix)
      }
      return norm === prefix || norm.startsWith(`${prefix}/`)
    })
  })
}

export function onlyNonShippingChanges(paths: string[]): boolean {
  return paths.length > 0 && paths.every((p) => isNonShippingPath(p))
}
