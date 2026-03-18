export default function HowIWork() {
  const nodes = [
    {
      label: "Discover",
      sub: "Pain points & opportunities",
      colorClass: "text-[#534AB7]",
    },
    {
      label: "Business case",
      sub: "Build vs buy, ROI",
      colorClass: "text-[#534AB7]",
    },
    {
      label: "Deliver",
      sub: "Build or implement",
      colorClass: "text-[#085041]",
    },
    {
      label: "Change mgmt",
      sub: "Adoption & training",
      colorClass: "text-[#633806]",
    },
    {
      label: "Value realized",
      sub: "Measured outcomes",
      colorClass: "text-[#085041]",
    },
  ]

  return (
    <section>
      <header>
        <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">How I work</div>
        <h2 className="mt-2 text-xl font-medium text-foreground">End-to-end, every time</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xl">
          I don't hand off when the interesting part is done. I cover the full arc — from first conversation to
          realized value.
        </p>
      </header>

      {/* Arc diagram */}
      <div className="mt-8 overflow-x-auto">
        <div className="flex items-start min-w-max">
          {nodes.map((node, idx) => (
            <div key={node.label} className="flex items-start">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "w-12 h-12 rounded-full flex items-center justify-center text-[10px] font-medium text-center leading-tight border border-current/20",
                    node.colorClass,
                  ].join(" ")}
                >
                  {node.label}
                </div>
                <div className="text-[10px] text-muted-foreground text-center mt-1.5 leading-tight max-w-[72px]">
                  {node.sub}
                </div>
              </div>
              {idx < nodes.length - 1 ? (
                <span className="text-muted-foreground text-sm pb-5 flex-shrink-0 mx-1" aria-hidden="true">
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Stakeholder cards */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-foreground mb-1">Business teams</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Translate pain into requirements — workshops, process mapping, making sure the solution solves the right
            problem.
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-foreground mb-1">Architects & tech leads</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Solution design, technical tradeoffs, and bridging what's technically possible with what the business
            actually needs.
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-foreground mb-1">Dev & delivery teams</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Lead delivery — clearing blockers, keeping scope honest, connecting daily work back to the business
            outcome.
          </p>
        </div>
      </div>
    </section>
  )
}

