'use client';

import React, { useState } from 'react';
import { Power, DollarSign, Star, CheckCircle, BarChart, Bell, Car, MapPin, Clock } from 'lucide-react';
import Map from '../../../../components/dashboard/Map';
import './RiderOverview.css';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; color: string }> = ({ icon, title, value, color }) => (
    <div className="rider-stat-card">
        <div className={`rider-stat-icon ${color}`}>
            {icon}
        </div>
        <div>
            <p className="rider-stat-value">{value}</p>
            <p className="rider-stat-title">{title}</p>
        </div>
    </div>
);

const IncomingRequestCard: React.FC = () => (
    <div className="request-card">
        <div className="request-header">
            <div className="request-timer"></div>
            <span>New Ride Request</span>
        </div>
        <div className="request-details">
            <div className="request-location">
                <MapPin size={16} className="text-green-500" />
                <span>Ikeja City Mall</span>
            </div>
            <div className="request-location">
                <MapPin size={16} className="text-red-500" />
                <span>Murtala Muhammed Airport</span>
            </div>
        </div>
        <div className="request-info">
            <span><strong>Fare:</strong> ₦3,500</span>
            <span><strong>Distance:</strong> 8.2 km</span>
            <span><strong>ETA:</strong> 25 mins</span>
        </div>
        <div className="request-actions">
            <button className="decline-btn">Decline</button>
            <button className="accept-btn">Accept</button>
        </div>
    </div>
);


export default function RiderOverviewPage() {
    const [isOnline, setIsOnline] = useState(false);
    // Mock driver's current location for the map
    const driverLocation = { lat: 6.5244, lng: 3.3792 };

    return (
        <div className="rider-overview-container">
            <header className="rider-page-header">
                <div>
                    <h1 className="rider-page-title">Dashboard</h1>
                    <p className="rider-page-subtitle">Welcome back, Kelechi!</p>
                </div>
                <div className="online-toggle-wrapper">
                    <span className={`status-text ${isOnline ? 'online' : 'offline'}`}>
                        {isOnline ? 'You are Online' : 'You are Offline'}
                    </span>
                    <label className="online-toggle">
                        <input type="checkbox" checked={isOnline} onChange={() => setIsOnline(!isOnline)} />
                        <span className="slider"></span>
                        <Power size={16} className="icon-on" />
                        <Power size={16} className="icon-off" />
                    </label>
                </div>
            </header>
            
            <div className="rider-stats-grid">
                <StatCard icon={<DollarSign size={20} />} title="Today's Earnings" value="₦12,500" color="bg-green-100 text-green-700" />
                <StatCard icon={<Star size={20} />} title="Your Rating" value="4.9" color="bg-yellow-100 text-yellow-700" />
                <StatCard icon={<CheckCircle size={20} />} title="Acceptance" value="92%" color="bg-blue-100 text-blue-700" />
                <StatCard icon={<Car size={20} />} title="Rides Today" value="5" color="bg-indigo-100 text-indigo-700" />
            </div>

            <div className="rider-main-grid">
                <div className="main-content-col rider-map-col">
                    <Map driverLocation={driverLocation} userLocation={driverLocation} />
                </div>
                <div className="sidebar-col">
                     <h2 className="section-title">
                        {isOnline ? 'Incoming Requests' : 'Go Online'}
                    </h2>
                    {isOnline ? (
                        <div className="requests-container">
                           <IncomingRequestCard />
                           <IncomingRequestCard />
                        </div>
                    ) : (
                        <div className="offline-card">
                            <div className="offline-icon">
                                <Power size={32} />
                            </div>
                            <h3>You Are Currently Offline</h3>
                            <p>Toggle the switch to go online and start receiving ride requests.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};