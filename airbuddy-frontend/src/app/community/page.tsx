"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CommunityPost {
    id: string;
    author: string;
    location: string;
    date: string;
    content: string;
    likes: number;
    comments: number;
    aqi?: number; // Optional AQI field
}

export default function CommunityPage() {
    const router = useRouter();
    const [newPost, setNewPost] = useState('');
    const [location, setLocation] = useState('');
    const [aqi, setAqi] = useState<string>('');
    const [includeAqi, setIncludeAqi] = useState(false);

    // Mock community posts data
    const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
        {
            id: '1',
            author: 'Priya Nair',
            location: 'Kochi, Kerala',
            date: '2 hours ago',
            content: 'Air quality seems much better today after yesterday\'s monsoon showers. AQI around 45 in the Fort Kochi area.',
            likes: 12,
            comments: 3,
            aqi: 45
        },
        {
            id: '2',
            author: 'Rahul Menon',
            location: 'Trivandrum, Kerala',
            date: '5 hours ago',
            content: 'Heavy traffic causing visible pollution near MG Road. Be careful if you have respiratory issues.',
            likes: 8,
            comments: 5
        },
        {
            id: '3',
            author: 'Anjali Thomas',
            location: 'Munnar, Kerala',
            date: '1 day ago',
            content: 'The air quality in the hills is excellent today! Perfect for outdoor activities. AQI reading of just 25.',
            likes: 15,
            comments: 7,
            aqi: 25
        }
    ]);

    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPost.trim() === '' || location.trim() === '') return;
        
        const newCommunityPost: CommunityPost = {
            id: Date.now().toString(),
            author: 'You',
            location: location,
            date: 'Just now',
            content: newPost,
            likes: 0,
            comments: 0,
            ...(includeAqi && aqi ? { aqi: parseInt(aqi) } : {})
        };
        
        setCommunityPosts([newCommunityPost, ...communityPosts]);
        setNewPost('');
        setLocation('');
        setAqi('');
        setIncludeAqi(false);
    };

    const handleLikePost = (postId: string) => {
        setCommunityPosts(
            communityPosts.map(post => 
                post.id === postId ? { ...post, likes: post.likes + 1 } : post
            )
        );
    };

    const getAqiColor = (aqi?: number) => {
        if (!aqi) return "";
        if (aqi <= 50) return "text-green-600";
        if (aqi <= 100) return "text-yellow-600";
        if (aqi <= 150) return "text-orange-600";
        if (aqi <= 200) return "text-red-600";
        return "text-purple-600";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-950">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <header className="mb-8">
                    <button 
                        onClick={() => router.push('/')}
                        className="mb-4 flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </button>
                    <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Community Reports</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Connect with others and share local air quality observations
                    </p>
                </header>
                
                {/* Post form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Share Your Observation</h2>
                    <form onSubmit={handlePostSubmit}>
                        <div className="mb-4">
                            <label htmlFor="location" className="block text-gray-700 dark:text-gray-300 mb-1">Location</label>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter your location"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="post" className="block text-gray-700 dark:text-gray-300 mb-1">Your Observation</label>
                            <textarea
                                id="post"
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                rows={3}
                                placeholder="Share what you're observing about air quality in your area..."
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                required
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="includeAqi"
                                    checked={includeAqi}
                                    onChange={(e) => setIncludeAqi(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="includeAqi" className="text-gray-700 dark:text-gray-300">
                                    I know the current AQI
                                </label>
                            </div>
                            
                            {includeAqi && (
                                <div className="mt-2">
                                    <label htmlFor="aqi" className="block text-gray-700 dark:text-gray-300 mb-1">AQI Value</label>
                                    <input
                                        type="number"
                                        id="aqi"
                                        value={aqi}
                                        onChange={(e) => setAqi(e.target.value)}
                                        placeholder="Enter AQI value (0-500)"
                                        min="0"
                                        max="500"
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                    />
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                        >
                            Post Observation
                        </button>
                    </form>
                </div>
                
                {/* Community posts */}
                <div className="space-y-6">
                    {communityPosts.map(post => (
                        <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-blue-700 dark:text-blue-300">{post.author}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{post.date}</span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {post.location}
                                {post.aqi !== undefined && (
                                    <span className={`ml-4 font-semibold ${getAqiColor(post.aqi)}`}>
                                        AQI: {post.aqi}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
                            <div className="flex space-x-4 text-sm">
                                <button 
                                    onClick={() => handleLikePost(post.id)}
                                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    {post.likes}
                                </button>
                                <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    {post.comments}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}</svg></button></svg></div>