'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/utils'
import { recordInspection, updateInspection } from '../actions'

export type InspectionRecord = {
  id: string
  vehicleReg: string
  date: Date
  result: string
  advisories: string | null
  testerNotes: string | null
}

export const InspectionManager = ({ inspections }: { inspections: InspectionRecord[] }) => {
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [selectedInspection, setSelectedInspection] = useState<InspectionRecord | null>(null)

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      try {
        await recordInspection(formData)
        setFeedback('Inspection recorded successfully.')
        event.currentTarget.reset()
      } catch (error) {
        console.error(error)
        setFeedback('Failed to record inspection. Ensure the garage profile exists.')
      }
    })
  }

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      try {
        await updateInspection(formData)
        setFeedback('Inspection updated.')
        setSelectedInspection(null)
      } catch (error) {
        console.error(error)
        setFeedback('Could not update inspection.')
      }
    })
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-background p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Record new inspection</h3>
        <p className="text-sm text-muted-foreground">
          Enter the vehicle registration and test outcome to create a new MOT record.
        </p>
        <form onSubmit={handleCreate} className="mt-4 grid gap-4 md:grid-cols-2">
          <Input name="reg" placeholder="Registration" required className="uppercase" minLength={4} />
          <Input name="date" type="date" required />
          <select
            name="result"
            required
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            defaultValue="PASS"
          >
            <option value="PASS">Pass</option>
            <option value="FAIL">Fail</option>
          </select>
          <Input name="mileage" type="number" min={0} placeholder="Mileage" />
          <Textarea name="advisories" placeholder="Advisories" className="md:col-span-2" />
          <Textarea name="testerNotes" placeholder="Tester notes" className="md:col-span-2" />
          <Button type="submit" className="md:col-span-2" disabled={isPending}>
            {isPending ? 'Saving…' : 'Save inspection'}
          </Button>
        </form>
        {feedback ? <p className="mt-2 text-sm text-muted-foreground">{feedback}</p> : null}
      </section>

      <section className="rounded-lg border bg-background p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Recent inspections</h3>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Registration</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Advisories</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inspections.length ? (
              inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell className="font-medium">{inspection.vehicleReg}</TableCell>
                  <TableCell>{formatDate(inspection.date)}</TableCell>
                  <TableCell>{inspection.result}</TableCell>
                  <TableCell className="max-w-[220px] whitespace-pre-wrap text-sm text-muted-foreground">
                    {inspection.advisories ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Dialog
                      open={selectedInspection?.id === inspection.id}
                      onOpenChange={(open) => (open ? setSelectedInspection(inspection) : setSelectedInspection(null))}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update inspection</DialogTitle>
                          <DialogDescription>
                            Adjust advisories or outcome after a retest.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-3">
                          <input type="hidden" name="id" value={inspection.id} />
                          <div className="space-y-1">
                            <label className="text-sm font-medium" htmlFor={`result-${inspection.id}`}>
                              Result
                            </label>
                            <select
                              id={`result-${inspection.id}`}
                              name="result"
                              defaultValue={inspection.result}
                              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                            >
                              <option value="PASS">Pass</option>
                              <option value="FAIL">Fail</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium" htmlFor={`advisories-${inspection.id}`}>
                              Advisories
                            </label>
                            <Textarea
                              id={`advisories-${inspection.id}`}
                              name="advisories"
                              defaultValue={inspection.advisories ?? ''}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium" htmlFor={`notes-${inspection.id}`}>
                              Tester notes
                            </label>
                            <Textarea
                              id={`notes-${inspection.id}`}
                              name="testerNotes"
                              defaultValue={inspection.testerNotes ?? ''}
                            />
                          </div>
                          <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                              {isPending && selectedInspection?.id === inspection.id ? 'Updating…' : 'Update'}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                  Record your first inspection to populate this table.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
