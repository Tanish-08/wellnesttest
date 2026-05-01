"use client"

import { useEffect, useState } from "react"

interface CircularProgressProps {
  percentage: number
  color: string
  isAnimating?: boolean
  size?: number
  strokeWidth?: number
}

export function CircularProgress({
  percentage,
  color,
  isAnimating = false,
  size = 200,
  strokeWidth = 12,
}: CircularProgressProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0)

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (displayPercentage / 100) * circumference

  useEffect(() => {
    if (isAnimating) {
      setDisplayPercentage(0)
      const duration = 2000
      const steps = 60
      const increment = percentage / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= percentage) {
          setDisplayPercentage(percentage)
          clearInterval(timer)
        } else {
          setDisplayPercentage(Math.round(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    } else {
      setDisplayPercentage(percentage)
    }
  }, [percentage, isAnimating])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-100 ease-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl sm:text-5xl font-bold text-foreground">
          {displayPercentage}%
        </span>
        <span className="text-sm text-muted-foreground">Risk Score</span>
      </div>
    </div>
  )
}
