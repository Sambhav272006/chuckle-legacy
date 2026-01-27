'use client'

import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: ReactNode
  showSidebar?: boolean
  className?: string
}

export function AppLayout({ children, showSidebar = false, className }: AppLayoutProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    redirect('/auth/signin')
  }

  if (showSidebar) {
    return (
      <div className="flex min-h-screen">
        <Sidebar className="hidden lg:flex fixed left-0 top-0 bottom-0" />
        <div className="flex-1 lg:ml-64">
          <Navbar />
          <main className={cn('pt-16 min-h-screen', className)}>{children}</main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={cn('pt-16 min-h-screen', className)}>{children}</main>
    </div>
  )
}

// Simple layout without sidebar for mobile-first pages
export function SimpleLayout({ children, className }: { children: ReactNode; className?: string }) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={cn('pt-16 min-h-screen', className)}>{children}</main>
    </div>
  )
}
