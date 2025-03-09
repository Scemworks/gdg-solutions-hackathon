"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Here you would implement actual authentication logic
            // For example, calling your API endpoint
            // const response = await fetch('/api/auth/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email, password }),
            // });
            
            // Simulate login success
            setTimeout(() => {
                setIsLoading(false);
                router.push('/aqi-tracking');
            }, 1000);
            
        } catch (err) {
            setIsLoading(false);
            setError('Login failed. Please check your credentials.');
            console.error('Login error:', err);
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
                    <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-6 text-center">Log In</h2>
                    
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
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
                        </div>
                        
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                            <div className="text-right mt-2">
                                <Link href="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}