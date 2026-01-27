'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string
  showValue?: boolean
  label?: string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, showValue, label, ...props }, ref) => (
  <div className="w-full">
    {(label || showValue) && (
      <div className="flex justify-between mb-1.5 text-sm">
        {label && <span className="text-muted-foreground">{label}</span>}
        {showValue && <span className="font-medium">{value}%</span>}
      </div>
    )}
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-3 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full w-full flex-1 bg-brand-500 transition-all duration-500 ease-out',
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

// Circular progress component
interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  showValue?: boolean
  label?: string
  color?: 'brand' | 'success' | 'warning' | 'destructive'
}

function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  className,
  showValue = true,
  label,
  color = 'brand',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  const colors = {
    brand: 'text-brand-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    destructive: 'text-destructive',
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="progress-ring"
      >
        <circle
          className="text-muted"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn('progress-ring-circle', colors[color])}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        {showValue && (
          <span className="text-2xl font-bold">{Math.round(value)}%</span>
        )}
        {label && (
          <span className="text-xs text-muted-foreground">{label}</span>
        )}
      </div>
    </div>
  )
}

// Match score component
interface MatchScoreProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

function MatchScore({ score, size = 'md', showLabel = true }: MatchScoreProps) {
  const sizes = {
    sm: { container: 'w-12 h-12', text: 'text-sm', label: 'text-[10px]' },
    md: { container: 'w-16 h-16', text: 'text-xl', label: 'text-xs' },
    lg: { container: 'w-24 h-24', text: 'text-3xl', label: 'text-sm' },
  }

  const getColor = () => {
    if (score >= 90) return 'bg-success-100 text-success-700 border-success-200'
    if (score >= 75) return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    if (score >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    if (score >= 40) return 'bg-orange-100 text-orange-700 border-orange-200'
    return 'bg-red-100 text-red-700 border-red-200'
  }

  const getLabel = () => {
    if (score >= 90) return 'Perfect'
    if (score >= 75) return 'Great'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Low'
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-full border-2',
        sizes[size].container,
        getColor()
      )}
    >
      <span className={cn('font-bold', sizes[size].text)}>{score}</span>
      {showLabel && (
        <span className={cn('font-medium -mt-1', sizes[size].label)}>{getLabel()}</span>
      )}
    </div>
  )
}

export { Progress, CircularProgress, MatchScore }
