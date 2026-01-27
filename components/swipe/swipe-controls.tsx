'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { SimpleTooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  X,
  Heart,
  Star,
  RotateCcw,
  Bookmark,
  Zap,
} from 'lucide-react'

interface SwipeControlsProps {
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onSwipeUp: () => void
  onUndo: () => void
  onBookmark: () => void
  canUndo: boolean
  superLikesRemaining: number
}

export function SwipeControls({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onUndo,
  onBookmark,
  canUndo,
  superLikesRemaining,
}: SwipeControlsProps) {
  return (
    <motion.div
      className="flex items-center justify-center space-x-3 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Undo */}
      <SimpleTooltip content="Undo last swipe">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onUndo}
          disabled={!canUndo}
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all',
            canUndo
              ? 'bg-white text-warning-500 hover:shadow-xl'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          )}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </SimpleTooltip>

      {/* Pass */}
      <SimpleTooltip content="Pass (Swipe Left)">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onSwipeLeft}
          className="w-16 h-16 rounded-full bg-white text-red-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <X className="w-8 h-8" strokeWidth={3} />
        </motion.button>
      </SimpleTooltip>

      {/* Super Like */}
      <SimpleTooltip content={`Super Like (${superLikesRemaining} left)`}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onSwipeUp}
          disabled={superLikesRemaining <= 0}
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all relative',
            superLikesRemaining > 0
              ? 'bg-gradient-to-br from-brand-400 to-brand-600 text-white hover:shadow-xl'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          )}
        >
          <Star className="w-6 h-6" fill="currentColor" />
          {superLikesRemaining > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {superLikesRemaining}
            </span>
          )}
        </motion.button>
      </SimpleTooltip>

      {/* Like */}
      <SimpleTooltip content="Interested (Swipe Right)">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onSwipeRight}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-success-400 to-success-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <Heart className="w-8 h-8" fill="currentColor" />
        </motion.button>
      </SimpleTooltip>

      {/* Bookmark */}
      <SimpleTooltip content="Save for later">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBookmark}
          className="w-12 h-12 rounded-full bg-white text-brand-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <Bookmark className="w-5 h-5" />
        </motion.button>
      </SimpleTooltip>
    </motion.div>
  )
}

// Floating action button variant for mobile
export function SwipeControlsFAB({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
}: Pick<SwipeControlsProps, 'onSwipeLeft' | 'onSwipeRight' | 'onSwipeUp'>) {
  return (
    <div className="fixed bottom-6 left-0 right-0 flex items-center justify-center space-x-4 px-4 sm:hidden">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSwipeLeft}
        className="w-14 h-14 rounded-full bg-white text-red-500 flex items-center justify-center shadow-lg"
      >
        <X className="w-7 h-7" strokeWidth={3} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSwipeUp}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center shadow-lg"
      >
        <Star className="w-5 h-5" fill="currentColor" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSwipeRight}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-success-400 to-success-600 text-white flex items-center justify-center shadow-lg"
      >
        <Heart className="w-7 h-7" fill="currentColor" />
      </motion.button>
    </div>
  )
}
