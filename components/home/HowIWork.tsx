"use client"

import { useEffect, useRef, useState } from "react"

export default function HowIWork() {
  const pipelineRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = pipelineRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="hiw" aria-labelledby="hiw-heading">
      <style jsx>{`
        .hiw {
          /* Page-level dividers handle vertical rhythm; keep section padding minimal */
          padding: 0;
          font-family: var(--font-sans, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif);
          --hiw-cycle: 5.2s;
          --hiw-beam: #10b981; /* bright emerald accent */
        }
        .hiw-eyebrow {
          font-size: 0.75rem; /* ~text-xs */
          letter-spacing: 0.12em; /* closer to tracking-widest */
          color: var(--color-muted-foreground, #5f5f66);
          text-transform: uppercase;
          margin: 0 0 0.6rem;
          opacity: 0.9;
        }
        .hiw-heading {
          font-size: 1.25rem; /* ~text-xl (matches rest of site sections) */
          font-weight: 500;
          color: var(--color-foreground, #2c2c2a);
          margin: 0 0 0.6rem;
          line-height: 1.25;
        }
        .hiw-sub {
          font-size: 0.875rem; /* ~text-sm */
          color: var(--color-muted-foreground, #5f5f66);
          margin: 0 0 2.5rem;
          max-width: 520px;
          line-height: 1.65;
        }

        .pipeline {
          display: flex;
          align-items: flex-start;
          position: relative;
          margin: 0 0 2.25rem;
        }
        .track {
          position: absolute;
          top: 21px;
          left: 21px;
          right: 21px;
          height: 1px;
          background: var(--color-border-tertiary, #e5e5e5);
          z-index: 0;
          overflow: hidden;
        }
        /* Animated "beam" that runs along the track */
        .track::after {
          content: "";
          position: absolute;
          top: 50%;
          left: -25%;
          height: 3px;
          width: 300px;
          transform: translateY(-50%);
          background: linear-gradient(
            90deg,
            transparent 0%,
            var(--hiw-beam) 30%,
            var(--hiw-beam) 70%,
            transparent 100%
          );
          opacity: 0.85;
          filter: blur(0.3px);
          box-shadow:
            0 0 24px rgba(16, 185, 129, 0.6),
            0 0 48px rgba(16, 185, 129, 0.35),
            0 0 8px rgba(16, 185, 129, 0.9);
          animation: hiw-beam var(--hiw-cycle) linear infinite;
        }
        .track::before {
          content: "";
          position: absolute;
          inset: -10px 0;
          background: radial-gradient(
            180px 16px at 50% 50%,
            rgba(0, 0, 0, 0.08),
            transparent 70%
          );
          pointer-events: none;
          opacity: 0.35;
          mix-blend-mode: multiply;
        }

        @keyframes hiw-beam {
          0% {
            left: -25%;
            opacity: 0;
          }
          8% {
            opacity: 0.55;
          }
          92% {
            opacity: 0.55;
          }
          100% {
            left: 110%;
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .track::after {
            animation: none;
            opacity: 0.14;
            left: 0;
            transform: translateY(-50%);
            width: 100%;
          }
          .pipeline > .phase .phase-node,
          .pipeline > .phase .phase-name {
            animation: none;
          }
        }

        .phase {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
          cursor: default;
        }

        /* Beam-synced depth cue (a subtle "hover" as the beam passes) */
        .phase-node {
          position: relative;
          box-shadow: 0 0 0 rgba(0, 0, 0, 0);
          transform: translateY(0);
          will-change: transform, box-shadow, background;
        }
        .phase-node::after {
          content: "";
          position: absolute;
          inset: -10px;
          border-radius: 999px;
          background: radial-gradient(
            20px 20px at 50% 50%,
            rgba(0, 0, 0, 0.12),
            transparent 70%
          );
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s ease;
        }
        .phase-name {
          transform: translateY(0);
          will-change: transform, color, opacity;
        }

        @keyframes hiw-phase-pulse {
          0% {
            transform: translateY(-2px);
            box-shadow:
              0 6px 12px -8px rgba(0, 0, 0, 0.22),
              0 2px 6px -6px rgba(0, 0, 0, 0.18);
          }
          18% {
            transform: translateY(0);
            box-shadow: 0 0 0 rgba(0, 0, 0, 0);
          }
          100% {
            transform: translateY(0);
            box-shadow: 0 0 0 rgba(0, 0, 0, 0);
          }
        }
        @keyframes hiw-phase-text-pulse {
          0% {
            transform: translateY(-1px);
            opacity: 1;
          }
          18% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Stagger pulses across phases (track is the first child) */
        .pipeline > .phase:nth-child(2) .phase-node,
        .pipeline > .phase:nth-child(3) .phase-node,
        .pipeline > .phase:nth-child(4) .phase-node,
        .pipeline > .phase:nth-child(5) .phase-node,
        .pipeline > .phase:nth-child(6) .phase-node,
        .pipeline > .phase:nth-child(7) .phase-node {
          animation: hiw-phase-pulse var(--hiw-cycle) linear infinite;
        }
        .pipeline > .phase:nth-child(2) .phase-name,
        .pipeline > .phase:nth-child(3) .phase-name,
        .pipeline > .phase:nth-child(4) .phase-name,
        .pipeline > .phase:nth-child(5) .phase-name,
        .pipeline > .phase:nth-child(6) .phase-name,
        .pipeline > .phase:nth-child(7) .phase-name {
          animation: hiw-phase-text-pulse var(--hiw-cycle) linear infinite;
        }
        /* Delays tuned so each phase pulses as the beam reaches it */
        .pipeline > .phase:nth-child(2) .phase-node,
        .pipeline > .phase:nth-child(2) .phase-name {
          animation-delay: 0.4s;
        }
        .pipeline > .phase:nth-child(3) .phase-node,
        .pipeline > .phase:nth-child(3) .phase-name {
          animation-delay: 1.25s;
        }
        .pipeline > .phase:nth-child(4) .phase-node,
        .pipeline > .phase:nth-child(4) .phase-name {
          animation-delay: 2.1s;
        }
        .pipeline > .phase:nth-child(5) .phase-node,
        .pipeline > .phase:nth-child(5) .phase-name {
          animation-delay: 2.95s;
        }
        .pipeline > .phase:nth-child(6) .phase-node,
        .pipeline > .phase:nth-child(6) .phase-name {
          animation-delay: 3.8s;
        }
        .pipeline > .phase:nth-child(7) .phase-node,
        .pipeline > .phase:nth-child(7) .phase-name {
          animation-delay: 4.65s;
        }

        /* Pause all pipeline animations until section scrolls into view */
        .pipeline:not(.is-visible) .track::after,
        .pipeline:not(.is-visible) .phase-node,
        .pipeline:not(.is-visible) .phase-name {
          animation-play-state: paused;
        }

        /* Also show the same depth cue on hover */
        .phase:hover .phase-node::after {
          opacity: 0.55;
        }
        .phase:hover .phase-node {
          border-color: var(--color-border-primary, #aaa);
          background: var(--color-background-secondary, #f9f9f9);
        }
        .phase:hover .phase-name {
          color: var(--color-foreground, #2c2c2a);
        }
        .phase:hover .phase-desc {
          opacity: 1;
        }

        .phase-node {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 0.5px solid var(--color-border-secondary, #ddd);
          background: var(--color-background-primary, #fff);
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            border-color 0.15s,
            background 0.15s;
          margin-bottom: 12px;
          /* Make SVGs reliable even if design tokens are missing */
          color: var(--color-muted-foreground, #5f5f66);
        }
        .phase-node.final {
          border-color: var(--hiw-beam);
          outline: 3px solid rgba(16, 185, 129, 0.12);
          outline-offset: -1px;
          width: 46px;
          height: 46px;
          margin-top: -2px;
          color: var(--hiw-beam);
        }
        .phase-node :global(svg) {
          width: 16px;
          height: 16px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .phase-node.final :global(svg) {
          width: 18px;
          height: 18px;
        }
        .phase-name {
          font-size: 0.75rem; /* readable: ~text-xs */
          font-weight: 500;
          color: var(--color-muted-foreground, #5f5f66);
          text-align: center;
          margin-bottom: 6px;
          letter-spacing: 0.02em;
          transition: color 0.15s;
        }
        .phase-desc {
          font-size: 0.75rem; /* readable: ~text-xs */
          color: var(--color-muted-foreground, #5f5f66);
          text-align: center;
          line-height: 1.45;
          padding: 0 6px;
          opacity: 0.6;
          transition: opacity 0.15s;
        }

        .sep {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 2.25rem 0 1.5rem;
        }
        .sep-line {
          flex: 1;
          height: 0.5px;
          background: var(--color-border-tertiary, #ebebeb);
        }
        .sep-text {
          font-size: 0.75rem; /* match eyebrow / text-xs rhythm */
          color: var(--color-muted-foreground, #5f5f66);
          letter-spacing: 0.07em;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0.9;
        }

        .teams-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        .team-card {
          padding: 1.25rem 1.25rem; /* close to Tailwind p-5, less tight than before */
          border: 1px solid var(--color-border, #e5e4f2);
          border-radius: 12px; /* matches Tailwind rounded-xl */
          background: var(--color-background, #fff);
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition:
            border-color 0.12s,
            box-shadow 0.3s ease;
          cursor: default;
        }
        .team-card:hover {
          border-color: var(--color-border, #e5e4f2);
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.08),
            0 2px 4px -2px rgba(0, 0, 0, 0.08); /* close to Tailwind shadow-md */
        }
        .team-icon {
          display: flex;
          align-items: center;
          margin-bottom: 0;
          color: var(--color-muted-foreground, #5f5f66);
          opacity: 0.9;
        }
        .team-icon :global(svg) {
          width: 14px;
          height: 14px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .team-name {
          font-size: 0.875rem; /* ~text-sm */
          font-weight: 500;
          color: var(--color-foreground, #2c2c2a);
        }
        .team-detail {
          font-size: 0.75rem; /* ~text-xs */
          color: var(--color-muted-foreground, #5f5f66);
          line-height: 1.4;
          opacity: 0.95;
        }

        .closer {
          margin-top: 2.25rem;
          padding: 1.5rem 1.5rem;
          border: 1px solid var(--color-border, #e5e4f2);
          border-radius: 12px;
          background: var(--color-muted, #f8f8fa);
        }
        .closer-body {
          font-size: 0.875rem; /* match site text-sm */
          color: var(--color-muted-foreground, #5f5f66);
          line-height: 1.75;
          margin: 0 0 0.8rem;
        }
        .closer-body :global(strong) {
          color: var(--color-foreground, #2c2c2a);
          font-weight: 500;
        }
        .closer-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .tag {
          font-size: 0.75rem; /* text-xs */
          padding: 0.25rem 0.625rem; /* closer to Tailwind px-2.5 py-1 */
          border: 1px solid var(--color-border, #e5e4f2);
          border-radius: 100px;
          color: var(--color-muted-foreground, #5f5f66);
          background: var(--color-muted, #f3f2fb);
        }

        /* Small responsive tightening (keeps the design, avoids squish) */
        @media (max-width: 900px) {
          .pipeline {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px 10px;
          }
          .track {
            display: none;
          }
          .phase {
            align-items: flex-start;
          }
          .phase-name,
          .phase-desc {
            text-align: left;
            width: 100%;
          }
        }
        @media (max-width: 720px) {
          .teams-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 420px) {
          .teams-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-color-scheme: dark) {
          .hiw { --hiw-beam: #34d399; }
          .hiw-eyebrow, .hiw-sub, .phase-desc, .team-detail, .sep-text { color: #a1a1aa; }
          .hiw-heading, .phase-name, .team-name { color: #e4e4e7; }
          .closer-body :global(strong) { color: #e4e4e7; }
          .phase-node { background: #1c1c1e; border-color: #3f3f46; }
          .phase-node.final { border-color: var(--hiw-beam); }
          .team-card { background: #1c1c1e; border-color: #3f3f46; }
          .closer { background: #27272a; border-color: #3f3f46; }
          .tag { background: #27272a; border-color: #3f3f46; color: #a1a1aa; }
          .track { background: #3f3f46; }
          .closer-body { color: #a1a1aa; }
        }
      `}</style>

      <p className="hiw-eyebrow">How I work</p>
      <h2 className="hiw-heading" id="hiw-heading">
        End-to-end, every time
      </h2>
      <p className="hiw-sub">
        I don&apos;t hand off when the interesting part is done. From first stakeholder conversation
        to live system — I own the arc, lead the teams, and stay accountable for outcomes.
      </p>

      <div ref={pipelineRef} className={`pipeline${isVisible ? " is-visible" : ""}`} aria-label="Delivery pipeline">
        <div className="track" aria-hidden="true" />

        <div className="phase">
          <div className="phase-node" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
          </div>
          <div className="phase-name">Discover</div>
          <div className="phase-desc">Stakeholder interviews, process mapping, problem framing</div>
        </div>

        <div className="phase">
          <div className="phase-node" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className="phase-name">Define</div>
          <div className="phase-desc">BRDs, user stories, acceptance criteria, business case</div>
        </div>

        <div className="phase">
          <div className="phase-node" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div className="phase-name">Solution design</div>
          <div className="phase-desc">
            Architecture, data models, API contracts, integration specs
          </div>
        </div>

        <div className="phase">
          <div className="phase-node" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div className="phase-name">Deliver</div>
          <div className="phase-desc">Agile execution, backlog ownership, UAT, defect triage</div>
        </div>

        <div className="phase">
          <div className="phase-node" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="phase-name">Change &amp; adoption</div>
          <div className="phase-desc">Training, comms, rollout, post-launch support</div>
        </div>

        <div className="phase">
          <div className="phase-node final" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <div className="phase-name" style={{ color: "var(--color-foreground, #2c2c2a)" }}>
            Value realized
          </div>
          <div className="phase-desc">KPIs tracked, outcomes measured, platform scales</div>
        </div>
      </div>

      <div className="sep" aria-hidden="true">
        <div className="sep-line" />
        <span className="sep-text">Teams I lead across every phase</span>
        <div className="sep-line" />
      </div>

      <div className="teams-grid">
        <div className="team-card">
          <div className="team-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="team-name">Business &amp; product</div>
          <div className="team-detail">Executives, product owners, domain SMEs</div>
        </div>

        <div className="team-card">
          <div className="team-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <div className="team-name">Engineering &amp; QA</div>
          <div className="team-detail">Dev, QA, DevOps, testing, release</div>
        </div>

        <div className="team-card">
          <div className="team-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div className="team-name">Architects &amp; tech leads</div>
          <div className="team-detail">Solution, enterprise, integration</div>
        </div>

        <div className="team-card">
          <div className="team-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <div className="team-name">UX &amp; design</div>
          <div className="team-detail">Flows, prototypes, research</div>
        </div>

        <div className="team-card">
          <div className="team-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </div>
          <div className="team-name">Data &amp; AI teams</div>
          <div className="team-detail">Data science, LLMs, agentic workflows</div>
        </div>

        <div className="team-card">
          <div className="team-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="team-name">Compliance &amp; vendors</div>
          <div className="team-detail">Regulatory, procurement, 3rd parties</div>
        </div>
      </div>

      <div className="closer">
        <p className="closer-body">
          Most PMs stop at the roadmap. Most BAs stop at the requirements doc.{" "}
          <strong>I stay in the room until the outcome is real</strong> — technically sound,
          business-justified, delivered, adopted, and measurable. That&apos;s not a common combination.
          It&apos;s the only one I know how to do.
        </p>
        <div className="closer-tags">
          <span className="tag">Business</span>
          <span className="tag">Technical</span>
          <span className="tag">Delivery</span>
          <span className="tag">AI-Native</span>
        </div>
      </div>
    </section>
  )
}
