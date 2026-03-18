export default function WhatIBring() {
  const cards = [
    {
      badge: "Discovery",
      badgeClass: "bg-[#EEEDFE] text-[#534AB7]",
      title: "Business analysis & problem framing",
      body: "Surface pain points, map processes, define what success looks like before any solution is chosen.",
    },
    {
      badge: "Decision",
      badgeClass: "bg-[#EEEDFE] text-[#534AB7]",
      title: "Business case & solution selection",
      body: "ROI analysis, options assessment, build vs buy — with the rigour to back them up to any stakeholder.",
    },
    {
      badge: "Delivery",
      badgeClass: "bg-[#E1F5EE] text-[#085041]",
      title: "In-house build or SaaS implementation",
      body: "Architect in-house solutions and lead dev teams, or own end-to-end vendor implementations from selection to go-live.",
    },
    {
      badge: "Adoption",
      badgeClass: "bg-[#FAEEDA] text-[#854F0B]",
      title: "Change management & value realization",
      body: "Training, communication, stakeholder alignment, and tracking until the value is realized — not just deployed.",
    },
  ]

  return (
    <section>
      <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">What I bring</div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {cards.map((card) => (
          <div key={card.title} className="bg-background border border-border rounded-xl p-5">
            <div
              className={[
                "text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mb-2",
                card.badgeClass,
              ].join(" ")}
            >
              {card.badge}
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">{card.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

