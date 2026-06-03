// Purpose: Data source attribution footer for weather views.

export function WeatherAttribution() {
  return (
    <p className="pt-1 text-[11px] text-on-surface-variant/75">
      Data from{" "}
      <a
        href="https://open-meteo.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        Open-Meteo
      </a>
    </p>
  )
}
