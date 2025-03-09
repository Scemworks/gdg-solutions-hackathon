"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';



export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Here you would implement actual password reset logic
            // For example, calling your API endpoint
            // const response = await fetch('/api/auth/forgot-password', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email }),
            // });
            
            // Simulate password reset email sent
            setTimeout(() => {
                setIsLoading(false);
                setSuccess(true);
            }, 1000);
            
        } catch (err) {
            setIsLoading(false);
            setError('Failed to send reset email. Please try again.');
            console.error('Password reset error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 flex flex-col justify-center">
            <div className="container mx-auto px-4 py-8 max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-block">
                        <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-300">AirBuddy</h1>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Your personal air quality companion</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-6 text-center">Reset Password</h2>
                    
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="text-center">
                            <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg mb-4">
                                Reset link has been sent to your email address.
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Please check your inbox and follow the instructions to reset your password.
                            </p>
                            <Link 
                                href="/login" 
                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                                Return to login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="your@email.com"
                                    required
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    We'll send a password reset link to this email address.
                                </p>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}
                    
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Remembered your password?{' '}
                            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}