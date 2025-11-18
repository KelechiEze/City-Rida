'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Map from '../../../components/dashboard/Map';
import { Wallet, Star, Zap, Map as MapIcon, Search, Loader, MapPin } from 'lucide-react';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; color: string }> = ({ icon, title, value, color }) => (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm flex items-center gap-4">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${color} flex-shrink-0`}>
            {icon}
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-gray-500 text-sm truncate">{title}</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">{value}</p>
        </div>
    </div>
);

// Popular Lagos locations for suggestions (not restrictions)
const POPULAR_LAGOS_LOCATIONS = [
    'Ikeja', 'Victoria Island', 'Lekki', 'Ajah', 'Surulere', 'Yaba', 'Ikoyi', 
    'Maryland', 'Gbagada', 'Oshodi', 'Mushin', 'Apapa', 'Agege', 'Ikorodu',
    'Badagry', 'Epe', 'Alimosho', 'Ifako-Ijaiye', 'Kosofe', 'Somolu', 'Lagos Island',
    'Amuwo-Odofin', 'Ojo', 'Ajeromi-Ifelodun', 'Shomolu', 'Mainland', 'Festac'
];

const Overview: React.FC = () => {
    const user = { name: 'Kelechi Eze' };
    const router = useRouter();
    const [destination, setDestination] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>('');

    // Function to validate if location is in Lagos using geocoding
    const validateLagosLocation = async (location: string): Promise<boolean> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location + ', Lagos, Nigeria')}&limit=1`
            );
            
            if (!response.ok) {
                throw new Error('Geocoding service unavailable');
            }
            
            const data = await response.json();
            
            if (data.length === 0) {
                return false;
            }
            
            // Check if the result is within Lagos State boundaries
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            
            // Lagos State approximate boundaries
            const isInLagos = lat >= 6.3 && lat <= 6.8 && lon >= 2.7 && lon <= 4.5;
            
            return isInLagos;
        } catch (error) {
            console.error('Geocoding error:', error);
            // If geocoding fails, allow the search to proceed but warn the user
            return true;
        }
    };

    // Function to get location suggestions from popular locations
    const getLocationSuggestions = (input: string) => {
        if (!input.trim()) {
            setLocationSuggestions([]);
            return;
        }
        
        const suggestions = POPULAR_LAGOS_LOCATIONS.filter(location =>
            location.toLowerCase().includes(input.toLowerCase())
        ).slice(0, 5);
        
        setLocationSuggestions(suggestions);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!destination.trim()) {
            setSearchError('Please enter a destination');
            return;
        }

        setSearchError('');
        setIsSearching(true);

        try {
            // Validate that the location is in Lagos
            const isValidLocation = await validateLagosLocation(destination);
            
            if (!isValidLocation) {
                setSearchError('Please enter a valid location within Lagos State');
                setIsSearching(false);
                return;
            }

            // Simulate search/processing for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Navigate to BookRide page with the destination as query parameter
            const params = new URLSearchParams({
                destination: destination,
                fromOverview: 'true'
            });
            
            router.push(`/dashboard/book?${params.toString()}`);
        } catch (error) {
            setSearchError('Unable to verify location. Please try again.');
            setIsSearching(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDestination(value);
        setSearchError('');
        setSelectedLocation('');
        
        if (value.trim()) {
            getLocationSuggestions(value);
        } else {
            setLocationSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setDestination(suggestion);
        setSelectedLocation(suggestion);
        setLocationSuggestions([]);
        setSearchError('');
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <header className="pt-2 md:pt-0">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Hello, {user.name}!</h1>
                <p className="text-gray-500 mt-1 text-sm md:text-base">Ready to book your next ride in Lagos? Let's go!</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    icon={<Wallet size={20} className="text-white"/>} 
                    title="My Wallet" 
                    value="₦90,500" 
                    color="bg-blue-500" 
                />
                <StatCard 
                    icon={<MapIcon size={20} className="text-white"/>} 
                    title="Total Rides" 
                    value="4" 
                    color="bg-green-500" 
                />
                <StatCard 
                    icon={<Star size={20} className="text-white"/>} 
                    title="Rating" 
                    value="4.8" 
                    color="bg-yellow-500" 
                />
                <StatCard 
                    icon={<Zap size={20} className="text-white"/>} 
                    title="Promo Codes" 
                    value="1" 
                    color="bg-purple-500" 
                />
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                {/* Map Section */}
                <div className="lg:col-span-2 h-[400px] md:h-[500px] lg:h-[60vh] bg-white p-3 md:p-4 rounded-2xl shadow-sm">
                   <div className="relative h-full w-full">
                     <Map />
                     <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 bg-white p-3 md:p-4 rounded-xl shadow-lg max-w-xs">
                        <h3 className="font-bold text-base md:text-lg">Find a Ride in Lagos</h3>
                        <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3">Enter any destination within Lagos State</p>
                        
                        <form onSubmit={handleSearch} className="space-y-2">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={destination}
                                    onChange={handleDestinationChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Enter any Lagos location..." 
                                    className="w-full pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
                                    disabled={isSearching}
                                />
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            
                            {/* Location Suggestions */}
                            {locationSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 mt-1 max-h-48 overflow-y-auto">
                                    {locationSuggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="w-full text-left px-4 py-2 hover:bg-yellow-50 flex items-center gap-2"
                                        >
                                            <MapPin size={14} className="text-gray-400" />
                                            <span className="text-sm">{suggestion}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            
                            {searchError && (
                                <p className={`text-xs ${searchError.includes('valid location') ? 'text-yellow-600' : 'text-red-500'}`}>
                                    {searchError}
                                </p>
                            )}
                            
                            <button 
                                type="submit"
                                disabled={isSearching || !destination.trim()}
                                className="w-full bg-[#FFC107] hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                {isSearching ? (
                                    <>
                                        <Loader size={18} className="animate-spin" />
                                        Finding Rides...
                                    </>
                                ) : (
                                    <>
                                        <Search size={18} />
                                        Find Rides
                                    </>
                                )}
                            </button>
                        </form>
                     </div>

                     {/* Overlay when searching */}
                     {isSearching && (
                         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl z-20">
                             <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
                                 <Loader size={32} className="animate-spin text-[#FFC107] mx-auto mb-4" />
                                 <h3 className="font-bold text-lg text-gray-800 mb-2">Finding Available Rides</h3>
                                 <p className="text-gray-600 text-sm">
                                     Searching for the best options to <strong>{destination}</strong>
                                 </p>
                                 <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                                     <div className="bg-[#FFC107] h-2 rounded-full animate-pulse"></div>
                                 </div>
                             </div>
                         </div>
                     )}
                   </div>
                </div>

                {/* Quick Actions & Recent Trips */}
                <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm flex flex-col space-y-4 md:space-y-6">
                    <div>
                        <h3 className="font-bold text-lg md:text-xl mb-3 md:mb-4">Quick Actions</h3>
                        <button 
                            onClick={() => router.push('/dashboard/book')}
                            className="w-full text-left p-3 md:p-4 mb-3 rounded-lg bg-yellow-100 text-yellow-800 font-semibold hover:bg-yellow-200 transition text-sm md:text-base"
                        >
                            Book a New Ride
                        </button>
                        <button className="w-full text-left p-3 md:p-4 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition text-sm md:text-base">
                            Schedule for Later
                        </button>
                    </div>
                    
                    <div className="flex-1">
                        <h3 className="font-bold text-lg md:text-xl mb-3 md:mb-4">Recent Trips</h3>
                        <div className="space-y-3 md:space-y-4 max-h-48 overflow-y-auto">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-sm md:text-base truncate">Ikeja to Victoria Island</p>
                                    <p className="text-xs md:text-sm text-gray-500">Yesterday, 5:30 PM</p>
                                </div>
                                <p className="ml-2 font-bold text-gray-800 text-sm md:text-base">₦4,500</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-sm md:text-base truncate">Lekki to Ajah</p>
                                    <p className="text-xs md:text-sm text-gray-500">Oct 12, 9:00 AM</p>
                                </div>
                                <p className="ml-2 font-bold text-gray-800 text-sm md:text-base">₦2,500</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;