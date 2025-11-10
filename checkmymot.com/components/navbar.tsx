'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Menu, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' }
]

export const Navbar = () => {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
          <span className="text-primary">CheckMy</span>
          <span>MOT</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn('transition hover:text-primary', pathname === item.href && 'text-primary')}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {status === 'authenticated' && session?.user?.name ? (
            <span className="hidden text-sm text-muted-foreground md:inline">Hi, {session.user.name}</span>
          ) : null}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {status === 'authenticated' ? (
            <>
              <Link href="/dashboard" className="hidden md:flex">
                <Button variant="secondary">My area</Button>
              </Link>
              <Button onClick={() => signOut({ callbackUrl: '/' })} variant="ghost">
                Sign out
              </Button>
            </>
          ) : (
            <Button onClick={() => signIn()} variant="default">
              Sign in
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {mobileOpen ? (
        <div className="md:hidden">
          <nav className="space-y-1 border-t bg-background p-4 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block rounded-md px-2 py-2 transition hover:bg-accent hover:text-accent-foreground',
                  pathname === item.href && 'bg-accent text-accent-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
