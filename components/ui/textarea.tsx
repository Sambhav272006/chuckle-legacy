'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
  helperText?: string
  showCount?: boolean
  maxLength?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, helperText, showCount, maxLength, id, value, ...props }, ref) => {
    const textareaId = id || React.useId()
    const charCount = typeof value === 'string' ? value.length : 0

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            className={cn(
              'flex min-h-[100px] w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background transition-colors',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'resize-y',
              error
                ? 'border-destructive focus-visible:ring-destructive'
                : 'border-input',
              className
            )}
            ref={ref}
            value={value}
            maxLength={maxLength}
            {...props}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-sm text-muted-foreground">{helperText}</p>
            )}
          </div>
          {showCount && maxLength && (
            <p className={cn(
              'text-sm',
              charCount > maxLength * 0.9
                ? 'text-warning-500'
                : 'text-muted-foreground'
            )}>
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
