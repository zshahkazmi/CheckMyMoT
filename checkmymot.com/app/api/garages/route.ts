import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function GET() {
  const session = await getServerAuthSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const garages = await prisma.garage.findMany({
    include: {
      user: true,
      vehicles: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ garages })
}

const garageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  contact: z.string().optional(),
  location: z.string().optional(),
  userId: z.string().cuid()
})

export async function POST(request: Request) {
  const session = await getServerAuthSession()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const parsed = garageSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const garage = await prisma.garage.upsert({
    where: { userId: parsed.data.userId },
    update: {
      name: parsed.data.name,
      email: parsed.data.email,
      contact: parsed.data.contact,
      location: parsed.data.location
    },
    create: {
      name: parsed.data.name,
      email: parsed.data.email,
      contact: parsed.data.contact,
      location: parsed.data.location,
      userId: parsed.data.userId
    }
  })

  return NextResponse.json({ garage })
}
