"use client"

import { motion } from "framer-motion"
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

type ShimmerButtonOwnProps = {
  children: ReactNode
  as?: "a" | "button"
}

type ShimmerButtonProps =
  | (ShimmerButtonOwnProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as?: "a" })
  | (ShimmerButtonOwnProps & ButtonHTMLAttributes<HTMLButtonElement> & { as: "button" })

export function ShimmerButton({ children, className, as = "a", ...props }: ShimmerButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {as === "a" ? (
        <a
          className={cn(
            "inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold text-white",
            "bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 shadow-editorial-float",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
            className
          )}
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      ) : (
        <button
          className={cn(
            "inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold text-white",
            "bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 shadow-editorial-float",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
            className
          )}
          {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      )}
    </motion.div>
  )
}

