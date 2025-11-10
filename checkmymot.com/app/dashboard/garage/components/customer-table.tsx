'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/utils'

export type CustomerVehicle = {
  id: string
  reg: string
  make: string
  model: string
  year: number
  ownerName: string | null
  ownerEmail: string | null
  motRecords: Array<{
    id: string
    date: Date
    result: string
  }>
}

export const CustomerTable = ({ vehicles }: { vehicles: CustomerVehicle[] }) => {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return vehicles
    const query = search.toLowerCase()
    return vehicles.filter((vehicle) =>
      [vehicle.reg, vehicle.make, vehicle.model, vehicle.ownerEmail ?? '', vehicle.ownerName ?? '']
        .some((value) => value.toLowerCase().includes(query))
    )
  }, [vehicles, search])

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by registration or customer email"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Last MOT</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map((vehicle) => {
                const latestRecord = vehicle.motRecords[0]
                return (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.reg}</TableCell>
                    <TableCell>
                      {vehicle.make} {vehicle.model}
                      <div className="text-xs text-muted-foreground">{vehicle.year}</div>
                    </TableCell>
                    <TableCell>
                      <div>{vehicle.ownerName ?? 'Unassigned'}</div>
                      <div className="text-xs text-muted-foreground">{vehicle.ownerEmail ?? '—'}</div>
                    </TableCell>
                    <TableCell>{latestRecord ? formatDate(latestRecord.date) : '—'}</TableCell>
                    <TableCell>{latestRecord ? latestRecord.result : 'No tests'}</TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                  No vehicles match your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
