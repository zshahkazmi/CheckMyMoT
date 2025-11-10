import { MOTChecker } from '@/components/landing/mot-checker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const features = [
  {
    title: 'Manage your garage',
    description: 'Record inspections, track customer vehicles, and keep your testers in sync with digital MOT workflows.'
  },
  {
    title: 'Stay compliant',
    description: 'Automated reminders and MOT history ensure every vehicle is road-legal before it leaves your premises.'
  },
  {
    title: 'Empower your customers',
    description: 'Owners get a single dashboard with notifications, documents, and service history across all their vehicles.'
  }
]

export default function LandingPage() {
  return (
    <div className="bg-background">
      <section className="border-b bg-gradient-to-b from-background via-background to-muted/50">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 md:flex-row md:items-center">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              MOT intelligence for the UK
            </span>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              CheckMyMoT keeps every vehicle compliant and every garage organised.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Seamlessly check DVLA records, manage MOT inspections, and notify customers about upcoming renewals — all in a single
              secure platform that scales with your workshop or fleet.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signin">Get started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">Explore dashboards</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <MOTChecker />
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-background">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">{feature.description}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16 text-center">
          <h2 className="text-3xl font-bold">Built for garages and vehicle owners</h2>
          <p className="text-muted-foreground">
            Whether you manage a busy MOT lane or a personal collection, CheckMyMoT centralises every test, advisory, and reminder
            so nothing slips through the cracks.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/dashboard/garage">Garage dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard/user">Owner dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
