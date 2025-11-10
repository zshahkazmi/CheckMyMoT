import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const registrationNumber = searchParams.get('registrationNumber');

    // Mock data for demonstration purposes
    const mockData = {
        registrationNumber: registrationNumber,
        motStatus: 'Valid',
        expiryDate: '2024-05-15',
        garage: 'Local Garage',
    };

    // Here you would typically fetch real data from a database or an external API
    // const motData = await fetchMotData(registrationNumber);

    return NextResponse.json(mockData);
}