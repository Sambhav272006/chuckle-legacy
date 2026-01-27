import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { generateProfileSummary, optimizeProfile } from '@/lib/ai'

// GET /api/profile - Get current user's profile
export async function GET(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        skills: {
          include: { skill: true },
          orderBy: { isTopSkill: 'desc' },
        },
        experience: {
          orderBy: { startDate: 'desc' },
        },
        education: {
          orderBy: { startDate: 'desc' },
        },
        preferences: true,
        subscription: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate profile completion score
    const profileFields = [
      user.profile?.headline,
      user.profile?.bio,
      user.profile?.location,
      user.skills.length > 0,
      user.experience.length > 0,
      user.education.length > 0,
      user.profile?.resumeUrl,
      user.image || user.profile?.avatarUrl,
      user.profile?.linkedinUrl,
    ]

    const completedFields = profileFields.filter(Boolean).length
    const completionScore = Math.round((completedFields / profileFields.length) * 100)

    return NextResponse.json({
      user: {
        ...user,
        password: undefined,
      },
      completionScore,
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// PUT /api/profile - Update profile
export async function PUT(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    // Update user basic info
    if (body.name !== undefined) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: body.name },
      })
    }

    // Update profile
    const profileData: Record<string, unknown> = {}
    const profileFields = [
      'headline', 'bio', 'location', 'phone', 'website',
      'linkedinUrl', 'githubUrl', 'portfolioUrl', 'resumeUrl',
      'avatarUrl', 'coverImageUrl', 'yearsOfExperience',
      'currentSalary', 'expectedSalary', 'noticePeriod',
      'availableFrom', 'isOpenToWork', 'isRemoteOnly',
      'willingToRelocate', 'preferredLocations', 'languages',
      'certifications', 'achievements', 'videoIntroUrl',
    ]

    for (const field of profileFields) {
      if (body[field] !== undefined) {
        // Convert arrays to JSON strings for storage
        if (Array.isArray(body[field])) {
          profileData[field] = JSON.stringify(body[field])
        } else {
          profileData[field] = body[field]
        }
      }
    }

    if (Object.keys(profileData).length > 0) {
      await prisma.profile.upsert({
        where: { userId: session.user.id },
        update: profileData,
        create: {
          userId: session.user.id,
          ...profileData,
        },
      })
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// POST /api/profile/optimize - Get AI optimization suggestions
export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        skills: { include: { skill: true } },
        preferences: true,
      },
    })

    if (!user || !user.profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check AI credits
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription || subscription.aiCreditsRemaining <= 0) {
      return NextResponse.json(
        { error: 'No AI credits remaining. Upgrade to Premium!' },
        { status: 403 }
      )
    }

    // Get optimization suggestions
    const suggestions = await optimizeProfile({
      headline: user.profile.headline || '',
      bio: user.profile.bio || '',
      skills: user.skills.map((s) => s.skill.name),
      targetRoles: user.preferences?.preferredRoles
        ? JSON.parse(user.preferences.preferredRoles)
        : [],
    })

    // Deduct AI credit
    await prisma.subscription.update({
      where: { userId: session.user.id },
      data: { aiCreditsRemaining: { decrement: 1 } },
    })

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Optimize profile error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
