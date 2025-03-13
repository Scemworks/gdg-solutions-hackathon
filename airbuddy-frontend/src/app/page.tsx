import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <main className="mb-10">
          <section className="text-center py-12">
            <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-300 mb-3">AirBuddy</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your personal air quality companion - track pollution, get health alerts and breathe easier
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            {/* About Card */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="flex items-center text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                AirBuddy is a personal air quality companion that helps you track pollution in your area, get health alerts based on the air quality index (AQI), and provides tips to stay safe. The app also features an interactive map to track pollution levels in real-time.
              </p>
              <a href="/aqi-tracking" className="inline-block bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                Get Started
              </a>
            </section>

            {/* Features Card */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="flex items-center text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Features
              </h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                {["Real-time air quality index (AQI) tracking",
                  "Health alerts based on air quality",
                  "Interactive pollution map",
                  "Safety tips for high pollution days"].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
              </ul>
            </section>
          </div>

          {/* Feature Exploration Section */}
          <section className="mt-12">
            <h2 className="flex items-center text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-6">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              Explore Our Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "AQI Tracking", desc: "Monitor real-time air quality data in your location using reliable API services", href: "/aqi-tracking" },
                { title: "Health Alerts", desc: "Receive personalized notifications based on air quality", href: "/health-alerts" },
                { title: "Pollution Map", desc: "View interactive pollution distribution in your region", href: "/pollution-map" },
                { title: "Safety Tips", desc: "Learn how to protect yourself on high pollution days", href: "/safety-tips" },
                { title: "Community Reports", desc: "Connect with others and share local air quality observations", href: "/community" }
              ].map((item, index) => (
                <a key={index} href={item.href} className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg p-5 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all">
                  <h3 className="font-medium text-lg text-blue-800 dark:text-blue-300 mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
