'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Clock, Calendar, Users, Car, Star, Zap, ArrowLeft, Navigation, X, CheckCircle, User } from 'lucide-react';
import { gsap } from 'gsap';

interface RideOption {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    price: string;
    eta: string;
    capacity: number;
    icon: React.ReactNode;
    features: string[];
    popular?: boolean;
}

interface Driver {
    id: string;
    name: string;
    car: string;
    license: string;
    rating: number;
    trips: number;
    currentLocation: string;
    price: string;
    eta: string;
    image: string;
}

interface Trip {
    id: string;
    date: string;
    time: string;
    pickup: string;
    destination: string;
    driver: string;
    car: string;
    license: string;
    price: string;
    status: 'completed' | 'upcoming' | 'cancelled';
    rating?: number;
    duration: string;
    distance: string;
}

// Function to get current location using browser geolocation
const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
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

// Lagos coordinates for major areas
const LAGOS_LOCATIONS: { [key: string]: { lat: number; lng: number } } = {
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

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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

// Confirmation Modal Component
const RideConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    trip: Trip;
    onViewTrips: () => void;
}> = ({ isOpen, onClose, trip, onViewTrips }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full mx-auto animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                <CheckCircle size={24} className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-gray-800">Ride Confirmed!</h3>
                                <p className="text-gray-600 text-sm">Your driver is on the way</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Trip Details */}
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Driver</span>
                        <span className="font-semibold">{trip.driver}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Vehicle</span>
                        <span className="font-semibold">{trip.car}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">License</span>
                        <span className="font-semibold">{trip.license}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">ETA</span>
                        <span className="font-semibold text-green-600">{trip.duration}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-gray-800">{trip.price}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Track Ride
                    </button>
                    <button
                        onClick={onViewTrips}
                        className="flex-1 py-3 px-4 bg-[#FFC107] text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                    >
                        View Trips
                    </button>
                </div>
            </div>
        </div>
    );
};

