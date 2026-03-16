'use client'

import * as React from 'react'

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
      className="inline-flex items-center justify-center rounded-md border border-transparent bg-slate-950 px-3 py-2 text-sm font-medium text-slate-50 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
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

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        aria-label="Close navigation menu"
        className="fixed inset-0 h-full w-full bg-black/40"
        onClick={() => setOpen(false)}
      />
      <div
        className={`fixed bg-slate-950 p-6 text-slate-50 shadow-lg transition-transform ${sideClasses[side]}`}
      >
        {children}
      </div>
    </div>
  )
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
  return <h2 className="text-lg font-semibold text-slate-50">{children}</h2>
}

export interface SheetDescriptionProps {
  children: React.ReactNode
}

export function SheetDescription({ children }: SheetDescriptionProps) {
  return <p className="text-sm text-slate-300">{children}</p>
}

export interface SheetCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function SheetClose({ children, ...props }: SheetCloseProps) {
  const context = React.useContext(SheetContext)

  if (!context) {
    throw new Error('SheetClose must be used within a Sheet')
  }

  const { setOpen } = context

  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-transparent px-3 py-2 text-sm font-medium text-slate-50 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      {...props}
    >
      {children}
    </button>
  )
}

