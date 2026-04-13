"use client"

import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useMemo, useState } from "react"

import type { HowIThinkPrinciple } from "@/lib/how-i-think-principles"
import { HOW_I_THINK_PRINCIPLES } from "@/lib/how-i-think-principles"
import { cn } from "@/lib/utils"

const accentVarByToken = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  tertiary: "var(--color-tertiary)",
} as const

const accentBgByToken = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  tertiary: "bg-tertiary/10 text-tertiary",
} as const

function SortableCard({
  id,
  className,
  style,
  children,
}: {
  id: string
  className: string
  style: React.CSSProperties
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <article
      ref={setNodeRef}
      className={className}
      style={{
        ...style,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.85 : 1,
        zIndex: isDragging ? 50 : undefined,
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </article>
  )
}

export type HowIThinkProps = {
  /** Hide the internal section heading when composed under a page hero. */
  showHeader?: boolean
  /** Show the draggable helper microcopy. */
  showHelperText?: boolean
  /** Override helper copy (set to `null` to render nothing). */
  helperText?: React.ReactNode
}

export default function HowIThink({
  showHeader = true,
  showHelperText = true,
  helperText = "Drag cards to reprioritise — the number shows your current ranking.",
}: HowIThinkProps) {
  const initialIds = useMemo<HowIThinkPrinciple["id"][]>(
    () => HOW_I_THINK_PRINCIPLES.map((p) => p.id),
    [],
  )
  const [ids, setIds] = useState<HowIThinkPrinciple["id"][]>(initialIds)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  )

  const itemsById = useMemo(() => {
    const map = new Map<HowIThinkPrinciple["id"], HowIThinkPrinciple>(
      HOW_I_THINK_PRINCIPLES.map((p) => [p.id, p]),
    )
    return map
  }, [])

  return (
    <section id="how-i-think" className="scroll-mt-28">
      {showHeader ? (
        <header className="text-center">
          <div className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Principles
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Philosophy &amp; principles
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base font-light leading-relaxed text-muted-foreground">
            A small set of principles I use to navigate ambiguity, reduce rework, and keep delivery tethered to outcomes.
          </p>
        </header>
      ) : null}

      {showHelperText ? (
        <p className={cn("text-center text-sm text-muted-foreground", showHeader ? "mt-6" : "mt-2")}>
          {helperText}
        </p>
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (!over) return
          if (active.id === over.id) return
          setIds((prev) => {
            const oldIndex = prev.indexOf(String(active.id))
            const newIndex = prev.indexOf(String(over.id))
            if (oldIndex === -1 || newIndex === -1) return prev
            return arrayMove(prev, oldIndex, newIndex)
          })
        }}
      >
        <SortableContext items={ids} strategy={rectSortingStrategy}>
          <div className="mt-8 grid grid-cols-1 items-stretch gap-4 md:mt-10 md:grid-cols-2 md:auto-rows-fr lg:grid-cols-3">
            {ids.map((id, index) => {
              const p = itemsById.get(id)
              if (!p) return null
              const rank = index + 1
              const { Icon } = p
              return (
                <SortableCard
                  key={p.id}
                  id={p.id}
                  className="group relative flex cursor-grab select-none flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-editorial transition will-change-transform hover:-translate-y-0.5 hover:shadow-editorial-lg active:cursor-grabbing"
                  style={{
                    ["--editorial-accent" as never]: accentVarByToken[p.accent],
                  }}
                >
                  {/* Accent top stripe */}
                  <div
                    className="h-1 w-full shrink-0"
                    style={{ background: accentVarByToken[p.accent] }}
                    aria-hidden
                  />

                  <div className="flex flex-1 flex-col gap-5 px-6 py-6 md:px-7 md:py-7">
                    {/* Header row: icon + rank */}
                    <div className="flex items-center justify-between">
                      <div className={cn("flex size-10 items-center justify-center rounded-xl", accentBgByToken[p.accent])}>
                        <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                      </div>
                      <span
                        className="font-mono text-3xl font-black leading-none tabular-nums transition-all duration-300"
                        style={{ color: accentVarByToken[p.accent], opacity: 0.18 + (6 - rank) * 0.115 }}
                        aria-label={`Priority ${rank}`}
                      >
                        {String(rank).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Quote */}
                    <div className="flex-1">
                      <h3 className="text-xl font-extrabold tracking-tight text-foreground leading-snug md:text-2xl">
                        <span className={p.underline ? "editorial-green-underline" : undefined}>
                          &ldquo;{p.quote.toUpperCase()}&rdquo;
                        </span>
                      </h3>
                    </div>

                    {/* Why + In practice */}
                    <div className="space-y-3 border-t border-outline-variant/20 pt-4">
                      <div>
                        <div className="text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: accentVarByToken[p.accent] }}>
                          Why it matters
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                          {p.why}
                        </p>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                          In practice
                        </div>
                        <p className="mt-1 text-sm italic leading-relaxed text-muted-foreground">
                          {p.example}
                        </p>
                      </div>
                    </div>
                  </div>
                </SortableCard>
              )
            })}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  )
}
