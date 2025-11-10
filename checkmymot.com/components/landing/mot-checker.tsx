'use client'

import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatDate } from '@/lib/utils'

interface MOTResponse {
  reg: string
  make: string
  model: string
  year: number
  motExpiry: string
  status: 'PASS' | 'FAIL' | 'UNKNOWN'
  mileageHistory: Array<{ year: number; mileage: number }>
  lastTest: {
    date: string
    result: string
    advisories: string[]
  }
}

export const MOTChecker = () => {
  const [registration, setRegistration] = useState('')
  const mutation = useMutation<MOTResponse, Error, string>({
    mutationFn: async (reg) => {
      const response = await fetch('/api/mot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reg })
      })
      if (!response.ok) {
        throw new Error('Unable to fetch MOT details right now')
      }
      return (await response.json()) as MOTResponse
    }
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate(registration.toUpperCase().trim())
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-lg border bg-background p-4 shadow-sm sm:flex-row sm:items-center"
      >
        <label className="w-full text-sm font-semibold text-muted-foreground" htmlFor="registration">
          Check your next MOT in seconds
        </label>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Input
            id="registration"
            value={registration}
            onChange={(event) => setRegistration(event.target.value)}
            placeholder="e.g. AB12 CDE"
            className="uppercase"
            required
            minLength={4}
          />
          <Button type="submit" disabled={mutation.isLoading} className="min-w-[150px]">
            {mutation.isLoading ? 'Checking…' : 'Check MOT'}
          </Button>
        </div>
        {mutation.isError ? (
          <p className="text-sm text-destructive">{mutation.error.message}</p>
        ) : null}
      </form>

      {mutation.data ? (
        <Card className={cn('border-l-4', mutation.data.status === 'FAIL' ? 'border-destructive' : 'border-primary')}>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">{mutation.data.reg}</CardTitle>
              <CardDescription>
                {mutation.data.make} {mutation.data.model} · {mutation.data.year}
              </CardDescription>
            </div>
            <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              MOT {mutation.data.status}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <section className="grid gap-3 md:grid-cols-2">
              <div className="rounded-md border bg-muted/30 p-4">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">Expiry date</h3>
                <p className="mt-1 text-lg font-semibold">{formatDate(mutation.data.motExpiry)}</p>
              </div>
              <div className="rounded-md border bg-muted/30 p-4">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">Last test</h3>
                <p className="mt-1 text-lg font-semibold">{formatDate(mutation.data.lastTest.date)}</p>
                <p className="text-sm text-muted-foreground">Result: {mutation.data.lastTest.result}</p>
              </div>
            </section>
            <section>
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Advisories</h3>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                {mutation.data.lastTest.advisories.length ? (
                  mutation.data.lastTest.advisories.map((item) => <li key={item}>{item}</li>)
                ) : (
                  <li>No advisories reported</li>
                )}
              </ul>
            </section>
            <section>
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Mileage history</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {mutation.data.mileageHistory.map((entry) => (
                  <div key={entry.year} className="rounded-md border bg-background p-3 text-sm">
                    <p className="font-semibold">{entry.year}</p>
                    <p className="text-muted-foreground">{entry.mileage.toLocaleString()} miles</p>
                  </div>
                ))}
              </div>
            </section>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
