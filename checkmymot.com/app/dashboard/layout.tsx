import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerAuthSession } from '@/lib/auth'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { Role } from '@prisma/client'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession()

  if (!session?.user) {
    redirect('/signin')
  }

  const role = (session.user.role ?? 'USER') as Role

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-8 md:flex-row">
      <DashboardSidebar role={role} />
      <section className="flex-1 space-y-6">
        <header className="rounded-lg border bg-background p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {role === 'GARAGE'
              ? 'Manage your testers, customer vehicles, and live MOT inspections.'
              : role === 'ADMIN'
              ? 'Oversee platform users, garages, and MOT activity in one place.'
              : 'Monitor your vehicles, history, and renewal reminders.'}
          </p>
        </header>
        <div className="space-y-6">{children}</div>
      </section>
    </div>
  )
}
