'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone, MessageCircle, X, Car, User, Star, MapPin, ArrowLeft, Loader, CheckCircle, Clock } from 'lucide-react';
import Map from '../../../components/dashboard/Map';
import './BookRide.css';

// Type definitions
interface Coords { lat: number; lng: number; }
interface ActiveRide {
    status: 'DRIVER_EN_ROUTE' | 'TRIP_IN_PROGRESS' | 'COMPLETED';
    pickup: string;
    destination: string;
    pickupCoords: Coords;
    destinationCoords: Coords;
    driver: {
        id: string;
        name: string;
        car: string;
        license: string;
        rating: number;
        location: Coords;
        eta: number;
    };
    route?: any; 
}

interface RideOption { 
    id: string; 
    name: string; 
    description: string; 
    priceMultiplier: number; 
    capacity: number; 
    icon: React.ReactNode; 
    isPopular?: boolean; 
    features: string[]; 
}

interface Driver { 
    id: string; 
    name: string; 
    car: string; 
    license: string; 
    rating: number; 
    location: Coords; 
    eta: number; 
}

// Mocks
const lagosLocations = [
    { name: 'Ikeja City Mall', coords: { lat: 6.6158, lng: 3.3588 } },
    { name: 'Murtala Muhammed Airport', coords: { lat: 6.5772, lng: 3.3211 } },
    { name: 'Lekki Conservation Centre', coords: { lat: 6.4403, lng: 3.5321 } },
    { name: 'Victoria Island', coords: { lat: 6.4285, lng: 3.4218 } },
    { name: 'University of Lagos', coords: { lat: 6.5186, lng: 3.3950 } },
    { name: 'National Stadium, Surulere', coords: { lat: 6.5056, lng: 3.3600 } },
];

const rideOptions: RideOption[] = [
    { 
        id: 'standard', 
        name: 'Standard', 
        description: 'Affordable, everyday rides', 
        priceMultiplier: 1, 
        capacity: 4, 
        icon: <Car size={20}/>, 
        features: ['AC', 'Music'] 
    },
    { 
        id: 'comfort', 
        name: 'Comfort', 
        description: 'Newer cars with extra legroom', 
        priceMultiplier: 1.3, 
        capacity: 4, 
        icon: <Car size={20} />, 
        isPopular: true, 
        features: ['AC', 'Music', 'Wifi'] 
    },
    { 
        id: 'suv', 
        name: 'SUV', 
        description: 'Room for friends and luggage', 
        priceMultiplier: 1.6, 
        capacity: 6, 
        icon: <Car size={20} />, 
        features: ['AC', 'Music', 'Extra Space'] 
    },
];

const mockDrivers: Driver[] = [
    { id: 'd1', name: 'Tunde Adebayo', car: 'Toyota Camry', license: 'LAG-123', rating: 4.9, location: { lat: 6.61, lng: 3.35 }, eta: 3 },
    { id: 'd2', name: 'Chinedu Obi', car: 'Honda Accord', license: 'APP-456', rating: 4.8, location: { lat: 6.62, lng: 3.36 }, eta: 5 },
    { id: 'd3', name: 'Folake Silva', car: 'Lexus RX350', license: 'IKJ-789', rating: 5.0, location: { lat: 6.60, lng: 3.37 }, eta: 6 },
    { id: 'd4', name: 'Emeka Okafor', car: 'Kia Rio', license: 'EPE-012', rating: 4.7, location: { lat: 6.59, lng: 3.34 }, eta: 8 },
];

