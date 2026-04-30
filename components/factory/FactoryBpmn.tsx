type NodeProps = {
  x: number
  y: number
  w: number
  h: number
  label: string
  sublabel?: string
}

function Task({ x, y, w, h, label, sublabel }: NodeProps) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} ry={10} fill="var(--bpmn-task-fill, transparent)" stroke="currentColor" strokeWidth={1.5} />
      <text
        x={x + w / 2}
        y={sublabel ? y + h / 2 - 4 : y + h / 2 + 4}
        textAnchor="middle"
        className="fill-current font-sans text-[12px] font-semibold"
      >
        {label}
      </text>
      {sublabel ? (
        <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" className="fill-current font-sans text-[10px] opacity-70">
          {sublabel}
        </text>
      ) : null}
    </g>
  )
}

function StartEvent({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={16} fill="none" stroke="currentColor" strokeWidth={1.5} />
      <text x={x} y={y + 36} textAnchor="middle" className="fill-current font-sans text-[10px] opacity-70">
        {label}
      </text>
    </g>
  )
}

function EndEvent({ x, y, label, error = false }: { x: number; y: number; label: string; error?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={16} fill="none" stroke="currentColor" strokeWidth={error ? 3 : 3} />
      {error ? (
        <text x={x} y={y + 5} textAnchor="middle" className="fill-current font-sans text-[14px] font-bold">
          ✕
        </text>
      ) : null}
      <text x={x} y={y + 36} textAnchor="middle" className="fill-current font-sans text-[10px] opacity-70">
        {label}
      </text>
    </g>
  )
}

function Gateway({ x, y, label }: { x: number; y: number; label: string }) {
  const size = 22
  return (
    <g>
      <polygon
        points={`${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <text x={x} y={y + 4} textAnchor="middle" className="fill-current font-sans text-[14px] font-bold">
        ×
      </text>
      <text x={x} y={y - size - 6} textAnchor="middle" className="fill-current font-sans text-[10px] opacity-70">
        {label}
      </text>
    </g>
  )
}

function SeqArrow({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="currentColor" strokeWidth={1.5} markerEnd="url(#bpmn-arrow)" />
}

function MsgArrow({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="currentColor" strokeWidth={1.2} strokeDasharray="5 4" markerEnd="url(#bpmn-arrow-open)" />
}

function ArrowLabel({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" className="fill-current font-sans text-[10px] font-semibold">
      {children}
    </text>
  )
}

export function FactoryBpmn() {
  return (
    <div className="w-full overflow-x-auto text-on-surface">
      <svg
        role="img"
        aria-label="BPMN diagram of the factory: a worker claims an item, prepares a worktree, runs the spec command, gates on tsc/lint/build, then commits, pushes, merges, and optionally runs UAT. The issue swarm watches incidents and enqueues auto-heal items."
        viewBox="0 0 1080 560"
        className="block min-w-[960px] w-full h-auto"
      >
        <defs>
          <marker id="bpmn-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
          <marker id="bpmn-arrow-open" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10" fill="none" stroke="currentColor" strokeWidth={1.2} />
          </marker>
        </defs>

        {/* Pool: Factory worker */}
        <g className="opacity-90">
          <rect x={20} y={20} width={1040} height={340} fill="none" stroke="currentColor" strokeWidth={1} />
          <rect x={20} y={20} width={28} height={340} fill="none" stroke="currentColor" strokeWidth={1} />
          <text
            x={34}
            y={190}
            transform="rotate(-90 34 190)"
            textAnchor="middle"
            className="fill-current font-sans text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Factory worker
          </text>
        </g>

        {/* Pool: Issue swarm */}
        <g className="opacity-90">
          <rect x={20} y={380} width={1040} height={160} fill="none" stroke="currentColor" strokeWidth={1} />
          <rect x={20} y={380} width={28} height={160} fill="none" stroke="currentColor" strokeWidth={1} />
          <text
            x={34}
            y={460}
            transform="rotate(-90 34 460)"
            textAnchor="middle"
            className="fill-current font-sans text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Issue swarm
          </text>
        </g>

        {/* Worker row 1 (top): start -> claim -> worktree -> run -> gateway */}
        <StartEvent x={90} y={120} label="Queued item" />
        <Task x={140} y={92} w={130} h={56} label="Claim item" sublabel="file-locked queue" />
        <Task x={300} y={92} w={150} h={56} label="Worktree + install" sublabel="frozen lockfile" />
        <Task x={480} y={92} w={150} h={56} label="Run spec.command" sublabel="bash -lc" />
        <Gateway x={700} y={120} label="Gates pass?" />
        <ArrowLabel x={730} y={170}>
          tsc · lint · build
        </ArrowLabel>

        <SeqArrow d="M 106 120 L 140 120" />
        <SeqArrow d="M 270 120 L 300 120" />
        <SeqArrow d="M 450 120 L 480 120" />
        <SeqArrow d="M 630 120 L 678 120" />

        {/* Yes branch right: commit -> merge -> uat -> end */}
        <Task x={760} y={92} w={130} h={56} label="Commit + push" />
        <Task x={760} y={210} w={130} h={56} label="Merge to main" sublabel="direct or PR" />
        <Task x={580} y={210} w={140} h={56} label="Post-merge UAT" sublabel="optional · prod smoke" />
        <EndEvent x={420} y={238} label="Done" />

        <SeqArrow d="M 722 120 L 760 120" />
        <ArrowLabel x={740} y={114}>
          yes
        </ArrowLabel>
        <SeqArrow d="M 825 148 L 825 210" />
        <SeqArrow d="M 760 238 L 720 238" />
        <SeqArrow d="M 580 238 L 438 238" />

        {/* No branch down: failed -> end */}
        <Task x={620} y={300} w={130} h={48} label="Mark failed" />
        <EndEvent x={820} y={324} label="Failed" error />
        <SeqArrow d="M 700 142 L 700 300" />
        <ArrowLabel x={714} y={210}>
          no
        </ArrowLabel>
        <SeqArrow d="M 750 324 L 804 324" />

        {/* Issue swarm row */}
        <StartEvent x={90} y={460} label="Incident written" />
        <Task x={140} y={432} w={140} h={56} label="Watch incidents" sublabel="agents/factory-logs" />
        <Task x={310} y={432} w={150} h={56} label="Classify + cooldown" sublabel="circuit breaker" />
        <Task x={490} y={432} w={160} h={56} label="Enqueue auto-heal" sublabel="capped, prioritized" />

        <SeqArrow d="M 106 460 L 140 460" />
        <SeqArrow d="M 280 460 L 310 460" />
        <SeqArrow d="M 460 460 L 490 460" />

        {/* Message flow: auto-heal item appears in queue feeding "Claim item" */}
        <MsgArrow d="M 570 432 C 570 380, 250 380, 205 148" />
        <ArrowLabel x={400} y={394}>
          new queue item
        </ArrowLabel>
      </svg>
    </div>
  )
}
