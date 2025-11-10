'use server'

import { prisma } from '@/lib/prisma'
import { getServerAuthSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(2),
  contact: z.string().optional(),
  location: z.string().optional()
})

export async function upsertGarageProfile(formData: FormData) {
  const session = await getServerAuthSession()
  if (!session?.user?.id) throw new Error('Unauthenticated')

  const parsed = profileSchema.parse({
    name: formData.get('name'),
    contact: formData.get('contact') ?? undefined,
    location: formData.get('location') ?? undefined
  })

  await prisma.garage.upsert({
    where: { userId: session.user.id },
    update: {
      name: parsed.name,
      contact: parsed.contact,
      location: parsed.location
    },
    create: {
      userId: session.user.id,
      email: session.user.email ?? `garage-${session.user.id}@checkmymot.local`,
      name: parsed.name,
      contact: parsed.contact,
      location: parsed.location
    }
  })

  await prisma.user.update({
    where: { id: session.user.id },
    data: { role: 'GARAGE' }
  })

  revalidatePath('/dashboard/garage')
}

const inspectionSchema = z.object({
  reg: z.string().min(4),
  date: z.coerce.date(),
  result: z.enum(['PASS', 'FAIL']),
  mileage: z.coerce.number().int().min(0).optional(),
  advisories: z.string().optional(),
  testerNotes: z.string().optional()
})

export async function recordInspection(formData: FormData) {
  const session = await getServerAuthSession()
  if (!session?.user?.id) throw new Error('Unauthenticated')

  const garage = await prisma.garage.findUnique({ where: { userId: session.user.id } })
  if (!garage) {
    throw new Error('Garage profile required before recording inspections.')
  }

  const parsed = inspectionSchema.parse({
    reg: formData.get('reg'),
    date: formData.get('date'),
    result: formData.get('result'),
    mileage: formData.get('mileage') || undefined,
    advisories: formData.get('advisories') || undefined,
    testerNotes: formData.get('testerNotes') || undefined
  })

  const vehicle = await prisma.vehicle.upsert({
    where: { reg: parsed.reg.toUpperCase() },
    update: { garageId: garage.id },
    create: {
      reg: parsed.reg.toUpperCase(),
      make: 'Unknown',
      model: 'Unknown',
      year: new Date(parsed.date).getFullYear(),
      userId: session.user.id,
      garageId: garage.id
    }
  })

  await prisma.mOTRecord.create({
    data: {
      vehicleId: vehicle.id,
      garageId: garage.id,
      date: parsed.date,
      result: parsed.result,
      mileage: parsed.mileage,
      advisories: parsed.advisories,
      testerNotes: parsed.testerNotes
    }
  })

  revalidatePath('/dashboard/garage')
}

const updateInspectionSchema = z.object({
  id: z.string().cuid(),
  result: z.enum(['PASS', 'FAIL']),
  advisories: z.string().optional(),
  testerNotes: z.string().optional()
})

export async function updateInspection(formData: FormData) {
  const session = await getServerAuthSession()
  if (!session?.user?.id) throw new Error('Unauthenticated')

  const garage = await prisma.garage.findUnique({ where: { userId: session.user.id } })
  if (!garage) {
    throw new Error('Garage profile required.')
  }

  const parsed = updateInspectionSchema.parse({
    id: formData.get('id'),
    result: formData.get('result'),
    advisories: formData.get('advisories') || undefined,
    testerNotes: formData.get('testerNotes') || undefined
  })

  const record = await prisma.mOTRecord.findUnique({ where: { id: parsed.id } })
  if (!record || record.garageId !== garage.id) {
    throw new Error('Inspection not found')
  }

  await prisma.mOTRecord.update({
    where: { id: parsed.id },
    data: {
      result: parsed.result,
      advisories: parsed.advisories,
      testerNotes: parsed.testerNotes
    }
  })

  revalidatePath('/dashboard/garage')
}
