// Brand mark SVG — colours are locked to the Editorial Expert design system.
// Primary #00694c circle base, dashed inner ring at 55% opacity for depth.
export function BrandMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="38" fill="#003828" stroke="#00694c" strokeWidth="3" />
      <circle
        cx="40"
        cy="40"
        r="27"
        fill="none"
        stroke="#0d8c6c"
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
        fill="#c8ebe0"
        dominantBaseline="central"
      >
        CP
      </text>
    </svg>
  )
}
