"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { FormEvent, useEffect, useState } from "react"

import { submitExperienceUnlock } from "@/lib/experience-unlock"
import { cn } from "@/lib/utils"
import { RainbowButton } from "@/registry/magicui/rainbow-button"

const STORAGE_KEY = "cpdeol-portfolio-experience-unlocked"

interface ExperienceEmailGateProps {
  children: React.ReactNode
}

export function ExperienceEmailGate({ children }: ExperienceEmailGateProps) {
  const [locked, setLocked] = useState(true)
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") {
        setLocked(false)
      }
    } catch {
      // private mode / storage blocked — keep gate
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const result = await submitExperienceUnlock(email.trim())
    if (!result.ok) {
      setError(result.error ?? "Something went wrong. Please try again.")
      setSubmitting(false)
      return
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, "1")
    } catch {
      // still unblur for this session
    }
    setLocked(false)
    setSubmitting(false)
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "transition-[filter,transform] duration-500 ease-out",
          locked && "pointer-events-none scale-[0.998] blur-md select-none",
        )}
        aria-hidden={locked}
      >
        {children}
      </div>

      <Dialog.Root open={locked} modal>
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px]" />
          <Dialog.Content
            className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-[101] w-[min(calc(100vw-2rem),420px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface-container-lowest p-6 shadow-editorial md:p-8"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <Dialog.Title className="font-display text-xl font-bold tracking-tight text-on-surface md:text-2xl">
              Read the full experience
            </Dialog.Title>
            <Dialog.Description className="mt-3 text-sm leading-relaxed text-on-surface-variant">
              Enter your email once to unlock this page. I use this to understand who is engaging with the portfolio; I
              won&apos;t spam you.
            </Dialog.Description>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="experience-gate-email" className="sr-only">
                  Email
                </label>
                <input
                  id="experience-gate-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-base text-on-surface placeholder:text-on-surface-variant/55 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest"
                />
              </div>
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              <RainbowButton
                as="button"
                type="submit"
                className="w-full justify-center rounded-xl px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Unlocking…" : "Unlock page"}
              </RainbowButton>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
