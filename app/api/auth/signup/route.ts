import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signUpSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate input
    const result = signUpSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password, name, role } = result.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        profile: {
          create: {},
        },
        subscription: {
          create: {
            plan: 'free',
            status: 'active',
            swipesRemaining: 50,
            superLikesRemaining: 5,
            boostsRemaining: 1,
            aiCreditsRemaining: 10,
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'system',
        title: 'Welcome to JobSwipe AI!',
        message: 'Complete your profile to start matching with opportunities.',
        actionUrl: '/onboarding',
      },
    })

    return NextResponse.json({
      message: 'Account created successfully',
      user,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
