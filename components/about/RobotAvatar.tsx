"use client"

import Lottie from "lottie-react"

interface RobotAvatarProps {
  /** Pre-fetched Lottie animation JSON, passed from the parent server component. */
  animationData: object | null
  className?: string
}

export function RobotAvatar({ animationData, className }: RobotAvatarProps) {
  if (!animationData) {
    return <div className={className} role="img" aria-label="Robot avatar" />
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
