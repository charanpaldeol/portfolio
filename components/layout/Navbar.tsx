'use client'

import Link from 'next/link'

import { ShimmerButton } from '../magicui/shimmer-button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from '../ui/navigation-menu'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
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
              <NavigationMenuLink href="/about">About</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/services">Services</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/contact">Contact</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenu>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex">
          <ShimmerButton href="/contact" className="rounded-full px-5 py-2 text-sm font-medium">
            Let&apos;s talk
          </ShimmerButton>
        </div>

        {/* Mobile menu */}
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger aria-label="Open navigation menu">
              <span className="sr-only">Open navigation menu</span>
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
                    href="/about"
                    className="rounded-md px-2 py-2 text-base font-medium text-slate-50 hover:bg-slate-800"
                  >
                    About
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/services"
                    className="rounded-md px-2 py-2 text-base font-medium text-slate-50 hover:bg-slate-800"
                  >
                    Services
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

