import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId, direction } = await req.json()

    if (!jobId || !['left', 'right', 'up'].includes(direction)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Check subscription limits
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 400 })
    }

    // Check daily limits
    if (subscription.swipesRemaining <= 0 && subscription.plan === 'free') {
      return NextResponse.json(
        { error: 'Daily swipe limit reached. Upgrade to Premium!' },
        { status: 403 }
      )
    }

    if (direction === 'up' && subscription.superLikesRemaining <= 0) {
      return NextResponse.json(
        { error: 'No super likes remaining. Upgrade to Premium!' },
        { status: 403 }
      )
    }

    // Get job with company info
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Create swipe record
    await prisma.swipe.upsert({
      where: {
        senderId_jobId: {
          senderId: session.user.id,
          jobId,
        },
      },
      create: {
        senderId: session.user.id,
        jobId,
        direction,
      },
      update: {
        direction,
      },
    })

    // Update subscription counts
    const updateData: Record<string, number> = {}
    if (subscription.plan === 'free') {
      updateData.swipesRemaining = subscription.swipesRemaining - 1
    }
    if (direction === 'up') {
      updateData.superLikesRemaining = subscription.superLikesRemaining - 1
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.subscription.update({
        where: { userId: session.user.id },
        data: updateData,
      })
    }

    // Check for match (if recruiter also liked this candidate for this job)
    let matched = false
    if (direction === 'right' || direction === 'up') {
      // Check if recruiter has swiped right on this user for any job at their company
      const recruiterSwipe = await prisma.swipe.findFirst({
        where: {
          senderId: job.posterId,
          receiverId: session.user.id,
          direction: { in: ['right', 'up'] },
        },
      })

      if (recruiterSwipe) {
        // Create match
        await prisma.match.upsert({
          where: {
            userId1_userId2_jobId: {
              userId1: session.user.id,
              userId2: job.posterId,
              jobId,
            },
          },
          create: {
            userId1: session.user.id,
            userId2: job.posterId,
            jobId,
            aiScore: 0, // Will be calculated by AI
          },
          update: {},
        })

        matched = true

        // Create notifications for both parties
        await prisma.notification.createMany({
          data: [
            {
              userId: session.user.id,
              type: 'match',
              title: 'New Match!',
              message: `You matched with ${job.company.name} for ${job.title}`,
              actionUrl: `/matches`,
            },
            {
              userId: job.posterId,
              type: 'match',
              title: 'New Match!',
              message: `A candidate matched with your ${job.title} position`,
              actionUrl: `/matches`,
            },
          ],
        })
      }
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'swipe',
        details: JSON.stringify({ jobId, direction, matched }),
      },
    })

    return NextResponse.json({
      success: true,
      matched,
      swipesRemaining: subscription.plan === 'free' ? subscription.swipesRemaining - 1 : 999,
      superLikesRemaining: direction === 'up' ? subscription.superLikesRemaining - 1 : subscription.superLikesRemaining,
    })
  } catch (error) {
    console.error('Swipe error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
