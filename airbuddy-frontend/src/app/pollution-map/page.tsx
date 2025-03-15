"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
const L = typeof window !== 'undefined' ? require('leaflet') : null;

// Define interfaces for type safety
interface Location {
    lat: number;
    lon: number;
    name: string;
}

interface PollutionData {
    aqius: number;
    mainus: string;
    timestamp: string;
}

interface AQIData {
    location: Location;
    pollution: PollutionData;
}

interface ForecastDataPoint {
    day: string;
    avg: number;
    max: number;
    min: number;
}

interface ForecastData {
    location: string;
    forecast: {
        pm25?: ForecastDataPoint[];
        pm10?: ForecastDataPoint[];
        o3?: ForecastDataPoint[];
    };
}

interface CustomMarkerProps {
    position: [number, number];
    color: string;
    children: React.ReactNode;
}

interface FlyToLocationProps {
    position: [number, number] | null;
}

// Custom hook to handle map click events
function useMapClick(callback: (lat: number, lon: number) => void) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            callback(lat, lng);
        }
    });
    return null;
}

// Fix Leaflet icon issues
const CustomMarker = ({ position, color, children }: CustomMarkerProps) => {
    if (!L) return null;
    const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 1px rgba(0,0,0,0.2);"></div>`,
        iconSize: [24, 24],
    });

    return (
        <Marker position={position} icon={icon}>
            {children}
        </Marker>
    );
};

// Component to fly to user location
function FlyToLocation({ position }: FlyToLocationProps) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, 3, {
                animate: true,
                duration: 1.5
            });
        }
    }, [map, position]);

    return null;
}

