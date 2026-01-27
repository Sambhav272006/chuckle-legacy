'use client'

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { useState, useCallback } from 'react'
import Image from 'next/image'
import { cn, formatSalaryRange, formatLocationType, formatEmploymentType, formatExperienceLevel } from '@/lib/utils'
import { Badge, MatchBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { MatchScore } from '@/components/ui/progress'
import {
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Briefcase,
  Users,
  Globe,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Heart,
  X,
  Star,
  Bookmark,
} from 'lucide-react'

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

interface SwipeCardProps {
  job: Job
  onSwipe: (direction: 'left' | 'right' | 'up') => void
  isTop: boolean
  index: number
}

export function SwipeCard({ job, onSwipe, isTop, index }: SwipeCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [exitX, setExitX] = useState(0)
  const [exitY, setExitY] = useState(0)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25])
  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0])
  const superLikeOpacity = useTransform(y, [-100, 0], [1, 0])

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const swipeThreshold = 150
      const velocityThreshold = 500

      if (info.offset.y < -swipeThreshold || info.velocity.y < -velocityThreshold) {
        // Super like (swipe up)
        setExitY(-1000)
        onSwipe('up')
      } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
        // Like (swipe right)
        setExitX(1000)
        onSwipe('right')
      } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
        // Pass (swipe left)
        setExitX(-1000)
        onSwipe('left')
      }
    },
    [onSwipe]
  )

  const scale = isTop ? 1 : 1 - index * 0.05
  const yOffset = index * 10

  return (
    <motion.div
      className="swipe-card"
      style={{
        x,
        y,
        rotate,
        scale,
        zIndex: 100 - index,
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{
        scale,
        y: yOffset,
        opacity: 1,
      }}
      exit={{
        x: exitX,
        y: exitY,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {/* Swipe Indicators */}
      <motion.div
        className="swipe-indicator like"
        style={{ opacity: likeOpacity }}
      >
        <Heart className="w-8 h-8 inline mr-2" />
        INTERESTED
      </motion.div>
      <motion.div
        className="swipe-indicator nope"
        style={{ opacity: nopeOpacity }}
      >
        <X className="w-8 h-8 inline mr-2" />
        PASS
      </motion.div>
      <motion.div
        className="swipe-indicator super"
        style={{ opacity: superLikeOpacity }}
      >
        <Star className="w-8 h-8 inline mr-2" />
        SUPER LIKE
      </motion.div>

      {/* Card Content */}
      <div className="h-full flex flex-col overflow-hidden">
        {/* Company Header */}
        <div className="relative h-48 bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
          {job.company.logo ? (
            <Image
              src={job.company.logo}
              alt={job.company.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-white text-6xl font-bold opacity-20">
              {job.company.name.charAt(0)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Match Score */}
          {job.aiMatchScore && (
            <div className="absolute top-4 right-4">
              <MatchScore score={job.aiMatchScore} size="md" />
            </div>
          )}

          {/* Company Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center space-x-3">
              <Avatar
                src={job.company.logo}
                name={job.company.name}
                size="lg"
                className="ring-2 ring-white"
              />
              <div>
                <h3 className="font-bold text-xl">{job.title}</h3>
                <p className="text-white/90">{job.company.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="flex-1 p-5 overflow-y-auto">
          {/* Quick Info */}
          <div className="flex flex-wrap gap-2 mb-4">
            {job.location && (
              <Badge variant="secondary" icon={<MapPin className="w-3 h-3" />}>
                {job.location}
              </Badge>
            )}
            <Badge variant="secondary" icon={<Globe className="w-3 h-3" />}>
              {formatLocationType(job.locationType)}
            </Badge>
            <Badge variant="secondary" icon={<Briefcase className="w-3 h-3" />}>
              {formatEmploymentType(job.employmentType)}
            </Badge>
            <Badge variant="secondary" icon={<Users className="w-3 h-3" />}>
              {formatExperienceLevel(job.experienceLevel)}
            </Badge>
          </div>

          {/* Salary */}
          {(job.minSalary || job.maxSalary) && (
            <div className="flex items-center space-x-2 mb-4 text-lg font-semibold text-success-600">
              <DollarSign className="w-5 h-5" />
              <span>{formatSalaryRange(job.minSalary || null, job.maxSalary || null, job.currency)}</span>
            </div>
          )}

          {/* AI Match Insights */}
          {job.aiMatchScore && job.aiMatchScore >= 70 && (
            <div className="mb-4 p-3 rounded-lg bg-brand-50 border border-brand-100">
              <div className="flex items-center space-x-2 text-brand-700 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI Match Insight</span>
              </div>
              <p className="text-sm text-brand-600">
                Your skills in {job.skills.slice(0, 2).map(s => s.skill.name).join(' and ')} make you a strong candidate!
              </p>
            </div>
          )}

          {/* Skills */}
          <div className="mb-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 6).map((s, i) => (
                <Badge key={i} variant="default" size="sm">
                  {s.skill.name}
                </Badge>
              ))}
              {job.skills.length > 6 && (
                <Badge variant="secondary" size="sm">
                  +{job.skills.length - 6} more
                </Badge>
              )}
            </div>
          </div>

          {/* Expandable Description */}
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <span>Job Description</span>
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            <motion.div
              initial={false}
              animate={{ height: expanded ? 'auto' : 80 }}
              className="overflow-hidden"
            >
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {job.description}
              </p>
            </motion.div>
            {!expanded && job.description.length > 200 && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
          </div>

          {/* Benefits */}
          {expanded && job.benefits && job.benefits.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Benefits</p>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit, i) => (
                  <Badge key={i} variant="success" size="sm">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
