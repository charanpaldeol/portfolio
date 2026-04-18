"use client"

import { useEffect, useMemo, useState } from "react"

import { homeJumpNavLinks } from "@/lib/home-page-sections"
import { cn } from "@/lib/utils"

type JumpHref = (typeof homeJumpNavLinks)[number]["href"]

export default function HomeJumpNav() {
  const defaultHref: JumpHref = homeJumpNavLinks[0]?.href ?? "#page-top"
  const [activeHref, setActiveHref] = useState<JumpHref>(defaultHref)

  const linksWithTargets = useMemo(
    () =>
      homeJumpNavLinks.map((item) => ({
        ...item,
        targetId: item.href.replace(/^#/, ""),
      })),
    [],
  )

  useEffect(() => {
    if (typeof window === "undefined") return
    const observers: IntersectionObserver[] = []

    linksWithTargets.forEach(({ href, targetId }) => {
      const target = document.getElementById(targetId)
      if (!target) return

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry?.isIntersecting) {
            setActiveHref(href)
          }
        },
        {
          rootMargin: "-35% 0px -50% 0px",
          threshold: 0.1,
        },
      )

      observer.observe(target)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [linksWithTargets])

  const activeLabel = linksWithTargets.find((item) => item.href === activeHref)?.label ?? linksWithTargets[0]?.label

  return (
    <nav
      aria-label="On this page"
      className={cn(
        "sticky top-16 z-30 -mx-6 mb-2 bg-surface-container-low/85 py-3 shadow-editorial-float backdrop-blur-md md:-mx-8"
      )}
    >
      <p className="px-4 pb-2 font-sans text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase md:px-6">
        Jump to section. Now viewing: {activeLabel}
      </p>
      <div className="flex snap-x snap-mandatory gap-1 overflow-x-auto px-4 pb-0.5 md:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {linksWithTargets.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "snap-start whitespace-nowrap rounded-full px-3 py-1.5 font-sans text-xs font-semibold tracking-wide text-muted-foreground uppercase",
              "ring-1 ring-outline-variant/15 hover:bg-surface-container-high hover:text-foreground",
              activeHref === item.href && "bg-surface-container-high text-foreground ring-primary/35"
            )}
            aria-current={activeHref === item.href ? "location" : undefined}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
