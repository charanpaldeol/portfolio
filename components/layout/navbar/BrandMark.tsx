// Brand mark SVG — fills/strokes use @theme tokens (DESIGN.md §2).
export function BrandMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 80 80" aria-hidden="true">
      <circle
        cx="40"
        cy="40"
        r="38"
        fill="var(--color-on-primary-fixed)"
        stroke="var(--color-primary)"
        strokeWidth="3"
      />
      <circle
        cx="40"
        cy="40"
        r="27"
        fill="none"
        stroke="var(--color-primary-container)"
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity="0.55"
      />
      <text
        x="40"
        y="43"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill="var(--color-primary-fixed)"
        dominantBaseline="central"
      >
        CP
      </text>
    </svg>
  )
}
