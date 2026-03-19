"use client"

import React, { forwardRef, type ReactNode, useRef } from "react"
import { twMerge } from "tailwind-merge"
import { AnimatedBeam } from "@/registry/magicui/animated-beam"

/* ── tiny SVG icon shell ─────────────────────────────────── */

function Svg({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      className={twMerge("size-full", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

/* ── icons (Lucide-style paths) ──────────────────────────── */

function SearchIcon({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </Svg>
  )
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </Svg>
  )
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </Svg>
  )
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </Svg>
  )
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </Svg>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  )
}

function LayersIcon({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </Svg>
  )
}

function TerminalIcon({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </Svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Svg>
  )
}

/* ── circle (beam endpoint) ──────────────────────────────── */

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children: ReactNode }
>(({ className, children }, ref) => (
  <div
    ref={ref}
    className={twMerge(
      "relative z-20 flex size-13 items-center justify-center rounded-full border-2 border-border bg-background p-3 shadow-sm",
      className,
    )}
  >
    {children}
  </div>
))
Circle.displayName = "Circle"

/* ── labelled node (circle + text below) ─────────────────── */

const Node = forwardRef<
  HTMLDivElement,
  {
    icon: ReactNode
    label: string
    sub?: string
  }
>(({ icon, label, sub }, ref) => {
  return (
    <div className="flex w-28 flex-col items-center gap-1">
      <Circle ref={ref}>
        <span className="text-muted-foreground">{icon}</span>
      </Circle>
      <span className="text-xs font-medium leading-tight text-center max-w-28 text-foreground">
        {label}
      </span>
      {sub && (
        <span className="text-[10px] text-muted-foreground leading-tight text-center max-w-24">
          {sub}
        </span>
      )}
    </div>
  )
})
Node.displayName = "Node"

/* ── main component ──────────────────────────────────────── */

export default function HowIWork() {
  const containerRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)

  const discoverRef = useRef<HTMLDivElement>(null)
  const bizCaseRef = useRef<HTMLDivElement>(null)
  const deliverRef = useRef<HTMLDivElement>(null)
  const changeRef = useRef<HTMLDivElement>(null)

  const valueRef = useRef<HTMLDivElement>(null)
  const bizTeamsRef = useRef<HTMLDivElement>(null)
  const archRef = useRef<HTMLDivElement>(null)
  const devRef = useRef<HTMLDivElement>(null)

  const leftNodes = [
    { ref: discoverRef, icon: <SearchIcon />, label: "Discover" },
    { ref: bizCaseRef, icon: <BriefcaseIcon />, label: "Business case" },
    { ref: deliverRef, icon: <PackageIcon />, label: "Deliver" },
    { ref: changeRef, icon: <RefreshIcon />, label: "Change mgmt" },
  ]

  const rightNodes = [
    { ref: valueRef, icon: <TargetIcon />, label: "Value realized" },
    { ref: bizTeamsRef, icon: <UsersIcon />, label: "Business teams" },
    { ref: archRef, icon: <LayersIcon />, label: "Architects & tech leads" },
    { ref: devRef, icon: <TerminalIcon />, label: "Dev & delivery teams" },
  ]


  return (
    <section>
      <header>
        <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          How I work
        </div>
        <h2 className="mt-2 text-xl font-medium text-foreground">
          End-to-end, every time
        </h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xl">
          I don&apos;t hand off when the interesting part is done. I cover the full arc — from first
          conversation to realized value.
        </p>
      </header>

      <div
        ref={containerRef}
        className="relative mt-8 hidden h-[420px] w-full items-stretch justify-between md:flex"
        aria-hidden="true"
      >
        {/* Left column — 4 nodes */}
        <div className="flex flex-col items-center justify-between py-4">
          {leftNodes.map((n) => (
            <Node
              key={n.label}
              ref={n.ref}
              icon={n.icon}
              label={n.label}
            />
          ))}
        </div>

        {/* Center — Me */}
        <div className="flex items-center justify-center">
          <Circle
            ref={centerRef}
            className="size-18"
          >
            <UserIcon className="text-muted-foreground" />
          </Circle>
        </div>

        {/* Right column — 4 nodes */}
        <div className="flex flex-col items-center justify-between py-4">
          {rightNodes.map((n) => (
            <Node
              key={n.label}
              ref={n.ref}
              icon={n.icon}
              label={n.label}
            />
          ))}
        </div>

        {/* Beams — absolutely positioned so they don't participate in flex layout */}
        <div className="absolute inset-0">
          {leftNodes.map((n, i) => {
            const durations = [4.5, 5.2, 4.8, 5.6] as const
            const delays = [0, 0.6, 0.3, 0.9] as const
            const dur = durations[i as 0 | 1 | 2 | 3]
            const del = delays[i as 0 | 1 | 2 | 3]
            return (
              <React.Fragment key={`left-${n.label}`}>
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={n.ref}
                  toRef={centerRef}
                  duration={dur}
                  delay={del}
                />
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={n.ref}
                  toRef={centerRef}
                  duration={dur}
                  delay={del + 2.2}
                  reverse
                />
              </React.Fragment>
            )
          })}

          {rightNodes.map((n, i) => {
            const durations = [5.0, 4.6, 5.4, 4.9] as const
            const delays = [0.4, 1.0, 0.7, 1.3] as const
            const dur = durations[i as 0 | 1 | 2 | 3]
            const del = delays[i as 0 | 1 | 2 | 3]
            return (
              <React.Fragment key={`right-${n.label}`}>
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={n.ref}
                  toRef={centerRef}
                  duration={dur}
                  delay={del}
                  reverse
                />
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={n.ref}
                  toRef={centerRef}
                  duration={dur}
                  delay={del + 2.5}
                />
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Mobile fallback — simple two-column grid */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:hidden">
        {[...leftNodes, ...rightNodes].map((n) => (
          <div key={n.label} className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background p-2">
              <span className="text-muted-foreground">{n.icon}</span>
            </div>
            <div className="min-w-0">
              <span className="text-xs font-medium text-foreground">
                {n.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
