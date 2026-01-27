import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { calculateMatchScore } from '@/lib/ai'
import { parseJsonSafe, generateUniqueSlug } from '@/lib/utils'

// GET /api/jobs - Get jobs for swiping or browsing
export async function GET(req: Request) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(req.url)

    const mode = searchParams.get('mode') || 'swipe' // swipe or browse
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Filters
    const search = searchParams.get('search') || ''
    const location = searchParams.get('location') || ''
    const locationType = searchParams.get('locationType')?.split(',').filter(Boolean) || []
    const employmentType = searchParams.get('employmentType')?.split(',').filter(Boolean) || []
    const experienceLevel = searchParams.get('experienceLevel')?.split(',').filter(Boolean) || []
    const minSalary = parseInt(searchParams.get('minSalary') || '0')
    const maxSalary = parseInt(searchParams.get('maxSalary') || '0')

    // Build where clause
    const where: Record<string, unknown> = {
      status: 'active',
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { company: { name: { contains: search } } },
      ]
    }

    if (location) {
      where.location = { contains: location }
    }

    if (locationType.length > 0) {
      where.locationType = { in: locationType }
    }

    if (employmentType.length > 0) {
      where.employmentType = { in: employmentType }
    }

    if (experienceLevel.length > 0) {
      where.experienceLevel = { in: experienceLevel }
    }

    if (minSalary > 0) {
      where.minSalary = { gte: minSalary }
    }

    if (maxSalary > 0) {
      where.maxSalary = { lte: maxSalary }
    }

    // For swipe mode, exclude already swiped jobs
    if (mode === 'swipe' && session?.user?.id) {
      const swipedJobs = await prisma.swipe.findMany({
        where: { senderId: session.user.id },
        select: { jobId: true },
      })
      const swipedJobIds = swipedJobs.map((s) => s.jobId).filter(Boolean) as string[]

      if (swipedJobIds.length > 0) {
        where.id = { notIn: swipedJobIds }
      }
    }

    // Get jobs
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
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
            include: {
              skill: true,
            },
          },
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.job.count({ where }),
    ])

    // Calculate AI match scores for authenticated users
    let jobsWithScores = jobs

    if (session?.user?.id && mode === 'swipe') {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          profile: true,
          skills: { include: { skill: true } },
          preferences: true,
        },
      })

      if (user) {
        jobsWithScores = await Promise.all(
          jobs.map(async (job) => {
            // Simple scoring based on skill match for now
            const userSkills = user.skills.map((s) => s.skill.name.toLowerCase())
            const jobSkills = job.skills.map((s) => s.skill.name.toLowerCase())

            const matchingSkills = jobSkills.filter((s) => userSkills.includes(s))
            const skillMatchPercent = jobSkills.length > 0
              ? Math.round((matchingSkills.length / jobSkills.length) * 100)
              : 50

            // Factor in preferences
            let preferenceBonus = 0
            if (user.preferences) {
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

            return {
              ...job,
              aiMatchScore,
            }
          })
        )

        // Sort by match score for swipe mode
        jobsWithScores.sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0))
      }
    }

    return NextResponse.json({
      jobs: jobsWithScores,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get jobs error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// POST /api/jobs - Create a new job (recruiters only)
export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a recruiter with a company
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        company: true,
        companyMember: { include: { company: true } },
      },
    })

    if (!user || user.role !== 'recruiter') {
      return NextResponse.json({ error: 'Only recruiters can post jobs' }, { status: 403 })
    }

    const company = user.company || user.companyMember?.company
    if (!company) {
      return NextResponse.json(
        { error: 'Please set up your company profile first' },
        { status: 400 }
      )
    }

    const body = await req.json()

    const {
      title,
      description,
      requirements,
      responsibilities,
      benefits,
      qualifications,
      niceToHave,
      location,
      locationType,
      employmentType,
      experienceLevel,
      department,
      minSalary,
      maxSalary,
      currency,
      showSalary,
      skills,
      status = 'active',
    } = body

    // Create job
    const job = await prisma.job.create({
      data: {
        title,
        slug: generateUniqueSlug(title),
        description,
        requirements,
        responsibilities,
        benefits: benefits ? JSON.stringify(benefits) : null,
        qualifications: qualifications ? JSON.stringify(qualifications) : null,
        niceToHave: niceToHave ? JSON.stringify(niceToHave) : null,
        location,
        locationType: locationType || 'onsite',
        employmentType: employmentType || 'full-time',
        experienceLevel: experienceLevel || 'mid',
        department,
        minSalary,
        maxSalary,
        currency: currency || 'USD',
        showSalary: showSalary ?? true,
        status,
        publishedAt: status === 'active' ? new Date() : null,
        companyId: company.id,
        posterId: session.user.id,
      },
    })

    // Create skill associations
    if (skills && skills.length > 0) {
      for (const skillData of skills) {
        // Find or create skill
        let skill = await prisma.skill.findUnique({
          where: { name: skillData.name },
        })

        if (!skill) {
          skill = await prisma.skill.create({
            data: { name: skillData.name },
          })
        }

        await prisma.jobSkill.create({
          data: {
            jobId: job.id,
            skillId: skill.id,
            isRequired: skillData.isRequired ?? true,
            importance: skillData.importance || 'medium',
          },
        })
      }
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'job_post',
        details: JSON.stringify({ jobId: job.id, title: job.title }),
      },
    })

    return NextResponse.json({
      message: 'Job posted successfully',
      job,
    })
  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
