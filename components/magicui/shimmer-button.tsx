import { motion } from "framer-motion"
import type { AnchorHTMLAttributes, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type ShimmerButtonProps = {
  children: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>

export function ShimmerButton({ children, className, ...props }: ShimmerButtonProps) {
  return (
    <motion.a
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={twMerge(
        "inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold text-white",
        "bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        className
      )}
      {...props}
    >
      {children}
    </motion.a>
  )
}

