'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ideasLinks, portfolioNavLinks, workLinks } from '@/config/navigation'
import { cn } from '@/lib/utils'
import { BrandMark } from './navbar/BrandMark'
import { SocialLinks } from './navbar/SocialLinks'
import { WorkPanel } from './navbar/WorkPanel'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'

export function Navbar() {
  const pathname = usePathname()
  const isWorkRoute = pathname.startsWith('/portfolio')
  const isIdeasRoute = ideasLinks.some((l) => pathname === l.href || pathname.startsWith(`${l.href}/`))
  const isHomeRoute = pathname === '/'

  return (
    <header className="sticky top-0 z-[100] w-full shrink-0 border-b border-outline-variant/10 bg-surface/90 shadow-editorial-float backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-surface/80">
      <div
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6',
          isWorkRoute ? 'py-2' : 'py-3'
        )}
      >
        {/* Logo */}
        <Link href="/" aria-label="cpdeol home" className="flex items-center gap-2">
          <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center">
            <BrandMark />
          </span>
          <span
            className={cn(
              'flex items-center font-display leading-none text-sm text-primary',
              isHomeRoute ? 'font-semibold' : 'font-medium'
            )}
          >
            cpdeol
            <span
              aria-hidden="true"
              className={cn(
                'ml-1 text-primary-container cpdeol-blink-cursor text-sm leading-none',
                isHomeRoute ? 'font-semibold' : 'font-medium'
              )}
            >
              _
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <NavigationMenu>
            <NavigationMenuList>

              <NavigationMenuItem>
                <NavigationMenuLink href="/" exact>Home</NavigationMenuLink>
              </NavigationMenuItem>

              {/* Work — rich dropdown with icons + descriptions */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={isWorkRoute ? 'font-semibold text-foreground' : undefined}>
                  Work
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <WorkPanel />
                </NavigationMenuContent>
              </NavigationMenuItem>

              {portfolioNavLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink href={link.href}>{link.label}</NavigationMenuLink>
                </NavigationMenuItem>
              ))}

              {/* Ideas — direct link while single destination; expand to dropdown when more pages added */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href={ideasLinks[0]?.href ?? '/internet-owned'}
                  className={isIdeasRoute ? 'font-semibold text-foreground' : undefined}
                >
                  Ideas
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/blog">Blog</NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop CTA + Social */}
        <SocialLinks />

        {/* Mobile menu — Sheet drawer */}
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger aria-label="Open navigation menu">
              <svg aria-hidden="true" className="h-5 w-5 text-background" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <Link href="/" className="rounded-md px-2 py-2 text-base font-medium text-background hover:bg-background/10">
                    Home
                  </Link>
                </SheetClose>

                <p className="px-2 pt-1 text-xs font-semibold tracking-widest text-background/50 uppercase">Work</p>
                {workLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link href={link.href} className="flex items-center gap-3 rounded-md px-4 py-2 text-base font-medium text-background hover:bg-background/10">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background/15 text-background/90">
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}

                {portfolioNavLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link href={link.href} className="flex items-center gap-3 rounded-md px-4 py-2 text-base font-medium text-background hover:bg-background/10">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background/15 text-background/90">
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}

                <p className="px-2 pt-1 text-xs font-semibold tracking-widest text-background/50 uppercase">Ideas</p>
                {ideasLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link href={link.href} className="rounded-md px-4 py-2 text-base font-medium text-background hover:bg-background/10">
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}

                <SheetClose asChild>
                  <Link href="/blog" className="rounded-md px-2 py-2 text-base font-medium text-background hover:bg-background/10">
                    Blog
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link href="/contact" className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container px-4 py-2 text-base font-medium text-primary-foreground hover:brightness-[1.03]">
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
