export default function HowIThink() {
  const principles = [
    {
      title: "Question the brief before accepting it",
      body: "The stated problem is rarely the real problem. I spend time upstream — challenging assumptions and asking why before jumping to solutions.",
    },
    {
      title: "Clarity over consensus",
      body: "Getting everyone to agree on the wrong thing is worse than disagreement. I push for shared understanding of the problem first — alignment on solutions second.",
    },
    {
      title: "Build for adoption, not just delivery",
      body: "A solution nobody uses isn't a solution. I factor in the human side of change from day one — not as an afterthought once the build is done.",
    },
    {
      title: "Decisions need evidence, not opinions",
      body: "I bring data to build/buy decisions, vendor selection, and prioritisation — so choices are defensible at any level of the business.",
    },
  ]

  return (
    <section>
      <header>
        <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">How I think</div>
        <h2 className="mt-2 text-xl font-medium text-foreground">Principles I bring to every problem</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xl">
          Critical thinking isn't a skill you list — it's how you operate under pressure and ambiguity.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
        {principles.map((p) => (
          <div key={p.title} className="border-l-2 border-border pl-4 py-1">
            <h3 className="text-sm font-medium text-foreground mb-1">{p.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

