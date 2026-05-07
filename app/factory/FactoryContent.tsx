import { FactoryBpmn } from "@/components/factory/FactoryBpmn"
import { FACTORY_TOOLS } from "@/lib/factory-tools"

export function FactoryContent() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <header className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10">
        <p className="font-sans text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">Tooling</p>
        <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-on-surface md:text-4xl">Factory</h1>
        <p className="mt-4 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant md:text-base md:leading-[1.75]">
          The factory is a queue-driven automation system that runs repeatable work in clean git worktrees, verifies results, and merges successful changes into main.
        </p>
      </header>

      <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10" aria-label="How to use the factory">
        <h2 className="font-sans text-lg font-semibold tracking-normal text-on-surface">How to use</h2>
        <div className="mt-4 flex flex-col gap-3 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant md:text-base md:leading-[1.75]">
          <p>
            Observe runs and queue state in the checked-in files under{" "}
            <span className="font-mono text-xs text-on-surface">agents/</span> (for example{" "}
            <span className="font-mono text-xs text-on-surface">factory-queue.json</span> and{" "}
            <span className="font-mono text-xs text-on-surface">factory-runs.json</span>).
          </p>
          <p>Run one iteration locally with <span className="font-mono text-xs text-on-surface">pnpm factory:run-once</span>.</p>
          <p>
            Run continuously with <span className="font-mono text-xs text-on-surface">pnpm factory:loop</span>, or run parallel workers with{" "}
            <span className="font-mono text-xs text-on-surface">FACTORY_WORKERS=5 pnpm factory:swarm</span>.
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10" aria-label="How the factory works">
        <h2 className="font-sans text-lg font-semibold tracking-normal text-on-surface">How it works</h2>
        <p className="mt-2 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant md:text-base md:leading-[1.75]">
          A worker claims one queued item, runs it in an isolated worktree, gates on tsc · lint · build, and only then merges. The issue swarm watches incidents in parallel and feeds auto-heal items back into the same queue.
        </p>
        <div className="mt-6 rounded-2xl bg-surface p-4 ring-1 ring-outline-variant/15 md:p-6">
          <FactoryBpmn />
        </div>
      </section>

      <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10" aria-label="Factory tools registry">
        <h2 className="font-sans text-lg font-semibold tracking-normal text-on-surface">Tools registry</h2>
        <p className="mt-2 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant md:text-base md:leading-[1.75]">
          Every tool under <span className="font-mono text-xs text-on-surface">scripts/agent-factory/</span> must be documented here.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {FACTORY_TOOLS.map((tool) => (
            <article key={tool.id} className="rounded-2xl bg-surface p-6 shadow-editorial ring-1 ring-outline-variant/15">
              <div className="flex flex-col gap-1">
                <p className="font-mono text-xs font-semibold text-on-surface-variant">{tool.id}</p>
                <h3 className="font-sans text-base font-semibold text-on-surface">{tool.title}</h3>
              </div>

              <p className="mt-3 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant">{tool.purpose}</p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-surface-container-low p-5 ring-1 ring-outline-variant/15">
                  <p className="font-sans text-xs font-semibold tracking-[0.18em] text-on-surface uppercase">How to use</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 font-sans text-sm text-on-surface-variant">
                    {tool.howToUse.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-surface-container-low p-5 ring-1 ring-outline-variant/15">
                  <p className="font-sans text-xs font-semibold tracking-[0.18em] text-on-surface uppercase">Commands</p>
                  <ul className="mt-3 space-y-2 font-mono text-xs text-on-surface-variant">
                    {tool.commands.map((cmd) => (
                      <li key={cmd} className="rounded-xl bg-surface px-3 py-2 ring-1 ring-outline-variant/15">
                        {cmd}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-surface-container-low p-5 ring-1 ring-outline-variant/15">
                <p className="font-sans text-xs font-semibold tracking-[0.18em] text-on-surface uppercase">Related files</p>
                <ul className="mt-3 space-y-2 font-mono text-xs text-on-surface-variant">
                  {tool.relatedFiles.map((f) => (
                    <li key={f} className="rounded-xl bg-surface px-3 py-2 ring-1 ring-outline-variant/15">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

