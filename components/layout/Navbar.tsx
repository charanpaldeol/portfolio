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
              <NavigationMenuLink href="/portfolio">Portfolio</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/blog">Blog</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/contact">Contact</NavigationMenuLink>
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
            className="transition-colors hover:text-slate-600"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-slate-600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" />
              <path
                d="M8.25 9.75V16.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="8.25" cy="7.25" r="1.1" fill="white" />
              <path
                d="M11.5 16.5V9.75H13.75L13.9 10.9C14.2 10.35 14.9 9.75 16 9.75C17.55 9.75 18.5 10.75 18.5 12.6V16.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
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
                    href="/portfolio"
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

