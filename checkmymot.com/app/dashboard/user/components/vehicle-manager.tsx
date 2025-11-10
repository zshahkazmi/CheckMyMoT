'use client'

import { useTransition, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { formatDate } from '@/lib/utils'
import { createVehicle, deleteVehicle, updateVehicle } from '../actions'

export type VehicleWithHistory = {
  id: string
  reg: string
  make: string
  model: string
  year: number
  motRecords: Array<{
    id: string
    date: Date
    result: string
    advisories: string | null
    mileage: number | null
    testerNotes: string | null
  }>
}

export const VehicleManager = ({ vehicles }: { vehicles: VehicleWithHistory[] }) => {
  const [isPending, startTransition] = useTransition()
  const [createError, setCreateError] = useState<string | null>(null)
  const [listError, setListError] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleWithHistory | null>(null)

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    startTransition(async () => {
      try {
        await createVehicle(formData)
        setCreateError(null)
        form.reset()
      } catch (error) {
        console.error(error)
        setCreateError('Could not save vehicle, please check the registration is unique.')
      }
    })
  }

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    startTransition(async () => {
      try {
        await updateVehicle(formData)
        setListError(null)
        setSelectedVehicle(null)
      } catch (error) {
        console.error(error)
        setListError('Could not update vehicle details.')
      }
    })
  }

  const handleDelete = (vehicleId: string) => {
    startTransition(async () => {
      try {
        await deleteVehicle(vehicleId)
        setListError(null)
      } catch (error) {
        console.error(error)
        setListError('Unable to remove vehicle at this time.')
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add a vehicle</CardTitle>
          <CardDescription>Store your vehicle details to track MOT history and reminders.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="reg" className="text-sm font-medium">
                Registration
              </label>
              <Input id="reg" name="reg" placeholder="AB12 CDE" required className="uppercase" minLength={4} maxLength={12} />
            </div>
            <div className="space-y-2">
              <label htmlFor="make" className="text-sm font-medium">
                Make
              </label>
              <Input id="make" name="make" placeholder="Tesla" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="model" className="text-sm font-medium">
                Model
              </label>
              <Input id="model" name="model" placeholder="Model 3" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="year" className="text-sm font-medium">
                Year
              </label>
              <Input id="year" name="year" type="number" required min={1950} max={new Date().getFullYear() + 1} />
            </div>
            <CardFooter className="col-span-full flex flex-col gap-2 p-0 pt-2">
              {createError ? <p className="text-sm text-destructive">{createError}</p> : null}
              <Button type="submit" className="w-full md:w-auto" disabled={isPending}>
                {isPending ? 'Saving…' : 'Save vehicle'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved vehicles</CardTitle>
          <CardDescription>Your latest MOT records, advisories, and renewal dates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {listError ? <p className="text-sm text-destructive">{listError}</p> : null}
          {vehicles.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add your first vehicle to build an MOT history.</p>
          ) : (
            vehicles.map((vehicle) => (
              <div key={vehicle.id} className="rounded-lg border p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {vehicle.reg} · {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">Registered in {vehicle.year}</p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={selectedVehicle?.id === vehicle.id}
                      onOpenChange={(open) => (open ? setSelectedVehicle(vehicle) : setSelectedVehicle(null))}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline">Edit</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit vehicle</DialogTitle>
                          <DialogDescription>Update basic vehicle details.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-3">
                          <input type="hidden" name="id" value={vehicle.id} />
                          <div className="space-y-1">
                            <label className="text-sm font-medium" htmlFor={`reg-${vehicle.id}`}>
                              Registration
                            </label>
                            <Input
                              id={`reg-${vehicle.id}`}
                              name="reg"
                              defaultValue={vehicle.reg}
                              className="uppercase"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium" htmlFor={`make-${vehicle.id}`}>
                              Make
                            </label>
                            <Input id={`make-${vehicle.id}`} name="make" defaultValue={vehicle.make} required />
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium" htmlFor={`model-${vehicle.id}`}>
                              Model
                            </label>
                            <Input id={`model-${vehicle.id}`} name="model" defaultValue={vehicle.model} required />
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium" htmlFor={`year-${vehicle.id}`}>
                              Year
                            </label>
                            <Input
                              id={`year-${vehicle.id}`}
                              name="year"
                              type="number"
                              defaultValue={vehicle.year}
                              min={1950}
                              max={new Date().getFullYear() + 1}
                              required
                            />
                          </div>
                          {listError && selectedVehicle?.id === vehicle.id ? (
                            <p className="text-sm text-destructive">{listError}</p>
                          ) : null}
                          <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                              {isPending && selectedVehicle?.id === vehicle.id ? 'Updating…' : 'Update vehicle'}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" onClick={() => handleDelete(vehicle.id)} disabled={isPending}>
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Mileage</TableHead>
                        <TableHead>Advisories</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehicle.motRecords.length ? (
                        vehicle.motRecords.slice(0, 5).map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{formatDate(record.date)}</TableCell>
                            <TableCell>{record.result}</TableCell>
                            <TableCell>{record.mileage ? `${record.mileage.toLocaleString()} miles` : '—'}</TableCell>
                            <TableCell>
                              {record.advisories ? (
                                <Textarea
                                  readOnly
                                  defaultValue={record.advisories ?? ''}
                                  className="min-h-[60px] bg-muted/20"
                                />
                              ) : (
                                <span className="text-muted-foreground">None</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                            No MOT records stored yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                    <TableCaption>Only the five most recent MOTs are shown.</TableCaption>
                  </Table>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
