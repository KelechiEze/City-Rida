'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Map from '../../../components/dashboard/Map';
import { Wallet, Star, Zap, Map as MapIcon, Search } from 'lucide-react';
import './Overview.css';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; color: string }> = ({ icon, title, value, color }) => (
    <div className="stat-card">
        <div className={`stat-card-icon-wrapper ${color}`}>
            {icon}
        </div>
        <div className="stat-card-info">
            <p className="stat-card-title">{title}</p>
            <p className="stat-card-value">{value}</p>
        </div>
    </div>
);

export default function OverviewPage() {
    const user = { name: 'Kelechi Eze' };
    const router = useRouter();
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                }
            );
        }
    }, []);
    
    return (
        <div className="overview-container">
            <header className="page-header">
                <h1 className="page-title">Hello, {user.name}!</h1>
                <p className="page-subtitle">Ready for your next ride? Let's go!</p>
            </header>

            <div className="stats-grid">
                <StatCard icon={<Wallet size={20} />} title="My Wallet" value="₦90,500" color="bg-blue-500/20 text-blue-400" />
                <StatCard icon={<MapIcon size={20} />} title="Total Rides" value="4" color="bg-green-500/20 text-green-400" />
                <StatCard icon={<Star size={20} />} title="Rating" value="4.8" color="bg-yellow-500/20 text-yellow-400" />
                <StatCard icon={<Zap size={20} />} title="Promo Codes" value="1" color="bg-purple-500/20 text-purple-400" />
            </div>
            
            <div className="overview-map-wrapper">
                <Map userLocation={userLocation} />
                <div className="overview-map-overlay">
                    <div 
                        className="where-to-search-bar"
                        onClick={() => router.push('/dashboard/book')}
                    >
                        <Search size={20} className="where-to-icon" />
                        <span className="where-to-text">Where to?</span>
                    </div>
                </div>
            </div>
        </div>
    );
};