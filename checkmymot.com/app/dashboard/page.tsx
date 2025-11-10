import { redirect } from 'next/navigation'
import { getServerAuthSession } from '@/lib/auth'

export default async function DashboardRootPage() {
  const session = await getServerAuthSession()

  if (!session?.user) {
    redirect('/signin')
  }

  if (session.user.role === 'GARAGE' || session.user.role === 'ADMIN') {
    redirect('/dashboard/garage')
  }

  redirect('/dashboard/user')
}
