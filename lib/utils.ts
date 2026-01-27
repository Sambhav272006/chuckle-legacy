import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSalary(amount: number | null | undefined, currency: string = 'USD'): string {
  if (!amount) return 'Not specified'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatSalaryRange(min: number | null, max: number | null, currency: string = 'USD'): string {
  if (!min && !max) return 'Salary not specified'
  if (min && !max) return `From ${formatSalary(min, currency)}`
  if (!min && max) return `Up to ${formatSalary(max, currency)}`
  return `${formatSalary(min, currency)} - ${formatSalary(max, currency)}`
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSecs < 60) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffWeeks < 4) return `${diffWeeks}w ago`
  if (diffMonths < 12) return `${diffMonths}mo ago`
  return `${diffYears}y ago`
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateUniqueSlug(text: string): string {
  const baseSlug = generateSlug(text)
  const uniqueSuffix = Math.random().toString(36).substring(2, 8)
  return `${baseSlug}-${uniqueSuffix}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function getAvatarUrl(name: string | null | undefined, seed?: string): string {
  const actualSeed = seed || name || 'default'
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(actualSeed)}&backgroundColor=0ea5e9`
}

export function calculateMatchPercentage(score: number | null | undefined): number {
  if (!score) return 0
  return Math.min(100, Math.max(0, score))
}

export function getMatchColor(score: number): string {
  if (score >= 90) return 'text-green-500'
  if (score >= 75) return 'text-emerald-500'
  if (score >= 60) return 'text-yellow-500'
  if (score >= 40) return 'text-orange-500'
  return 'text-red-500'
}

export function getMatchLabel(score: number): string {
  if (score >= 90) return 'Excellent Match'
  if (score >= 75) return 'Great Match'
  if (score >= 60) return 'Good Match'
  if (score >= 40) return 'Fair Match'
  return 'Low Match'
}

export function parseJsonSafe<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatEmploymentType(type: string): string {
  const types: Record<string, string> = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    'contract': 'Contract',
    'internship': 'Internship',
    'freelance': 'Freelance',
  }
  return types[type] || capitalizeFirst(type)
}

export function formatExperienceLevel(level: string): string {
  const levels: Record<string, string> = {
    'entry': 'Entry Level',
    'mid': 'Mid Level',
    'senior': 'Senior Level',
    'lead': 'Lead / Principal',
    'executive': 'Executive',
  }
  return levels[level] || capitalizeFirst(level)
}

export function formatLocationType(type: string): string {
  const types: Record<string, string> = {
    'onsite': 'On-site',
    'remote': 'Remote',
    'hybrid': 'Hybrid',
  }
  return types[type] || capitalizeFirst(type)
}

export function getCompanySizeLabel(size: string): string {
  const sizes: Record<string, string> = {
    '1-10': '1-10 employees',
    '11-50': '11-50 employees',
    '51-200': '51-200 employees',
    '201-500': '201-500 employees',
    '501-1000': '501-1000 employees',
    '1000+': '1000+ employees',
  }
  return sizes[size] || size
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (password.length < 8) errors.push('Password must be at least 8 characters')
  if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter')
  if (!/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter')
  if (!/[0-9]/.test(password)) errors.push('Password must contain a number')
  return { valid: errors.length === 0, errors }
}

export function getProfileCompletionScore(profile: Record<string, unknown>): number {
  const fields = [
    'headline',
    'bio',
    'location',
    'skills',
    'experience',
    'education',
    'resumeUrl',
    'avatarUrl',
    'linkedinUrl',
  ]
  const completedFields = fields.filter((field) => {
    const value = profile[field]
    if (Array.isArray(value)) return value.length > 0
    return value !== null && value !== undefined && value !== ''
  })
  return Math.round((completedFields.length / fields.length) * 100)
}