export default function PollutionMap() {
    const [aqiData, setAqiData] = useState<AQIData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [showForecast, setShowForecast] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isClient, setIsClient] = useState(false);
    const mapRef = useRef(null);

    // Set client-side flag to avoid SSR issues (e.g. window is not defined)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsClient(true);
        }
    }, []);

    // Function to get AQI category and color based on AQI level
    const getAQIInfo = (aqi: number) => {
        if (aqi <= 50) return { category: "Good", color: "#00E400", textColor: "text-black" };
        if (aqi <= 100) return { category: "Moderate", color: "#FFFF00", textColor: "text-black" };
        if (aqi <= 150) return { category: "Unhealthy for Sensitive Groups", color: "#FF7E00", textColor: "text-white" };
        if (aqi <= 200) return { category: "Unhealthy", color: "#FF0000", textColor: "text-white" };
        if (aqi <= 300) return { category: "Very Unhealthy", color: "#8F3F97", textColor: "text-white" };
        return { category: "Hazardous", color: "#7E0023", textColor: "text-white" };
    };

    // Fetch all AQI data at once using the map endpoint
    const fetchAQIMapData = useCallback(async (locations: Location[] = []) => {
        try {
            // Create custom locations parameter
            const locationsParam = JSON.stringify(locations);
            const response = await fetch(`https://airbuddy-backend.vercel.app/api/aqi/map?locations=${encodeURIComponent(locationsParam)}`);

            if (!response.ok) throw new Error('Failed to fetch map data');

            const data = await response.json();
            return data;
        } catch (err) {
            console.error("Error fetching map data:", err);
            throw err;
        }
    }, []);

    // Function to handle map clicks
    const handleMapClick = async (lat: number, lon: number) => {
        try {
            setLoading(true);
            const response = await fetch(`https://airbuddy-backend.vercel.app/api/aqi/point?lat=${lat}&lon=${lon}`);

            if (!response.ok) throw new Error('Failed to fetch point data');

            // Fetch forecast for this point
            fetchForecast(lat, lon);
        } catch (err) {
            console.error("Error fetching point data:", err);
            setError("Failed to load data for clicked location.");
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch forecast data
    const fetchForecast = async (lat: number, lon: number) => {
        try {
            const response = await fetch(`https://airbuddy-backend.vercel.app/api/aqi/forecast?lat=${lat}&lon=${lon}`);

            if (!response.ok) throw new Error('Failed to fetch forecast data');

            const data = await response.json();
            setForecastData(data);
            setShowForecast(true);
        } catch (err) {
            console.error("Error fetching forecast data:", err);
        }
    };

    // Function to handle location search
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            const response = await fetch(`https://airbuddy-backend.vercel.app/api/geocode?location=${encodeURIComponent(searchQuery)}`);

            if (!response.ok) throw new Error('Failed to geocode location');

            const data = await response.json();
            setUserLocation([parseFloat(data.lat), parseFloat(data.lon)]);

            // Fetch AQI for this location
            handleMapClick(parseFloat(data.lat), parseFloat(data.lon));
        } catch (err) {
            console.error("Error geocoding location:", err);
            setError("Location not found. Please try a different search term.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch AQI data along with cities data (from every state of every country and Kerala)
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);

            try {
                // Fetch cities data from your API endpoint.
                // This endpoint should return an array of objects with { lat, lon, name } for every main city of every state across 198 countries (including Kerala).
                const citiesResponse = await fetch('https://airbuddy-backend.vercel.app/api/cities');
                if (!citiesResponse.ok) throw new Error('Failed to fetch cities data');
                const citiesData: Location[] = await citiesResponse.json();

                // Get user's location if available
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            const userLat = position.coords.latitude;
                            const userLon = position.coords.longitude;
                            setUserLocation([userLat, userLon]);

                            // Add user's location to the beginning of citiesData
                            citiesData.unshift({
                                lat: userLat,
                                lon: userLon,
                                name: "Your Location"
                            });
                        },
                        () => {
                            console.log("Unable to get user's location");
                        }
                    );
                }

                // Fetch all AQI data using the citiesData
                const results = await fetchAQIMapData(citiesData);
                setAqiData(results);
            } catch (err) {
                console.error("Error loading map data:", err);
                setError("Failed to load pollution data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [fetchAQIMapData]);

    // Render forecast data if available
    const renderForecast = () => {
        if (!forecastData || !showForecast) return null;

        return (
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">5-Day AQI Forecast for {forecastData.location}</h3>
                    <button
                        onClick={() => setShowForecast(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {forecastData.forecast.pm25 && (
                    <div className="mb-4">
                        <h4 className="font-medium mb-2">PM2.5 Forecast</h4>
                        <div className="flex overflow-x-auto pb-2 space-x-4">
                            {forecastData.forecast.pm25.map((day, i) => {
                                const date = new Date(day.day);
                                const { color } = getAQIInfo(day.avg);
                                return (
                                    <div key={i} className="flex-shrink-0 w-24 p-2 border rounded-lg text-center bg-gray-50 dark:bg-gray-700">
                                        <p className="text-sm font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                        <div className="my-2 mx-auto w-8 h-8 rounded-full" style={{ backgroundColor: color }}></div>
                                        <p className="text-xl font-bold">{Math.round(day.avg)}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {Math.round(day.min)}-{Math.round(day.max)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // MapClickHandler component to capture clicks
    const MapClickHandler = () => {
        useMapClick((lat, lon) => {
            handleMapClick(lat, lon);
        });
        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-950">
            <div className="container mx-auto px-4 py-8">
                {/* Header with Back Button */}
                <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                    <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">Air Quality Map</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Explore air quality levels around the world. Click on markers to see detailed information.
                    </p>

                    {/* Search form */}
                    <form onSubmit={handleSearch} className="flex mb-6">
                        <input
                            type="text"
                            placeholder="Search for a location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Search
                        </button>
                    </form>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                            {error}
                        </div>
                    )}

                    {/* Map container */}
                    <div className="w-full h-[500px] rounded-lg overflow-hidden relative">
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 z-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        )}

                        {/* Render map only on client side */}
                        {isClient && (
                            <MapContainer
                                center={[20, 0]}
                                zoom={2}
                                style={{ height: '100%', width: '100%' }}
                                scrollWheelZoom={true}
                                ref={mapRef}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {userLocation && <FlyToLocation position={userLocation} />}
                                <MapClickHandler />

                                {aqiData.map((data, index) => {
                                    if (!data.location) return null;
                                    const { lat, lon, name } = data.location;
                                    const { aqius } = data.pollution;
                                    const { color, category } = getAQIInfo(aqius);

                                    return (
                                        <CustomMarker
                                            key={index}
                                            position={[lat, lon] as [number, number]}
                                            color={color}
                                        >
                                            <Popup>
                                                <div>
                                                    <h3 className="font-bold">{name}</h3>
                                                    <p>AQI: {aqius} - {category}</p>
                                                    <p>Updated: {new Date(data.pollution.timestamp).toLocaleString()}</p>
                                                    <button
                                                        className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                                        onClick={() => fetchForecast(lat, lon)}
                                                    >
                                                        View Forecast
                                                    </button>
                                                </div>
                                            </Popup>
                                        </CustomMarker>
                                    );
                                })}
                            </MapContainer>
                        )}
                    </div>

                    {/* Forecast Display */}
                    {renderForecast()}

                    {/* Legend */}
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Air Quality Index Legend</h3>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                            {[
                                { aqi: 25, label: "Good" },
                                { aqi: 75, label: "Moderate" },
                                { aqi: 125, label: "Unhealthy for Sensitive Groups" },
                                { aqi: 175, label: "Unhealthy" },
                                { aqi: 250, label: "Very Unhealthy" },
                                { aqi: 350, label: "Hazardous" }
                            ].map((item, index) => {
                                const { color } = getAQIInfo(item.aqi);
                                return (
                                    <div key={index} className="flex items-center">
                                        <div
                                            className="w-6 h-6 rounded-full mr-2"
                                            style={{ backgroundColor: color }}
                                        ></div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
