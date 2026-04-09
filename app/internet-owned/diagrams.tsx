import type { ReactNode } from "react"

/** Single tonal lift for figures — ghost edge only per DESIGN.md. */
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

function House({ x, y, label, active = false }: { x: number; y: number; label: string; active?: boolean }) {
  return (
    <g>
      <rect x={x - 18} y={y - 14} width="36" height="28" rx="7" fill={active ? "#ECFDF5" : "#F8FAFC"} stroke={active ? "#10B981" : "#94A3B8"} />
      <path d={`M${x - 20} ${y - 13} L${x} ${y - 28} L${x + 20} ${y - 13}`} fill={active ? "#D1FAE5" : "#E2E8F0"} stroke={active ? "#10B981" : "#94A3B8"} />
      <text x={x} y={y + 28} textAnchor="middle" fontSize="11" fill="#334155">
        {label}
      </text>
    </g>
  )
}

export function MeshStagesDiagram() {
  return (
    <DiagramFigure aria-label="Mesh network diagram">
      <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">Network growth stages</span>
        <div className="flex items-center gap-3 font-sans text-xs font-normal text-on-surface-variant">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Mesh link
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Gateway link
          </span>
        </div>
      </figcaption>
      <svg viewBox="0 0 1140 320" role="img" aria-label="Mesh network growth from one house to a connected neighborhood with gateways" className="w-full">
        <defs>
          <linearGradient id="io-stageBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>
          <marker id="io-flowArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#10B981" />
          </marker>
          <marker id="io-gatewayArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#0369A1" />
          </marker>
        </defs>

        <rect x="16" y="18" width="350" height="286" rx="16" fill="url(#io-stageBg)" stroke="#CBD5E1" />
        <rect x="394" y="18" width="350" height="286" rx="16" fill="url(#io-stageBg)" stroke="#CBD5E1" />
        <rect x="772" y="18" width="350" height="286" rx="16" fill="url(#io-stageBg)" stroke="#CBD5E1" />

        <text x="36" y="48" fontSize="15" fontWeight="700" fill="#0F172A">
          Stage 1: A single house starts
        </text>
        <House x={192} y={152} label="Starter node" active />
        <circle cx="192" cy="106" r="7" fill="#10B981" />
        <text x="208" y="111" fontSize="11" fill="#065F46">
          Mesh hardware
        </text>

        <text x="414" y="48" fontSize="15" fontWeight="700" fill="#0F172A">
          Stage 2: Neighborhood mesh forms
        </text>
        <House x={466} y={112} label="A" />
        <House x={570} y={88} label="B" active />
        <House x={678} y={120} label="C" />
        <House x={512} y={202} label="D" />
        <House x={632} y={208} label="E" />
        <line x1="483" y1="112" x2="552" y2="92" stroke="#10B981" strokeWidth="3" markerEnd="url(#io-flowArrow)" />
        <line x1="588" y1="92" x2="660" y2="118" stroke="#10B981" strokeWidth="3" markerEnd="url(#io-flowArrow)" />
        <line x1="570" y1="104" x2="523" y2="188" stroke="#10B981" strokeWidth="3" markerEnd="url(#io-flowArrow)" />
        <line x1="531" y1="202" x2="613" y2="208" stroke="#10B981" strokeWidth="3" markerEnd="url(#io-flowArrow)" />
        <line x1="660" y1="136" x2="632" y2="190" stroke="#10B981" strokeWidth="3" markerEnd="url(#io-flowArrow)" />

        <text x="792" y="48" fontSize="15" fontWeight="700" fill="#0F172A">
          Stage 3: Gateway houses add backup internet
        </text>
        <House x={844} y={108} label="G1" active />
        <House x={946} y={90} label="N1" />
        <House x={1044} y={124} label="N2" />
        <House x={912} y={206} label="N3" />
        <House x={1024} y={206} label="G2" active />
        <line x1="862" y1="106" x2="927" y2="94" stroke="#10B981" strokeWidth="3" markerEnd="url(#io-flowArrow)" />
        <line x1="964" y1="96" x2="1026" y2="121" stroke="#10B981" strokeWidth="3" markerEnd="url(#io-flowArrow)" />
        <line x1="946" y1="106" x2="915" y2="190" stroke="#10B981" strokeWidth="3" markerEnd="url(#io-flowArrow)" />
        <line x1="928" y1="206" x2="1006" y2="206" stroke="#10B981" strokeWidth="3" markerEnd="url(#io-flowArrow)" />

        <circle cx="1090" cy="86" r="10" fill="#0369A1" />
        <text x="1043" y="68" fontSize="11" fill="#0C4A6E">
          Traditional internet
        </text>
        <line x1="1038" y1="206" x2="1088" y2="96" stroke="#0369A1" strokeWidth="3" markerEnd="url(#io-gatewayArrow)" />
        <line x1="850" y1="108" x2="1084" y2="86" stroke="#0369A1" strokeWidth="2.5" strokeDasharray="6 5" markerEnd="url(#io-gatewayArrow)" />
      </svg>
    </DiagramFigure>
  )
}

