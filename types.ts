import type React from 'react';

export interface RideOption {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    price: string;
    eta: string;
    capacity: number;
    iconUrl: string;
    popular?: boolean;
}

export interface Driver {
    id: string;
    name: string;
    car: string;
    license: string;
    rating: number;
    trips: number;
    eta: string;
    image: string;
}

export interface Trip {
    id: string;
    date: string;
    time: string;
    pickup: string;
    destination: string;
    driver: Driver;
    ride: RideOption;
    price: string;
    status: 'completed' | 'upcoming' | 'cancelled';
    rating?: number;
    duration: string;
    distance: string;
}

export interface LatLng {
    lat: number;
    lng: number;
}

export type View = 'overview' | 'booking';
