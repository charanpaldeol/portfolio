"use client"

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

import styles from "./rainbow-button.module.css"

type RainbowButtonOwnProps = {
  children: ReactNode
  className?: string
  as?: "a" | "button"
}

type RainbowButtonProps =
  | (RainbowButtonOwnProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as?: "a" })
  | (RainbowButtonOwnProps & ButtonHTMLAttributes<HTMLButtonElement> & { as: "button" })

export function RainbowButton({ children, className, as = "a", ...props }: RainbowButtonProps) {
  const cls = twMerge(
    styles.editorialCta,
    "inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-medium text-primary-foreground transition-[filter]",
    className
  )

  if (as === "button") {
    return (
      <button className={cls} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
        {children}
      </button>
    )
  }

  return (
    <a className={cls} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {children}
    </a>
  )
}
