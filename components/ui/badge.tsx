import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-brand-100 text-brand-700 hover:bg-brand-200',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-red-100 text-red-700 hover:bg-red-200',
        success: 'bg-success-100 text-success-700 hover:bg-success-200',
        warning: 'bg-warning-100 text-warning-700 hover:bg-warning-200',
        outline: 'border border-current bg-transparent',
        premium: 'bg-gradient-to-r from-warning-400 to-warning-500 text-white',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  removable?: boolean
  onRemove?: () => void
  icon?: React.ReactNode
}

function Badge({
  className,
  variant,
  size,
  removable,
  onRemove,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

// Special badges for job matching
function MatchBadge({ score }: { score: number }) {
  let variant: 'success' | 'warning' | 'destructive' | 'default' = 'default'
  let label = ''

  if (score >= 90) {
    variant = 'success'
    label = 'Perfect Match'
  } else if (score >= 75) {
    variant = 'success'
    label = 'Great Match'
  } else if (score >= 60) {
    variant = 'warning'
    label = 'Good Match'
  } else if (score >= 40) {
    variant = 'warning'
    label = 'Fair Match'
  } else {
    variant = 'destructive'
    label = 'Low Match'
  }

  return (
    <Badge variant={variant} size="lg">
      <span className="font-bold mr-1">{score}%</span>
      {label}
    </Badge>
  )
}

function SkillBadge({
  skill,
  isRequired,
  proficiency,
  removable,
  onRemove,
}: {
  skill: string
  isRequired?: boolean
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  removable?: boolean
  onRemove?: () => void
}) {
  const proficiencyColors = {
    beginner: 'bg-gray-100 text-gray-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700',
    expert: 'bg-brand-100 text-brand-700',
  }

  return (
    <Badge
      variant={isRequired ? 'default' : 'secondary'}
      className={proficiency ? proficiencyColors[proficiency] : undefined}
      removable={removable}
      onRemove={onRemove}
    >
      {skill}
      {isRequired && <span className="ml-1 text-brand-500">*</span>}
    </Badge>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { variant: 'success' | 'warning' | 'destructive' | 'secondary'; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    pending: { variant: 'warning', label: 'Pending' },
    reviewing: { variant: 'warning', label: 'Reviewing' },
    shortlisted: { variant: 'success', label: 'Shortlisted' },
    interviewing: { variant: 'success', label: 'Interviewing' },
    offered: { variant: 'success', label: 'Offered' },
    hired: { variant: 'success', label: 'Hired' },
    rejected: { variant: 'destructive', label: 'Rejected' },
    withdrawn: { variant: 'secondary', label: 'Withdrawn' },
    closed: { variant: 'secondary', label: 'Closed' },
    draft: { variant: 'secondary', label: 'Draft' },
    paused: { variant: 'warning', label: 'Paused' },
  }

  const config = statusConfig[status] || { variant: 'secondary', label: status }

  return <Badge variant={config.variant}>{config.label}</Badge>
}

export { Badge, badgeVariants, MatchBadge, SkillBadge, StatusBadge }
