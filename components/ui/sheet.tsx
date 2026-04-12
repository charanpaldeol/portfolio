'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'

interface SheetContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | undefined>(undefined)

export interface SheetProps {
  children: React.ReactNode
}

export function Sheet({ children }: SheetProps) {
  const [open, setOpen] = React.useState<boolean>(false)

  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>
}

export interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function SheetTrigger({ children, ...props }: SheetTriggerProps) {
  const context = React.useContext(SheetContext)

  if (!context) {
    throw new Error('SheetTrigger must be used within a Sheet')
  }

  const { setOpen } = context

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="inline-flex items-center justify-center rounded-xl border border-transparent bg-foreground px-3 py-2 text-sm font-medium text-background hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      {...props}
    >
      {children}
    </button>
  )
}

export interface SheetContentProps {
  side?: 'left' | 'right' | 'top' | 'bottom'
  children: React.ReactNode
}

export function SheetContent({ side = 'left', children }: SheetContentProps) {
  const context = React.useContext(SheetContext)

  if (!context) {
    throw new Error('SheetContent must be used within a Sheet')
  }

  const { open, setOpen } = context

  const sideClasses: Record<NonNullable<SheetContentProps['side']>, string> = {
    left: 'left-0 top-0 h-full w-80 max-w-full',
    right: 'right-0 top-0 h-full w-80 max-w-full',
    top: 'top-0 left-0 w-full max-h-[80vh]',
    bottom: 'bottom-0 left-0 w-full max-h-[80vh]',
  }

  if (!open) return null

  // Render at document.body so `position: fixed` is not trapped by ancestors
  // (e.g. the sticky navbar uses `backdrop-blur`, which creates a containing block
  // for fixed descendants and clips the drawer to the header height).
  const layer = (
    <div className="fixed inset-0 z-[200] flex">
      <button
        type="button"
        aria-label="Close navigation menu"
        className="fixed inset-0 z-0 h-full w-full bg-on-surface/25 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div
        className={`fixed z-10 bg-foreground p-6 text-background shadow-editorial-lg backdrop-blur-xl transition-transform ${sideClasses[side]}`}
      >
        {children}
      </div>
    </div>
  )

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(layer, document.body)
}

export interface SheetHeaderProps {
  children: React.ReactNode
}

export function SheetHeader({ children }: SheetHeaderProps) {
  return <div className="mb-4 flex flex-col gap-1">{children}</div>
}

export interface SheetTitleProps {
  children: React.ReactNode
}

export function SheetTitle({ children }: SheetTitleProps) {
  return <h2 className="font-display text-lg font-bold text-background">{children}</h2>
}

export interface SheetDescriptionProps {
  children: React.ReactNode
}

export function SheetDescription({ children }: SheetDescriptionProps) {
  return <p className="text-sm text-background/75">{children}</p>
}

export interface SheetCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  asChild?: boolean
}

export function SheetClose({ children, asChild, ...props }: SheetCloseProps) {
  const context = React.useContext(SheetContext)

  if (!context) {
    throw new Error('SheetClose must be used within a Sheet')
  }

  const { setOpen } = context

  if (asChild) {
    return (
      <span
        onClick={() => setOpen(false)}
        className={props.className}
        {...props}
      >
        {children}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className="inline-flex items-center justify-center rounded-xl border border-background/20 bg-transparent px-3 py-2 text-sm font-medium text-background hover:bg-background/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
      {...props}
    >
      {children}
    </button>
  )
}

