import Link from "next/link"

import type { RelatedItem } from "@/lib/content-lookups"
import { cn } from "@/lib/utils"

export type RelatedGroup = {
  title: string
  items: RelatedItem[]
  /** Show the sublabel beneath each chip (useful for testimonials, proof metrics). Defaults to false. */
  showSublabel?: boolean
}

type RelatedLinksProps = {
  /** Overall heading above the groups. */
  heading?: string
  /** Optional short description above the groups. */
  description?: string
  groups: RelatedGroup[]
  className?: string
}

/**
 * Renders grouped "Related …" chips that link out to the canonical surface for
 * each piece of content. Groups with no items are skipped; if every group is
 * empty the component renders nothing. Used across project detail, services,
 * work-with-me, how-i-work, and blog pages so cross-references added in the
 * data layer are visible to visitors.
 */
export function RelatedLinks({ heading, description, groups, className }: RelatedLinksProps) {
  const nonEmpty = groups.filter((g) => g.items.length > 0)
  if (nonEmpty.length === 0) return null

  return (
    <section
      aria-label={heading ?? "Related content"}
      className={cn(
        "rounded-2xl bg-surface-container/40 p-6 sm:p-8",
        className,
      )}
    >
      {(heading || description) && (
        <header className="mb-6">
          {heading && (
            <h2 className="font-display text-lg font-semibold tracking-tight text-on-surface sm:text-xl">
              {heading}
            </h2>
          )}
          {description && (
            <p className="mt-1.5 text-sm text-on-surface/70">{description}</p>
          )}
        </header>
      )}

      <div className="flex flex-col gap-5">
        {nonEmpty.map((group) => (
          <div key={group.title}>
            <h3 className="mb-2 text-xs font-semibold tracking-wide uppercase text-on-surface/60">
              {group.title}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item.key}>
                  <RelatedChip item={item} showSublabel={group.showSublabel ?? false} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function RelatedChip({ item, showSublabel }: { item: RelatedItem; showSublabel: boolean }) {
  const baseClass = cn(
    "group inline-flex max-w-full flex-col gap-0.5 rounded-xl bg-surface-container-low px-3 py-2 text-left text-sm transition-colors",
    "hover:border-primary/40 hover:bg-primary-container/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  )
  const body = (
    <>
      <span className="line-clamp-1 font-medium text-on-surface">{item.label}</span>
      {showSublabel && item.sublabel && (
        <span className="line-clamp-2 text-xs text-on-surface/65">{item.sublabel}</span>
      )}
    </>
  )
  if (item.href) {
    return (
      <Link href={item.href} className={baseClass}>
        {body}
      </Link>
    )
  }
  return <span className={baseClass}>{body}</span>
}
