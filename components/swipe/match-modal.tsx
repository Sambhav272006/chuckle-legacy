'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Sparkles, MessageSquare, ArrowRight, PartyPopper } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

interface MatchModalProps {
  isOpen: boolean
  onClose: () => void
  job: {
    id: string
    title: string
    company: {
      name: string
      logo?: string
    }
  } | null
}

export function MatchModal({ isOpen, onClose, job }: MatchModalProps) {
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#0ea5e9', '#22c55e', '#f59e0b'],
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#0ea5e9', '#22c55e', '#f59e0b'],
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [isOpen])

  const handleSendMessage = () => {
    if (job) {
      router.push(`/matches?job=${job.id}`)
    }
    onClose()
  }

  const handleKeepSwiping = () => {
    onClose()
  }

  if (!job) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} showClose={false} className="max-w-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center py-4"
          >
            {/* Celebration Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-success-400 to-success-600 flex items-center justify-center"
            >
              <PartyPopper className="w-10 h-10 text-white" />
            </motion.div>

            {/* Match Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-500 to-success-500 bg-clip-text text-transparent mb-2">
                It's a Match!
              </h2>
              <p className="text-muted-foreground">
                You and {job.company.name} have shown mutual interest
              </p>
            </motion.div>

            {/* Company Preview */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 bg-muted rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <Avatar
                  src={job.company.logo}
                  name={job.company.name}
                  size="lg"
                />
                <div className="text-left">
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-sm text-muted-foreground">{job.company.name}</p>
                </div>
              </div>
            </motion.div>

            {/* AI Insight */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 p-3 bg-brand-50 rounded-lg border border-brand-100"
            >
              <div className="flex items-center justify-center space-x-2 text-brand-600 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>You can now message the recruiter directly!</span>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 space-y-3"
            >
              <Button
                onClick={handleSendMessage}
                className="w-full"
                size="lg"
                leftIcon={<MessageSquare className="w-5 h-5" />}
              >
                Send a Message
              </Button>
              <Button
                onClick={handleKeepSwiping}
                variant="outline"
                className="w-full"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Keep Swiping
              </Button>
            </motion.div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  )
}
