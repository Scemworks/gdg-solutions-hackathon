import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 p-8 mb-8">
                    <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-6">Privacy Policy</h1>
                    
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">1. Information Collection</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                            Our service collects your geolocation data when you search for air quality information.
                            This is necessary to provide you with relevant AQI data for your location. We may also collect
                            search history to improve your experience but this can be disabled in settings.
                        </p>
                    </section>
                    
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">2. Use of Information</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                            We use your location data solely to query the WAQI API for accurate air quality information.
                            Any saved locations or search preferences are stored locally on your device or securely in your account
                            if you choose to register. We do not sell your data to third parties.
                        </p>
                    </section>
                    
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">3. Data Storage and Security</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                            Location data is transmitted securely using encryption. We cache AQI data temporarily to improve
                            performance but do not permanently store your search history on our servers unless you&apos;ve enabled
                            this feature in your account settings.
                        </p>
                    </section>
                    
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">4. Third-party Services</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                            We use the World Air Quality Index (WAQI) API to provide AQI data. When you search for a location,
                            that search is forwarded to the WAQI service. Please refer to WAQI&apos;s privacy policy for information
                            on how they process this data. We may also use analytics services to improve our site.
                        </p>
                    </section>
                    
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">5. Cookies and Local Storage</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                            We use cookies and local storage to save your preferences and recent searches. This helps provide
                            a faster experience when you return. You can clear this data through your browser settings or within
                            our application settings.
                        </p>
                    </section>
                    
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">6. User Rights</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                            You can access, update, or delete your saved locations and search history from your account settings.
                            You can also use our service without an account, in which case data is stored only locally on your device.
                            You may opt out of location sharing, though this will limit functionality.
                        </p>
                    </section>
                    
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">7. Children&apos;s Privacy</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                            Our service is not intended for users under 13 years of age. We do not knowingly collect
                            personal information from children under 13.
                        </p>
                    </section>
                    
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">8. Changes to Privacy Policy</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                            This policy may be updated periodically. We will notify registered users of significant changes
                            via email and post notices on our website. Continued use of our service constitutes acceptance
                            of the updated policy.
                        </p>
                    </section>
                    
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">9. Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                            For questions about this privacy policy or to exercise your data rights, please contact our
                            privacy team at privacy@airqualitysearch.com.
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