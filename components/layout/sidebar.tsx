'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  Heart,
  Briefcase,
  MessageSquare,
  User,
  Settings,
  LayoutDashboard,
  Search,
  Building2,
  BarChart3,
  Users,
  FileText,
  Crown,
  HelpCircle,
  Sparkles,
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isRecruiter = session?.user?.role === 'recruiter'

  const jobSeekerNav = [
    { name: 'Discover', href: '/discover', icon: Heart, description: 'Swipe on jobs' },
    { name: 'Browse Jobs', href: '/jobs', icon: Briefcase, description: 'Search & filter' },
    { name: 'Matches', href: '/matches', icon: MessageSquare, description: 'Your connections' },
    { name: 'Applications', href: '/applications', icon: FileText, description: 'Track status' },
    { name: 'Profile', href: '/profile', icon: User, description: 'Your profile' },
  ]

  const recruiterNav = [
    { name: 'Dashboard', href: '/recruiter', icon: LayoutDashboard, description: 'Overview' },
    { name: 'Candidates', href: '/recruiter/candidates', icon: Search, description: 'Find talent' },
    { name: 'My Jobs', href: '/recruiter/jobs', icon: Briefcase, description: 'Job postings' },
    { name: 'Matches', href: '/matches', icon: MessageSquare, description: 'Conversations' },
    { name: 'Analytics', href: '/recruiter/analytics', icon: BarChart3, description: 'Insights' },
    { name: 'Team', href: '/recruiter/team', icon: Users, description: 'Manage team' },
    { name: 'Company', href: '/recruiter/company', icon: Building2, description: 'Company profile' },
  ]

  const navigation = isRecruiter ? recruiterNav : jobSeekerNav

  const bottomNav = [
    { name: 'Settings', href: isRecruiter ? '/recruiter/settings' : '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
  ]

  return (
    <aside className={cn('flex flex-col w-64 bg-card border-r h-screen', className)}>
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href={isRecruiter ? '/recruiter' : '/discover'} className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl">
              JobSwipe<span className="text-brand-500">AI</span>
            </span>
            <p className="text-xs text-muted-foreground">
              {isRecruiter ? 'Recruiter Portal' : 'Job Seeker'}
            </p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-brand-50 text-brand-600 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive && 'text-brand-500')} />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                )}
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Premium CTA */}
      <div className="p-4">
        <Link
          href="/premium"
          className="block p-4 rounded-xl bg-gradient-to-br from-warning-400 to-warning-500 text-white"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Crown className="w-5 h-5" />
            <span className="font-semibold">Go Premium</span>
          </div>
          <p className="text-xs text-white/90">
            Unlock unlimited swipes, AI features & more
          </p>
        </Link>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t space-y-1">
        {bottomNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
