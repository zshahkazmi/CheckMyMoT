import { redirect } from 'next/navigation'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CustomerTable } from './components/customer-table'
import { InspectionManager } from './components/inspection-manager'
import { upsertGarageProfile } from './actions'

export default async function GarageDashboardPage() {
  const session = await getServerAuthSession()
  if (!session?.user?.id) {
    redirect('/signin')
  }

  if (session.user.role !== 'GARAGE' && session.user.role !== 'ADMIN') {
    redirect('/dashboard/user')
  }

  const garage = await prisma.garage.findUnique({ where: { userId: session.user.id } })

  const vehicles = await prisma.vehicle.findMany({
    include: {
      user: true,
      motRecords: {
        orderBy: { date: 'desc' }
      }
    },
    orderBy: { updatedAt: 'desc' }
  })

  const inspections = await prisma.mOTRecord.findMany({
    where: garage ? { garageId: garage.id } : {},
    orderBy: { date: 'desc' },
    take: 10,
    include: {
      vehicle: true
    }
  })

  const customerVehicles = vehicles.map((vehicle) => ({
    id: vehicle.id,
    reg: vehicle.reg,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    ownerName: vehicle.user?.name ?? null,
    ownerEmail: vehicle.user?.email ?? null,
    motRecords: vehicle.motRecords
  }))

  const inspectionRows = inspections.map((inspection) => ({
    id: inspection.id,
    vehicleReg: inspection.vehicle.reg,
    date: inspection.date,
    result: inspection.result,
    advisories: inspection.advisories,
    testerNotes: inspection.testerNotes
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Garage profile</CardTitle>
          <CardDescription>
            Keep your workshop details up-to-date for customer bookings and compliance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={upsertGarageProfile} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="name">
                Garage name
              </label>
              <Input id="name" name="name" defaultValue={garage?.name ?? ''} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="contact">
                Contact number
              </label>
              <Input id="contact" name="contact" defaultValue={garage?.contact ?? ''} placeholder="01234 567890" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="location">
                Location
              </label>
              <Input id="location" name="location" defaultValue={garage?.location ?? ''} placeholder="London" />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Save profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer vehicles</CardTitle>
          <CardDescription>Search across registered owners and quickly access MOT history.</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerTable vehicles={customerVehicles} />
        </CardContent>
      </Card>

      <InspectionManager inspections={inspectionRows} />
    </div>
  )
}
