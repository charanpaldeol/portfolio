import Link from "next/link"

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

export default function HowIThink() {
  return (
    <section id="how-i-think" className="scroll-mt-28 space-y-12">

      {/* ── Editorial pull quote ──────────────────────────────── */}
      <div className="flex gap-5 items-start">
        <div className="w-1 shrink-0 self-stretch rounded-full bg-tertiary" aria-hidden />
        <div className="max-w-3xl">
          <blockquote className="text-2xl font-extrabold leading-snug tracking-tight text-foreground md:text-3xl lg:text-4xl">
            &ldquo;The future of great products isn&apos;t larger teams —
            it&apos;s sharper thinking about the right problem.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            — Architectural philosophy, 2024
          </p>
        </div>
      </div>

      {/* ── Principles grid ──────────────────────────────────── */}
      <div>
        <div className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          How I think
        </div>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
          Principles I bring to every problem
        </h2>
        <p className="mt-3 max-w-xl text-base font-light leading-relaxed text-muted-foreground">
          Critical thinking isn&apos;t a skill you list — it&apos;s how you operate under pressure and ambiguity.
        </p>

        {/* Cards — surface-container-lowest on default surface bg, no borders */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {principles.map((p) => (
            <div
              key={p.title}
              className="rounded-xl bg-surface-container-lowest p-6"
            >
              <div className="flex gap-4">
                <div className="w-0.5 shrink-0 self-stretch rounded-full bg-tertiary" aria-hidden />
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm font-normal leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link
            href="/how-i-think"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            My full thinking process →
          </Link>
        </div>
      </div>
    </section>
  )
}
