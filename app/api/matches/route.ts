import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/matches - Get user's matches
export async function GET(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { userId1: session.user.id },
          { userId2: session.user.id },
        ],
        status: 'active',
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
            profile: {
              select: {
                headline: true,
                avatarUrl: true,
              },
            },
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
            profile: {
              select: {
                headline: true,
                avatarUrl: true,
              },
            },
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                name: true,
                logo: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    })

    // Format matches
    const formattedMatches = matches.map((match) => {
      const isUser1 = match.userId1 === session.user.id
      const otherUser = isUser1 ? match.user2 : match.user1
      const lastMessage = match.messages[0]

      return {
        id: match.id,
        otherUser,
        job: match.job,
        aiScore: match.aiScore,
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              isFromMe: lastMessage.senderId === session.user.id,
              createdAt: lastMessage.createdAt,
              isRead: lastMessage.isRead,
            }
          : null,
        createdAt: match.createdAt,
        lastMessageAt: match.lastMessageAt,
      }
    })

    return NextResponse.json({ matches: formattedMatches })
  } catch (error) {
    console.error('Get matches error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
