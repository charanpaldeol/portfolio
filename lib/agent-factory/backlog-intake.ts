const SECTION_HEADING = "## Factory research intake"

const ItemHeadingRe = /^###\s+([A-Z][A-Z0-9_]*)\s*[—–-]\s+(.+?)\s*$/
const PriorityRe = /^-\s*Priority:\s*(\d+)\s*$/i
const CommandRe = /^-\s*Command:\s+(.+?)\s*$/i

export type ParsedIntakeItem = {
  id: string
  title: string
  /** Set only when a `- Priority:` line is present under the heading. */
  priority: number | undefined
  command: string | null
}

export function researchIntakeSectionHeading() {
  return SECTION_HEADING
}

export function extractResearchIntakeSection(markdown: string): string[] {
  const lines = markdown.split(/\r?\n/)
  const startIdx = lines.findIndex((l) => l.trim() === SECTION_HEADING)
  if (startIdx === -1) return []

  const body: string[] = []
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i] ?? ""
    if (line.startsWith("## ") && line.trim() !== SECTION_HEADING) break
    body.push(line)
  }
  return body
}

export type ParsedIntakeItemReady = ParsedIntakeItem & { priority: number }

export function parseIntakeItems(sectionLines: string[], warn: (msg: string) => void): ParsedIntakeItemReady[] {
  const items: ParsedIntakeItem[] = []
  let current: ParsedIntakeItem | null = null

  const flush = () => {
    if (current) {
      items.push(current)
      current = null
    }
  }

  for (const raw of sectionLines) {
    const line = raw.trimEnd()
    const hm = line.match(ItemHeadingRe)
    if (hm?.[1] && hm[2] != null) {
      flush()
      current = {
        id: hm[1],
        title: hm[2].trim(),
        priority: undefined,
        command: null,
      }
      continue
    }
    if (!current) continue

    const pm = line.match(PriorityRe)
    if (pm?.[1]) {
      current.priority = Number(pm[1])
      continue
    }
    const cm = line.match(CommandRe)
    if (cm?.[1]) {
      current.command = cm[1].trim()
      continue
    }
  }
  flush()

  const ready: ParsedIntakeItemReady[] = []
  for (const it of items) {
    const p = it.priority
    if (p === undefined || !Number.isFinite(p) || p < 0) {
      warn(`factory:backlog:intake: skip ${it.id} — invalid or missing Priority (use "- Priority: <int>")`)
      continue
    }
    ready.push({ ...it, priority: p })
  }
  return ready
}

export function defaultIntakeSpec(id: string, command: string | null, priority: number) {
  const cmd = command?.trim() || `pnpm -s factory:implement ${id}`
  return {
    command: cmd,
    require_diff: true,
    definition_of_done: `See backlog.md (Factory research intake): ${id} (priority ${priority})`,
  }
}

/** Single-line title safe for `### ID — title` (no newlines). */
export function sanitizeIntakeTitle(title: string, maxLen = 180) {
  return title.replace(/\s+/g, " ").trim().slice(0, maxLen)
}

/**
 * Appends one task block under `## Factory research intake` so `factory:backlog:intake` can merge it into the roadmap.
 * Skips if that `### ID —` heading already exists anywhere in the section body.
 */
export function appendFactoryResearchIntakeBlock(args: {
  markdown: string
  id: string
  title: string
  priority: number
  command: string
  extraLines?: string[]
}): { markdown: string; appended: boolean; reason: string } {
  const id = args.id.trim()
  if (!id) return { markdown: args.markdown, appended: false, reason: "empty id" }

  const md = args.markdown
  const start = md.indexOf(SECTION_HEADING)
  if (start === -1) {
    return { markdown: md, appended: false, reason: `missing ${SECTION_HEADING} in backlog.md` }
  }

  const afterHeading = md.slice(start + SECTION_HEADING.length)
  const nextH2 = afterHeading.search(/\n## /)
  const sectionEnd = nextH2 === -1 ? md.length : start + SECTION_HEADING.length + nextH2
  const sectionSlice = md.slice(start, sectionEnd)
  const headingNeedle = `### ${id} —`
  if (sectionSlice.includes(headingNeedle)) {
    return { markdown: md, appended: false, reason: `id ${id} already in Factory research intake` }
  }

  const title = sanitizeIntakeTitle(args.title)
  const cmd = args.command.trim()
  const extras = (args.extraLines ?? []).filter((l) => l.trim().length > 0)
  const extraBlock = extras.length ? `${extras.map((l) => (l.startsWith("-") ? l : `- ${l}`)).join("\n")}\n` : ""

  const block = `\n### ${id} — ${title}\n- Priority: ${args.priority}\n- Command: ${cmd}\n${extraBlock}`

  const next = md.slice(0, sectionEnd) + block + md.slice(sectionEnd)
  return { markdown: next, appended: true, reason: "appended" }
}
