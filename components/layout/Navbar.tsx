'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

import { RainbowButton } from '@/registry/magicui/rainbow-button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'

// ─── Constants ─────────────────────────────────────────────────────────────────

const GITHUB_URL = 'https://github.com/charanpaldeol'
const LINKEDIN_URL = 'https://www.linkedin.com/in/cdeol'

// ─── Work links (add description + icon per page) ──────────────────────────────

const workLinks = [
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

// ─── Ideas links (append here when new ideas pages are added) ─────────────────

const ideasLinks = [
  { href: '/internet-owned', label: 'Internet Owned' },
  // Add future ideas pages here
]

// ─── Brand mark ───────────────────────────────────────────────────────────────

const brandMark = (
  <svg width="32" height="32" viewBox="0 0 80 80" aria-hidden="true">
    <circle cx="40" cy="40" r="38" fill="rgb(5,46,22)" stroke="rgb(16,185,129)" strokeWidth="3" />
    <circle cx="40" cy="40" r="27" fill="none" stroke="rgb(16,185,129)" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
    <text x="40" y="43" textAnchor="middle" fontFamily="Space Mono, monospace" fontSize="22" fontWeight="700" fill="rgb(16,185,129)" dominantBaseline="central">
      CP
    </text>
  </svg>
)

// ─── Work dropdown panel ───────────────────────────────────────────────────────
// Uses plain Link (not NavigationMenuLink) to avoid trigger-style conflicts

function WorkPanel() {
  const pathname = usePathname()
  return (
    <ul className="w-72 p-2">
      {workLinks.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={twMerge(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive ? 'bg-accent' : ''
              )}
            >
              <span className={twMerge(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border transition-colors',
                isActive ? 'bg-foreground text-background border-foreground' : 'bg-muted text-muted-foreground'
              )}>
                {link.icon}
              </span>
              <span className="min-w-0">
                <span className={twMerge(
                  'block text-sm text-foreground',
                  isActive ? 'font-semibold' : 'font-medium'
                )}>
                  {link.label}
                </span>
                <span className="block text-xs leading-relaxed text-muted-foreground">
                  {link.description}
                </span>
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname()
  const isWorkRoute = pathname.startsWith('/portfolio')
  const isIdeasRoute = ideasLinks.some((l) => pathname === l.href || pathname.startsWith(`${l.href}/`))
  const isHomeRoute = pathname === '/'

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <style>{`
        @keyframes cpdeolBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cpdeol-blink-cursor {
          animation: cpdeolBlink 1.1s step-end infinite;
        }
      `}</style>
      <div className={`mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6 ${isWorkRoute ? 'py-2' : 'py-3'}`}>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center">
            {brandMark}
          </span>
          <span className={twMerge(
            'flex items-center leading-none text-sm text-[rgb(5,46,22)]',
            isHomeRoute ? 'font-semibold' : 'font-medium'
          )}>
            cpdeol
            <span aria-hidden="true" className={twMerge(
              'ml-1 text-emerald-600 cpdeol-blink-cursor text-sm leading-none',
              isHomeRoute ? 'font-semibold' : 'font-medium'
            )}>
              _
            </span>
          </span>
        </Link>

        {/* Desktop navigation — uses NavigationMenu for proper hover + keyboard behaviour */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <NavigationMenu>
            <NavigationMenuList>

              {/* Home */}
              <NavigationMenuItem>
                <NavigationMenuLink href="/" exact>Home</NavigationMenuLink>
              </NavigationMenuItem>

              {/* Work — rich dropdown with icons + descriptions */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={isWorkRoute ? 'font-semibold text-foreground' : undefined}
                >
                  Work
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <WorkPanel />
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Ideas — direct link while single destination, dropdown when more pages added */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href={ideasLinks[0]?.href ?? '/internet-owned'}
                  className={isIdeasRoute ? 'font-semibold text-foreground' : undefined}
                >
                  Ideas
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Blog */}
              <NavigationMenuItem>
                <NavigationMenuLink href="/blog">Blog</NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop CTA + Social */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-all duration-300 hover:bg-foreground hover:shadow-md"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-muted-foreground group-hover:fill-background" d="M12 .5C5.73.5.5 5.85.5 12.25c0 5.2 3.28 9.6 7.82 11.16.57.11.78-.25.78-.56v-2.05c-3.18.7-3.84-1.58-3.84-1.58-.52-1.33-1.27-1.68-1.27-1.68-1.04-.73.08-.72.08-.72 1.14.08 1.73 1.2 1.73 1.2 1.01 1.76 2.66 1.25 3.31.96.1-.76.39-1.25.7-1.54-2.54-.3-5.21-1.31-5.21-5.82 0-1.29.45-2.35 1.19-3.18-.12-.31-.52-1.58.11-3.29 0 0 .97-.32 3.18 1.21.92-.27 1.9-.41 2.88-.41.98 0 1.96.14 2.88.41 2.21-1.53 3.18-1.21 3.18-1.21.63 1.71.23 2.98.11 3.29.74.83 1.19 1.89 1.19 3.18 0 4.52-2.67 5.52-5.22 5.82.41.37.77 1.1.77 2.21v3.27c0 .31.21.67.79.56 4.54-1.56 7.82-5.96 7.82-11.16C23.5 5.85 18.27.5 12 .5Z" />
            </svg>
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-all duration-300 hover:bg-[#0A66C2] hover:shadow-md"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-muted-foreground group-hover:fill-white" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
            </svg>
          </a>
          <RainbowButton href="/contact">Let&apos;s talk</RainbowButton>
        </div>

        {/* Mobile menu — Sheet drawer */}
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger aria-label="Open navigation menu">
              <svg aria-hidden="true" className="h-5 w-5 text-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>cpdeol</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-3">
                <SheetClose asChild>
                  <Link href="/" className="rounded-md px-2 py-2 text-base font-medium text-slate-50 hover:bg-slate-800">
                    Home
                  </Link>
                </SheetClose>

                <p className="px-2 pt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Work</p>
                {workLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link href={link.href} className="flex items-center gap-3 rounded-md px-4 py-2 text-base font-medium text-slate-50 hover:bg-slate-800">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-slate-300">
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}

                <p className="px-2 pt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Ideas</p>
                {ideasLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link href={link.href} className="rounded-md px-4 py-2 text-base font-medium text-slate-50 hover:bg-slate-800">
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}

                <SheetClose asChild>
                  <Link href="/blog" className="rounded-md px-2 py-2 text-base font-medium text-slate-50 hover:bg-slate-800">
                    Blog
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link href="/contact" className="mt-2 inline-flex items-center justify-center rounded-full bg-slate-50 px-4 py-2 text-base font-medium text-slate-900 hover:bg-slate-200">
                    Let&apos;s talk
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}
