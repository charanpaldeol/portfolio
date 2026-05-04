"use client"
import { useEffect, useLayoutEffect, useReducer, useRef, useState } from "react"

export const BREAK_TIPS = [
  "Look at something 20 feet away. Let your eyes relax.",
  "Stand up and take a short walk around the room.",
  "Close your eyes and breathe deeply for a moment.",
  "Look out a window — give your eyes a proper rest.",
]

type Status = "idle" | "running" | "paused" | "break"

type State = {
  status: Status
  remaining: number // ms (display; for paused, source of truth)
  breakRemaining: number // ms
  breakCount: number
  tipIndex: number
  workEndsAt: number | null // epoch ms when work period ends
  breakEndsAt: number | null // epoch ms when break ends
  pausedPhase: "work" | "break" | null
}

type Action =
  | { type: "START_WORK"; remaining: number }
  | { type: "RESUME" }
  | { type: "PAUSE" }
  | { type: "STOP"; initialState: State }
  | { type: "REPLACE"; state: State }
  | { type: "SKIP_BREAK"; remaining: number; breakCount: number; workEndsAt: number }

const TICK_MS = 1000

const STORAGE_KEY = "cpdeol-eye-break-timer-v2"

type PersistedV2 = {
  v: 2
  status: Status
  remaining: number
  breakRemaining: number
  breakCount: number
  tipIndex: number
  workEndsAt: number | null
  breakEndsAt: number | null
  pausedPhase: "work" | "break" | null
  workMs: number
  breakMs: number
}

function makeInitialState(): State {
  return {
    status: "idle",
    remaining: 0,
    breakRemaining: 0,
    breakCount: 0,
    tipIndex: 0,
    workEndsAt: null,
    breakEndsAt: null,
    pausedPhase: null,
  }
}

function reconcileOverdue(s: State, now: number, workMs: number, breakMs: number): State {
  const tipsCount = BREAK_TIPS.length
  let cur = { ...s }
  let guard = 0

  if (cur.status === "paused" || cur.status === "idle") {
    return cur
  }

  while (guard++ < 10000) {
    if (cur.status === "running" && cur.workEndsAt != null) {
      if (now < cur.workEndsAt) {
        return { ...cur, remaining: Math.max(0, cur.workEndsAt - now) }
      }
      const endedAt = cur.workEndsAt
      const nextTipIndex = (cur.tipIndex + 1) % tipsCount
      cur = {
        ...cur,
        status: "break",
        remaining: 0,
        breakRemaining: breakMs,
        tipIndex: nextTipIndex,
        workEndsAt: null,
        breakEndsAt: endedAt + breakMs,
        pausedPhase: null,
      }
      continue
    }

    if (cur.status === "break" && cur.breakEndsAt != null) {
      if (now < cur.breakEndsAt) {
        return { ...cur, breakRemaining: Math.max(0, cur.breakEndsAt - now) }
      }
      const endedAt = cur.breakEndsAt
      cur = {
        ...cur,
        status: "running",
        remaining: workMs,
        breakRemaining: 0,
        breakCount: cur.breakCount + 1,
        workEndsAt: endedAt + workMs,
        breakEndsAt: null,
        pausedPhase: null,
      }
      continue
    }

    break
  }

  return cur
}

function loadPersisted(): { state: State; workMs: number; breakMs: number } | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as PersistedV2
    if (p.v !== 2 || p.status == null) return null
    const base: State = {
      status: p.status,
      remaining: p.remaining,
      breakRemaining: p.breakRemaining,
      breakCount: p.breakCount,
      tipIndex: p.tipIndex,
      workEndsAt: p.workEndsAt,
      breakEndsAt: p.breakEndsAt,
      pausedPhase: p.pausedPhase ?? null,
    }
    const now = Date.now()
    const state = reconcileOverdue(base, now, p.workMs, p.breakMs)
    return { state, workMs: p.workMs, breakMs: p.breakMs }
  } catch {
    return null
  }
}

