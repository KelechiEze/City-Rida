'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Clock, Star, MapPin, User, Phone, MessageCircle } from 'lucide-react';
import Map from '../../../../components/dashboard/Map';
import './RiderTrips.css';

interface Trip {
    id: string;
    date: string;
    time: string;
    pickup: string;
    destination: string;
    passenger: string;
    fare: string;
    status: 'assigned' | 'completed' | 'cancelled';
    rating?: number;
    duration: string;
    distance: string;
    pickupCoords: { lat: number; lng: number };
    destinationCoords: { lat: number; lng: number };
}

const mockTrips: Trip[] = [
    { id: '1', date: '2025-11-18', time: '10:30 AM', pickup: 'Ikeja City Mall', destination: 'Murtala Muhammed Airport', passenger: 'Ada Okoro', fare: '₦3,500', status: 'assigned', duration: '25 min', distance: '8.2 km', pickupCoords: { lat: 6.6158, lng: 3.3588 }, destinationCoords: { lat: 6.5772, lng: 3.3211 } },
    { id: '2', date: '2025-11-17', time: '05:45 PM', pickup: 'Lekki Conservation Centre', destination: 'Victoria Island', passenger: 'Femi Adebayo', fare: '₦4,200', status: 'completed', rating: 5, duration: '45 min', distance: '12.5 km', pickupCoords: { lat: 6.4403, lng: 3.5321 }, destinationCoords: { lat: 6.4285, lng: 3.4218 } },
    { id: '3', date: '2025-11-17', time: '09:15 AM', pickup: 'Yaba', destination: 'University of Lagos', passenger: 'Chioma Nwosu', fare: '₦1,800', status: 'completed', rating: 4, duration: '15 min', distance: '4.1 km', pickupCoords: { lat: 6.5186, lng: 3.3950 }, destinationCoords: { lat: 6.5186, lng: 3.3950 } },
    { id: '4', date: '2025-11-16', time: '02:00 PM', pickup: 'Surulere', destination: 'National Stadium', passenger: 'Bolanle Adekunle', fare: '₦2,500', status: 'cancelled', duration: '20 min', distance: '6.0 km', pickupCoords: { lat: 6.5056, lng: 3.3600 }, destinationCoords: { lat: 6.5056, lng: 3.3600 } },
];

export default function RiderTripsPage() {
    const [activeTab, setActiveTab] = useState<'assigned' | 'completed' | 'cancelled'>('assigned');
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(mockTrips.find(t => t.status === 'assigned') || null);

    const filteredTrips = mockTrips.filter(trip => trip.status === activeTab);

    const StatusBadge: React.FC<{ status: Trip['status'] }> = ({ status }) => {
        const statusClasses: { [key in Trip['status']]: string } = {
            completed: 'status-completed',
            assigned: 'status-assigned',
            cancelled: 'status-cancelled'
        };
        return <span className={`status-badge ${statusClasses[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
    };

    return (
        <div className="rider-trips-container">
            <header className="page-header">
                <h1 className="page-title">My Trips</h1>
                <p className="page-subtitle">View your assigned rides and trip history.</p>
            </header>
            <div className="main-grid">
                <div className="trips-list-column">
                    <div className="tabs-container"><div className="tabs-wrapper">
                        {(['assigned', 'completed', 'cancelled'] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-button ${activeTab === tab ? 'active' : ''}`}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({mockTrips.filter(t => t.status === tab).length})
                            </button>
                        ))}
                    </div></div>
                    <div className="trips-list">
                        {filteredTrips.length > 0 ? (
                            filteredTrips.map(trip => (
                                <div key={trip.id} className={`trip-card ${selectedTrip?.id === trip.id ? 'selected' : ''}`} onClick={() => setSelectedTrip(trip)}>
                                    <div className="trip-card-header">
                                        <div>
                                            <p className="trip-passenger">{trip.passenger}</p>
                                            <p className="trip-time">{new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {trip.time}</p>
                                        </div>
                                        <p className="trip-fare">{trip.fare}</p>
                                    </div>
                                    <div className="trip-card-body">
                                        <div className="location-item"><MapPin size={14} className="text-green-500"/>{trip.pickup}</div>
                                        <div className="location-item"><MapPin size={14} className="text-red-500"/>{trip.destination}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state"><Car size={48} /><h3 className="empty-title">No {activeTab} trips</h3><p className="empty-text">Your {activeTab} trips will appear here.</p></div>
                        )}
                    </div>
                </div>
                <div className="details-sidebar">
                    {selectedTrip ? (
                        <div className="details-card">
                            <h3 className="details-title">Trip Details</h3>
                             <div className="details-map-container">
                                <Map pickupCoords={selectedTrip.pickupCoords} destinationCoords={selectedTrip.destinationCoords} />
                            </div>
                            <div className="details-sections">
                                <div>
                                    <h4 className="section-title">Passenger Info</h4>
                                    <div className="passenger-info-card">
                                        <div className="passenger-icon"><User size={20} /></div>
                                        <div className="passenger-details"><p>{selectedTrip.passenger}</p></div>
                                        <div className="passenger-actions">
                                            <button className="contact-btn call"><Phone size={16} /></button>
                                            <button className="contact-btn message"><MessageCircle size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="section-title">Trip Information</h4>
                                    <div className="trip-info-list">
                                        <div className="info-row"><span>Pickup</span><span>{selectedTrip.pickup}</span></div>
                                        <div className="info-row"><span>Destination</span><span>{selectedTrip.destination}</span></div>
                                        <div className="info-row"><span>Est. Duration</span><span>{selectedTrip.duration}</span></div>
                                        <div className="info-row"><span>Distance</span><span>{selectedTrip.distance}</span></div>
                                        <div className="info-row"><span>Status</span><StatusBadge status={selectedTrip.status} /></div>
                                    </div>
                                </div>
                                <div className="total-row"><span>Fare</span><span>{selectedTrip.fare}</span></div>
                                {selectedTrip.status === 'assigned' && (
                                    <div className="trip-actions">
                                        <button className="trip-action-btn cancel">Cancel Ride</button>
                                        <button className="trip-action-btn complete">Start Trip</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="empty-details"><Car size={48} /><h3>Select a Trip</h3><p>Choose a trip from the list to view its details.</p></div>
                    )}
                </div>
            </div>
        </div>
    );
};