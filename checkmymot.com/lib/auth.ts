import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import type { NextAuthOptions, Session } from 'next-auth'
import { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import nodemailer from 'nodemailer'
import type { Role } from '@prisma/client'

const smtpConfigured =
  process.env.EMAIL_SERVER_HOST &&
  process.env.EMAIL_SERVER_PORT &&
  process.env.EMAIL_SERVER_USER &&
  process.env.EMAIL_SERVER_PASSWORD

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
      }
    })
  : undefined

const sendMagicLink = async ({ identifier, url }: { identifier: string; url: string }) => {
  if (!transporter || !process.env.EMAIL_FROM) {
    console.info('Magic link for %s: %s', identifier, url)
    return
  }

  await transporter.sendMail({
    to: identifier,
    from: process.env.EMAIL_FROM,
    subject: 'Your CheckMyMoT sign-in link',
    text: `Sign in to CheckMyMoT: ${url}`,
    html: `<p>Click the link below to sign in to <strong>CheckMyMoT</strong>.</p><p><a href="${url}">Sign in now</a></p>`
  })
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    }),
    EmailProvider({
      sendVerificationRequest: async (params) => {
        await sendMagicLink({ identifier: params.identifier, url: params.url })
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      const typedSession = session as Session & {
        user: Session['user'] & { role?: Role; id?: string }
      }
      if (typedSession.user) {
        typedSession.user.role = (token.role as Role) ?? 'USER'
        if (token.sub) {
          typedSession.user.id = token.sub
        }
      }
      return typedSession
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: Role }).role ?? 'USER'
      } else if (token.sub) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } })
        if (dbUser) {
          token.role = dbUser.role
        }
      }
      return token
    }
  }
}

export const getServerAuthSession = () => getServerSession(authOptions)
