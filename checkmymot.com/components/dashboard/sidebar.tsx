'use client'

import Link from 'next/link'
import { Role } from '@prisma/client'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  role: Role
}

const commonLinks = [{ href: '/dashboard/user', label: 'My garage' }]
const garageLinks = [
  { href: '/dashboard/garage', label: 'Garage workspace' },
  { href: '/dashboard/garage/inspections', label: 'Inspection history', disabled: true }
]

export const DashboardSidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname()
  const links = role === 'GARAGE' || role === 'ADMIN' ? [...commonLinks, ...garageLinks] : commonLinks

  return (
    <aside className="w-full border-b bg-background md:w-64 md:border-b-0 md:border-r">
      <div className="space-y-1 p-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition',
              pathname === link.href ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
              link.disabled && 'pointer-events-none opacity-60'
            )}
          >
            <span>{link.label}</span>
            {link.disabled ? <span className="text-xs">Soon</span> : null}
          </Link>
        ))}
      </div>
    </aside>
  )
}
