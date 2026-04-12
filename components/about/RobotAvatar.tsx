"use client"

import Lottie from "lottie-react"
import { useEffect, useState } from "react"

interface RobotAvatarProps {
  className?: string
  /**
   * Either:
   *  - A URL to a LottieFiles CDN JSON  (e.g. "https://assets2.lottiefiles.com/packages/lf20_…/….json")
   *  - A path to a local file in /public (e.g. "/animations/robot.json")
   *
   * See LOTTIE_GUIDE below for how to find a free animation.
   */
  src: string
}

/*
 * ─── HOW TO PICK AN ANIMATION ───────────────────────────────────────────────
 *
 * 1. Go to  https://lottiefiles.com/search?q=robot&category=animation
 * 2. Filter: Free ✓  |  Any colour theme you like
 * 3. Open the animation → click "JSON" under the download icon
 *    Copy the "Lottie Animation URL" (ends in .json) from the modal
 * 4. Paste that URL as the `src` prop in AboutContent.tsx
 *
 * Good search terms:  "robot wave"  "ai bot"  "robot character"  "cute robot"
 * ────────────────────────────────────────────────────────────────────────────
 */

export function RobotAvatar({ className, src }: RobotAvatarProps) {
  // Fetch the JSON at runtime so we can handle both URLs and local paths uniformly
  const [animationData, setAnimationData] = useState<object | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(src)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setAnimationData(data)
      })
      .catch(console.error)
    return () => {
      cancelled = true
    }
  }, [src])

  if (!animationData) {
    // Placeholder while loading — keeps layout stable
    return (
      <div
        className={className}
        aria-label="Loading robot avatar…"
        role="img"
      />
    )
  }

  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      className={className}
      aria-label="Animated robot avatar"
      role="img"
    />
  )
}
