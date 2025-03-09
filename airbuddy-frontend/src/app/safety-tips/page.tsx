"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface TipCategory {
    id: string;
    title: string;
    icon: React.ReactNode;
    tips: Tip[];
}

interface Tip {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'all';
}

export default function SafetyTips() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [aqiFilter, setAqiFilter] = useState<string>('all');

    const categories: TipCategory[] = [
        {
            id: 'outdoor',
            title: 'Outdoor Activities',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            ),
            tips: [
                {
                    title: 'Check AQI Before Going Out',
                    description: 'Always check the air quality index (AQI) before planning outdoor activities. Use the AirBuddy app for real-time updates.',
                    severity: 'all'
                },
                {
                    title: 'Time Your Activities',
                    description: 'Schedule outdoor activities when air pollution is lowest, typically early morning or evening after rush hour.',
                    severity: 'medium'
                },
                {
                    title: 'Choose Location Wisely',
                    description: 'Exercise in parks or areas away from major roads and industrial zones to reduce exposure to pollutants.',
                    severity: 'medium'
                },
                {
                    title: 'Limit Intense Activities',
                    description: 'On high pollution days, avoid strenuous exercises like running or cycling that increase breathing rate and pollutant intake.',
                    severity: 'high'
                },
                {
                    title: 'Stay Indoors',
                    description: 'When AQI exceeds 150, consider moving activities indoors, especially for sensitive groups.',
                    severity: 'high'
                }
            ]
        },
        {
            id: 'masks',
            title: 'Protective Masks',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            ),
            tips: [
                {
                    title: 'Choose N95 or KN95 Masks',
                    description: 'For effective protection against fine particulate matter (PM2.5), use N95, KN95, or equivalent masks.',
                    severity: 'high'
                },
                {
                    title: 'Ensure Proper Fit',
                    description: 'Make sure your mask forms a tight seal around your nose and mouth with no gaps for pollutants to enter.',
                    severity: 'high'
                },
                {
                    title: 'Replace Regularly',
                    description: 'Replace disposable masks according to manufacturer guidelines or when they become dirty or difficult to breathe through.',
                    severity: 'medium'
                },
                {
                    title: 'Cloth Masks Limitations',
                    description: 'Be aware that standard cloth masks offer minimal protection against fine air pollutants.',
                    severity: 'medium'
                }
            ]
        },
        {
            id: 'home',
            title: 'Home Protection',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            tips: [
                {
                    title: 'Keep Windows Closed',
                    description: 'On high pollution days, keep windows and doors closed to prevent outdoor pollutants from entering your home.',
                    severity: 'high'
                },
                {
                    title: 'Use Air Purifiers',
                    description: 'Invest in HEPA air purifiers for living spaces, especially bedrooms, to filter particulate matter.',
                    severity: 'medium'
                },
                {
                    title: 'Change AC Filters',
                    description: 'Regularly replace air conditioner filters to maintain good indoor air quality.',
                    severity: 'low'
                },
                {
                    title: 'Create a Clean Room',
                    description: 'Designate at least one room in your home with filtered air where sensitive family members can spend time during pollution spikes.',
                    severity: 'high'
                },
                {
                    title: 'Avoid Indoor Pollution',
                    description: 'Limit activities that create indoor pollution like smoking, burning candles, or using gas stoves without proper ventilation.',
                    severity: 'medium'
                }
            ]
        },
        {
            id: 'health',
            title: 'Health Management',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            tips: [
                {
                    title: 'Stay Hydrated',
                    description: 'Drink plenty of water to help your body flush out toxins that may enter your system from polluted air.',
                    severity: 'all'
                },
                {
                    title: 'Monitor Symptoms',
                    description: 'Watch for symptoms like coughing, wheezing, shortness of breath, or eye irritation that may indicate a reaction to air pollution.',
                    severity: 'all'
                },
                {
                    title: 'Take Prescribed Medication',
                    description: 'If you have respiratory conditions like asthma or COPD, ensure you take prescribed medications regularly during high pollution periods.',
                    severity: 'high'
                },
                {
                    title: 'Consult Healthcare Provider',
                    description: 'Work with your doctor to develop an action plan for high pollution days, especially if you have pre-existing conditions.',
                    severity: 'high'
                },
                {
                    title: 'Consider Air Quality Supplements',
                    description: 'Some studies suggest antioxidants like Vitamins C and E may help mitigate effects of air pollution, but consult your doctor before starting any supplement regimen.',
                    severity: 'medium'
                }
            ]
        },
        {
            id: 'travel',
            title: 'Travel Precautions',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            ),
            tips: [
                {
                    title: 'Use Car Air Recirculation',
                    description: 'When driving in heavy traffic or polluted areas, use the recirculation setting on your car\'s air conditioning system.',
                    severity: 'medium'
                },
                {
                    title: 'Keep Car Windows Closed',
                    description: 'Keep car windows closed during commutes through high-pollution areas or during rush hour traffic.',
                    severity: 'high'
                },
                {
                    title: 'Plan Travel Routes',
                    description: 'Use navigation apps that can suggest routes with less traffic congestion to reduce exposure to vehicle emissions.',
                    severity: 'medium'
                },
                {
                    title: 'Check Destination AQI',
                    description: 'Before traveling to a new city, check historical and current air quality data to prepare accordingly.',
                    severity: 'all'
                }
            ]
        },
        {
            id: 'conditions',
            title: 'Health Conditions',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            tips: [
                {
                    title: 'Asthma Management',
                    description: 'Keep rescue inhalers always accessible. Consider increasing controller medication during high pollution days after consulting your doctor.',
                    severity: 'high'
                },
                {
                    title: 'COPD Precautions',
                    description: 'Follow your action plan created with your doctor. Consider using supplemental oxygen as prescribed when pollution levels are elevated.',
                    severity: 'high'
                },
                {
                    title: 'Heart Disease',
                    description: 'People with cardiovascular conditions should limit outdoor exposure when AQI exceeds 100, as air pollution can increase risk of heart attacks and stroke.',
                    severity: 'medium'
                },
                {
                    title: 'Pregnancy',
                    description: 'Pregnant women should take extra precautions as pollution exposure may affect fetal development. Limit outdoor activities when AQI is above 100.',
                    severity: 'medium'
                },
                {
                    title: 'Children with Respiratory Issues',
                    description: 'Children with asthma or other respiratory conditions should avoid outdoor play when AQI is unhealthy. Ensure they take prescribed medications.',
                    severity: 'high'
                },
                {
                    title: 'Elderly with Multiple Conditions',
                    description: 'Older adults with multiple health issues should stay indoors with air purification during pollution events and maintain good hydration.',
                    severity: 'high'
                },
                {
                    title: 'Allergies and Pollution',
                    description: 'People with allergies may experience intensified symptoms during high pollution. Consider using antihistamines and nasal sprays as directed by your doctor.',
                    severity: 'medium'
                }
            ]
        }
    ];

    const filteredCategories = selectedCategory 
        ? categories.filter(cat => cat.id === selectedCategory) 
        : categories;

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'low':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'high':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        }
    };

    const filteredTips = (tips: Tip[]) => {
        if (aqiFilter === 'all') return tips;
        return tips.filter(tip => tip.severity === aqiFilter || tip.severity === 'all');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-950">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300 mb-3">Air Quality Safety Tips</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Practical guidance to protect yourself and your family from air pollution effects. Customize recommendations based on pollution levels and your specific needs.
                    </p>
                </header>

                <div className="mb-8">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-gray-700 dark:text-gray-300">Filter by category:</span>
                        <button 
                            onClick={() => setSelectedCategory(null)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                selectedCategory === null 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                    selectedCategory === cat.id 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                {cat.title}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-gray-700 dark:text-gray-300">Filter by AQI severity:</span>
                        <button 
                            onClick={() => setAqiFilter('all')}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                aqiFilter === 'all' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            All Conditions
                        </button>
                        <button 
                            onClick={() => setAqiFilter('low')}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                aqiFilter === 'low' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                            }`}
                        >
                            Low Pollution (0-50)
                        </button>
                        <button 
                            onClick={() => setAqiFilter('medium')}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                aqiFilter === 'medium' 
                                    ? 'bg-yellow-600 text-white' 
                                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800'
                            }`}
                        >
                            Moderate Pollution (51-150)
                        </button>
                        <button 
                            onClick={() => setAqiFilter('high')}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                aqiFilter === 'high' 
                                    ? 'bg-red-600 text-white' 
                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
                            }`}
                        >
                            High Pollution (151+)
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    {filteredCategories.map(category => {
                        const tips = filteredTips(category.tips);
                        if (tips.length === 0) return null;
                        
                        return (
                            <section key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <h2 className="flex items-center text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
                                    <div className="mr-3 p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                                        {category.icon}
                                    </div>
                                    {category.title}
                                </h2>
                                
                                <div className="space-y-4">
                                    {tips.map((tip, index) => (
                                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{tip.title}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(tip.severity)}`}>
                                                    {tip.severity === 'low' && 'Low AQI'}
                                                    {tip.severity === 'medium' && 'Moderate AQI'}
                                                    {tip.severity === 'high' && 'High AQI'}
                                                    {tip.severity === 'all' && 'All Conditions'}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300">{tip.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>

                <div className="mt-12 bg-blue-50 dark:bg-blue-900/40 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-4">Remember</h2>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start">
                            <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Air quality can change quickly, always check the latest AQI reading on AirBuddy before going outdoors.
                        </li>
                        <li className="flex items-start">
                            <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            People with respiratory conditions, the elderly, children, and pregnant women should take extra precautions.
                        </li>
                        <li className="flex items-start">
                            <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            These tips are general guidelines. Your specific health needs may require personalized advice from healthcare professionals.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}