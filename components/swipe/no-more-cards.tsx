'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RefreshCw, Search, Sliders, Sparkles } from 'lucide-react'

export function NoMoreCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto"
    >
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <Sparkles className="w-12 h-12 text-muted-foreground" />
      </div>

      <h2 className="text-2xl font-bold mb-2">You've seen all jobs!</h2>
      <p className="text-muted-foreground mb-8">
        We're constantly adding new opportunities. Check back soon or try adjusting your preferences.
      </p>

      <div className="w-full space-y-3">
        <Button
          onClick={() => window.location.reload()}
          className="w-full"
          size="lg"
          leftIcon={<RefreshCw className="w-5 h-5" />}
        >
          Refresh Jobs
        </Button>

        <Button
          variant="outline"
          className="w-full"
          size="lg"
          leftIcon={<Sliders className="w-5 h-5" />}
          asChild
        >
          <Link href="/settings/preferences">
            Adjust Preferences
          </Link>
        </Button>

        <Button
          variant="ghost"
          className="w-full"
          size="lg"
          leftIcon={<Search className="w-5 h-5" />}
          asChild
        >
          <Link href="/jobs">
            Browse All Jobs
          </Link>
        </Button>
      </div>

      <div className="mt-8 p-4 bg-brand-50 rounded-xl border border-brand-100">
        <div className="flex items-center space-x-2 text-brand-600 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">AI Tip</span>
        </div>
        <p className="text-sm text-brand-700">
          Complete your profile to unlock better job matches! Add more skills and experience to improve your match scores.
        </p>
        <Button
          variant="link"
          className="text-brand-600 p-0 h-auto mt-2"
          asChild
        >
          <Link href="/profile">Complete Profile</Link>
        </Button>
      </div>
    </motion.div>
  )
}
