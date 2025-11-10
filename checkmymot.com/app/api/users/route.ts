import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function GET() {
  const session = await getServerAuthSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      vehicles: true,
      garage: true
    }
  })

  return NextResponse.json({ users })
}

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['USER', 'GARAGE', 'ADMIN']).default('USER')
})

export async function POST(request: Request) {
  const session = await getServerAuthSession()
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'GARAGE')) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const parsed = createUserSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const user = await prisma.user.upsert({
    where: { email: parsed.data.email },
    update: {
      name: parsed.data.name,
      role: parsed.data.role
    },
    create: {
      email: parsed.data.email,
      name: parsed.data.name,
      role: parsed.data.role
    }
  })

  return NextResponse.json({ user })
}
