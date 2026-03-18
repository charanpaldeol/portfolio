import type { ReactNode } from "react"

function Chip({ children, bold }: { children: ReactNode; bold?: boolean }) {
  return (
    <span
      className={[
        "text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-md",
        bold ? "font-medium text-foreground" : "",
      ].join(" ")}
    >
      {children}
    </span>
  )
}

export default function ToolsAndMethods() {
  const groups = [
    {
      title: "Analysis & delivery",
      bold: new Set(["BPMN", "User story mapping", "Process mapping"]),
      chips: [
        "BPMN",
        "User story mapping",
        "Process mapping",
        "Gap analysis",
        "Requirements workshops",
        "MoSCoW prioritisation",
        "Agile / Scrum",
        "PRINCE2",
      ],
    },
    {
      title: "Change management",
      bold: new Set(["ADKAR", "Prosci"]),
      chips: ["ADKAR", "Prosci", "Stakeholder mapping", "Training design", "Communication planning"],
    },
    {
      title: "Platforms & tooling",
      bold: new Set(["Jira", "Confluence", "Salesforce"]),
      chips: ["Jira", "Confluence", "Salesforce", "ServiceNow", "Power BI", "Miro", "Figma"],
    },
  ] as const

  return (
    <section>
      <header>
        <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">Tools & methods</div>
        <h2 className="mt-2 text-xl font-medium text-foreground">I speak the language of both rooms</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xl">
          Comfortable in a technical design session in the morning and a boardroom presentation in the afternoon.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="text-[11px] font-medium text-muted-foreground mb-2 mt-4">{group.title}</div>
            <div className="flex flex-wrap gap-2">
              {group.chips.map((chip) => (
                <Chip key={chip} bold={group.bold.has(chip)}>
                  {chip}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

