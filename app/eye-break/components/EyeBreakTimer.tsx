"use client"
import { useMemo, useState } from "react"
import { toast, Toaster } from "sonner"

import { NumberTicker } from "components/magicui/number-ticker"
import { Badge } from "components/ui/badge"
import { Button } from "components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import { Slider } from "components/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip"

import { BreakOverlay } from "./BreakOverlay"
import { BREAK_TIPS, useEyeBreakTimer } from "../hooks/useEyeBreakTimer"

const tipsCount = BREAK_TIPS.length

function formatMinutes(ms: number) {
  return Math.round(ms / 60000)
}

export function EyeBreakTimer() {
  const { state, start, pause, stop, workMs, breakMs, setWorkMs, setBreakMs } = useEyeBreakTimer()
  const [previewOpen, setPreviewOpen] = useState(false)

  const overlayOpen = state.status === "break" || previewOpen

  const breakTipForOverlay = useMemo(() => {
    if (state.status === "break") {
      const currentTipIndex = (state.tipIndex - 1 + tipsCount) % tipsCount
      return BREAK_TIPS[currentTipIndex] ?? BREAK_TIPS[0] ?? ""
    }
    return BREAK_TIPS[0] ?? ""
  }, [state.status, state.tipIndex])

  const handleSkip = () => {
    setPreviewOpen(false)
    if (state.status === "break") start()
  }

  const handleStart = async () => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      toast("Enable notifications to get alerted even when this tab is in the background")
    }
    try {
      if (typeof Notification !== "undefined") {
        await Notification.requestPermission()
      }
    } catch {
      // Ignore permission errors; the timer still works.
    }
    start()
  }

  const handleStop = () => {
    setPreviewOpen(false)
    stop()
  }

  const workMinutes = formatMinutes(workMs)
  const breakMinutes = formatMinutes(breakMs)

  const workTotalSeconds = Math.max(0, Math.ceil(state.remaining / 1000))
  const workMinutesPart = Math.floor(workTotalSeconds / 60)
  const workSecondsPart = workTotalSeconds % 60

  const canEditTimers = state.status === "idle" || state.status === "paused"
  const canStart = state.status === "idle" || state.status === "paused"
  const canPause = state.status === "running"

  return (
    <TooltipProvider delayDuration={0}>
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Eye Break Timer</CardTitle>
          <CardDescription>Rest your eyes on a schedule</CardDescription>
          <CardAction>
            <Badge variant="outline">
              {state.status === "idle" && "Idle"}
              {state.status === "running" && "Running"}
              {state.status === "paused" && "Paused"}
              {state.status === "break" && "On Break"}
            </Badge>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Work interval</div>
              <div className="text-sm font-medium text-muted-foreground">{workMinutes} min</div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Slider
                  aria-label="Work interval"
                  min={5}
                  max={60}
                  step={1}
                  value={[workMinutes]}
                  onValueChange={(v) => setWorkMs((v[0] ?? workMinutes) * 60 * 1000)}
                  disabled={!canEditTimers}
                />
              </TooltipTrigger>
              <TooltipContent>{workMinutes} min</TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Break duration</div>
              <div className="text-sm font-medium text-muted-foreground">{breakMinutes} min</div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Slider
                  aria-label="Break duration"
                  min={1}
                  max={5}
                  step={1}
                  value={[breakMinutes]}
                  onValueChange={(v) => setBreakMs((v[0] ?? breakMinutes) * 60 * 1000)}
                  disabled={!canEditTimers}
                />
              </TooltipTrigger>
              <TooltipContent>{breakMinutes} min</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default" onClick={handleStart} disabled={!canStart} aria-label="Start">
            Start
          </Button>
          <Button variant="outline" onClick={pause} disabled={!canPause} aria-label="Pause">
            Pause
          </Button>
          <Button variant="ghost" onClick={handleStop} aria-label="Stop">
            Stop
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPreviewOpen(true)}
            disabled={
              state.status === "running" || state.status === "break" || previewOpen
            }
            aria-label="Preview"
          >
            Preview
          </Button>
        </div>

        {state.status !== "idle" && state.status !== "break" && (
          <div
            data-testid="work-countdown"
            className="text-center"
            role="timer"
            aria-live="off"
            aria-label={`${workMinutesPart} minutes ${workSecondsPart} seconds remaining`}
          >
            {/* keep seconds animated via NumberTicker */}
            <div className="text-4xl font-semibold tabular-nums">
              {`${workMinutesPart}:`}
              <NumberTicker value={workSecondsPart} className="inline-block" />
            </div>
          </div>
        )}

        <BreakOverlay
          isOpen={overlayOpen}
          breakRemaining={state.status === "break" ? state.breakRemaining : breakMs}
          breakTotal={breakMs}
          tip={breakTipForOverlay}
          onSkip={handleSkip}
          onStop={handleStop}
        />
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

