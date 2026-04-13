import type { ReactNode } from "react"

/** Single tonal lift for figures — matches `app/internet-owned/diagrams.tsx`. */
function DiagramFigure({ children, "aria-label": ariaLabel }: { children: ReactNode; "aria-label"?: string }) {
  return (
    <figure
      aria-label={ariaLabel}
      className="mt-8 overflow-hidden rounded-2xl bg-surface-container-low p-5 shadow-editorial outline outline-1 outline-outline-variant/15 md:mt-10 md:p-8"
    >
      {children}
    </figure>
  )
}

const C = {
  primary: "var(--color-primary)",
  primaryFixed: "var(--color-primary-fixed)",
  primaryDark: "var(--color-on-primary-fixed)",
  secondary: "var(--color-secondary)",
  secondaryFixed: "var(--color-secondary-fixed)",
  onSurface: "var(--color-on-surface)",
  onSurfaceVariant: "var(--color-on-surface-variant)",
  containerLow: "var(--color-surface-container-low)",
  containerHighest: "var(--color-surface-container-highest)",
} as const

const BOX_W = 200
const BOX_H = 54
const COLS = [
  { cx: 150, labelL1: "Design tokens", labelL2: "Features", labelL3a: "Cross-product", labelL3b: "consistency" },
  { cx: 450, labelL1: "Components", labelL2: "Flows", labelL3a: "Platform", labelL3b: "strategy" },
  { cx: 750, labelL1: "Patterns", labelL2: "Pages", labelL3a: "Business", labelL3b: "outcomes" },
] as const

function StackCell({
  cx,
  y,
  fill,
  stroke,
  line1,
  line2,
}: {
  cx: number
  y: number
  fill: string
  stroke: string
  line1: string
  line2?: string
}) {
  const x = cx - BOX_W / 2
  return (
    <g>
      <rect x={x} y={y} width={BOX_W} height={BOX_H} rx={10} fill={fill} stroke={stroke} strokeWidth={2} />
      <text x={cx} y={line2 ? y + 22 : y + 32} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.onSurface}>
        {line1}
      </text>
      {line2 ? (
        <text x={cx} y={y + 38} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.onSurface}>
          {line2}
        </text>
      ) : null}
    </g>
  )
}

export function SystemsThinkingDiagram() {
  const y1 = 268
  const y2 = 156
  const y3 = 44
  return (
    <DiagramFigure aria-label="Design leverage stack diagram">
      <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
          The design leverage stack
        </span>
        <span className="max-w-md font-sans text-xs font-normal leading-snug text-on-surface-variant">
          How design decisions at the token level create leverage across the entire product platform
        </span>
      </figcaption>
      <svg
        viewBox="0 0 900 400"
        role="img"
        aria-label="Three-layer stack from design tokens through product surfaces to platform outcomes, with upward connectors"
        className="w-full"
      >
        <defs>
          <marker
            id="st-leverage-arrow"
            viewBox="0 0 10 10"
            refX={8}
            refY={5}
            markerWidth={5}
            markerHeight={5}
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill={C.onSurfaceVariant} />
          </marker>
        </defs>

        <text x={24} y={y3 + 26} fontSize={11} fontWeight={700} fill={C.primaryDark}>
          Platform layer
        </text>
        <text x={24} y={y2 + 26} fontSize={11} fontWeight={700} fill={C.secondary}>
          Product layer
        </text>
        <text x={24} y={y1 + 26} fontSize={11} fontWeight={700} fill={C.primary}>
          Atomic layer
        </text>

        {COLS.map((col) => (
          <g key={col.cx}>
            <StackCell
              cx={col.cx}
              y={y3}
              fill={C.containerLow}
              stroke={C.containerHighest}
              line1={col.labelL3a}
              line2={col.labelL3b}
            />
            <StackCell
              cx={col.cx}
              y={y2}
              fill={C.secondaryFixed}
              stroke={C.secondary}
              line1={col.labelL2}
            />
            <StackCell
              cx={col.cx}
              y={y1}
              fill={C.primaryFixed}
              stroke={C.primary}
              line1={col.labelL1}
            />
            <line
              x1={col.cx}
              y1={y1}
              x2={col.cx}
              y2={y2 + BOX_H}
              stroke={C.onSurfaceVariant}
              strokeWidth={2}
              markerEnd="url(#st-leverage-arrow)"
            />
            <line
              x1={col.cx}
              y1={y2}
              x2={col.cx}
              y2={y3 + BOX_H}
              stroke={C.onSurfaceVariant}
              strokeWidth={2}
              markerEnd="url(#st-leverage-arrow)"
            />
          </g>
        ))}

        <path
          d="M 150 334 Q 450 360 750 334"
          fill="none"
          stroke={C.onSurfaceVariant}
          strokeWidth={1.5}
          strokeDasharray="5 6"
          opacity={0.85}
        />
        <text x={450} y={382} textAnchor="middle" fontSize={11} fill={C.onSurfaceVariant}>
          Decisions compound upward — consistency at the base unlocks speed and clarity at the top
        </text>
      </svg>
    </DiagramFigure>
  )
}
