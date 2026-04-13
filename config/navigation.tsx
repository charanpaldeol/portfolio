import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavLink {
  href: string
  label: string
  description: string
  icon: ReactNode
}

export interface SimpleNavLink {
  href: string
  label: string
}

// ─── Social URLs ──────────────────────────────────────────────────────────────

export const GITHUB_URL = 'https://github.com/charanpaldeol'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/cdeol'

// ─── Top-level portfolio links (Navbar, not inside Work dropdown) ─────────────

export const portfolioNavLinks: NavLink[] = [
  {
    href: '/portfolio/services',
    label: 'Services',
    description: 'What I offer and how I engage',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <rect x="1" y="4.5" width="14" height="9" rx="1.5" />
        <path d="M5 4.5V3.5A1.5 1.5 0 0 1 6.5 2h3A1.5 1.5 0 0 1 11 3.5v1" />
      </svg>
    ),
  },
  {
    href: '/portfolio/projects',
    label: 'Projects',
    description: 'Selected work across sectors',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <rect x="1" y="1" width="5.5" height="5.5" rx="1" />
        <rect x="9.5" y="1" width="5.5" height="5.5" rx="1" />
        <rect x="1" y="9.5" width="5.5" height="5.5" rx="1" />
        <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1" />
      </svg>
    ),
  },
]

// ─── Work links ───────────────────────────────────────────────────────────────
// Each entry appears in both the desktop dropdown (WorkPanel) and mobile Sheet.
// Add new pages here — the nav updates automatically.

export const workLinks: NavLink[] = [
  {
    href: '/what-i-bring',
    label: 'What I bring',
    description: 'My service ecosystem from discovery to impact',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <path d="M8 1.5v13" />
        <path d="M3 6l5-4.5L13 6" />
        <path d="M3 10l5 4.5 5-4.5" />
      </svg>
    ),
  },
  {
    href: '/how-i-work',
    label: 'How I work',
    description: 'My delivery operating model end-to-end',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <path d="M2 8h12" />
        <path d="M10.5 4.5 14 8l-3.5 3.5" />
        <path d="M2 3.5h6" />
        <path d="M2 12.5h6" />
      </svg>
    ),
  },
  {
    href: '/how-i-think',
    label: 'How I think',
    description: 'Principles I bring to every problem',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <path d="M6 14c0-2 4-2 4-4 0-1.25-1-2-2-2s-2 .75-2 2" />
        <path d="M8 2a5 5 0 0 0-3 9.04V12.5c0 .83.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5v-1.46A5 5 0 0 0 8 2Z" />
      </svg>
    ),
  },
  {
    href: '/tools-and-methods',
    label: 'Tools & methods',
    description: 'Artifacts, frameworks, and platforms I use',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <path d="M6.5 1.5h3" />
        <path d="M8 1.5v13" />
        <path d="M3 5.5h10" />
        <path d="M3 10.5h10" />
      </svg>
    ),
  },
  {
    href: '/portfolio/about',
    label: 'About',
    description: 'Who I am and how I approach problems',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <circle cx="8" cy="5.5" r="2.5" />
        <path d="M2.5 13.5v-.667C2.5 11.26 4.067 10 6 10h4c1.933 0 3.5 1.26 3.5 2.833v.667" />
      </svg>
    ),
  },
  {
    href: '/portfolio/experience',
    label: 'Experience',
    description: 'Career background and timeline',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 4.5V8l2.5 2" />
      </svg>
    ),
  },
]

// ─── Ideas links ──────────────────────────────────────────────────────────────
// Append here when new ideas pages are added.

export const ideasLinks: SimpleNavLink[] = [
  { href: '/internet-owned', label: 'Internet Owned' },
  { href: '/how-i-use-ai', label: 'How I Use AI' },
]
