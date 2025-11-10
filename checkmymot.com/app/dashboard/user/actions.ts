'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerAuthSession } from '@/lib/auth'

const vehicleSchema = z.object({
  reg: z.string().min(4),
  make: z.string().min(2),
  model: z.string().min(1),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1)
})

export async function createVehicle(formData: FormData) {
  const session = await getServerAuthSession()
  if (!session?.user?.id) {
    throw new Error('Unauthenticated')
  }

  const parsed = vehicleSchema.parse({
    reg: formData.get('reg'),
    make: formData.get('make'),
    model: formData.get('model'),
    year: formData.get('year')
  })

  await prisma.vehicle.create({
    data: {
      reg: parsed.reg.toUpperCase(),
      make: parsed.make,
      model: parsed.model,
      year: parsed.year,
      userId: session.user.id
    }
  })

  revalidatePath('/dashboard/user')
}

export async function deleteVehicle(vehicleId: string) {
  const session = await getServerAuthSession()
  if (!session?.user?.id) {
    throw new Error('Unauthenticated')
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId }
  })

  if (!vehicle || vehicle.userId !== session.user.id) {
    throw new Error('Vehicle not found')
  }

  await prisma.vehicle.delete({ where: { id: vehicleId } })

  revalidatePath('/dashboard/user')
}

const updateVehicleSchema = vehicleSchema.extend({
  id: z.string().cuid()
})

export async function updateVehicle(formData: FormData) {
  const session = await getServerAuthSession()
  if (!session?.user?.id) {
    throw new Error('Unauthenticated')
  }

  const parsed = updateVehicleSchema.parse({
    id: formData.get('id'),
    reg: formData.get('reg'),
    make: formData.get('make'),
    model: formData.get('model'),
    year: formData.get('year')
  })

  const vehicle = await prisma.vehicle.findUnique({ where: { id: parsed.id } })
  if (!vehicle || vehicle.userId !== session.user.id) {
    throw new Error('Vehicle not found')
  }

  await prisma.vehicle.update({
    where: {
      id: parsed.id
    },
    data: {
      reg: parsed.reg.toUpperCase(),
      make: parsed.make,
      model: parsed.model,
      year: parsed.year
    }
  })

  revalidatePath('/dashboard/user')
}