// Driver Card Component
const DriverCard: React.FC<{
    driver: Driver;
    isSelected: boolean;
    onSelect: (driver: Driver) => void;
}> = ({ driver, isSelected, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(driver)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                isSelected 
                    ? 'border-[#FFC107] bg-yellow-50 ring-2 ring-yellow-100' 
                    : 'border-gray-200 hover:border-gray-300'
            }`}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate">{driver.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{driver.car}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            <span className="flex items-center gap-1 text-xs text-gray-600">
                                <Star size={12} className="text-yellow-500" />
                                {driver.rating} ({driver.trips} trips)
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-600">
                                <Navigation size={12} />
                                <span className="truncate">{driver.currentLocation}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-lg sm:text-xl font-bold text-gray-800 whitespace-nowrap">{driver.price}</p>
                    <p className="text-xs text-gray-500">ETA: {driver.eta}</p>
                </div>
            </div>
        </div>
    );
};

const BookRide: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [pickup, setPickup] = useState('Current Location');
    const [destination, setDestination] = useState('');
    const [selectedRide, setSelectedRide] = useState<string | null>(null);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [rideTime, setRideTime] = useState('now');
    const [isLoading, setIsLoading] = useState(false);
    const [isFindingDrivers, setIsFindingDrivers] = useState(false);
    const [showDrivers, setShowDrivers] = useState(false);
    const [distance, setDistance] = useState<number>(0);
    const [calculatedPrices, setCalculatedPrices] = useState<{ [key: string]: string }>({});
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmedTrip, setConfirmedTrip] = useState<Trip | null>(null);
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    
    const driversContainerRef = useRef<HTMLDivElement>(null);

    // Get destination from URL params
    useEffect(() => {
        const urlDestination = searchParams.get('destination');
        const fromOverview = searchParams.get('fromOverview') === 'true';
        
        if (urlDestination) {
            setDestination(urlDestination);
        }
    }, [searchParams]);

    // Get current location on component mount
    useEffect(() => {
        const initializeCurrentLocation = async () => {
            setIsGettingLocation(true);
            try {
                const location = await getCurrentLocation();
                setCurrentLocation(location);
                console.log('Current location:', location);
            } catch (error) {
                console.error('Failed to get current location:', error);
                // Fallback to Lagos Island coordinates
                setCurrentLocation({ lat: 6.5244, lng: 3.3792 });
            } finally {
                setIsGettingLocation(false);
            }
        };

        initializeCurrentLocation();
    }, []);

    const calculatePrice = (basePrice: number, distance: number): number => {
        const baseFare = 500;
        const distanceRate = basePrice * distance;
        const price = baseFare + distanceRate;
        return Math.round(price / 100) * 100;
    };

    const getLocationCoordinates = async (locationName: string): Promise<{ lat: number; lng: number }> => {
        if (locationName === 'Current Location' && currentLocation) {
            return currentLocation;
        }
        return LAGOS_LOCATIONS[locationName] || LAGOS_LOCATIONS['Ikeja'];
    };

    // Generate drivers with dynamic pricing based on calculated prices
    const generateDrivers = (rideId: string): Driver[] => {
        const baseDrivers = [
            {
                id: '1',
                name: 'Tunde Adewale',
                car: 'Toyota Corolla 2022',
                license: 'LAG-1234',
                rating: 4.9,
                trips: 1247,
                currentLocation: '2km away',
                price: '',
                eta: '5 min',
                image: ''
            },
            {
                id: '2',
                name: 'Chinedu Okoro',
                car: 'Honda Accord 2021',
                license: 'LAG-5678',
                rating: 4.8,
                trips: 892,
                currentLocation: '1.5km away',
                price: '',
                eta: '4 min',
                image: ''
            },
            {
                id: '3',
                name: 'Emeka Nwosu',
                car: 'Toyota Camry 2023',
                license: 'LAG-9012',
                rating: 4.7,
                trips: 567,
                currentLocation: '3km away',
                price: '',
                eta: '7 min',
                image: ''
            },
            {
                id: '4',
                name: 'Aisha Bello',
                car: 'Hyundai Elantra 2022',
                license: 'LAG-3456',
                rating: 4.9,
                trips: 1103,
                currentLocation: '1.2km away',
                price: '',
                eta: '3 min',
                image: ''
            }
        ];

        // Use the calculated price for the selected ride, or add small variations
        const basePrice = calculatedPrices[rideId] || '₦2,500';
        
        return baseDrivers.map((driver, index) => ({
            ...driver,
            price: calculateDriverPrice(basePrice, index)
        }));
    };

    // Calculate driver price with small variations
    const calculateDriverPrice = (basePrice: string, driverIndex: number): string => {
        try {
            const baseAmount = parseInt(basePrice.replace('₦', '').replace(',', ''));
            // Add small variations (-₦200 to +₦200) based on driver index
            const variation = (driverIndex % 4 - 1.5) * 100; // Creates variations like -200, -100, 0, 100
            const finalAmount = Math.max(1000, baseAmount + variation); // Ensure minimum price
            return `₦${Math.round(finalAmount / 100) * 100}`;
        } catch (error) {
            return basePrice;
        }
    };

    const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);

    useEffect(() => {
        const initializeDistanceAndPrices = async () => {
            if (destination) {
                // Calculate distance using coordinates
                const pickupCoords = await getLocationCoordinates(pickup);
                const destCoords = await getLocationCoordinates(destination);
                
                const calculatedDistance = calculateDistance(
                    pickupCoords.lat, pickupCoords.lng,
                    destCoords.lat, destCoords.lng
                );
                
                setDistance(calculatedDistance);
                
                const prices: { [key: string]: string } = {};
                rideOptions.forEach(ride => {
                    const price = calculatePrice(ride.basePrice, calculatedDistance);
                    prices[ride.id] = `₦${price.toLocaleString()}`;
                });
                setCalculatedPrices(prices);

                // Automatically start finding drivers when coming from overview
                const fromOverview = searchParams.get('fromOverview') === 'true';
                if (fromOverview) {
                    handleFindDrivers();
                }
            }
        };

        initializeDistanceAndPrices();
    }, [destination, pickup, currentLocation, searchParams]);

    // Update drivers when selected ride changes and prices are calculated
    useEffect(() => {
        if (selectedRide && calculatedPrices[selectedRide]) {
            const drivers = generateDrivers(selectedRide);
            setAvailableDrivers(drivers);
        }
    }, [selectedRide, calculatedPrices]);

    // GSAP animation for drivers list
    useEffect(() => {
        if (showDrivers && driversContainerRef.current) {
            const driverCards = driversContainerRef.current.querySelectorAll('.driver-card');
            
            gsap.fromTo(driverCards, 
                {
                    x: -100,
                    opacity: 0
                },
                {
                    x: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: "power2.out"
                }
            );
        }
    }, [showDrivers]);

    const rideOptions: RideOption[] = [
        {
            id: 'economy',
            name: 'Economy',
            description: 'Affordable everyday rides',
            basePrice: 200,
            price: '₦1,500',
            eta: '5 min',
            capacity: 4,
            icon: <Car size={20} className="text-gray-600" />,
            features: ['Air conditioning', 'Standard comfort']
        },
        {
            id: 'comfort',
            name: 'Comfort',
            description: 'Extra legroom and newer cars',
            basePrice: 300,
            price: '₦2,200',
            eta: '7 min',
            capacity: 4,
            icon: <Car size={20} className="text-blue-500" />,
            features: ['Extra legroom', 'Newer cars', 'Premium comfort'],
            popular: true
        },
        {
            id: 'premium',
            name: 'Premium',
            description: 'Luxury vehicles with professional drivers',
            basePrice: 450,
            price: '₦3,500',
            eta: '10 min',
            capacity: 4,
            icon: <Star size={20} className="text-yellow-500" />,
            features: ['Luxury vehicle', 'Professional driver', 'Bottled water']
        },
        {
            id: 'xl',
            name: 'XL',
            description: 'Extra space for groups',
            basePrice: 350,
            price: '₦2,800',
            eta: '8 min',
            capacity: 6,
            icon: <Users size={20} className="text-green-500" />,
            features: ['6 seats', 'Extra luggage space', 'Great for groups']
        }
    ];

    const popularLagosAreas = [
        'Ikeja', 'Victoria Island', 'Lekki', 'Ajah', 'Surulere', 'Yaba', 'Ikoyi',
        'Maryland', 'Gbagada', 'Oshodi', 'Agege', 'Ikorodu', 'Badagry'
    ];

    const handleFindDrivers = async () => {
        if (!selectedRide || !pickup || !destination) {
            console.log('Please fill in all required fields and select a ride type.');
            return;
        }

        setIsFindingDrivers(true);
        setShowDrivers(false);
        setSelectedDriver(null);

        // Simulate finding drivers for 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        setIsFindingDrivers(false);
        setShowDrivers(true);
    };

    const handleRideSelect = (rideId: string) => {
        setSelectedRide(rideId);
        // Automatically find drivers when a ride is selected
        handleFindDrivers();
    };

    const handleDriverSelect = (driver: Driver) => {
        setSelectedDriver(driver);
        
        // Animate other drivers out
        if (driversContainerRef.current) {
            const driverCards = driversContainerRef.current.querySelectorAll('.driver-card');
            driverCards.forEach((card, index) => {
                const driverId = card.getAttribute('data-driver-id');
                if (driverId !== driver.id) {
                    gsap.to(card, {
                        x: -100,
                        opacity: 0,
                        duration: 0.4,
                        ease: "power2.in",
                        onComplete: () => {
                            // Remove from DOM after animation
                            setTimeout(() => {
                                setShowDrivers(false);
                                handleConfirmRide(driver);
                            }, 400);
                        }
                    });
                }
            });
        }
    };

    const handleConfirmRide = async (driver?: Driver) => {
        const finalDriver = driver || selectedDriver;
        if (!finalDriver || !selectedRide || !pickup || !destination) {
            console.log('Please fill in all required fields and select a driver.');
            return;
        }

        setIsLoading(true);
        
        // Simulate ride confirmation process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate trip details
        const selectedRideDetails = rideOptions.find(r => r.id === selectedRide);
        const estimatedDuration = `${Math.round(distance * 2.5)}-${Math.round(distance * 3.5)} min`;
        
        const newTrip: Trip = {
            id: `trip_${Date.now()}`, // Unique ID with timestamp
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            }),
            pickup: pickup,
            destination: destination,
            driver: finalDriver.name,
            car: finalDriver.car,
            license: finalDriver.license,
            price: finalDriver.price,
            status: 'upcoming',
            duration: estimatedDuration,
            distance: `${distance} km`
        };

        // Save to localStorage - prevent duplicates by checking existing trips
        const existingTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
        
        // Check if this trip already exists (same driver, pickup, destination, and recent timestamp)
        const isDuplicate = existingTrips.some((trip: Trip) => 
            trip.driver === newTrip.driver && 
            trip.pickup === newTrip.pickup && 
            trip.destination === newTrip.destination &&
            Math.abs(new Date(trip.date).getTime() - new Date(newTrip.date).getTime()) < 60000 // Within 1 minute
        );

        if (!isDuplicate) {
            const updatedTrips = [newTrip, ...existingTrips];
            localStorage.setItem('userTrips', JSON.stringify(updatedTrips));
            setConfirmedTrip(newTrip);
            setIsLoading(false);
            setShowConfirmation(true);
        } else {
            console.log('Duplicate ride detected, not saving again.');
            setIsLoading(false);
        }
    };

    const handleBackToOverview = () => {
        router.push('/dashboard/overview');
    };

    const handlePickupChange = async (newPickup: string) => {
        setPickup(newPickup);
        if (destination) {
            const pickupCoords = await getLocationCoordinates(newPickup);
            const destCoords = await getLocationCoordinates(destination);
            
            const calculatedDistance = calculateDistance(
                pickupCoords.lat, pickupCoords.lng,
                destCoords.lat, destCoords.lng
            );
            
            setDistance(calculatedDistance);
            
            const prices: { [key: string]: string } = {};
            rideOptions.forEach(ride => {
                const price = calculatePrice(ride.basePrice, calculatedDistance);
                prices[ride.id] = `₦${price.toLocaleString()}`;
            });
            setCalculatedPrices(prices);
        }
    };

    const handleDestinationSelect = async (newDestination: string) => {
        setDestination(newDestination);
        const pickupCoords = await getLocationCoordinates(pickup);
        const destCoords = await getLocationCoordinates(newDestination);
        
        const calculatedDistance = calculateDistance(
            pickupCoords.lat, pickupCoords.lng,
            destCoords.lat, destCoords.lng
        );
        
        setDistance(calculatedDistance);
        
        const prices: { [key: string]: string } = {};
        rideOptions.forEach(ride => {
            const price = calculatePrice(ride.basePrice, calculatedDistance);
            prices[ride.id] = `₦${price.toLocaleString()}`;
        });
        setCalculatedPrices(prices);
    };

    const handleViewTrips = () => {
        setShowConfirmation(false);
        router.push('/dashboard/trips');
    };

    const selectedRideDetails = selectedRide ? rideOptions.find(r => r.id === selectedRide) : null;
    const fromOverview = searchParams.get('fromOverview') === 'true';

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <header className="pt-2 md:pt-0">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={handleBackToOverview}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
                    {fromOverview ? 'Rides Available!' : 'Book a Ride'}
                </h1>
                <p className="text-gray-500 mt-1 text-sm md:text-base">
                    {fromOverview 
                        ? `Great options found for your trip to ${destination}`
                        : 'Get where you need to go, comfortably and safely'
                    }
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                {/* Booking Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Location Inputs */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                                <div className="relative">
                                    <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <select
                                        value={pickup}
                                        onChange={(e) => handlePickupChange(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent appearance-none bg-white text-sm md:text-base"
                                    >
                                        <option value="Current Location">
                                            {isGettingLocation ? 'Getting location...' : 'Current Location'}
                                        </option>
                                        {popularLagosAreas.map(area => (
                                            <option key={area} value={area}>{area}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                                <div className="relative">
                                    <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <select
                                        value={destination}
                                        onChange={(e) => handleDestinationSelect(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent appearance-none bg-white text-sm md:text-base"
                                    >
                                        <option value="">Select destination</option>
                                        {popularLagosAreas.map(area => (
                                            <option key={area} value={area}>{area}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {distance > 0 && (
                            <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Navigation size={16} className="text-blue-600" />
                                        <span className="text-sm font-medium text-blue-800">Trip Distance</span>
                                    </div>
                                    <span className="text-lg font-bold text-blue-800">{distance} km</span>
                                </div>
                                <p className="text-xs text-blue-600 mt-1">
                                    Estimated travel time: {Math.round(distance * 2.5)}-{Math.round(distance * 3.5)} minutes
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Schedule Options */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Schedule Your Ride</h3>
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <button
                                onClick={() => setRideTime('now')}
                                className={`p-3 md:p-4 rounded-lg border-2 text-left transition-all ${
                                    rideTime === 'now' 
                                        ? 'border-[#FFC107] bg-yellow-50 ring-2 ring-yellow-100' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <Zap size={18} className="mb-2 text-yellow-500" />
                                <p className="font-semibold text-sm md:text-base">Ride Now</p>
                                <p className="text-xs md:text-sm text-gray-500">Get a ride ASAP</p>
                            </button>
                            <button
                                onClick={() => setRideTime('later')}
                                className={`p-3 md:p-4 rounded-lg border-2 text-left transition-all ${
                                    rideTime === 'later' 
                                        ? 'border-[#FFC107] bg-yellow-50 ring-2 ring-yellow-100' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <Calendar size={18} className="mb-2 text-blue-500" />
                                <p className="font-semibold text-sm md:text-base">Schedule</p>
                                <p className="text-xs md:text-sm text-gray-500">Plan for later</p>
                            </button>
                        </div>
                    </div>

                    {/* Ride Options OR Drivers List */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm relative">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">
                                {showDrivers ? 'Available Drivers' : 'Choose Your Ride'}
                            </h3>
                            <span className="text-sm text-gray-500">
                                {showDrivers ? `${availableDrivers.length} drivers available` : `${rideOptions.length} options available`}
                            </span>
                        </div>

                        {!showDrivers ? (
                            /* Ride Options - Updated for mobile */
                            <div className="space-y-3 md:space-y-4">
                                {rideOptions.map((ride) => (
                                    <div
                                        key={ride.id}
                                        onClick={() => handleRideSelect(ride.id)}
                                        className={`p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                                            selectedRide === ride.id 
                                                ? 'border-[#FFC107] bg-yellow-50 ring-2 ring-yellow-100' 
                                                : 'border-gray-200 hover:border-gray-300'
                                        } ${ride.popular ? 'ring-2 ring-yellow-200' : ''}`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    {ride.icon}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                                        <h4 className="font-bold text-gray-800 text-sm md:text-base truncate">
                                                            {ride.name}
                                                        </h4>
                                                        {ride.popular && (
                                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full self-start sm:self-center whitespace-nowrap">
                                                                Popular
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs md:text-sm text-gray-500 mb-2 line-clamp-1">
                                                        {ride.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-3 mb-2">
                                                        <span className="flex items-center gap-1 text-xs text-gray-600">
                                                            <Clock size={12} />
                                                            {ride.eta}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-xs text-gray-600">
                                                            <Users size={12} />
                                                            {ride.capacity} seats
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {ride.features.slice(0, 2).map((feature, index) => (
                                                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap">
                                                                {feature}
                                                            </span>
                                                        ))}
                                                        {ride.features.length > 2 && (
                                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                                +{ride.features.length - 2} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0 sm:self-start">
                                                <p className="text-lg md:text-xl font-bold text-gray-800 whitespace-nowrap">
                                                    {calculatedPrices[ride.id] || ride.price}
                                                </p>
                                                <p className="text-xs text-gray-500">estimated</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Drivers List */
                            <div ref={driversContainerRef} className="space-y-3 md:space-y-4">
                                {availableDrivers.map((driver) => (
                                    <div key={driver.id} data-driver-id={driver.id} className="driver-card">
                                        <DriverCard
                                            driver={driver}
                                            isSelected={selectedDriver?.id === driver.id}
                                            onSelect={handleDriverSelect}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Finding Drivers Overlay */}
                        {isFindingDrivers && (
                            <div className="absolute inset-0 bg-white bg-opacity-90 rounded-2xl flex items-center justify-center">
                                <div className="text-center max-w-sm p-4">
                                    <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-[#FFC107] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <h3 className="font-bold text-xl md:text-2xl text-gray-800 mb-2">Finding Available Drivers</h3>
                                    <p className="text-gray-600 text-sm md:text-base mb-4">
                                        Searching for the best drivers near you for your trip to <strong>{destination}</strong>
                                    </p>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-[#FFC107] h-2 rounded-full animate-pulse"></div>
                                    </div>
                                    <p className="text-xs md:text-sm text-gray-500 mt-2">This may take a few seconds...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Ride Summary */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm sticky top-6">
                        <h3 className="font-bold text-lg mb-4">Ride Summary</h3>
                        {selectedRideDetails ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm md:text-base">Ride type</span>
                                    <span className="font-semibold text-sm md:text-base">{selectedRideDetails.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm md:text-base">Pickup</span>
                                    <span className="font-semibold text-xs md:text-sm text-right max-w-[100px] md:max-w-[120px] truncate">
                                        {pickup || 'Not set'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm md:text-base">Destination</span>
                                    <span className="font-semibold text-xs md:text-sm text-right max-w-[100px] md:max-w-[120px] truncate">
                                        {destination || 'Not set'}
                                    </span>
                                </div>
                                {distance > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm md:text-base">Distance</span>
                                        <span className="font-semibold text-sm md:text-base">{distance} km</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm md:text-base">ETA</span>
                                    <span className="font-semibold text-sm md:text-base">{selectedRideDetails.eta}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                    <span className="text-gray-600 text-sm md:text-base">Estimated price</span>
                                    <span className="text-lg md:text-xl font-bold text-gray-800">
                                        {calculatedPrices[selectedRideDetails.id] || selectedRideDetails.price}
                                    </span>
                                </div>
                                
                                {selectedDriver && (
                                    <>
                                        <div className="pt-2 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm md:text-base">Selected Driver</span>
                                                <span className="font-semibold text-sm md:text-base truncate max-w-[100px]">
                                                    {selectedDriver.name}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm md:text-base">Final Price</span>
                                                <span className="text-lg md:text-xl font-bold text-green-600">{selectedDriver.price}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleConfirmRide()}
                                            disabled={isLoading}
                                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 mt-4 flex items-center justify-center gap-2 text-sm md:text-base"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Confirming...
                                                </>
                                            ) : (
                                                'Confirm Ride'
                                            )}
                                        </button>
                                    </>
                                )}
                                
                                {(!pickup || !destination) && !selectedDriver && (
                                    <p className="text-red-500 text-xs text-center mt-2">
                                        Please fill in both pickup and destination
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <Car size={32} className="text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm mb-2">No ride selected</p>
                                <p className="text-gray-400 text-xs">Choose a ride option to see details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <RideConfirmationModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                trip={confirmedTrip!}
                onViewTrips={handleViewTrips}
            />
        </div>
    );
};

export default BookRide;