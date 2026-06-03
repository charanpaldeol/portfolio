// Purpose: Small SVG wind-direction compass for weather detail tiles.
type WindCompassProps = {
  degrees: number | null
  className?: string
}

export function WindCompass({ degrees, className }: WindCompassProps) {
  const rotation = typeof degrees === "number" && Number.isFinite(degrees) ? degrees : 0

  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className ?? "h-10 w-10 text-on-surface-variant"}
    >
      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
      <text x="24" y="10" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.6">
        N
      </text>
      <g transform={`rotate(${rotation} 24 24)`}>
        <path d="M24 8 L28 28 L24 24 L20 28 Z" fill="currentColor" />
      </g>
    </svg>
  )
}
