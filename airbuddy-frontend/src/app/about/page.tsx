import React from 'react';
import Link from 'next/link';
import Header from '../components/header';

export default function AboutPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 p-8 mb-8">
                        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-6">About AirBuddy</h1>
                        
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">Our Mission</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                AirBuddy is dedicated to providing accurate, real-time air quality information to help you make informed decisions 
                                about your outdoor activities and health. We believe that access to environmental data should be simple, intuitive, 
                                and actionable.
                            </p>
                        </section>
                        
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">What We Offer</h2>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-3">
                                <li>Real-time air quality index (AQI) monitoring</li>
                                <li>5-day air quality forecasts</li>
                                <li>Detailed pollutant information (PM2.5, PM10, Ozone, etc.)</li>
                                <li>Location-based air quality tracking</li>
                                <li>Health recommendations based on current air quality</li>
                            </ul>
                        </section>
                        
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">Our Technology</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                AirBuddy leverages reliable air quality data sources and modern web technologies to deliver a 
                                seamless user experience. Built with Next.js, Tailwind CSS, and powered by real-time data from 
                                trusted air quality monitoring networks.
                            </p>
                        </section>
                        
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Meet Team QuadSquad</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Team Member 1 */}
                                <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                                    <div className="w-20 h-20 mx-auto bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center mb-3">
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-300">MS</span>
                                    </div>
                                    <h3 className="font-semibold text-blue-700 dark:text-blue-300">Mohammed Shadin</h3>
                                </div>
                                
                                {/* Team Member 2 */}
                                <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                                    <div className="w-20 h-20 mx-auto bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center mb-3">
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-300">A</span>
                                    </div>
                                    <h3 className="font-semibold text-blue-700 dark:text-blue-300">Aiswarya</h3>
                                </div>
                                
                                {/* Team Member 3 */}
                                <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                                    <div className="w-20 h-20 mx-auto bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center mb-3">
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-300">NF</span>
                                    </div>
                                    <h3 className="font-semibold text-blue-700 dark:text-blue-300">N. Fadeela</h3>
                                </div>
                                
                                {/* Team Member 4 */}
                                <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                                    <div className="w-20 h-20 mx-auto bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center mb-3">
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-300">C</span>
                                    </div>
                                    <h3 className="font-semibold text-blue-700 dark:text-blue-300">Cenna</h3>
                                </div>
                            </div>
                        </section>
                        
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">About the Hackathon</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                This project was developed for the GDG Solutions Hackathon, where our team tackled environmental 
                                challenges through technology. AirBuddy represents our commitment to creating solutions that 
                                positively impact people&apos;s health and quality of life.
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                                Our solution addresses key UN Sustainable Development Goals, including SDG 3 (Good Health and Well-being), 
                                SDG 11 (Sustainable Cities and Communities), and SDG 13 (Climate Action) by providing accessible 
                                air quality information that helps people make healthier decisions and raises awareness about 
                                environmental conditions.
                            </p>
                        </section>
                        
                        <div className="text-center mt-8">
                            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                                Back to Homepage
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}