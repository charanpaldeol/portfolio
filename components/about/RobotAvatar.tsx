"use client"

import Lottie from "lottie-react"
import { useEffect, useState } from "react"

interface RobotAvatarProps {
  className?: string
  /**
   * Lottie animation JSON — either a CDN URL or a /public path.
   * Defaults to the "robo 2" animation from LottieFiles.
   */
  src?: string
}

const DEFAULT_SRC = "https://assets2.lottiefiles.com/packages/lf20_GbabwrUY2k.json"

export function RobotAvatar({ className, src = DEFAULT_SRC }: RobotAvatarProps) {
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
    return <div className={className} role="img" aria-label="Loading animation…" />
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
