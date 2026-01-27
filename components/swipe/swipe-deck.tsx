'use client'

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SwipeCard } from './swipe-card'
import { SwipeControls } from './swipe-controls'
import { MatchModal } from './match-modal'
import { NoMoreCards } from './no-more-cards'
import { useSwipeStore } from '@/lib/store'
import { JobCardSkeleton } from '@/components/ui/skeleton'
import toast from 'react-hot-toast'

interface Job {
  id: string
  title: string
  description: string
  company: {
    name: string
    logo?: string
    size?: string
    industry?: string
  }
  location?: string
  locationType: string
  employmentType: string
  experienceLevel: string
  minSalary?: number
  maxSalary?: number
  currency: string
  skills: { skill: { name: string } }[]
  aiMatchScore?: number
  createdAt: string
  benefits?: string[]
  requirements?: string
}

interface SwipeDeckProps {
  initialJobs: Job[]
}

export function SwipeDeck({ initialJobs }: SwipeDeckProps) {
  const {
    jobs,
    currentIndex,
    setJobs,
    swipeRight,
    swipeLeft,
    swipeUp,
    nextCard,
    undoSwipe,
    isLoading,
    setLoading,
  } = useSwipeStore()

  const [showMatch, setShowMatch] = useState(false)
  const [matchedJob, setMatchedJob] = useState<Job | null>(null)
  const [swipesRemaining, setSwipesRemaining] = useState(50)
  const [superLikesRemaining, setSuperLikesRemaining] = useState(5)

  useEffect(() => {
    if (initialJobs.length > 0) {
      setJobs(initialJobs)
    }
  }, [initialJobs, setJobs])

  const visibleJobs = jobs.slice(currentIndex, currentIndex + 3)
  const currentJob = jobs[currentIndex]

  const handleSwipe = useCallback(
    async (direction: 'left' | 'right' | 'up') => {
      if (!currentJob) return

      // Check limits
      if (direction === 'up' && superLikesRemaining <= 0) {
        toast.error('No super likes remaining! Upgrade to Premium for unlimited.')
        return
      }

      if (swipesRemaining <= 0) {
        toast.error('Daily swipe limit reached! Upgrade to Premium for unlimited.')
        return
      }

      // Update local state
      if (direction === 'right') {
        swipeRight(currentJob.id)
        setSwipesRemaining((prev) => prev - 1)
      } else if (direction === 'left') {
        swipeLeft(currentJob.id)
        setSwipesRemaining((prev) => prev - 1)
      } else if (direction === 'up') {
        swipeUp(currentJob.id)
        setSuperLikesRemaining((prev) => prev - 1)
        setSwipesRemaining((prev) => prev - 1)
      }

      // Record swipe on server
      try {
        const response = await fetch('/api/swipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId: currentJob.id,
            direction,
          }),
        })

        const data = await response.json()

        // Check for match
        if (data.matched) {
          setMatchedJob(currentJob)
          setShowMatch(true)
        }
      } catch (error) {
        console.error('Failed to record swipe:', error)
      }

      nextCard()
    },
    [currentJob, swipeRight, swipeLeft, swipeUp, nextCard, swipesRemaining, superLikesRemaining]
  )

  const handleUndo = useCallback(() => {
    undoSwipe()
    toast.success('Undo successful!')
  }, [undoSwipe])

  const handleBookmark = useCallback(async () => {
    if (!currentJob) return

    try {
      await fetch('/api/jobs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: currentJob.id }),
      })
      toast.success('Job saved!')
    } catch {
      toast.error('Failed to save job')
    }
  }, [currentJob])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <JobCardSkeleton />
      </div>
    )
  }

  if (visibleJobs.length === 0) {
    return <NoMoreCards />
  }

  return (
    <div className="flex flex-col items-center">
      {/* Swipe Counter */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{swipesRemaining}</span> swipes left today
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-brand-500">{superLikesRemaining}</span> super likes
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative w-full max-w-md h-[560px]">
        <AnimatePresence mode="popLayout">
          {visibleJobs.map((job, index) => (
            <SwipeCard
              key={job.id}
              job={job}
              onSwipe={handleSwipe}
              isTop={index === 0}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <SwipeControls
        onSwipeLeft={() => handleSwipe('left')}
        onSwipeRight={() => handleSwipe('right')}
        onSwipeUp={() => handleSwipe('up')}
        onUndo={handleUndo}
        onBookmark={handleBookmark}
        canUndo={currentIndex > 0}
        superLikesRemaining={superLikesRemaining}
      />

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatch}
        onClose={() => setShowMatch(false)}
        job={matchedJob}
      />
    </div>
  )
}
