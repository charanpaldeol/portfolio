"use client"

import type { ComponentPropsWithoutRef, CSSProperties, FC } from "react"

import { cn } from "@/lib/utils"

import styles from "./animated-shiny-text.module.css"

export type AnimatedShinyTextProps = ComponentPropsWithoutRef<"span"> & {
  shimmerWidth?: number
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(styles.shinyText, className)}
      {...props}
    >
      {children}
    </span>
  )
}
