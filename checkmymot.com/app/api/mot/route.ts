import { NextResponse } from 'next/server'

const mockMOTDatabase = {
  'AB12CDE': {
    reg: 'AB12CDE',
    make: 'Ford',
    model: 'Focus ST',
    year: 2019,
    motExpiry: '2024-11-18',
    status: 'PASS',
    mileageHistory: [
      { year: 2023, mileage: 23500 },
      { year: 2022, mileage: 17800 },
      { year: 2021, mileage: 11050 }
    ],
    lastTest: {
      date: '2023-11-18',
      result: 'PASS',
      advisories: ['Monitor rear brake pad wear', 'Slight play in offside track rod end']
    }
  },
  'EF34GHI': {
    reg: 'EF34GHI',
    make: 'Tesla',
    model: 'Model 3',
    year: 2021,
    motExpiry: '2024-05-08',
    status: 'PASS',
    mileageHistory: [
      { year: 2023, mileage: 14200 },
      { year: 2022, mileage: 9700 },
      { year: 2021, mileage: 3200 }
    ],
    lastTest: {
      date: '2023-05-08',
      result: 'PASS',
      advisories: []
    }
  },
  'JK56LMN': {
    reg: 'JK56LMN',
    make: 'BMW',
    model: '3 Series',
    year: 2017,
    motExpiry: '2024-01-03',
    status: 'FAIL',
    mileageHistory: [
      { year: 2023, mileage: 44250 },
      { year: 2022, mileage: 39210 },
      { year: 2021, mileage: 33600 }
    ],
    lastTest: {
      date: '2023-01-03',
      result: 'FAIL',
      advisories: ['Nearside front tyre tread below requirements', 'Exhaust emissions outside limits']
    }
  }
} satisfies Record<string, unknown>

export async function GET() {
  return NextResponse.json({
    available: Object.values(mockMOTDatabase).map((entry) => ({
      reg: (entry as { reg: string }).reg,
      make: (entry as { make: string }).make,
      model: (entry as { model: string }).model,
      motExpiry: (entry as { motExpiry: string }).motExpiry
    }))
  })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body || typeof body.reg !== 'string') {
    return NextResponse.json({ error: 'Registration number is required.' }, { status: 400 })
  }

  const reg = body.reg.toUpperCase().replace(/\s/g, '')
  const record = mockMOTDatabase[reg as keyof typeof mockMOTDatabase]

  if (!record) {
    return NextResponse.json(
      {
        reg,
        status: 'UNKNOWN',
        message: 'No DVLA record found. Please double check the registration.'
      },
      { status: 404 }
    )
  }

  return NextResponse.json(record)
}
