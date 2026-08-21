import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const normalizedEmail = (credentials.email as string).toLowerCase().trim()
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        })
        if (!user || !user.password) return null
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        if (!passwordMatch) return null

        // Block login if email has not been verified
        if (!user.emailVerified) {
          throw new Error('EmailNotVerified')
        }

        return user
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!account || account.provider === 'credentials') {
          if (!user?.email) return false
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase().trim() },
            select: { emailVerified: true },
          })
          if (!dbUser?.emailVerified) {
            return false
          }
          return true
        }

        if (!user.email) return false

        const normalizedEmail = user.email.toLowerCase().trim()

        // Find if a user with this email already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          include: { accounts: true },
        })

        if (!existingUser) {
          // New user — let NextAuth create them normally
          return true
        }

        // If existing user was unverified before connecting OAuth, mark them verified now
        if (!existingUser.emailVerified) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { emailVerified: new Date() },
          })
        }

        // User exists — check if this specific OAuth account is already linked
        const linkedAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        })

        if (linkedAccount) {
          // Account already linked — this is a returning user from a different browser
          return true
        }

        // User exists but this OAuth provider not yet linked — link it now
        await prisma.account.create({
          data: {
            userId: existingUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token ?? null,
            refresh_token: account.refresh_token ?? null,
            expires_at: account.expires_at ?? null,
            token_type: account.token_type ?? null,
            scope: account.scope ?? null,
            id_token: account.id_token ?? null,
            session_state: (account.session_state as string) ?? null,
          },
        })

        return true
      } catch (error) {
        console.error('[auth] signIn callback error:', error)
        return false
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },
})
