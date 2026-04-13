import { SystemsThinkingDiagram } from "@/components/home/SystemsThinkingDiagram"
import { systemsExamples } from "@/lib/systems-thinking-data"
import { cn } from "@/lib/utils"

function layerChipClasses(layer: "token" | "component" | "platform") {
  return cn(
    "inline-flex rounded-full px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide",
    layer === "token" && "bg-primary-fixed text-on-primary-fixed",
    layer === "component" && "bg-secondary-fixed text-on-secondary-fixed",
    layer === "platform" && "bg-tertiary-fixed text-on-tertiary-fixed"
  )
}

export default function SystemsThinkingSection() {
  return (
    <section className="mt-12 md:mt-14" aria-labelledby="hiw-systems-heading">
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
        Why token-level decisions matter
      </p>
      <h2
        id="hiw-systems-heading"
        className="font-display mt-2 text-2xl font-bold tracking-tight text-on-surface md:text-3xl"
      >
        Systems Thinking in Practice
      </h2>
      <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-on-surface-variant md:text-base">
        A concrete view of how choices at the pattern and token layer ripple into product scope and platform outcomes.
      </p>

      <SystemsThinkingDiagram />

      <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {systemsExamples.map((ex) => (
          <li key={ex.id}>
            <article className="flex h-full flex-col rounded-xl bg-surface-container-lowest p-6 shadow-editorial md:p-7">
              <span className={layerChipClasses(ex.layer)}>
                {ex.layer === "token" ? "Token" : ex.layer === "component" ? "Component" : "Platform"}
              </span>
              <h3 className="font-display mt-4 text-lg font-bold text-on-surface md:text-xl">{ex.title}</h3>
              <p className="mt-2 font-sans text-sm font-normal leading-relaxed text-on-surface-variant md:text-[0.9375rem]">
                {ex.description}
              </p>
              <p className="mt-3 font-sans text-sm font-medium leading-snug text-primary md:text-[0.9375rem]">
                {ex.impact}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
