import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
    return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 p-8 mb-8">
                        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-6">Terms of Service</h1>
                        
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">1. Acceptance of Terms</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                By accessing or using AirBuddy, you agree to be bound by these Terms of Service. If you do not agree 
                                to these terms, please do not use our service.
                            </p>
                        </section>
                        
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">2. Description of Service</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                AirBuddy provides air quality information based on data from third-party sources. The service is provided 
                                "as is" and we make no warranties regarding the accuracy, completeness, or reliability of the data.
                            </p>
                        </section>
                        
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">3. User Responsibilities</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                Users are responsible for providing accurate location information when using the service. You agree not to 
                                misuse the service or interfere with its normal operation.
                            </p>
                        </section>
                        
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">4. Data and Privacy</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                We collect and process location data as necessary to provide air quality information. Please refer to our 
                                Privacy Policy for details on how we handle your personal information.
                            </p>
                        </section>
                        
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">5. Limitation of Liability</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                AirBuddy and its operators will not be liable for any direct, indirect, incidental, special, or consequential 
                                damages arising from the use or inability to use our service.
                            </p>
                        </section>
                        
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">6. Changes to Terms</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes 
                                acceptance of the modified terms.
                            </p>
                        </section>
                        
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">7. Contact Us</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                If you have any questions about these Terms of Service, please contact us.
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
    );
}