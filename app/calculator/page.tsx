"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { PageShell } from "@/components/layout/PageShell"

type Op = "+" | "-" | "*" | "/"

const BTN_PAD =
  "rounded-md bg-surface-container-high p-3 text-foreground hover:bg-surface-container-highest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"

function applyOp(a: number, b: number, op: Op): number {
  switch (op) {
    case "+":
      return a + b
    case "-":
      return a - b
    case "*":
      return a * b
    case "/":
      return b === 0 ? NaN : a / b
    default:
      return b
  }
}

export default function CalculatorPage() {
  const [display, setDisplay] = useState("0")
  const [acc, setAcc] = useState<number | null>(null)
  const [pendingOp, setPendingOp] = useState<Op | null>(null)
  const [fresh, setFresh] = useState(true)

  const value = useMemo(() => {
    const n = Number.parseFloat(display)
    return Number.isFinite(n) ? n : 0
  }, [display])

  const pushDigit = useCallback(
    (d: string) => {
      setDisplay((prev) => {
        if (fresh) {
          setFresh(false)
          return d
        }
        if (prev === "0" && d !== ".") return d
        if (d === "." && prev.includes(".")) return prev
        return prev + d
      })
    },
    [fresh],
  )

  const commitOp = useCallback(
    (next: Op) => {
      if (acc === null || pendingOp === null) {
        setAcc(value)
        setPendingOp(next)
        setFresh(true)
        return
      }
      const nextAcc = applyOp(acc, value, pendingOp)
      const shown = Number.isFinite(nextAcc) ? String(nextAcc) : "Error"
      setAcc(nextAcc)
      setDisplay(shown)
      setPendingOp(next)
      setFresh(true)
    },
    [acc, pendingOp, value],
  )

  const equals = useCallback(() => {
    if (acc === null || pendingOp === null) return
    const result = applyOp(acc, value, pendingOp)
    setDisplay(Number.isFinite(result) ? String(result) : "Error")
    setAcc(null)
    setPendingOp(null)
    setFresh(true)
  }, [acc, pendingOp, value])

  const clear = useCallback(() => {
    setDisplay("0")
    setAcc(null)
    setPendingOp(null)
    setFresh(true)
  }, [])

  const backspace = useCallback(() => {
    setDisplay((prev) => {
      if (prev === "Error" || prev.length <= 1) return "0"
      const next = prev.slice(0, -1)
      return next === "" || next === "-" ? "0" : next
    })
    setFresh(false)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return

      const k = e.key
      if (/^[0-9]$/.test(k)) {
        e.preventDefault()
        pushDigit(k)
        return
      }
      if (k === ".") {
        e.preventDefault()
        pushDigit(".")
        return
      }
      if (k === "+" || k === "-" || k === "*" || k === "/") {
        e.preventDefault()
        commitOp(k as Op)
        return
      }
      if (k === "Enter" || k === "=") {
        e.preventDefault()
        equals()
        return
      }
      if (k === "Escape") {
        e.preventDefault()
        clear()
        return
      }
      if (k === "Backspace") {
        e.preventDefault()
        backspace()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [pushDigit, commitOp, equals, clear, backspace])

  return (
    <PageShell>
      <main className="mx-auto max-w-md space-y-6">
        <h1 className="font-display text-3xl font-semibold text-foreground">Calculator</h1>
        <div
          data-testid="calc-display"
          className="rounded-lg bg-surface-container p-4 text-right font-mono text-2xl text-foreground"
          aria-live="polite"
        >
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {(["7", "8", "9", "/"] as const).map((key) => (
            <button
              key={key}
              type="button"
              className={BTN_PAD}
              onClick={() => (key === "/" ? commitOp("/") : pushDigit(key))}
            >
              {key}
            </button>
          ))}
          {(["4", "5", "6", "*"] as const).map((key) => (
            <button
              key={key}
              type="button"
              className={BTN_PAD}
              onClick={() => (key === "*" ? commitOp("*") : pushDigit(key))}
            >
              {key}
            </button>
          ))}
          {(["1", "2", "3", "-"] as const).map((key) => (
            <button
              key={key}
              type="button"
              className={BTN_PAD}
              onClick={() => (key === "-" ? commitOp("-") : pushDigit(key))}
            >
              {key}
            </button>
          ))}
          <button type="button" className={BTN_PAD} onClick={clear}>
            C
          </button>
          <button type="button" className={BTN_PAD} onClick={() => pushDigit("0")}>
            0
          </button>
          <button type="button" className={BTN_PAD} onClick={() => pushDigit(".")}>
            .
          </button>
          <button type="button" className={BTN_PAD} onClick={() => commitOp("+")}>
            +
          </button>
          <button
            type="button"
            className={`col-span-4 rounded-md bg-primary p-3 font-medium text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface hover:opacity-90`}
            onClick={equals}
          >
            =
          </button>
        </div>
      </main>
    </PageShell>
  )
}
