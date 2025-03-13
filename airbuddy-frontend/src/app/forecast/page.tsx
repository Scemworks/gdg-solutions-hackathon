"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ChartData } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface ForecastItem {
    avg: number;
    day: string;
    max: number;
    min: number;
}

interface ForecastData {
    pm25?: ForecastItem[];
    pm10?: ForecastItem[];
    o3?: ForecastItem[];
    no2?: ForecastItem[];
    so2?: ForecastItem[];
    [key: string]: ForecastItem[] | undefined;
}

interface ForecastResponse {
    location: string;
    forecast: ForecastData;
}

export default function ForecastPage() {
    const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [location, setLocation] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedPollutant, setSelectedPollutant] = useState<string>("pm25");
    const [showTrendPrediction, setShowTrendPrediction] = useState<boolean>(false);
    const [chartType, setChartType] = useState<'line' | 'bar'>('line');

    // Get pollutant name from code
    const getPollutantName = (code: string) => {
        const pollutants: { [key: string]: string } = {
            'pm10': 'PM10',
            'pm25': 'PM2.5',
            'o3': 'Ozone',
            'no2': 'Nitrogen Dioxide',
            'so2': 'Sulfur Dioxide',
        };

        return pollutants[code] || code;
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

    // Function to get AQI category color for chart
    const getAQICategoryColor = (aqi: number) => {
        if (aqi <= 50) return "rgb(34, 197, 94)";
        if (aqi <= 100) return "rgb(234, 179, 8)";
        if (aqi <= 150) return "rgb(249, 115, 22)";
        if (aqi <= 200) return "rgb(239, 68, 68)";
        if (aqi <= 300) return "rgb(168, 85, 247)";
        return "rgb(157, 23, 77)";
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

    // Calculate linear regression for trend prediction
    const calculateTrendLine = (data: number[]): number[] => {
        const n = data.length;
        
        // If there's not enough data, return the original
        if (n <= 1) return data;
        
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumXX = 0;
        
        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += data[i];
            sumXY += i * data[i];
            sumXX += i * i;
        }
        
        // Calculate slope and y-intercept
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const yIntercept = (sumY - slope * sumX) / n;
        
        // Generate trend line points
        const trendLine = [];
        for (let i = 0; i < n; i++) {
            trendLine.push(slope * i + yIntercept);
        }
        
        // Calculate future prediction points (extend for 2 more days)
        for (let i = n; i < n + 2; i++) {
            trendLine.push(slope * i + yIntercept);
        }
        
        return trendLine;
    };

    // Prepare chart data
    const getChartData = (): ChartData<'line' | 'bar'> => {
        if (!forecastData || !forecastData.forecast || !forecastData.forecast[selectedPollutant]) {
            return {
                labels: [],
                datasets: []
            };
        }
        
        const pollutantData = forecastData.forecast[selectedPollutant]!;
        const labels = pollutantData.map(item => formatDate(item.day));
        
        // For trend prediction mode, add additional labels for future days
        const extendedLabels = showTrendPrediction ? 
            [
                ...labels, 
                `Day ${labels.length + 1}`, 
                `Day ${labels.length + 2}`
            ] : labels;
        
        if (showTrendPrediction) {
            const avgData = pollutantData.map(item => item.avg);
            const trendLine = calculateTrendLine(avgData);
            
            return {
                labels: extendedLabels,
                datasets: [
                    {
                        label: 'Actual Data',
                        data: avgData,
                        borderColor: getAQICategoryColor(pollutantData[0].avg),
                        backgroundColor: `${getAQICategoryColor(pollutantData[0].avg)}33`,
                        tension: 0.3,
                        borderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: 'Trend Prediction',
                        data: trendLine,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderDash: [5, 5],
                        tension: 0.1,
                        borderWidth: 2,
                        pointRadius: (ctx) => ctx.dataIndex >= avgData.length ? 4 : 0,
                        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    }
                ]
            };
        }
        
        return {
            labels,
            datasets: [
                {
                    label: 'Min',
                    data: pollutantData.map(item => item.min),
                    borderColor: 'rgba(53, 162, 235, 0.8)',
                    backgroundColor: 'rgba(53, 162, 235, 0.2)',
                    tension: 0.3,
                },
                {
                    label: 'Average',
                    data: pollutantData.map(item => item.avg),
                    borderColor: getAQICategoryColor(pollutantData[0].avg),
                    backgroundColor: `${getAQICategoryColor(pollutantData[0].avg)}33`,
                    tension: 0.3,
                    borderWidth: 2
                },
                {
                    label: 'Max',
                    data: pollutantData.map(item => item.max),
                    borderColor: 'rgba(255, 99, 132, 0.8)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.3,
                }
            ]
        };
    };

    // Compare all pollutants data for the bar chart
    const getPollutantsComparisonData = (): ChartData<'bar'> => {
        if (!forecastData || !forecastData.forecast) {
            return {
                labels: [],
                datasets: []
            };
        }
        
        const labels = ['PM2.5', 'PM10', 'Ozone', 'NO2', 'SO2'];
        const pollutantCodes = ['pm25', 'pm10', 'o3', 'no2', 'so2'];
        const avgValues = pollutantCodes.map(code => {
            const data = forecastData.forecast[code];
            if (!data || data.length === 0) return 0;
            return data[0].avg; // Using the first day's average value
        });

        const colors = avgValues.map(val => getAQICategoryColor(val));
        
        return {
            labels,
            datasets: [
                {
                    label: 'Current AQI Values',
                    data: avgValues,
                    backgroundColor: colors,
                    borderColor: colors.map(c => c.replace(')', ', 1)')),
                    borderWidth: 1
                }
            ]
        };
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: showTrendPrediction 
                    ? `${getPollutantName(selectedPollutant)} Trend Prediction` 
                    : `${getPollutantName(selectedPollutant)} Forecast Trends`
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'AQI Value'
                }
            }
        }
    };

    // Bar chart options
    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Current Pollutant Comparison'
            },
            tooltip: {
                callbacks: {
                    afterLabel: function(context: any) {
                        const index = context.dataIndex;
                        const value = context.dataset.data[index];
                        return `Status: ${getAQICategory(value)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'AQI Value'
                }
            }
        }
    };

    // Function to fetch data based on location name
    const fetchDataByLocationName = useCallback(async (locationName: string) => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            // First, geocode the location to get coordinates
            const geocodeResponse = await fetch(`https://airbuddy-backend.vercel.app/api/geocode?location=${encodeURIComponent(locationName)}`);
            const geocodeData = await geocodeResponse.json();

            if (!geocodeResponse.ok) {
                throw new Error(geocodeData.error || "Failed to find location");
            }

            // Then fetch forecast data using the coordinates
            const { lat, lon, display_name } = geocodeData;
            const forecastResponse = await fetch(`https://airbuddy-backend.vercel.app/api/aqi/forecast?lat=${lat}&lon=${lon}`);
            const forecastResponseData = await forecastResponse.json();

            if (!forecastResponse.ok) {
                throw new Error(forecastResponseData.error || "Failed to fetch forecast data");
            }

            setForecastData(forecastResponseData);
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

    // Format date from "YYYY-MM-DD" to more readable format
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
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

                            // Fetch forecast data using coordinates
                            try {
                                const forecastResponse = await fetch(`https://airbuddy-backend.vercel.app/api/aqi/forecast?lat=${latitude}&lon=${longitude}`);
                                const forecastResponseData = await forecastResponse.json();

                                if (!forecastResponse.ok) {
                                    throw new Error(forecastResponseData.error || "Failed to fetch forecast data");
                                }

                                setForecastData(forecastResponseData);
                                
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
                                console.error("Error fetching forecast data:", error);
                                setErrorMessage(error instanceof Error ? error.message : "Failed to fetch forecast data");
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

                    {/* Forecast Display */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">5-Day Air Quality Forecast</h2>

                        {isLoading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600 dark:text-gray-300">Loading forecast data...</p>
                            </div>
                        ) : forecastData ? (
                            <>
                                {/* Pollutant selector */}
                                <div className="mb-6">
                                    <label htmlFor="pollutant-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Select Pollutant:
                                    </label>
                                    <select
                                        id="pollutant-select"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        value={selectedPollutant}
                                        onChange={(e) => setSelectedPollutant(e.target.value)}
                                    >
                                        {forecastData?.forecast && Object.keys(forecastData.forecast).map((pollutant) => (
                                            <option key={pollutant} value={pollutant}>
                                                {getPollutantName(pollutant)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Visualization controls */}
                                <div className="flex flex-wrap gap-4 mb-6">
                                    <div>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-blue-600"
                                                checked={showTrendPrediction}
                                                onChange={() => setShowTrendPrediction(!showTrendPrediction)}
                                            />
                                            <span className="ml-2 text-gray-700 dark:text-gray-300">Show Trend Prediction</span>
                                        </label>
                                    </div>
                                    
                                    <div>
                                        <label className="inline-flex items-center">
                                            <span className="mr-2 text-gray-700 dark:text-gray-300">Chart Type:</span>
                                            <select 
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                value={chartType}
                                                onChange={(e) => setChartType(e.target.value as 'line' | 'bar')}
                                            >
                                                <option value="line">Line Chart</option>
                                                <option value="bar">Bar Chart</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                {/* Chart visualization */}
                                {forecastData?.forecast && forecastData.forecast[selectedPollutant] && (
                                    <div className="mb-8 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                                            {getPollutantName(selectedPollutant)} {showTrendPrediction ? "Trend Forecast" : "Trend"}
                                        </h3>
                                        <div className="h-64 md:h-80">
                                            {chartType === 'line' ? (
                                                <Line data={getChartData() as ChartData<'line'>} options={chartOptions} />
                                            ) : (
                                                <Bar data={getChartData() as ChartData<'bar'>} options={chartOptions} />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Forecast cards */}
                                {forecastData?.forecast && forecastData.forecast[selectedPollutant] ? (
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                        {forecastData?.forecast[selectedPollutant]?.map((day, index) => (
                                            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                                                    {formatDate(day.day)}
                                                </h3>
                                                <div className={`${getAQICategoryColorClass(day.avg)} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-2`}>
                                                    {day.avg}
                                                </div>
                                                <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {getAQICategory(day.avg)}
                                                </p>
                                                <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                                                    <div className="flex justify-between">
                                                        <span>Min</span>
                                                        <span className="font-medium">{day.min}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Max</span>
                                                        <span className="font-medium">{day.max}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center py-4 text-gray-600 dark:text-gray-300">
                                        No forecast data available for {getPollutantName(selectedPollutant)}
                                    </p>
                                )}

                                {/* Pollutant comparison chart - NEW */}
                                <div className="mt-8 mb-6 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                                        Current Pollutant Comparison
                                    </h3>
                                    <div className="h-64 md:h-80">
                                        <Bar data={getPollutantsComparisonData()} options={barChartOptions} />
                                    </div>
                                </div>

                                <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                                    <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                                        About {getPollutantName(selectedPollutant)}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {selectedPollutant === "pm25" && "PM2.5 refers to fine particulate matter (diameter less than 2.5 microns) which can penetrate deep into lungs and bloodstream, causing respiratory and cardiovascular issues."}
                                        {selectedPollutant === "pm10" && "PM10 refers to inhalable particles with diameters of 10 microns or smaller that can cause respiratory problems and aggravate existing health conditions."}
                                        {selectedPollutant === "o3" && "Ozone (O3) at ground level is a harmful air pollutant that can trigger respiratory problems, especially for people with asthma and sensitive groups."}
                                        {selectedPollutant === "no2" && "Nitrogen Dioxide (NO2) is a gaseous air pollutant that can irritate airways and worsen respiratory conditions like asthma when inhaled."}
                                        {selectedPollutant === "so2" && "Sulfur Dioxide (SO2) is a gaseous air pollutant that can harm the respiratory system and make breathing difficult, particularly for people with asthma."}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-600 dark:text-gray-300">No forecast data available. Please try another location.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}