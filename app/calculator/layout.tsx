import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Calculator",
  description: "Quick arithmetic in the browser — add, subtract, multiply, and divide with a minimal keypad.",
}

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return children
}
