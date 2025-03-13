"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface ForecastDay {
    day: string;
    aqi: number;
    mainPollutant: string;
    components: {
        pm2_5_avg?: number;
        pm2_5_min?: number;
        pm2_5_max?: number;
        pm10_avg?: number;
        pm10_min?: number;
        pm10_max?: number;
        o3_avg?: number;
        o3_min?: number;
        o3_max?: number;
        no2_avg?: number;
        no2_min?: number;
        no2_max?: number;
        so2_avg?: number;
        so2_min?: number;
        so2_max?: number;
        [key: string]: number | undefined;
    };
}

interface AQIForecastData {
    location: {
        lat: number;
        lon: number;
        name: string;
    };
    current: {
        aqi: number;
        mainPollutant: string;
        timestamp: string;
        components: {
            co: number;
            no: number;
            no2: number;
            o3: number;
            so2: number;
            pm2_5: number;
            pm10: number;
            nh3: number;
        };
    };
    forecast: ForecastDay[];
}

export default function ForecastPage() {
    const [forecastData, setForecastData] = useState<AQIForecastData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [location, setLocation] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedPollutant, setSelectedPollutant] = useState("pm2_5");

    // Function to get AQI category name based on AQI level
    const getAQICategory = (aqi: number) => {
        if (aqi <= 50) return "Good";
        if (aqi <= 100) return "Moderate";
        if (aqi <= 150) return "Unhealthy for Sensitive Groups";
        if (aqi <= 200) return "Unhealthy";
        if (aqi <= 300) return "Very Unhealthy";
        return "Hazardous";
    };

    // Function to get color class based on AQI level
    const getAQICategoryColorClass = (aqi: number) => {
        if (aqi <= 50) return "bg-green-500";
        if (aqi <= 100) return "bg-yellow-500";
        if (aqi <= 150) return "bg-orange-500";
        if (aqi <= 200) return "bg-red-500";
        if (aqi <= 300) return "bg-purple-500";
        return "bg-pink-800";
    };

    // Function to get formatted date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to get pollutant display name
    const getPollutantDisplayName = (code: string) => {
        const pollutants: { [key: string]: string } = {
            'pm2_5': 'PM2.5',
            'pm10': 'PM10',
            'o3': 'Ozone',
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

            setForecastData(aqiResponseData);
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
        let isMounted = true;

        const getCurrentLocationData = async () => {
            if (!isMounted) return;
            setIsLoading(true);

            try {
                // Check if we're in a browser environment and geolocation is available
                if (typeof window !== 'undefined' && navigator.geolocation) {
                    const geolocationPromise = new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            timeout: 10000,
                            maximumAge: 60000,
                            enableHighAccuracy: false
                        });
                    });

                    try {
                        const position = await geolocationPromise;

                        if (!isMounted) return;

                        const { latitude, longitude } = position.coords;

                        try {
                            const aqiResponse = await fetch(`https://airbuddy-backend.vercel.app/api/aqi?lat=${latitude}&lon=${longitude}`);
                            if (!isMounted) return;

                            const aqiResponseData = await aqiResponse.json();

                            if (!aqiResponse.ok) {
                                throw new Error(aqiResponseData.error || "Failed to fetch AQI data");
                            }

                            if (isMounted) setForecastData(aqiResponseData);

                            // Try to get location name from reverse geocoding
                            try {
                                const geocodeResponse = await fetch(`https://airbuddy-backend.vercel.app/api/geocode?location=${latitude},${longitude}`);
                                if (!isMounted) return;

                                const geocodeData = await geocodeResponse.json();
                                if (geocodeResponse.ok && isMounted) {
                                    setLocation(geocodeData.display_name);
                                } else if (isMounted) {
                                    setLocation(`Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                                }
                            } catch {
                                if (isMounted) {
                                    setLocation(`Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                                }
                            }
                        } catch (error) {
                            console.error("Error fetching AQI data:", error);
                            if (isMounted) {
                                setErrorMessage(error instanceof Error ? error.message : "Failed to fetch AQI data");
                                // Fallback to default location if AQI fetch fails
                                fetchDataByLocationName("Government Engineering College Palakkad, Kerala, India");
                            }
                        }
                    } catch (error) {
                        console.error("Error getting current position:", error);
                        if (isMounted) {
                            setErrorMessage(error instanceof Error ? error.message : "Failed to get current position");
                            // Fallback to default location if geolocation fails
                            fetchDataByLocationName("Government Engineering College Palakkad, Kerala, India");
                        }
                    }
                } else {
                    // Fallback to default location if geolocation is not available
                    fetchDataByLocationName("Government Engineering College Palakkad, Kerala, India");
                }
            } catch (error) {
                console.error("Error in getCurrentLocationData:", error);
                if (isMounted) {
                    setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        getCurrentLocationData();

        return () => {
            isMounted = false;
        };
    }, [fetchDataByLocationName]);

    // Prepare chart data if forecast data is available
    const chartData = React.useMemo(() => {
        if (!forecastData || !forecastData.forecast || forecastData.forecast.length === 0) {
            return null;
        }

        const labels = forecastData.forecast.map(day => formatDate(day.day));

        // Select appropriate value based on the pollutant and availability
        const datapoints = forecastData.forecast.map(day => {
            const avgKey = `${selectedPollutant}_avg`;
            const maxKey = `${selectedPollutant}_max`;
            const minKey = `${selectedPollutant}_min`;

            // Prefer average, fallback to max or min
            return day.components[avgKey] ?? day.components[maxKey] ?? day.components[minKey] ?? 0;
        });

        return {
            labels,
            datasets: [
                {
                    label: getPollutantDisplayName(selectedPollutant),
                    data: datapoints,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                }
            ],
        };
    }, [forecastData, selectedPollutant]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Air Quality Forecast',
            },
        },
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
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Air Quality Forecast</h1>
                </div>

                <main>
                    {/* Location Selection */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Your Location</h2>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 font-semibold mb-3">
                            {location || (forecastData?.location?.name ? forecastData.location.name : "Unknown location")}
                        </p>

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

                    {/* Current AQI Summary */}
                    {isLoading ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 text-center">
                            <p className="text-gray-600 dark:text-gray-300">Loading forecast data...</p>
                        </div>
                    ) : forecastData ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Current Air Quality</h2>
                            <div className="flex flex-col md:flex-row md:items-center mb-4">
                                <div className="flex-1 mb-4 md:mb-0">
                                    <div className="flex items-center">
                                        <div className={`${getAQICategoryColorClass(forecastData.current.aqi)} w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4`}>
                                            {forecastData.current.aqi}
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                                {getAQICategory(forecastData.current.aqi)}
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Last updated: {new Date(forecastData.current.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">Main pollutant:</span> {getPollutantDisplayName(forecastData.current.mainPollutant)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 text-center">
                            <p className="text-gray-600 dark:text-gray-300">No forecast data available. Please try another location.</p>
                        </div>
                    )}

                    {/* Forecast Chart */}
                    {!isLoading && forecastData && forecastData.forecast && forecastData.forecast.length > 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Pollution Forecast</h2>

                            <div className="mb-4">
                                <label htmlFor="pollutant-select" className="block text-gray-700 dark:text-gray-300 mb-2">
                                    Select Pollutant:
                                </label>
                                <select
                                    id="pollutant-select"
                                    value={selectedPollutant}
                                    onChange={(e) => setSelectedPollutant(e.target.value)}
                                    className="w-full md:w-1/3 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="pm2_5">PM2.5</option>
                                    <option value="pm10">PM10</option>
                                    <option value="o3">Ozone (O₃)</option>
                                    <option value="no2">Nitrogen Dioxide (NO₂)</option>
                                    <option value="so2">Sulfur Dioxide (SO₂)</option>
                                </select>
                            </div>

                            <div className="h-64 md:h-80">
                                {chartData ? (
                                    <Line options={chartOptions} data={chartData} />
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-300 text-center pt-16">
                                        No forecast data available for {getPollutantDisplayName(selectedPollutant)}
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {/* Daily Forecast Table */}
                    {!isLoading && forecastData && forecastData.forecast && forecastData.forecast.length > 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 overflow-x-auto">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Daily Forecast Details</h2>
                            <table className="w-full table-auto border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-700">
                                        <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">Date</th>
                                        <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">AQI</th>
                                        <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">PM2.5</th>
                                        <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">PM10</th>
                                        <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">O₃</th>
                                        <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">NO₂</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {forecastData.forecast.map((day, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                                            <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">{formatDate(day.day)}</td>
                                            <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{day.aqi}</td>
                                            <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{day.components.pm2_5_avg || '-'}</td>
                                            <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{day.components.pm10_avg || '-'}</td>
                                            <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{day.components.o3_avg || '-'}</td>
                                            <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{day.components.no2_avg || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : null}

                    {/* Information Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Understanding Air Quality Forecasts</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                            Air quality forecasts help you plan outdoor activities and take precautions when pollution levels are expected to be high. The forecast shows predicted levels of various pollutants over the coming days.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                            <span className="font-medium">PM2.5 and PM10:</span> Fine particulate matter that can penetrate deep into the lungs and bloodstream.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                            <span className="font-medium">Ozone (O₃):</span> A gas that can irritate airways and worsen respiratory conditions when at ground level.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Nitrogen Dioxide (NO₂), Sulfur Dioxide (SO₂), and Carbon Monoxide (CO):</span> Gases released from burning fuels that can cause respiratory issues and other health problems.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}