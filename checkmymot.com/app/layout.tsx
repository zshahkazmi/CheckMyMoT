import '@/styles/globals.css'
import { Providers } from '@/components/providers/providers'
import { Navbar } from '@/components/navbar'
import { getServerAuthSession } from '@/lib/auth'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'CheckMyMoT.com – UK MOT management platform',
  description:
    'CheckMyMoT.com lets vehicle owners and garages manage MOT history, receive reminders, and record new inspections with ease.'
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Providers session={session}>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 bg-muted/20">{children}</main>
            <footer className="border-t bg-background py-6 text-sm text-muted-foreground">
              <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-center sm:flex-row sm:items-center sm:justify-between">
                <span>&copy; {new Date().getFullYear()} CheckMyMoT.com. All rights reserved.</span>
                <span className="flex justify-center gap-4">
                  <a className="hover:text-primary" href="mailto:hello@checkmymot.com">
                    Contact
                  </a>
                  <a className="hover:text-primary" href="/privacy">
                    Privacy
                  </a>
                  <a className="hover:text-primary" href="/terms">
                    Terms
                  </a>
                </span>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
