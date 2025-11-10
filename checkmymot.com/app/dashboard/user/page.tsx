import { redirect } from 'next/navigation'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { withUpcomingExpiry, formatDate } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VehicleManager, VehicleWithHistory } from './components/vehicle-manager'

export default async function UserDashboardPage() {
  const session = await getServerAuthSession()
  if (!session?.user?.id) {
    redirect('/signin')
  }

  const vehicles = await prisma.vehicle.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      motRecords: {
        orderBy: { date: 'desc' }
      }
    }
  })

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { notifyAt: 'asc' }
  })

  const upcomingExpiries = vehicles.filter((vehicle) => withUpcomingExpiry(vehicle, 45))
  const combinedAlerts = [
    ...notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      date: notification.notifyAt
    })),
    ...upcomingExpiries.map((vehicle) => ({
      id: `upcoming-${vehicle.id}`,
      title: `${vehicle.reg} MOT due soon`,
      message: 'Schedule a test to stay road legal.',
      date: new Date()
    }))
  ].sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming MOT reminders</CardTitle>
          <CardDescription>
            We automatically flag vehicles that are within 45 days of their next MOT expiry.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {combinedAlerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">All clear! We will notify you when a vehicle is due.</p>
          ) : (
            <ul className="space-y-3">
              {combinedAlerts.map((alert) => (
                <li key={alert.id} className="rounded-md border bg-muted/20 p-3">
                  <p className="text-sm font-semibold">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(alert.date)}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <VehicleManager vehicles={vehicles as VehicleWithHistory[]} />
    </div>
  )
}
