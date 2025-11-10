export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Vehicle {
    id: string;
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
    ownerId: string;
}

export interface MOTRecord {
    id: string;
    vehicleId: string;
    date: Date;
    status: 'pass' | 'fail' | 'pending';
}

export interface Garage {
    id: string;
    name: string;
    address: string;
    phone: string;
}