function savePersisted(state: State, workMs: number, breakMs: number) {
  if (typeof window === "undefined") return
  try {
    if (state.status === "idle") {
      sessionStorage.removeItem(STORAGE_KEY)
      return
    }
    const payload: PersistedV2 = {
      v: 2,
      status: state.status,
      remaining: state.remaining,
      breakRemaining: state.breakRemaining,
      breakCount: state.breakCount,
      tipIndex: state.tipIndex,
      workEndsAt: state.workEndsAt,
      breakEndsAt: state.breakEndsAt,
      pausedPhase: state.pausedPhase,
      workMs,
      breakMs,
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // ignore quota / private mode
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START_WORK":
      return {
        status: "running",
        remaining: action.remaining,
        breakRemaining: 0,
        breakCount: state.breakCount,
        tipIndex: state.tipIndex,
        workEndsAt: Date.now() + action.remaining,
        breakEndsAt: null,
        pausedPhase: null,
      }
    case "RESUME": {
      if (state.pausedPhase === "work") {
        return {
          ...state,
          status: "running",
          workEndsAt: Date.now() + state.remaining,
          pausedPhase: null,
        }
      }
      if (state.pausedPhase === "break") {
        return {
          ...state,
          status: "break",
          breakEndsAt: Date.now() + state.breakRemaining,
          pausedPhase: null,
        }
      }
      return state
    }
    case "PAUSE": {
      if (state.status === "running" && state.workEndsAt != null) {
        const remaining = Math.max(0, state.workEndsAt - Date.now())
        return {
          ...state,
          status: "paused",
          remaining,
          workEndsAt: null,
          pausedPhase: "work",
        }
      }
      if (state.status === "break" && state.breakEndsAt != null) {
        const breakRemaining = Math.max(0, state.breakEndsAt - Date.now())
        return {
          ...state,
          status: "paused",
          breakRemaining,
          breakEndsAt: null,
          pausedPhase: "break",
        }
      }
      return state
    }
    case "STOP":
      return action.initialState
    case "REPLACE":
      return action.state
    case "SKIP_BREAK":
      return {
        ...state,
        status: "running",
        remaining: action.remaining,
        breakRemaining: 0,
        breakCount: action.breakCount,
        workEndsAt: action.workEndsAt,
        breakEndsAt: null,
        pausedPhase: null,
      }
    default: {
      const _exhaustive: never = action
      return state
    }
  }
}

function formatMsAsMMSS(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function stateTimerSig(a: State) {
  return `${a.status}|${a.remaining}|${a.breakRemaining}|${a.breakCount}|${a.tipIndex}|${a.workEndsAt}|${a.breakEndsAt}|${a.pausedPhase}`
}

export function useEyeBreakTimer() {
  const [state, dispatch] = useReducer(reducer, makeInitialState())

  const [workMs, setWorkMsState] = useState(30 * 60 * 1000)
  const [breakMs, setBreakMsState] = useState(1 * 60 * 1000)

  const workMsRef = useRef(workMs)
  const breakMsRef = useRef(breakMs)
  const stateRef = useRef(state)
  const originalTitleRef = useRef<string | null>(null)

  useLayoutEffect(() => {
    const p = loadPersisted()
    if (p) {
      dispatch({ type: "REPLACE", state: p.state })
      setWorkMsState(p.workMs)
      setBreakMsState(p.breakMs)
    }
  }, [])

  useEffect(() => {
    workMsRef.current = workMs
  }, [workMs])

  useEffect(() => {
    breakMsRef.current = breakMs
  }, [breakMs])

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    savePersisted(state, workMs, breakMs)
  }, [state, workMs, breakMs])

  useEffect(() => {
    originalTitleRef.current = typeof document !== "undefined" ? document.title : null
    return () => {
      if (originalTitleRef.current && typeof document !== "undefined") {
        document.title = originalTitleRef.current
      }
    }
  }, [])

  useEffect(() => {
    if (!originalTitleRef.current) return

    if (state.status === "idle") {
      document.title = originalTitleRef.current
      return
    }

    const ms = state.status === "break" ? state.breakRemaining : state.remaining
    document.title = `(${formatMsAsMMSS(ms)}) Eye Break Timer`
  }, [state.status, state.remaining, state.breakRemaining])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (state.status !== "running" && state.status !== "break") return

    const tick = () => {
      const now = Date.now()
      const wm = workMsRef.current
      const bm = breakMsRef.current
      const prev = stateRef.current
      const next = reconcileOverdue(prev, now, wm, bm)

      if (stateTimerSig(prev) === stateTimerSig(next)) return

      const enteredBreak = prev.status === "running" && next.status === "break"
      if (enteredBreak) {
        const tipsCount = BREAK_TIPS.length
        const currentTip = BREAK_TIPS[prev.tipIndex % tipsCount] ?? BREAK_TIPS[0] ?? ""
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification("Break time", { body: currentTip })
        }
        try {
          window.focus()
        } catch {
          // ignore
        }
      }

      dispatch({ type: "REPLACE", state: next })
    }

    const interval = window.setInterval(tick, TICK_MS)
    const onVisible = () => {
      if (document.visibilityState !== "visible") return
      tick()
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [state.status])

  const setWorkMs = (nextMinutes: number) => setWorkMsState(nextMinutes)
  const setBreakMs = (nextMinutes: number) => setBreakMsState(nextMinutes)

  const start = () => {
    const current = stateRef.current

    if (current.status === "idle") {
      dispatch({ type: "START_WORK", remaining: workMsRef.current })
      return
    }

    if (current.status === "paused") {
      dispatch({ type: "RESUME" })
      return
    }

    if (current.status === "break") {
      const now = Date.now()
      dispatch({
        type: "SKIP_BREAK",
        remaining: workMsRef.current,
        breakCount: current.breakCount + 1,
        workEndsAt: now + workMsRef.current,
      })
      return
    }
  }

  const pause = () => {
    const current = stateRef.current
    if (current.status !== "running" && current.status !== "break") return
    dispatch({ type: "PAUSE" })
  }

  const stop = () => {
    dispatch({ type: "STOP", initialState: makeInitialState() })
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
    }
    if (originalTitleRef.current && typeof document !== "undefined") {
      document.title = originalTitleRef.current
    }
  }

  return {
    state,
    start,
    pause,
    stop,
    workMs,
    breakMs,
    setWorkMs,
    setBreakMs,
  }
}
