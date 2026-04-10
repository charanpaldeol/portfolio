'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { workLinks } from '@/config/navigation'
import { cn } from '@/lib/utils'

// Desktop dropdown panel — rendered inside NavigationMenuContent.
// Uses plain <Link> (not NavigationMenuLink) to avoid trigger-style conflicts.
export function WorkPanel() {
  const pathname = usePathname()

  return (
    <ul className="w-72 p-2">
      {workLinks.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                isActive && 'bg-accent'
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-container-low transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                )}
              >
                {link.icon}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    'block text-sm text-foreground',
                    isActive ? 'font-semibold' : 'font-medium'
                  )}
                >
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
