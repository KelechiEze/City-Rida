'use client';
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Calendar, Star, Car, Navigation, Receipt, Phone, MessageCircle } from 'lucide-react';

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

const MyTrips: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [trips, setTrips] = useState<Trip[]>([]);

    // Load trips from localStorage on component mount and when storage changes
    useEffect(() => {
        const loadTrips = () => {
            const savedTrips = localStorage.getItem('userTrips');
            if (savedTrips) {
                try {
                    const parsedTrips = JSON.parse(savedTrips);
                    // Ensure we only show trips that have actual booking data
                    const validTrips = parsedTrips.filter((trip: Trip) => 
                        trip.driver && trip.driver !== '' && 
                        trip.pickup && trip.destination
                    );
                    
                    // Remove duplicates by ID
                    const uniqueTrips = validTrips.reduce((acc: Trip[], current: Trip) => {
                        const exists = acc.find(trip => trip.id === current.id);
                        if (!exists) {
                            acc.push(current);
                        }
                        return acc;
                    }, []);
                    
                    setTrips(uniqueTrips);
                } catch (error) {
                    console.error('Error loading trips:', error);
                    setTrips([]);
                }
            } else {
                setTrips([]);
            }
        };

        loadTrips();

        // Listen for storage changes to update trips in real-time
        const handleStorageChange = () => {
            loadTrips();
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also check for changes periodically (in case same tab updates)
        const interval = setInterval(loadTrips, 2000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const filteredTrips = trips.filter(trip => 
        activeTab === 'upcoming' ? trip.status === 'upcoming' : trip.status === 'completed'
    );

    const StatusBadge: React.FC<{ status: Trip['status'] }> = ({ status }) => {
        const styles = {
            completed: 'bg-green-100 text-green-800',
            upcoming: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const handleCancelRide = (tripId: string) => {
        const updatedTrips = trips.map(trip => 
            trip.id === tripId ? { ...trip, status: 'cancelled' as const } : trip
        );
        setTrips(updatedTrips);
        localStorage.setItem('userTrips', JSON.stringify(updatedTrips));
        setSelectedTrip(null);
    };

    const handleCompleteRide = (tripId: string) => {
        const updatedTrips = trips.map(trip => 
            trip.id === tripId ? { ...trip, status: 'completed' as const, rating: 5 } : trip
        );
        setTrips(updatedTrips);
        localStorage.setItem('userTrips', JSON.stringify(updatedTrips));
        if (selectedTrip && selectedTrip.id === tripId) {
            setSelectedTrip(updatedTrips.find(trip => trip.id === tripId) || null);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            return date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    const formatTime = (timeString: string) => {
        try {
            // If it's already in a readable format, return as is
            if (timeString.includes(':')) {
                return timeString;
            }
            // Otherwise try to parse it
            const time = new Date(timeString);
            if (isNaN(time.getTime())) {
                return timeString;
            }
            return time.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
        } catch (error) {
            return timeString;
        }
    };

    // Calculate price breakdown
    const calculatePriceBreakdown = (trip: Trip) => {
        try {
            const totalPrice = parseInt(trip.price.replace('₦', '').replace(',', ''));
            const baseFare = 500;
            const distanceCharge = totalPrice - baseFare;
            
            return {
                baseFare,
                distanceCharge: distanceCharge > 0 ? distanceCharge : 0,
                serviceFee: 0,
                total: totalPrice
            };
        } catch (error) {
            return {
                baseFare: 500,
                distanceCharge: 0,
                serviceFee: 0,
                total: 0
            };
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <header className="pt-2 md:pt-0">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800">My Trips</h1>
                <p className="text-gray-500 mt-1 text-sm md:text-base">
                    {trips.length > 0 
                        ? `You have ${trips.length} trip${trips.length === 1 ? '' : 's'} in total`
                        : 'Manage your upcoming rides and view trip history'
                    }
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Trips List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className="bg-white p-2 rounded-2xl shadow-sm">
                        <div className="flex space-x-2">
                            {(['upcoming', 'completed'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                                        activeTab === tab
                                            ? 'bg-[#FFC107] text-black'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    {tab === 'upcoming' ? `Upcoming Rides (${trips.filter(t => t.status === 'upcoming').length})` : `Trip History (${trips.filter(t => t.status === 'completed').length})`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Trips */}
                    <div className="space-y-4">
                        {filteredTrips.length > 0 ? (
                            filteredTrips.map((trip) => (
                                <div
                                    key={trip.id}
                                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-yellow-200"
                                    onClick={() => setSelectedTrip(trip)}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                                                <Car size={24} className="text-yellow-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{formatDate(trip.date)}</p>
                                                <p className="text-gray-500 flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {formatTime(trip.time)}
                                                </p>
                                            </div>
                                        </div>
                                        <StatusBadge status={trip.status} />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">Pickup</p>
                                                <p className="text-gray-600">{trip.pickup}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">Destination</p>
                                                <p className="text-gray-600">{trip.destination}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Navigation size={14} />
                                                {trip.distance}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {trip.duration}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-800">{trip.price}</p>
                                            {trip.rating && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            className={i < trip.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                                <Car size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="font-bold text-lg text-gray-600 mb-2">
                                    {activeTab === 'upcoming' ? 'No Upcoming Rides' : 'No Trip History'}
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    {activeTab === 'upcoming' 
                                        ? 'You don\'t have any upcoming rides. Book a ride to get started!'
                                        : 'Your completed trips will appear here.'
                                    }
                                </p>
                                {activeTab === 'upcoming' && (
                                    <button 
                                        onClick={() => window.location.href = '/dashboard/book'}
                                        className="bg-[#FFC107] hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg transition-colors"
                                    >
                                        Book a Ride
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Trip Details Sidebar */}
                <div className="space-y-6">
                    {selectedTrip ? (
                        <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-6">
                            <h3 className="font-bold text-xl mb-6">Trip Details</h3>
                            
                            <div className="space-y-6">
                                {/* Driver Info */}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-3">Driver & Vehicle</h4>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                            <Car size={20} className="text-yellow-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800">{selectedTrip.driver}</p>
                                            <p className="text-gray-600 text-sm">{selectedTrip.car}</p>
                                            <p className="text-gray-500 text-sm">License: {selectedTrip.license}</p>
                                        </div>
                                        {selectedTrip.rating && (
                                            <div className="flex items-center gap-1">
                                                <Star size={16} className="text-yellow-400 fill-current" />
                                                <span className="font-semibold">{selectedTrip.rating}.0</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Trip Info */}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-3">Trip Information</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date & Time</span>
                                            <span className="font-semibold">{formatDate(selectedTrip.date)} at {formatTime(selectedTrip.time)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Duration</span>
                                            <span className="font-semibold">{selectedTrip.duration}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Distance</span>
                                            <span className="font-semibold">{selectedTrip.distance}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status</span>
                                            <StatusBadge status={selectedTrip.status} />
                                        </div>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-3">Price Breakdown</h4>
                                    <div className="space-y-2">
                                        {(() => {
                                            const breakdown = calculatePriceBreakdown(selectedTrip);
                                            return (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Base fare</span>
                                                        <span>₦{breakdown.baseFare.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Distance</span>
                                                        <span>₦{breakdown.distanceCharge.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Service fee</span>
                                                        <span>₦0</span>
                                                    </div>
                                                    <div className="border-t border-gray-200 pt-2">
                                                        <div className="flex justify-between font-bold text-lg">
                                                            <span>Total</span>
                                                            <span>{selectedTrip.price}</span>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-3 pt-4">
                                    {selectedTrip.status === 'upcoming' && (
                                        <div className="space-y-3">
                                            <div className="flex gap-3">
                                                <button 
                                                    onClick={() => handleCancelRide(selectedTrip.id)}
                                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                                                >
                                                    Cancel Ride
                                                </button>
                                                <div className="flex gap-2">
                                                    <button className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                                                        <Phone size={16} />
                                                    </button>
                                                    <button className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                                                        <MessageCircle size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleCompleteRide(selectedTrip.id)}
                                                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                                            >
                                                Mark as Completed
                                            </button>
                                        </div>
                                    )}
                                    <button className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition-colors py-2">
                                        <Receipt size={16} />
                                        Download Receipt
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                            <Car size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="font-bold text-lg text-gray-600">Select a Trip</h3>
                            <p className="text-gray-500 mt-2">
                                {trips.length > 0 
                                    ? 'Choose a trip from the list to view details'
                                    : 'No trips yet. Book your first ride!'
                                }
                            </p>
                            {trips.length === 0 && (
                                <button 
                                    onClick={() => window.location.href = '/dashboard/book'}
                                    className="mt-4 bg-[#FFC107] hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg transition-colors"
                                >
                                    Book First Ride
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyTrips;