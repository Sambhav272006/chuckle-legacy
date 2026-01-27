import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { generateMessageSuggestions } from '@/lib/ai'

// GET /api/matches/[id]/messages - Get messages for a match
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        user1: {
          select: { id: true, name: true, image: true, role: true },
        },
        user2: {
          select: { id: true, name: true, image: true, role: true },
        },
        job: {
          select: { id: true, title: true },
        },
      },
    })

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    // Check if user is part of this match
    if (match.userId1 !== session.user.id && match.userId2 !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const messages = await prisma.message.findMany({
      where: { matchId: params.id },
      orderBy: { createdAt: 'asc' },
    })

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        matchId: params.id,
        receiverId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    // Get AI message suggestions if it's a new conversation
    let suggestions: string[] = []
    if (messages.length < 3) {
      const isUser1 = match.userId1 === session.user.id
      const senderRole = isUser1 ? match.user1.role : match.user2.role

      const result = await generateMessageSuggestions({
        senderRole: senderRole as 'jobseeker' | 'recruiter',
        matchContext: `Matched for ${match.job?.title || 'a job opportunity'}`,
        jobTitle: match.job?.title,
        previousMessages: messages.map((m) => m.content),
      })

      suggestions = result.suggestions
    }

    const isUser1 = match.userId1 === session.user.id
    const otherUser = isUser1 ? match.user2 : match.user1

    return NextResponse.json({
      match: {
        id: match.id,
        otherUser,
        job: match.job,
      },
      messages,
      suggestions,
    })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// POST /api/matches/[id]/messages - Send a message
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const match = await prisma.match.findUnique({
      where: { id: params.id },
    })

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    // Check if user is part of this match
    if (match.userId1 !== session.user.id && match.userId2 !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { content, messageType = 'text' } = await req.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 })
    }

    const receiverId = match.userId1 === session.user.id ? match.userId2 : match.userId1

    const message = await prisma.message.create({
      data: {
        matchId: params.id,
        senderId: session.user.id,
        receiverId,
        content: content.trim(),
        messageType,
      },
    })

    // Update match with last message time
    await prisma.match.update({
      where: { id: params.id },
      data: { lastMessageAt: new Date() },
    })

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'message',
        title: 'New Message',
        message: `You have a new message`,
        actionUrl: `/matches?id=${params.id}`,
      },
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
