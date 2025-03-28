"use client";
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Close menu when pathname changes (navigation occurs)
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isMenuOpen &&
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    // Add padding to body to prevent content from being hidden under fixed header
    useEffect(() => {
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        document.body.style.paddingTop = `${headerHeight}px`;
        return () => {
            document.body.style.paddingTop = '0';
        };
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800/30 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-400 ml-2">AirBuddy</h1>
                </div>
                
                <div className="hidden md:flex items-center">
                    <nav className="flex space-x-4 mr-4">
                        <Link href="/" className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${pathname === '/' ? 'text-blue-600 dark:text-blue-400 font-semibold underline' : ''}`}>Home</Link>
                        <Link href="/aqi-tracking" className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${pathname === '/aqi-tracking' ? 'text-blue-600 dark:text-blue-400 font-semibold underline' : ''}`}>AQI</Link>
                        <Link href="/forecast" className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${pathname === '/forecast' ? 'text-blue-600 dark:text-blue-400 font-semibold underline' : ''}`}>Forecast</Link>
                        <Link href="/health-alerts" className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${pathname === '/health-alerts' ? 'text-blue-600 dark:text-blue-400 font-semibold underline' : ''}`}>Alerts</Link>
                        <Link href="/safety-tips" className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${pathname === '/safety-tips' ? 'text-blue-600 dark:text-blue-400 font-semibold underline' : ''}`}>Tips</Link>
                        <Link href="/community" className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${pathname === '/community' ? 'text-blue-600 dark:text-blue-400 font-semibold underline' : ''}`}>Community</Link>
                        <Link href="/login" className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-blue-200 dark:bg-blue-800 px-3 py-1 rounded ${pathname === '/login' ? 'text-blue-600 dark:text-blue-400 font-semibold underline' : ''}`}>{pathname === '/signup' ? 'Signup' : 'Login'}</Link>
                    </nav>
                </div>
                
                <div className="flex items-center md:hidden">
                    <button
                        ref={buttonRef}
                        onClick={toggleMenu}
                        className="ml-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                    >
                        {isMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800/30 z-50 border-t border-gray-100 dark:border-gray-700"
                >
                    <div className="container mx-auto px-4">
                        <nav className="py-3 space-y-3">
                            <Link href="/" className={`block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${pathname === '/' ? 'text-blue-600 dark:text-blue-400 font-semibold underline' : ''}`}>Home</Link>
                            <Link href="/aqi-tracking" className={`block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${pathname === '/aqi-tracking' ? 'text-blue-600 dark:text-blue-400 font-semibold underline' : ''}`}>AQI</Link>
                            <Link href="/forecast" className={`block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${pathname === '/forecast' ? 'text-blue-600 dark:text-blue-400 font-semibold underline' : ''}`}>Forecast</Link>
                            <Link href="/health-alerts" className={`block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${pathname === '/health-alerts' ? 'text-blue-600 dark:text-blue-400 font-semibold underline' : ''}`}>Alerts</Link>
                            <Link href="/safety-tips" className={`block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${pathname === '/safety-tips' ? 'text-blue-600 dark:text-blue-400 font-semibold underline' : ''}`}>Tips</Link>
                            <Link href="/community" className={`block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${pathname === '/community' ? 'text-blue-600 dark:text-blue-400 font-semibold underline' : ''}`}>Community</Link>
                            <Link href="/login" className={`block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-blue-200 dark:bg-blue-800 px-4 py-2 rounded text-center my-2 font-medium ${pathname === '/login' ? 'text-blue-600 dark:text-blue-400 font-semibold underline' : ''}`}>{pathname === '/signup' ? 'Signup' : 'Login'}</Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
