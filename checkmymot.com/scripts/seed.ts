import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.notification.deleteMany()
  await prisma.mOTRecord.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.garage.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  const owner = await prisma.user.create({
    data: {
      name: 'Olivia Owner',
      email: 'owner@example.com',
      role: Role.USER
    }
  })

  const garageUser = await prisma.user.create({
    data: {
      name: 'Graham Garage',
      email: 'garage@example.com',
      role: Role.GARAGE
    }
  })

  const garage = await prisma.garage.create({
    data: {
      name: 'High Street MOT Centre',
      email: 'garage@example.com',
      contact: '01234 555000',
      location: 'Manchester',
      userId: garageUser.id
    }
  })

  const vehicle = await prisma.vehicle.create({
    data: {
      reg: 'AB12CDE',
      make: 'Ford',
      model: 'Focus ST',
      year: 2019,
      userId: owner.id,
      garageId: garage.id,
      motRecords: {
        create: [
          {
            date: new Date('2023-11-18'),
            result: 'PASS',
            advisories: 'Monitor rear brake pad wear',
            mileage: 23500,
            testerNotes: 'Vehicle presented in excellent condition',
            garageId: garage.id
          },
          {
            date: new Date('2022-11-10'),
            result: 'PASS',
            advisories: 'Slight play in track rod end',
            mileage: 17800,
            testerNotes: 'Advisory issued to driver',
            garageId: garage.id
          }
        ]
      }
    }
  })

  await prisma.notification.create({
    data: {
      userId: owner.id,
      title: 'MOT due soon',
      message: 'Book your Ford Focus for its next MOT to stay compliant.',
      notifyAt: new Date()
    }
  })

  console.log('Seed completed with users:', owner.email, garageUser.email, 'and vehicle', vehicle.reg)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