function ActiveRideContent() {
    const router = useRouter();
    const [ride, setRide] = useState<ActiveRide | null>(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rideProgress, setRideProgress] = useState(0);

    useEffect(() => {
        const activeRideData = localStorage.getItem('active_ride_passenger');
        if (activeRideData) {
            const parsedRide: ActiveRide = JSON.parse(activeRideData);
            setRide(parsedRide);
            
            // Simulate ride progress
            const progressInterval = setInterval(() => {
                setRideProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        setShowRatingModal(true);
                        return 100;
                    }
                    return prev + (100 / 60); // Complete in 60 seconds
                });
            }, 1000);

            return () => clearInterval(progressInterval);
        } else {
            router.replace('/dashboard/book');
        }
    }, [router]);

    const handleRatingSubmit = (rating: number) => {
        if (!ride) return;
        
        const completedTrip = {
            ...ride,
            id: `trip_${Date.now()}`,
            date: new Date().toISOString(),
            time: new Date().toLocaleTimeString(),
            price: `₦${(Math.random() * 2000 + 1500).toFixed(0)}`,
            status: 'completed',
            rating: rating,
            duration: `${Math.round(Math.random()*20+10)} min`,
            distance: `${(Math.random()*10+5).toFixed(1)} km`,
        };
        
        const existingTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
        localStorage.setItem('userTrips', JSON.stringify([completedTrip, ...existingTrips]));
        localStorage.removeItem('active_ride_passenger');
        router.push('/dashboard/trips');
    };

    if (!ride) return <div className="loading-overlay">Loading Trip...</div>;

    return (
        <div className="active-ride-container">
            <Map 
                pickupCoords={ride.pickupCoords}
                destinationCoords={ride.destinationCoords}
                driverLocation={ride.driver.location}
            />
            
            <div className="trip-bottom-sheet">
                <div className="handle-bar"></div>
                <div className="status-header">
                    <h2>Driver is on the way</h2>
                    <p>Arriving in ~{ride.driver.eta} min</p>
                    
                    {/* Progress Bar */}
                    <div className="ride-progress-container">
                        <div className="ride-progress-bar">
                            <div 
                                className="ride-progress-fill" 
                                style={{ width: `${rideProgress}%` }}
                            ></div>
                        </div>
                        <div className="ride-progress-text">
                            {Math.round(rideProgress)}% Complete
                        </div>
                    </div>
                </div>
                
                <div className="driver-info-card">
                    <div className="driver-avatar">
                        <User size={24} />
                    </div>
                    <div className="driver-details">
                        <h4>{ride.driver.name}</h4>
                        <div className="rating">
                            <Star size={14} fill="currentColor" /> {ride.driver.rating}
                        </div>
                    </div>
                    <div className="vehicle-details">
                        <p>{ride.driver.car}</p>
                        <p>{ride.driver.license}</p>
                    </div>
                    <div className="driver-contact">
                        <button className="contact-btn">
                            <Phone size={20} />
                        </button>
                        <button className="contact-btn">
                            <MessageCircle size={20} />
                        </button>
                    </div>
                </div>
            </div>
            
            {showRatingModal && (
                <RatingModal 
                    ride={ride} 
                    onSubmit={handleRatingSubmit} 
                />
            )}
        </div>
    );
}

const RatingModal: React.FC<{ride: ActiveRide; onSubmit: (rating: number) => void}> = ({ ride, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-scale-in">
                <div className="rating-modal-header">
                    <CheckCircle size={48} className="success-icon" />
                    <h3>Ride Completed!</h3>
                    <p>How was your ride with {ride.driver.name}?</p>
                </div>
                
                <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="star-button"
                            type="button"
                        >
                            <Star 
                                size={36} 
                                className={
                                    star <= (hoverRating || rating) ? 'filled' : ''
                                }
                            />
                        </button>
                    ))}
                </div>
                
                <div className="rating-labels">
                    <span>Poor</span>
                    <span>Fair</span>
                    <span>Good</span>
                    <span>Very Good</span>
                    <span>Excellent</span>
                </div>
                
                <button 
                    onClick={() => onSubmit(rating)} 
                    disabled={rating === 0} 
                    className="submit-rating-btn"
                >
                    Submit Rating {rating > 0 && `(${rating})`}
                </button>
            </div>
        </div>
    );
}

function BookingFlowContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [bookingStep, setBookingStep] = useState<'enterRoute' | 'selectRide' | 'selectDriver'>('enterRoute');
    const [userLocation, setUserLocation] = useState<Coords | null>(null);
    const [pickup, setPickup] = useState('Current Location');
    const [destination, setDestination] = useState('');
    const [distance, setDistance] = useState<number | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [isFindingDriver, setIsFindingDriver] = useState(false);
    const [sheetHeight, setSheetHeight] = useState(280);

    // Get destination from URL params if coming from overview
    useEffect(() => {
        const urlDestination = searchParams.get('destination');
        if (urlDestination) {
            setDestination(urlDestination);
            setBookingStep('selectRide');
            setSheetHeight(420);
        }
    }, [searchParams]);

    const pickupCoords = pickup === 'Current Location' ? userLocation : lagosLocations.find(l => l.name === pickup)?.coords || null;
    const destinationCoords = lagosLocations.find(l => l.name === destination)?.coords || null;

    useEffect(() => {
        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({ 
                        lat: position.coords.latitude, 
                        lng: position.coords.longitude 
                    });
                },
                () => {
                    setUserLocation(lagosLocations[0].coords);
                }
            );
        }
    }, []);

    useEffect(() => {
        if (pickupCoords && destinationCoords) {
            const randomDistance = Math.random() * 15 + 5;
            const randomDuration = randomDistance * (Math.random() * 1.5 + 2.5);
            setDistance(randomDistance);
            setDuration(randomDuration);
        }
    }, [pickupCoords, destinationCoords]);

    const handleDestinationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setDestination(value);
        if (value) {
            setBookingStep('selectRide');
            setSheetHeight(420);
        }
    };

    const handleFindDriver = () => {
        if (!selectedRide) return;
        
        setIsFindingDriver(true);
        setTimeout(() => {
            setBookingStep('selectDriver');
            setSheetHeight(500);
            setIsFindingDriver(false);
        }, 2000);
    };

    const handleConfirmRide = () => {
        if (!selectedDriver || !pickupCoords || !destinationCoords || !selectedRide) return;
        
        const newActiveRide: ActiveRide = {
            status: 'DRIVER_EN_ROUTE',
            pickup, 
            destination, 
            pickupCoords, 
            destinationCoords,
            driver: selectedDriver,
        };
        localStorage.setItem('active_ride_passenger', JSON.stringify(newActiveRide));
        window.location.reload();
    };

    const calculatePrice = (option: RideOption) => {
        if (!distance) return '0';
        return (distance * option.priceMultiplier * 150).toFixed(0);
    };

    const handleBackToRideSelection = () => {
        setBookingStep('selectRide');
        setSheetHeight(420);
        setSelectedDriver(null);
    };

    const handleBackToRoute = () => {
        setBookingStep('enterRoute');
        setSheetHeight(280);
        setSelectedRide(null);
    };

    return (
        <div className="book-ride-page-layout">
            <div className="book-ride-map-container">
                <Map 
                    pickupCoords={pickupCoords} 
                    destinationCoords={destinationCoords} 
                    userLocation={userLocation}
                    onRouteCalculated={(details) => {
                        setDistance(details.distance);
                        setDuration(details.duration);
                    }}
                />
            </div>
            
            <div 
                className={`bottom-sheet ${bookingStep}`}
                style={{ height: `${sheetHeight}px` }}
            >
                <div className="handle-bar"></div>
                
                <div className="sheet-content">
                    {bookingStep === 'enterRoute' && (
                        <RouteSelectionView
                            pickup={pickup}
                            destination={destination}
                            onDestinationChange={handleDestinationSelect}
                        />
                    )}

                    {bookingStep === 'selectRide' && (
                        <RideSelectionView
                            duration={duration}
                            selectedRide={selectedRide}
                            onRideSelect={setSelectedRide}
                            onBack={handleBackToRoute}
                            onFindDriver={handleFindDriver}
                            isFindingDriver={isFindingDriver}
                            calculatePrice={calculatePrice}
                        />
                    )}

                    {bookingStep === 'selectDriver' && (
                        <DriverSelectionView
                            selectedDriver={selectedDriver}
                            onDriverSelect={setSelectedDriver}
                            onBack={handleBackToRideSelection}
                            onConfirmRide={handleConfirmRide}
                            selectedRide={selectedRide}
                            calculatePrice={calculatePrice}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// Sub-components for better organization
const RouteSelectionView: React.FC<{
    pickup: string;
    destination: string;
    onDestinationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ pickup, destination, onDestinationChange }) => (
    <div className="content-view">
        <h3>Enter your route</h3>
        <div className="location-inputs">
            <div className="input-group">
                <span>FROM</span>
                <p>{pickup}</p>
            </div>
            <div className="input-group">
                <span>TO</span>
                <select 
                    value={destination} 
                    onChange={onDestinationChange}
                    className="destination-select"
                >
                    <option value="">Select a destination</option>
                    {lagosLocations.map(loc => (
                        <option key={loc.name} value={loc.name}>
                            {loc.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    </div>
);

const RideSelectionView: React.FC<{
    duration: number | null;
    selectedRide: RideOption | null;
    onRideSelect: (ride: RideOption) => void;
    onBack: () => void;
    onFindDriver: () => void;
    isFindingDriver: boolean;
    calculatePrice: (option: RideOption) => string;
}> = ({ duration, selectedRide, onRideSelect, onBack, onFindDriver, isFindingDriver, calculatePrice }) => (
    <div className="content-view">
        <button onClick={onBack} className="sheet-back-btn">
            <ArrowLeft size={18}/> Back
        </button>
        
        <h3>Choose a ride</h3>
        
        <div className="options-list">
            {rideOptions.map(option => (
                <div 
                    key={option.id} 
                    onClick={() => onRideSelect(option)}
                    className={`ride-option-card ${selectedRide?.id === option.id ? 'selected' : ''} ${option.isPopular ? 'popular' : ''}`}
                >
                    {option.isPopular && <div className="popular-badge">Most Popular</div>}
                    
                    <div className="ride-info">
                        <div className="ride-icon">{option.icon}</div>
                        <div className="ride-details">
                            <h4>{option.name}</h4>
                            <p>{option.description}</p>
                            <div className="ride-features">
                                <span><Clock size={12}/> {Math.round(duration || 0)} min</span>
                                <span>•</span>
                                <span>{option.capacity} seats</span>
                                <span>•</span>
                                <span>{option.features.join(', ')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="ride-price">
                        ₦{calculatePrice(option)}
                    </div>
                </div>
            ))}
        </div>
        
        <button 
            onClick={onFindDriver}
            disabled={!selectedRide || isFindingDriver}
            className="sheet-action-btn"
        >
            {isFindingDriver ? (
                <>
                    <Loader size={18} className="animate-spin" />
                    Finding Drivers...
                </>
            ) : (
                'Find Available Drivers'
            )}
        </button>
    </div>
);

const DriverSelectionView: React.FC<{
    selectedDriver: Driver | null;
    onDriverSelect: (driver: Driver) => void;
    onBack: () => void;
    onConfirmRide: () => void;
    selectedRide: RideOption | null;
    calculatePrice: (option: RideOption) => string;
}> = ({ selectedDriver, onDriverSelect, onBack, onConfirmRide, selectedRide, calculatePrice }) => (
    <div className="content-view">
        <button onClick={onBack} className="sheet-back-btn">
            <ArrowLeft size={18}/> Back
        </button>
        
        <h3>Available Drivers</h3>
        <p className="driver-selection-subtitle">Choose your preferred driver</p>
        
        <div className="driver-list">
            {mockDrivers.map(driver => (
                <div 
                    key={driver.id} 
                    onClick={() => onDriverSelect(driver)}
                    className={`driver-select-card ${selectedDriver?.id === driver.id ? 'selected' : ''}`}
                >
                    <div className="driver-select-info">
                        <div className="driver-select-avatar">
                            <User size={20} />
                        </div>
                        <div className="driver-details">
                            <h4>
                                {driver.name} 
                                <Star size={12} className="inline-star" /> 
                                {driver.rating}
                            </h4>
                            <p>{driver.car} • {driver.license}</p>
                            <div className="driver-eta">
                                <Clock size={12} />
                                {driver.eta} min away
                            </div>
                        </div>
                    </div>
                    <div className="driver-select-price">
                        ₦{selectedRide ? calculatePrice(selectedRide) : '0'}
                    </div>
                </div>
            ))}
        </div>
        
        <button 
            onClick={onConfirmRide}
            disabled={!selectedDriver}
            className="sheet-action-btn confirm-ride-btn"
        >
            <CheckCircle size={18} />
            Confirm Ride with {selectedDriver?.name.split(' ')[0]}
        </button>
    </div>
);

function BookRidePageContent() {
    const [hasActiveRide, setHasActiveRide] = useState<boolean | null>(null);
    
    useEffect(() => {
        setHasActiveRide(!!localStorage.getItem('active_ride_passenger'));
    }, []);

    if (hasActiveRide === null) {
        return <div className="loading-overlay">Loading...</div>;
    }

    return hasActiveRide ? <ActiveRideContent /> : <BookingFlowContent />;
}

export default function BookRidePage() {
    return (
        <Suspense fallback={<div className="loading-overlay">Loading...</div>}>
            <BookRidePageContent />
        </Suspense>
    );
}
