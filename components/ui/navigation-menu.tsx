'use client'

import * as React from 'react'
import Link from 'next/link'

export interface NavigationMenuProps {
  children: React.ReactNode
}

export function NavigationMenu({ children }: NavigationMenuProps) {
  return (
    <nav className="flex items-center justify-center">
      <ul className="flex items-center gap-6 text-sm font-medium text-slate-600 md:gap-8">
        {children}
      </ul>
    </nav>
  )
}

export interface NavigationMenuItemProps {
  children: React.ReactNode
}

export function NavigationMenuItem({ children }: NavigationMenuItemProps) {
  return <li className="flex items-center">{children}</li>
}

export interface NavigationMenuLinkProps {
  href: string
  children: React.ReactNode
}

export function NavigationMenuLink({ href, children }: NavigationMenuLinkProps) {
  return (
    <Link
      href={href}
      className="text-slate-600 transition-colors hover:text-slate-900 data-[active=true]:text-slate-950"
    >
      {children}
    </Link>
  )
}

