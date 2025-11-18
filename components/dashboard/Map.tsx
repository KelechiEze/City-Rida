'use client';

import React, { useEffect, useRef, useState } from 'react';

const Map: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !mapContainerRef.current || mapInstanceRef.current) return;

        // Dynamically import Leaflet only on client side
        import('leaflet').then((L) => {
            // Fix for default markers in Next.js
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });

            // Center map on Lagos, Nigeria
            const map = L.default.map(mapContainerRef.current!).setView([6.5244, 3.3792], 10);

            L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const taxiIcon = L.default.icon({
                iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA1MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuNSAxOUMyLjQ2MjQzIDE5IDAgMTYuNTM3NiAwIDEzLjVDMCAxMC40NjI0IDIuNDYyNDMgOCA1LjUgOEg0NC41QzQ3LjUzNzYgOCA1MCAxMC40NjI0IDUwIDEzLjVDNTAgMTYuNTM3NiA0Ny41Mzc2IDE5IDQ0LjUgMTlIMzlMMzYuNSAyNEgxMy41TDExIDE5SDUuNVoiIGZpbGw9IiNGRkMxMDciLz4KPHBhdGggZD0iTTEyIDExQzEyIDkuODk1NDMgMTIuODk1NCA5IDE0IDlIMzZDMTcuMTA0NiA5IDM4IDkuODk1NDMgMzggMTFWMTlIMTJWMTEiIGZpbGw9IiMxMTExMTEiLz4KPGNpcmNsZSBjeD0iMTAiIGN5PSIyMiIgcj0iNCIgZmlsbD0iYmxhY2siIHN0cm9rZT0iI0ZGQzEwNyIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIyMiIgcj0iNCIgZmlsbD0iYmxhY2siIHN0cm9rZT0iI0ZGQzEwNyIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPC9zdmc+Cg==',
                iconSize: [38, 23],
                iconAnchor: [19, 23],
                popupAnchor: [0, -23]
            });
            
            // Lagos-specific cab locations
            const cabs = [
                { lat: 6.5244, lng: 3.3792, name: "Cab Ikeja" },
                { lat: 6.4550, lng: 3.3841, name: "Cab Victoria Island" },
                { lat: 6.6018, lng: 3.3515, name: "Cab Agege" },
                { lat: 6.4350, lng: 3.4487, name: "Cab Lekki" },
                { lat: 6.4698, lng: 3.5852, name: "Cab Ajah" },
            ];

            cabs.forEach(cab => {
                L.default.marker([cab.lat, cab.lng], { icon: taxiIcon })
                    .addTo(map)
                    .bindPopup(`<b>${cab.name}</b><br>Available for booking.`);
            });

            mapInstanceRef.current = map;

            // Handle map resize
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }).catch((error) => {
            console.error('Failed to load Leaflet:', error);
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [isClient]);

    if (!isClient) {
        return (
            <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-[#FFC107] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-600 text-sm">Loading map...</p>
                </div>
            </div>
        );
    }

    return <div ref={mapContainerRef} className="w-full h-full rounded-lg" />;
};

export default Map;