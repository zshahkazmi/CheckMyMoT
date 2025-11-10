import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Seed Users
    const user1 = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123', // In a real application, ensure to hash passwords
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123', // In a real application, ensure to hash passwords
        },
    });

    // Seed Vehicles
    const vehicle1 = await prisma.vehicle.create({
        data: {
            registrationNumber: 'ABC1234',
            ownerId: user1.id,
        },
    });

    const vehicle2 = await prisma.vehicle.create({
        data: {
            registrationNumber: 'XYZ5678',
            ownerId: user2.id,
        },
    });

    // Seed MOT Records
    await prisma.mOTRecord.createMany({
        data: [
            {
                vehicleId: vehicle1.id,
                date: new Date('2023-01-01'),
                status: 'Passed',
            },
            {
                vehicleId: vehicle2.id,
                date: new Date('2023-02-01'),
                status: 'Failed',
            },
        ],
    });

    // Seed Garages
    await prisma.garage.createMany({
        data: [
            {
                name: 'Garage A',
                location: 'Location A',
            },
            {
                name: 'Garage B',
                location: 'Location B',
            },
        ],
    });

    console.log('Seeding completed.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });