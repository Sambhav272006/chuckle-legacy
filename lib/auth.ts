import { NextAuthOptions, getServerSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import LinkedInProvider from 'next-auth/providers/linkedin'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { profile: true },
        })

        if (!user || !user.password) {
          throw new Error('Invalid email or password')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
      ? [
          LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    newUser: '/onboarding',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token.name = session.name
        token.image = session.image
        token.role = session.role
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account }) {
      // Update last active time on sign in
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastActiveAt: new Date() },
        }).catch(() => {})
      }

      // Create profile if it doesn't exist (for OAuth users)
      if (account?.provider !== 'credentials' && user.id) {
        const existingProfile = await prisma.profile.findUnique({
          where: { userId: user.id },
        })

        if (!existingProfile) {
          await prisma.profile.create({
            data: { userId: user.id },
          }).catch(() => {})
        }
      }

      return true
    },
  },
  events: {
    async createUser({ user }) {
      // Create default profile for new users
      await prisma.profile.create({
        data: { userId: user.id },
      }).catch(() => {})

      // Create default subscription
      await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: 'free',
          status: 'active',
          swipesRemaining: 50,
          superLikesRemaining: 5,
          boostsRemaining: 1,
          aiCreditsRemaining: 10,
        },
      }).catch(() => {})

      // Create welcome notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'system',
          title: 'Welcome to JobSwipe AI!',
          message: 'Complete your profile to start matching with opportunities.',
          actionUrl: '/onboarding',
        },
      }).catch(() => {})
    },
  },
  debug: process.env.NODE_ENV === 'development',
}

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session?.user?.id) return null

  return await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      subscription: true,
      company: true,
      companyMember: {
        include: { company: true },
      },
    },
  })
}

export async function requireAuth() {
  const session = await getSession()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function requireRole(roles: string[]) {
  const session = await requireAuth()
  if (!roles.includes(session.user.role)) {
    throw new Error('Forbidden')
  }
  return session
}
