import type { LatLng } from '../types';

export const getCurrentLocation = (): Promise<LatLng> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => {
                console.error('Error getting current location:', error);
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    });
};

export const LAGOS_LOCATIONS: { [key: string]: LatLng } = {
    'Ikeja': { lat: 6.6059, lng: 3.3491 },
    'Victoria Island': { lat: 6.4281, lng: 3.4210 },
    'Lekki': { lat: 6.4650, lng: 3.5770 },
    'Ajah': { lat: 6.4730, lng: 3.5770 },
    'Surulere': { lat: 6.5010, lng: 3.3580 },
    'Yaba': { lat: 6.5090, lng: 3.3710 },
    'Ikoyi': { lat: 6.4520, lng: 3.4380 },
    'Maryland': { lat: 6.5780, lng: 3.3610 },
    'Gbagada': { lat: 6.5480, lng: 3.3810 },
    'Oshodi': { lat: 6.5550, lng: 3.3430 },
    'Agege': { lat: 6.6150, lng: 3.3230 },
    'Ikorodu': { lat: 6.6190, lng: 3.5110 },
    'Badagry': { lat: 6.4150, lng: 2.8870 }
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = R * c;
    
    return Math.round(distanceKm * 10) / 10;
};

export const popularLagosAreas = [
    'Ikeja', 'Victoria Island', 'Lekki', 'Ajah', 'Surulere', 'Yaba', 'Ikoyi',
    'Maryland', 'Gbagada', 'Oshodi', 'Agege', 'Ikorodu', 'Badagry'
];
