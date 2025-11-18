'use client';
import React, { useEffect, useRef, useState } from 'react';

declare const L: any;

interface MapProps {
    pickupCoords?: { lat: number, lng: number } | null;
    destinationCoords?: { lat: number, lng: number } | null;
    driverLocation?: { lat: number, lng: number } | null;
    userLocation?: { lat: number, lng: number } | null;
    onRouteCalculated?: (details: { distance: number, duration: number }) => void;
}

const Map: React.FC<MapProps> = ({ 
    pickupCoords, 
    destinationCoords, 
    driverLocation, 
    userLocation,
    onRouteCalculated 
}) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const routingControlRef = useRef<any>(null);
    const driverMarkerRef = useRef<any>(null);
    const userMarkerRef = useRef<any>(null);
    const [leafletLoaded, setLeafletLoaded] = useState(false);

    // Load Leaflet scripts and styles
    useEffect(() => {
        // Check if already loaded
        if (typeof window === 'undefined') return;
        
        if ((window as any).L && (window as any).L.Routing) {
            setLeafletLoaded(true);
            return;
        }

        let leafletCssLoaded = false;
        let leafletJsLoaded = false;
        let routingJsLoaded = false;

        const checkAllLoaded = () => {
            if (leafletCssLoaded && leafletJsLoaded && routingJsLoaded) {
                setLeafletLoaded(true);
            }
        };

        // Load Leaflet CSS
        if (!document.getElementById('leaflet-css')) {
            const leafletCss = document.createElement('link');
            leafletCss.id = 'leaflet-css';
            leafletCss.rel = 'stylesheet';
            leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            leafletCss.onload = () => {
                leafletCssLoaded = true;
                checkAllLoaded();
            };
            leafletCss.onerror = () => {
                console.error('Failed to load Leaflet CSS');
                leafletCssLoaded = true;
                checkAllLoaded();
            };
            document.head.appendChild(leafletCss);
        } else {
            leafletCssLoaded = true;
        }

        // Load Leaflet JS
        if (!document.getElementById('leaflet-js')) {
            const leafletJs = document.createElement('script');
            leafletJs.id = 'leaflet-js';
            leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            leafletJs.async = true;
            leafletJs.onload = () => {
                leafletJsLoaded = true;
                // Now load routing machine after Leaflet is loaded
                loadRoutingMachine();
            };
            leafletJs.onerror = () => {
                console.error('Failed to load Leaflet JS');
                leafletJsLoaded = true;
                checkAllLoaded();
            };
            document.body.appendChild(leafletJs);
        } else {
            leafletJsLoaded = true;
            if ((window as any).L) {
                loadRoutingMachine();
            }
        }

        function loadRoutingMachine() {
            // Load Leaflet Routing Machine
            if (!document.getElementById('leaflet-routing-machine-js')) {
                const routingJs = document.createElement('script');
                routingJs.id = 'leaflet-routing-machine-js';
                routingJs.src = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js';
                routingJs.async = true;
                routingJs.onload = () => {
                    routingJsLoaded = true;
                    checkAllLoaded();
                };
                routingJs.onerror = () => {
                    console.error('Failed to load Leaflet Routing Machine');
                    routingJsLoaded = true;
                    checkAllLoaded();
                };
                document.body.appendChild(routingJs);
            } else {
                routingJsLoaded = true;
                checkAllLoaded();
            }
        }

        checkAllLoaded();
    }, []);

    // Initialize map
    useEffect(() => {
        if (!leafletLoaded || !mapContainerRef.current || mapInstanceRef.current) return;

        try {
            // Initialize map
            mapInstanceRef.current = L.map(mapContainerRef.current).setView([6.5244, 3.3792], 12);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(mapInstanceRef.current);

            // Add error handling for tile layer
            mapInstanceRef.current.on('tileerror', function(error: any) {
                console.warn('Tile loading error:', error);
            });

        } catch (error) {
            console.error('Error initializing map:', error);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [leafletLoaded]);

    // Update map with coordinates and routing
    useEffect(() => {
        if (!leafletLoaded || !mapInstanceRef.current) return;

        const map = mapInstanceRef.current;

        // Clear existing routing control
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
            routingControlRef.current = null;
        }

        // Clear existing markers
        if (driverMarkerRef.current) {
            map.removeLayer(driverMarkerRef.current);
            driverMarkerRef.current = null;
        }
        if (userMarkerRef.current) {
            map.removeLayer(userMarkerRef.current);
            userMarkerRef.current = null;
        }

        // Add user marker
        if (userLocation) {
            const userIcon = L.divIcon({
                className: 'user-marker',
                html: `<div style="width: 12px; height: 12px; background: #4285F4; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });
            userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { 
                icon: userIcon,
                zIndexOffset: 1000 
            }).addTo(map);
        }

        // Add driver marker
        if (driverLocation) {
            const taxiIcon = L.divIcon({
                className: 'driver-marker',
                html: `<div style="width: 24px; height: 24px; background: #FFC107; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3); font-size: 12px; color: black;">🚗</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });
            driverMarkerRef.current = L.marker([driverLocation.lat, driverLocation.lng], { 
                icon: taxiIcon,
                zIndexOffset: 900 
            }).addTo(map);
        }

        // Add routing if we have both pickup and destination
        if (pickupCoords && destinationCoords && L.Routing) {
            try {
                routingControlRef.current = L.Routing.control({
                    waypoints: [
                        L.latLng(pickupCoords.lat, pickupCoords.lng),
                        L.latLng(destinationCoords.lat, destinationCoords.lng)
                    ],
                    routeWhileDragging: false,
                    addWaypoints: false,
                    draggableWaypoints: false,
                    fitSelectedRoutes: true,
                    show: false, // Hide the instructions panel
                    lineOptions: { 
                        styles: [{ color: '#FFC107', weight: 6, opacity: 0.8 }] 
                    },
                    createMarker: () => null // Hide default markers
                }).on('routesfound', function(e: any) {
                    if (onRouteCalculated && e.routes && e.routes[0]) {
                        const route = e.routes[0];
                        onRouteCalculated({
                            distance: route.summary.totalDistance / 1000, // in km
                            duration: route.summary.totalTime / 60, // in minutes
                        });
                    }
                }).addTo(map);
            } catch (error) {
                console.error('Error setting up routing:', error);
            }
        }

        // Fit bounds to show all relevant markers
        const group = new L.FeatureGroup();
        if (userMarkerRef.current) group.addLayer(userMarkerRef.current);
        if (driverMarkerRef.current) group.addLayer(driverMarkerRef.current);
        
        if (group.getLayers().length > 0) {
            map.fitBounds(group.getBounds().pad(0.1));
        }

    }, [pickupCoords, destinationCoords, driverLocation, userLocation, leafletLoaded, onRouteCalculated]);

    return (
        <div 
            ref={mapContainerRef} 
            className="leaflet-container" 
            style={{ 
                height: '100%', 
                width: '100%',
                background: '#f8f9fa' // Fallback background
            }} 
        />
    );
};

export default Map;