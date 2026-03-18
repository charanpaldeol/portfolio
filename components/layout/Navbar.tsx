'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ShimmerButton } from '../magicui/shimmer-button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from '../ui/navigation-menu'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'

export function Navbar() {
  const pathname = usePathname()
  const isPortfolioRoute = pathname.startsWith('/portfolio')

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
          <NavigationMenu>
            <NavigationMenuItem>
              <NavigationMenuLink href="/">Home</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/portfolio/about">Portfolio</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/blog">Blog</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenu>
        </div>

        {/* Desktop CTA + Social */}
        <div className="hidden items-center gap-4 md:flex">
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
          <ShimmerButton href="/contact" className="rounded-full px-5 py-2 text-sm font-medium">
            Let&apos;s talk
          </ShimmerButton>
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
                <SheetClose asChild>
                  <Link
                    href="/portfolio/about"
                    className="rounded-md px-2 py-2 text-base font-medium text-slate-50 hover:bg-slate-800"
                  >
                    Portfolio
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/blog"
                    className="rounded-md px-2 py-2 text-base font-medium text-slate-50 hover:bg-slate-800"
                  >
                    Blog
                  </Link>
                </SheetClose>
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

