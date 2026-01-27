import { Suspense } from 'react'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { SimpleLayout } from '@/components/layout/app-layout'
import { SwipeDeck } from '@/components/swipe/swipe-deck'
import { JobCardSkeleton } from '@/components/ui/skeleton'
import { redirect } from 'next/navigation'
import { parseJsonSafe } from '@/lib/utils'

async function getJobsForSwiping(userId: string) {
  // Get user's swiped jobs
  const swipedJobs = await prisma.swipe.findMany({
    where: { senderId: userId },
    select: { jobId: true },
  })
  const swipedJobIds = swipedJobs.map((s) => s.jobId).filter(Boolean) as string[]

  // Get user's preferences and skills
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      skills: { include: { skill: true } },
      preferences: true,
    },
  })

  // Build query
  const where: Record<string, unknown> = {
    status: 'active',
  }

  if (swipedJobIds.length > 0) {
    where.id = { notIn: swipedJobIds }
  }

  // Get jobs
  const jobs = await prisma.job.findMany({
    where,
    include: {
      company: {
        select: {
          name: true,
          logo: true,
          size: true,
          industry: true,
        },
      },
      skills: {
        include: { skill: true },
      },
    },
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' },
    ],
    take: 50,
  })

  // Calculate match scores
  const userSkills = user?.skills.map((s) => s.skill.name.toLowerCase()) || []

  const jobsWithScores = jobs.map((job) => {
    const jobSkills = job.skills.map((s) => s.skill.name.toLowerCase())
    const matchingSkills = jobSkills.filter((s) => userSkills.includes(s))

    let skillMatchPercent = jobSkills.length > 0
      ? Math.round((matchingSkills.length / jobSkills.length) * 100)
      : 50

    // Factor in preferences
    let preferenceBonus = 0
    if (user?.preferences) {
      const prefs = user.preferences
      if (prefs.remotePreference === job.locationType || prefs.remotePreference === 'any') {
        preferenceBonus += 10
      }
      const prefJobTypes = parseJsonSafe<string[]>(prefs.jobTypes, [])
      if (prefJobTypes.includes(job.employmentType)) {
        preferenceBonus += 10
      }
    }

    const aiMatchScore = Math.min(100, Math.max(0, skillMatchPercent + preferenceBonus))

    // Parse benefits
    const benefits = job.benefits ? parseJsonSafe<string[]>(job.benefits, []) : []

    return {
      ...job,
      aiMatchScore,
      benefits,
    }
  })

  // Sort by match score
  jobsWithScores.sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0))

  return jobsWithScores
}

export default async function DiscoverPage() {
  const session = await getSession()

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Redirect recruiters to their dashboard
  if (session.user.role === 'recruiter') {
    redirect('/recruiter')
  }

  const jobs = await getJobsForSwiping(session.user.id)

  return (
    <SimpleLayout className="bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-md mx-auto py-8 px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Discover Jobs</h1>
          <p className="text-muted-foreground">Swipe right on jobs you love</p>
        </div>

        <Suspense fallback={<JobCardSkeleton />}>
          <SwipeDeck initialJobs={jobs} />
        </Suspense>
      </div>
    </SimpleLayout>
  )
}