export function PayoffChart() {
  const years = Array.from({ length: 13 }, (_, year) => year)
  const monthlyCost = 50
  const annualCost = monthlyCost * 12
  const investment = 2250
  const chartBottom = 250
  const chartTop = 30
  const chartLeft = 62
  const chartWidth = 760
  const chartHeight = chartBottom - chartTop
  const yMax = 7200

  const xForYear = (year: number) => chartLeft + (year / 12) * chartWidth
  const yForValue = (value: number) => chartBottom - (value / yMax) * chartHeight

  const cumulativePoints = years.map((year) => `${xForYear(year)},${yForValue(year * annualCost)}`).join(" ")
  const areaPoints = `${chartLeft},${chartBottom} ${cumulativePoints} ${xForYear(12)},${chartBottom}`
  const breakEvenYear = investment / annualCost

  return (
    <DiagramFigure aria-label="Cost payoff chart">
      <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">Cost comparison timeline</span>
        <div className="flex flex-wrap items-center gap-3 font-sans text-xs font-normal text-on-surface-variant">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Traditional monthly bill
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" /> One-time hardware purchase
          </span>
        </div>
      </figcaption>
      <svg viewBox="0 0 900 300" role="img" aria-label="Payoff timeline comparing cumulative monthly internet cost and one-time mesh hardware cost" className="w-full">
        <rect x={chartLeft} y={chartTop} width={chartWidth} height={chartHeight} fill="#F8FAFC" stroke="#E2E8F0" />

        {[0, 1200, 2400, 3600, 4800, 6000, 7200].map((value) => (
          <g key={value}>
            <line x1={chartLeft} y1={yForValue(value)} x2={chartLeft + chartWidth} y2={yForValue(value)} stroke="#E2E8F0" />
            <text x="10" y={yForValue(value) + 4} fontSize="11" fill="#64748B">
              ${value.toLocaleString()}
            </text>
          </g>
        ))}

        {[0, 2, 4, 6, 8, 10, 12].map((year) => (
          <g key={year}>
            <line x1={xForYear(year)} y1={chartTop} x2={xForYear(year)} y2={chartBottom} stroke="#E2E8F0" />
            <text x={xForYear(year) - 11} y="272" fontSize="11" fill="#64748B">
              Y{year}
            </text>
          </g>
        ))}

        <polygon points={areaPoints} fill="#BAE6FD" opacity="0.45" />
        <polyline points={cumulativePoints} fill="none" stroke="#0284C7" strokeWidth="4" />

        <line x1={chartLeft} y1={yForValue(investment)} x2={chartLeft + chartWidth} y2={yForValue(investment)} stroke="#059669" strokeWidth="3" />
        <text x={chartLeft + chartWidth - 210} y={yForValue(investment) - 8} fontSize="12" fill="#065F46">
          One-time hardware (~$2,250 example)
        </text>

        <line x1={xForYear(breakEvenYear)} y1={chartTop} x2={xForYear(breakEvenYear)} y2={chartBottom} stroke="#0F172A" strokeDasharray="5 5" />
        <circle cx={xForYear(breakEvenYear)} cy={yForValue(investment)} r="5" fill="#0F172A" />
        <text x={xForYear(breakEvenYear) - 28} y={chartTop - 6} fontSize="12" fill="#0F172A">
          ~3.8 years
        </text>
      </svg>
      <p className="mt-4 font-sans text-xs font-normal leading-relaxed text-on-surface-variant md:text-sm">
        Assumes $50/month baseline internet spend and one-time hardware example in the middle of the estimated $1,500–$3,000 range.
      </p>
    </DiagramFigure>
  )
}

