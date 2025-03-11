"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PollutionData {
    aqius: number;
    mainus: string;
    aqicn: number;
    maincn: string;
    timestamp: string;
}

interface PollutantComponents {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
}

interface AQIData {
    city?: string;
    state?: string;
    country?: string;
    location: {
        lat: number;
        lon: number;
    };
    pollution: PollutionData;
    components: PollutantComponents;
}

export default function AQITrackingPage() {
    const [aqiData, setAqiData] = useState<AQIData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [location, setLocation] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Function to determine health advice based on AQI level
    const getHealthAdvice = (aqi: number) => {
        if (aqi <= 50) return "Air quality is satisfactory, and air pollution poses little or no risk.";
        if (aqi <= 100) return "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.";
        if (aqi <= 150) return "Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
        if (aqi <= 200) return "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.";
        if (aqi <= 300) return "Health alert: The risk of health effects is increased for everyone.";
        return "Health warning of emergency conditions: everyone is more likely to be affected.";
    };

    // Function to get AQI category color class based on AQI level
    const getAQICategoryColorClass = (aqi: number) => {
        if (aqi <= 50) return "bg-green-500";
        if (aqi <= 100) return "bg-yellow-500";
        if (aqi <= 150) return "bg-orange-500";
        if (aqi <= 200) return "bg-red-500";
        if (aqi <= 300) return "bg-purple-500";
        return "bg-pink-800";
    };

    // Function to get AQI category name
    const getAQICategory = (aqi: number) => {
        if (aqi <= 50) return "Good";
        if (aqi <= 100) return "Moderate";
        if (aqi <= 150) return "Unhealthy for Sensitive Groups";
        if (aqi <= 200) return "Unhealthy";
        if (aqi <= 300) return "Very Unhealthy";
        return "Hazardous";
    };

    // Get pollutant name from code
    const getPollutantName = (code: string) => {
        const pollutants: { [key: string]: string } = {
            'p1': 'PM10',
            'p2': 'PM2.5',
            'pm10': 'PM10',
            'pm25': 'PM2.5',
            'o3': 'Ozone',
            'n2': 'Nitrogen Dioxide',
            'no2': 'Nitrogen Dioxide',
            'so2': 'Sulfur Dioxide',
            'co': 'Carbon Monoxide'
        };

        return pollutants[code] || code;
    };

    // Function to fetch data based on location name
    const fetchDataByLocationName = React.useCallback(async (locationName: string) => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            // First, geocode the location to get coordinates
            const geocodeResponse = await fetch(`https://airbuddy-backend.vercel.app/api/geocode?location=${encodeURIComponent(locationName)}`);
            const geocodeData = await geocodeResponse.json();

            if (!geocodeResponse.ok) {
                throw new Error(geocodeData.error || "Failed to find location");
            }

            // Then fetch AQI data using the coordinates
            const { lat, lon, display_name } = geocodeData;
            const aqiResponse = await fetch(`https://airbuddy-backend.vercel.app/api/aqi?lat=${lat}&lon=${lon}`);
            const aqiResponseData = await aqiResponse.json();

            if (!aqiResponse.ok) {
                throw new Error(aqiResponseData.error || "Failed to fetch AQI data");
            }

            setAqiData(aqiResponseData);
            setLocation(display_name);
        } catch (error) {
            console.error("Error fetching data:", error);
            setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Handle location search
    const handleLocationSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            fetchDataByLocationName(searchQuery);
        }
    };

    // Initial data fetch - using user's current position
    useEffect(() => {
        const getCurrentLocationData = async () => {
            setIsLoading(true);

            try {
                // Try to get user's current position
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;

                            // Fetch AQI data using coordinates
                            try {
                                const aqiResponse = await fetch(`https://airbuddy-backend.vercel.app/api/aqi?lat=${latitude}&lon=${longitude}`);
                                const aqiResponseData = await aqiResponse.json();

                                if (!aqiResponse.ok) {
                                    throw new Error(aqiResponseData.error || "Failed to fetch AQI data");
                                }

                                setAqiData(aqiResponseData);
                                
                                // Try to get location name from reverse geocoding
                                try {
                                    const geocodeResponse = await fetch(`https://airbuddy-backend.vercel.app/api/geocode?location=${latitude},${longitude}`);
                                    const geocodeData = await geocodeResponse.json();
                                    if (geocodeResponse.ok) {
                                        setLocation(geocodeData.display_name);
                                    } else {
                                        setLocation(`Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                                    }
                                } catch {
                                    setLocation(`Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                                }
                            } catch (error) {
                                console.error("Error fetching AQI data:", error);
                                setErrorMessage(error instanceof Error ? error.message : "Failed to fetch AQI data");
                            } finally {
                                setIsLoading(false);
                            }
                        },
                        (error) => {
                            console.error("Geolocation error:", error);
                            // Fallback to a default location if user denies location permission
                            fetchDataByLocationName("Government Engineering College Palakkad, Kerala, India");
                        }
                    );
                } else {
                    // Browser doesn't support geolocation
                    fetchDataByLocationName("Government Engineering College Palakkad, Kerala, India");
                }
            } catch (error) {
                console.error("Error:", error);
                setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
                setIsLoading(false);
            }
        };

        getCurrentLocationData();
    }, [fetchDataByLocationName]);

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

                <main>
                    {/* Location Selection */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Your Location</h2>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 font-semibold mb-3">{location}</p>

                        <form onSubmit={handleLocationSearch} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search location..."
                                className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Search
                            </button>
                        </form>

                        {errorMessage && (
                            <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
                        )}
                    </div>

                    {/* Current AQI Display */}
                    {isLoading ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 text-center">
                            <p className="text-gray-600 dark:text-gray-300">Loading AQI data...</p>
                        </div>
                    ) : aqiData ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                            <div className="flex flex-col md:flex-row items-center">
                                <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
                                    <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Current Air Quality</h1>
                                    <div className="flex items-center justify-center md:justify-start">
                                        <div className={`${getAQICategoryColorClass(aqiData.pollution.aqius)} w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4`}>
                                            {aqiData.pollution.aqius}
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold">{getAQICategory(aqiData.pollution.aqius)}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Updated: {new Date(aqiData.pollution.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                                    <h3 className="text-md font-medium mb-2">Health Advice</h3>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {getHealthAdvice(aqiData.pollution.aqius)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 text-center">
                            <p className="text-gray-600 dark:text-gray-300">No AQI data available. Please try another location.</p>
                        </div>
                    )}

                    {/* Pollutant Details - Using actual data from API */}
                    {!isLoading && aqiData && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Main Pollutant Data</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h3 className="text-sm uppercase font-medium text-gray-600 dark:text-gray-400 mb-2">US Standard</h3>
                                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                        {getPollutantName(aqiData.pollution.mainus)}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        AQI: {aqiData.pollution.aqius} (US EPA Standard)
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h3 className="text-sm uppercase font-medium text-gray-600 dark:text-gray-400 mb-2">Chinese Standard</h3>
                                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                        {getPollutantName(aqiData.pollution.maincn || aqiData.pollution.mainus)}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        AQI: {aqiData.pollution.aqicn} (China MEP Standard)
                                    </p>
                                </div>
                            </div>

                            {/* Display detailed component data */}
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Pollutant Components</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                {aqiData.components && (
                                    <>
                                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                            <h3 className="text-sm uppercase font-medium text-gray-600 dark:text-gray-400 mb-1">PM2.5</h3>
                                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                {aqiData.components.pm2_5} μg/m³
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                            <h3 className="text-sm uppercase font-medium text-gray-600 dark:text-gray-400 mb-1">PM10</h3>
                                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                {aqiData.components.pm10} μg/m³
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                            <h3 className="text-sm uppercase font-medium text-gray-600 dark:text-gray-400 mb-1">Ozone (O₃)</h3>
                                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                {aqiData.components.o3} μg/m³
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                            <h3 className="text-sm uppercase font-medium text-gray-600 dark:text-gray-400 mb-1">NO₂</h3>
                                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                {aqiData.components.no2} μg/m³
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                            <h3 className="text-sm uppercase font-medium text-gray-600 dark:text-gray-400 mb-1">SO₂</h3>
                                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                {aqiData.components.so2} μg/m³
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                            <h3 className="text-sm uppercase font-medium text-gray-600 dark:text-gray-400 mb-1">CO</h3>
                                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                {aqiData.components.co} μg/m³
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                            <h3 className="text-sm uppercase font-medium text-gray-600 dark:text-gray-400 mb-1">NO</h3>
                                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                {aqiData.components.no} μg/m³
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                            <h3 className="text-sm uppercase font-medium text-gray-600 dark:text-gray-400 mb-1">NH₃</h3>
                                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                {aqiData.components.nh3} μg/m³
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
