export default function ProofMetrics() {
  return (
    <section>
      <header>
        <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">Proof of work</div>
        <h2 className="mt-2 text-xl font-medium text-foreground">Results that actually moved the needle</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Real outcomes from real engagements — anonymized, but measurable.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-muted rounded-xl p-5 border border-border">
          <div className="text-3xl font-medium text-foreground mb-1">60%</div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            Reduction in manual reporting time after leading a BI tool selection and full implementation across a
            200-person finance team.
          </div>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-[#E1F5EE] text-[#085041] text-xs font-medium">
            SaaS implementation
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-muted rounded-xl p-5 border border-border">
          <div className="text-3xl font-medium text-foreground mb-1">4 → 1</div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            Consolidated four disconnected systems into a single platform, cutting onboarding time from 3 weeks to
            4 days for a healthcare provider.
          </div>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-[#EEEDFE] text-[#534AB7] text-xs font-medium">
            In-house build
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-muted rounded-xl p-5 border border-border">
          <div className="text-3xl font-medium text-foreground mb-1">83%</div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            User adoption rate achieved within 60 days of go-live through structured change management — up from a
            projected 40%.
          </div>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-[#FAEEDA] text-[#854F0B] text-xs font-medium">
            Change management
          </div>
        </div>
      </div>
    </section>
  )
}