export function EarningsDiagram() {
  const neighbors = [
    { name: "N1", gb: 140 },
    { name: "N2", gb: 180 },
    { name: "N3", gb: 120 },
    { name: "N4", gb: 160 },
    { name: "N5", gb: 150 },
  ]
  const rate = 0.02
  const maxGb = 200
  const totalGb = neighbors.reduce((sum, neighbor) => sum + neighbor.gb, 0)
  const projected = totalGb * rate
  const barWidth = 46
  const gap = 24
  const startX = 120
  const baseY = 212
  const maxHeight = 120

  return (
    <DiagramFigure aria-label="Earnings scenario chart">
      <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">Monthly earning scenario</span>
        <span className="font-sans text-xs font-normal text-on-surface-variant">Micropayment model: ~$0.02 per GB routed</span>
      </figcaption>
      <svg viewBox="0 0 900 280" role="img" aria-label="Five-neighbor usage chart showing monthly mesh routing income" className="w-full">
        <rect x="74" y="38" width="420" height="186" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <line x1="98" y1={baseY} x2="470" y2={baseY} stroke="#94A3B8" />

        {[0, 50, 100, 150, 200].map((tick) => {
          const y = baseY - (tick / maxGb) * maxHeight
          return (
            <g key={tick}>
              <line x1="98" y1={y} x2="470" y2={y} stroke="#E2E8F0" />
              <text x="80" y={y + 4} fontSize="11" fill="#64748B">
                {tick}
              </text>
            </g>
          )
        })}

        {neighbors.map((neighbor, index) => {
          const height = (neighbor.gb / maxGb) * maxHeight
          const x = startX + index * (barWidth + gap)
          const y = baseY - height
          return (
            <g key={neighbor.name}>
              <rect x={x} y={y} width={barWidth} height={height} rx="8" fill="#10B981" opacity="0.9" />
              <text x={x + barWidth / 2} y={baseY + 18} textAnchor="middle" fontSize="11" fill="#334155">
                {neighbor.name}
              </text>
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="10" fill="#065F46">
                {neighbor.gb} GB
              </text>
            </g>
          )
        })}

        <path d="M505 132 C 560 132, 575 132, 625 132" stroke="#10B981" strokeWidth="3.5" fill="none" />
        <polygon points="625,132 614,126 614,138" fill="#10B981" />

        <rect x="636" y="62" width="226" height="146" rx="12" fill="white" stroke="#CBD5E1" />
        <text x="654" y="90" fontSize="13" fontWeight="700" fill="#0F172A">
          Income estimate
        </text>
        <text x="654" y="114" fontSize="12" fill="#334155">
          Total routed: {totalGb} GB / month
        </text>
        <text x="654" y="136" fontSize="12" fill="#334155">
          Rate: ${rate.toFixed(2)} per GB
        </text>
        <line x1="654" y1="148" x2="844" y2="148" stroke="#E2E8F0" />
        <text x="654" y="173" fontSize="16" fontWeight="700" fill="#047857">
          ${projected.toFixed(2)} / month
        </text>
        <text x="654" y="194" fontSize="11" fill="#64748B">
          Typical target range: $15–$20 with small usage fluctuations
        </text>
      </svg>
    </DiagramFigure>
  )
}
