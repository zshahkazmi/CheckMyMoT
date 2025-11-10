import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { addDays, format, isBefore } from 'date-fns'
import { MOTRecord, Vehicle } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: Date | string, dateFormat = 'dd MMM yyyy') => {
  const parsed = typeof date === 'string' ? new Date(date) : date
  return format(parsed, dateFormat)
}

export const withUpcomingExpiry = (
  vehicle: Vehicle & { motRecords: MOTRecord[] },
  thresholdDays = 30
) => {
  if (!vehicle.motRecords.length) return false
  const latestRecord = vehicle.motRecords.reduce((latest, current) =>
    current.date > latest.date ? current : latest
  )
  if (!latestRecord) return false
  const expiry = addDays(latestRecord.date, 365)
  return isBefore(expiry, addDays(new Date(), thresholdDays))
}

export type MOTHistoryEntry = Pick<MOTRecord, 'date' | 'result' | 'advisories' | 'mileage'>

export const summariseMotHistory = (records: MOTRecord[]) =>
  records
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((record) => ({
      date: record.date,
      result: record.result,
      advisories: record.advisories,
      mileage: record.mileage
    }))
