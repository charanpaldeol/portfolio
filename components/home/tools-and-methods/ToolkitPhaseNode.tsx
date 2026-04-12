"use client"

import type { LucideIcon } from "lucide-react"
import { Box, FileText, Search, TrendingUp, Users, Zap } from "lucide-react"

import { cn } from "@/lib/utils"

const phaseIcons: Record<string, LucideIcon> = {
  Discover: Search,
  Define: FileText,
  Design: Box,
  Deliver: Zap,
  Adopt: Users,
  Value: TrendingUp,
}

function Chip({
  children,
  bold,
  accent,
}: {
  children: string
  bold?: boolean
  accent: "primary" | "secondary"
}) {
  return (
    <span
      className={cn(
        "rounded-md bg-surface-container px-2.5 py-1 text-[11px] font-medium text-muted-foreground",
        bold && accent === "primary" && "bg-primary-fixed font-semibold text-on-primary-fixed",
        bold && accent === "secondary" && "bg-secondary-fixed font-semibold text-on-secondary-fixed"
      )}
    >
      {children}
    </span>
  )
}

export function ToolkitPhaseNode({
  phase,
  description,
  chips,
  bold,
  accent,
}: {
  phase: string
  description: string
  chips: string[]
  bold: string[]
  accent: "primary" | "secondary"
}) {
  const Icon = phaseIcons[phase] ?? Search
  const boldSet = new Set(bold)

  return (
    <div
      className={cn(
        "group relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-editorial",
        "border-l-4 transition-transform duration-500 ease-out will-change-transform",
        "hover:-translate-y-2 hover:shadow-editorial-lg",
        accent === "primary" ? "border-primary" : "border-secondary"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          accent === "primary" ? "bg-primary/10" : "bg-secondary/10"
        )}
        aria-hidden
      />
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "min-w-0 text-[10px] font-bold tracking-[0.2em] uppercase",
              accent === "primary" ? "text-primary" : "text-secondary"
            )}
          >
            {phase}
          </span>
          <Icon
            className={cn(
              "size-5 shrink-0 text-muted-foreground/50 transition-colors duration-500",
              accent === "primary"
                ? "group-hover:text-primary/70"
                : "group-hover:text-secondary/70"
            )}
            strokeWidth={1.5}
            aria-hidden
          />
        </div>

        <p className="text-sm font-normal leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <Chip key={chip} bold={boldSet.has(chip)} accent={accent}>
              {chip}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  )
}
