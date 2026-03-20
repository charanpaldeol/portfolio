'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { RainbowButton } from '@/registry/magicui/rainbow-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { NavigationMenuLink, navigationMenuTriggerStyle } from '../ui/navigation-menu'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'

const triggerChevron = (
  <svg
    aria-hidden="true"
    className="relative top-px ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const portfolioLinks = [
  { href: '/portfolio/about', label: 'About' },
  { href: '/portfolio/services', label: 'Services' },
  { href: '/portfolio/projects', label: 'Projects' },
  { href: '/portfolio/experience', label: 'Experience' },
]

const toolsLinks = [{ href: '/eye-break', label: 'Eye Break Timer' }]

const HOVER_CLOSE_MS = 150

type NavDropdownLink = { href: string; label: string }

function HoverNavDropdown({
  label,
  links,
  sectionActive,
}: {
  label: string
  links: NavDropdownLink[]
  sectionActive: boolean
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelScheduledClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    cancelScheduledClose()
    closeTimerRef.current = setTimeout(() => setOpen(false), HOVER_CLOSE_MS)
  }, [cancelScheduledClose])

  const handlePointerEnterOpen = useCallback(() => {
    cancelScheduledClose()
    setOpen(true)
  }, [cancelScheduledClose])

  useEffect(() => () => cancelScheduledClose(), [cancelScheduledClose])

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        if (next) cancelScheduledClose()
        setOpen(next)
      }}
      modal={false}
    >
      <DropdownMenuTrigger
        className={twMerge(
          navigationMenuTriggerStyle(),
          'group',
          sectionActive ? 'font-semibold text-slate-950' : 'text-slate-600 hover:text-slate-900'
        )}
        onPointerEnter={handlePointerEnterOpen}
        onPointerLeave={scheduleClose}
      >
        {label}
        {triggerChevron}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-44 p-2"
        onPointerEnter={handlePointerEnterOpen}
        onPointerLeave={scheduleClose}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <DropdownMenuItem key={link.href} asChild className="p-0 focus:bg-transparent">
              <Link
                href={link.href}
                className={twMerge(
                  'block w-full rounded-md px-3 py-2 text-sm',
                  isActive ? 'font-semibold text-slate-950' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {link.label}
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const isPortfolioRoute = pathname.startsWith('/portfolio')
  const isToolsRoute = pathname.startsWith('/eye-break')

  return (
    <header
      className={`border-b bg-white/80 backdrop-blur ${
        isPortfolioRoute ? 'border-slate-100/80' : 'border-slate-200'
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6 ${
          isPortfolioRoute ? 'py-2 text-slate-500' : 'py-3'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            cpdeol.com
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <ul className="flex list-none items-center justify-center gap-1">
            <li>
              <NavigationMenuLink href="/" exact>Home</NavigationMenuLink>
            </li>
            <li>
              <HoverNavDropdown label="Portfolio" links={portfolioLinks} sectionActive={isPortfolioRoute} />
            </li>
            <li>
              <NavigationMenuLink href="/blog">Blog</NavigationMenuLink>
            </li>
            <li>
              <HoverNavDropdown label="Tools" links={toolsLinks} sectionActive={isToolsRoute} />
            </li>
          </ul>
        </div>

        {/* Desktop CTA + Social */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href="https://github.com/charanpaldeol"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 transition-all duration-300 hover:bg-[#0A66C2] hover:shadow-md"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 transition-colors duration-300 group-hover:text-white"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-slate-700 group-hover:fill-white"
                d="M12 .5C5.73.5.5 5.85.5 12.25c0 5.2 3.28 9.6 7.82 11.16.57.11.78-.25.78-.56v-2.05c-3.18.7-3.84-1.58-3.84-1.58-.52-1.33-1.27-1.68-1.27-1.68-1.04-.73.08-.72.08-.72 1.14.08 1.73 1.2 1.73 1.2 1.01 1.76 2.66 1.25 3.31.96.1-.76.39-1.25.7-1.54-2.54-.3-5.21-1.31-5.21-5.82 0-1.29.45-2.35 1.19-3.18-.12-.31-.52-1.58.11-3.29 0 0 .97-.32 3.18 1.21.92-.27 1.9-.41 2.88-.41.98 0 1.96.14 2.88.41 2.21-1.53 3.18-1.21 3.18-1.21.63 1.71.23 2.98.11 3.29.74.83 1.19 1.89 1.19 3.18 0 4.52-2.67 5.52-5.22 5.82.41.37.77 1.1.77 2.21v3.27c0 .31.21.67.79.56 4.54-1.56 7.82-5.96 7.82-11.16C23.5 5.85 18.27.5 12 .5Z"
              />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/cdeol"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 transition-all duration-300 hover:bg-[#0A66C2] hover:shadow-md"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 transition-colors duration-300 group-hover:text-white"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* LinkedIn official icon */}
              <path
                className="fill-slate-700 group-hover:fill-white"
                d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
              />
            </svg>
          </a>
          <RainbowButton href="/contact">Let&apos;s talk</RainbowButton>
        </div>

        {/* Mobile menu */}
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger aria-label="Open navigation menu">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-slate-900"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 6H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>cpdeol.com</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-3">
                <SheetClose asChild>
                  <Link
                    href="/"
                    className="rounded-md px-2 py-2 text-base font-medium text-slate-50 hover:bg-slate-800"
                  >
                    Home
                  </Link>
                </SheetClose>
                <p className="px-2 pt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Portfolio
                </p>
                {portfolioLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className="rounded-md px-4 py-2 text-base font-medium text-slate-50 hover:bg-slate-800"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    href="/blog"
                    className="rounded-md px-2 py-2 text-base font-medium text-slate-50 hover:bg-slate-800"
                  >
                    Blog
                  </Link>
                </SheetClose>
                <p className="px-2 pt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Tools
                </p>
                {toolsLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className="rounded-md px-4 py-2 text-base font-medium text-slate-50 hover:bg-slate-800"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    href="/contact"
                    className="mt-2 inline-flex items-center justify-center rounded-full bg-slate-50 px-4 py-2 text-base font-medium text-slate-900 hover:bg-slate-200"
                  >
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

