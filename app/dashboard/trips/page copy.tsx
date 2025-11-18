'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Star, Car, Navigation, Receipt, MoreVertical, MapPin } from 'lucide-react';
import Map from '../../../components/dashboard/Map';
import './MyTrips.css';

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
    pickupCoords: { lat: number; lng: number };
    destinationCoords: { lat: number; lng: number };
}

export default function MyTripsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('completed');
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [trips, setTrips] = useState<Trip[]>([]);

    useEffect(() => {
        const loadTrips = () => {
            if (typeof window !== 'undefined') {
                const savedTrips = localStorage.getItem('userTrips');
                let parsedTrips: Trip[] = [];
                if (savedTrips) {
                    try {
                        const allTrips: Trip[] = JSON.parse(savedTrips);
                        const validTrips = allTrips.filter(trip => trip.driver && trip.pickup && trip.destination).map(trip => ({
                            ...trip,
                            pickupCoords: trip.pickupCoords || { lat: 6.5244, lng: 3.3792 },
                            destinationCoords: trip.destinationCoords || { lat: 6.4698, lng: 3.5852 }
                        }));
                        const uniqueTrips = validTrips.reduce((acc: Trip[], current) => {
                            if (!acc.find(item => item.id === current.id)) {
                                acc.push(current);
                            }
                            return acc;
                        }, []);
                        parsedTrips = uniqueTrips;
                    } catch (error) {
                        console.error('Error loading trips:', error);
                    }
                }
                setTrips(parsedTrips);
                 if (!selectedTrip && parsedTrips.length > 0) {
                    const firstTripInView = parsedTrips.find(t => t.status === activeTab);
                    setSelectedTrip(firstTripInView || parsedTrips[0]);
                }
            }
        };

        loadTrips();
    }, []);

    const filteredTrips = trips.filter(trip => activeTab === 'upcoming' ? trip.status === 'upcoming' : trip.status !== 'upcoming');
    
    useEffect(() => {
        if (!selectedTrip && filteredTrips.length > 0) {
            setSelectedTrip(filteredTrips[0]);
        } else if (selectedTrip && !filteredTrips.some(t => t.id === selectedTrip.id)) {
            setSelectedTrip(filteredTrips[0] || null);
        }
    }, [activeTab, trips, filteredTrips, selectedTrip]);


    const StatusBadge: React.FC<{ status: Trip['status'] }> = ({ status }) => {
        const statusClasses: { [key in Trip['status']]: string } = {
            completed: 'status-completed',
            upcoming: 'status-upcoming',
            cancelled: 'status-cancelled'
        };
        return <span className={`status-badge ${statusClasses[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formatTime = (timeString: string) => timeString.includes(':') ? timeString : new Date(timeString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <div className="my-trips-container">
            <header className="page-header">
                <h1 className="page-title">My Trips</h1>
                <p className="page-subtitle">Manage your rides and view trip history</p>
            </header>
            <div className="main-grid">
                <div className="trips-list-column">
                    <div className="tabs-container"><div className="tabs-wrapper">
                        {(['completed', 'upcoming'] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-button ${activeTab === tab ? 'active' : ''}`}>
                                {tab === 'upcoming' ? `Upcoming` : `History`}
                            </button>
                        ))}
                    </div></div>
                    <div className="trips-list">
                        {filteredTrips.length > 0 ? (
                            filteredTrips.map(trip => (
                                <div key={trip.id} className={`trip-card ${selectedTrip?.id === trip.id ? 'selected' : ''}`} onClick={() => setSelectedTrip(trip)}>
                                    <div className="trip-card-header">
                                        <div className="trip-card-icon"><Car size={24} /></div>
                                        <div>
                                            <p className="trip-destination">{trip.destination}</p>
                                            <p className="trip-date">{formatDate(trip.date)} at {formatTime(trip.time)}</p>
                                        </div>
                                        <div className="trip-price-status">
                                            <p className="trip-price">{trip.price}</p>
                                            <StatusBadge status={trip.status} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state"><Car size={48} /><h3 className="empty-title">{activeTab === 'upcoming' ? 'No Upcoming Rides' : 'No Trip History'}</h3><p className="empty-text">{activeTab === 'upcoming' ? "You don't have any upcoming rides." : 'Your past trips will appear here.'}</p>{activeTab === 'upcoming' && <button onClick={() => router.push('/dashboard/overview')} className="book-ride-btn">Book a Ride</button>}</div>
                        )}
                    </div>
                </div>
                <div className="details-sidebar">
                    {selectedTrip ? (
                        <div className="details-card">
                            <div className="details-header">
                                <h3 className="details-title">{selectedTrip.destination}</h3>
                                <button className="options-btn"><MoreVertical size={20} /></button>
                            </div>
                            <div className="details-map-container">
                               <Map 
                                 pickupCoords={selectedTrip.pickupCoords}
                                 destinationCoords={selectedTrip.destinationCoords}
                               />
                            </div>
                            <div className="details-sections">
                                <div>
                                    <h4 className="section-title">Driver & Vehicle</h4>
                                    <div className="driver-info-card">
                                        <div className="driver-icon"><Car size={20} /></div>
                                        <div className="driver-details"><p>{selectedTrip.driver}</p><p>{selectedTrip.car}</p></div>
                                        {selectedTrip.rating && <div className="driver-rating"><Star size={16} className="filled" /><span>{selectedTrip.rating}.0</span></div>}
                                    </div>
                                </div>
                                <div className="info-grid">
                                    <div className="info-item"><span>Distance</span><span>{selectedTrip.distance}</span></div>
                                    <div className="info-item"><span>Duration</span><span>{selectedTrip.duration}</span></div>
                                </div>
                                
                                <div className="total-row"><span>Total</span><span>{selectedTrip.price}</span></div>
                                
                                <div className="actions-section">
                                    {selectedTrip.status === 'upcoming' && (
                                        <div className="upcoming-actions">
                                            <button className="action-btn cancel">Cancel Ride</button>
                                            <button className="action-btn contact">Contact Driver</button>
                                        </div>
                                    )}
                                    {selectedTrip.status === 'completed' && (
                                        <div className="completed-actions">
                                            <button className="action-btn rebook">Book Again</button>
                                            <button className="action-btn receipt"><Receipt size={16} />Get Receipt</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-details"><Car size={48} /><h3>Select a Trip</h3><p>{trips.length > 0 ? 'Choose a trip from the list to view details' : 'No trips yet. Book your first ride!'}</p>{trips.length === 0 && <button onClick={() => router.push('/dashboard/overview')} className="book-ride-btn">Book First Ride</button>}</div>
                    )}
                </div>
            </div>
        </div>
    );
};
