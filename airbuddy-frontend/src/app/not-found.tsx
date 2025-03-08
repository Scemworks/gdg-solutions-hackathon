import React from 'react';
import Link from 'next/link';
import Header from './components/header';

export default function NotFoundPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="container mx-auto px-4 py-8 text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 p-8">
                        <h1 className="text-6xl font-bold text-blue-800 dark:text-blue-400 mb-4">404</h1>
                        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Page Not Found</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            The page you&apos;re looking for doesn&apos;t exist or has been moved.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Please check the URL or navigate back to our homepage.
                        </p>
                        <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                            Back to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
