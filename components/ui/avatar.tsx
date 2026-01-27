'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn, getInitials, getAvatarUrl } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-24 w-24',
        '3xl': 'h-32 w-32',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  src?: string | null
  alt?: string
  name?: string | null
  showBadge?: boolean
  badgeColor?: 'success' | 'warning' | 'destructive' | 'primary'
  isPremium?: boolean
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, src, alt, name, showBadge, badgeColor = 'success', isPremium, ...props }, ref) => {
  const badgeColors = {
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    destructive: 'bg-destructive',
    primary: 'bg-brand-500',
  }

  const badgeSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
    '2xl': 'h-4 w-4',
    '3xl': 'h-5 w-5',
  }

  return (
    <div className="relative inline-block">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        <AvatarPrimitive.Image
          className="aspect-square h-full w-full object-cover"
          src={src || getAvatarUrl(name)}
          alt={alt || name || 'Avatar'}
        />
        <AvatarPrimitive.Fallback
          className="flex h-full w-full items-center justify-center rounded-full bg-brand-100 text-brand-700 font-medium"
          delayMs={600}
        >
          {getInitials(name)}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {showBadge && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-background',
            badgeColors[badgeColor],
            badgeSizes[size || 'md']
          )}
        />
      )}
      {isPremium && (
        <span
          className={cn(
            'absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-warning-500 text-white',
            size === 'xl' || size === '2xl' || size === '3xl' ? 'h-6 w-6 text-xs' : 'h-4 w-4 text-[10px]'
          )}
        >
          ★
        </span>
      )}
    </div>
  )
})
Avatar.displayName = 'Avatar'

interface AvatarGroupProps {
  avatars: Array<{ src?: string | null; name?: string | null }>
  max?: number
  size?: VariantProps<typeof avatarVariants>['size']
}

const AvatarGroup = ({ avatars, max = 4, size = 'md' }: AvatarGroupProps) => {
  const displayAvatars = avatars.slice(0, max)
  const remaining = avatars.length - max

  const overlapSizes = {
    xs: '-ml-1.5',
    sm: '-ml-2',
    md: '-ml-2.5',
    lg: '-ml-3',
    xl: '-ml-4',
    '2xl': '-ml-5',
    '3xl': '-ml-6',
  }

  return (
    <div className="flex items-center">
      {displayAvatars.map((avatar, index) => (
        <div
          key={index}
          className={cn(
            'ring-2 ring-background rounded-full',
            index > 0 && overlapSizes[size || 'md']
          )}
        >
          <Avatar src={avatar.src} name={avatar.name} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            avatarVariants({ size }),
            overlapSizes[size || 'md'],
            'flex items-center justify-center bg-muted text-muted-foreground font-medium ring-2 ring-background'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}

export { Avatar, AvatarGroup }
