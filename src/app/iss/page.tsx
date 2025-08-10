'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const ISSMap = dynamic(() => import('./ISSMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-700 rounded-lg p-4 h-96 flex items-center justify-center">
      <div className="text-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
         <p className="text-gray-400">Loading map...</p>
       </div>
     </div>
   ),
 });
 
 interface ISSPosition {
   latitude: number;
   longitude: number;
   altitude: number;
   velocity: number;
   timestamp: number;
   visibility: string;
 }
 
 export default function ISSPage() {
   const [issData, setIssData] = useState<ISSPosition | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
 
   const fetchISSData = async () => {
     try {
       setLoading(true);
       const baseUrl =
         process.env.NEXT_PUBLIC_BASE_URL ||
         (process.env.NODE_ENV === 'development'
           ? 'http://localhost:3000'
           : 'https://discoverspace.christopher-mace.com');
       const response = await fetch(`${baseUrl}/api/iss`);
 
       if (!response.ok) {
         throw new Error('Failed to fetch ISS data');
       }
 
       const data = await response.json();
       setIssData(data);
       setLastUpdate(new Date());
       setError(null);
     } catch (err) {
       setError('Unable to load ISS data');
       console.error('Error fetching ISS data:', err);
     } finally {
       setLoading(false);
     }
   };
 
   useEffect(() => {
     fetchISSData();
 
     // Auto-refresh every 30 seconds for page data
     const interval = setInterval(fetchISSData, 30000);
 
     return () => clearInterval(interval);
   }, []);
 
   // Separate effect for map data refresh (every 3 seconds)
   useEffect(() => {
     if (!issData) return; // Only start map refresh after initial data load
 
     const mapInterval = setInterval(() => {
       // Fetch fresh data for map updates
       const baseUrl =
         process.env.NEXT_PUBLIC_BASE_URL ||
         (process.env.NODE_ENV === 'development'
           ? 'http://localhost:3000'
           : 'https://discoverspace.christopher-mace.com');
       fetch(`${baseUrl}/api/iss`)
         .then(response => response.json())
         .then(data => {
           setIssData(data);
           setLastUpdate(new Date());
         })
         .catch(err => {
           console.error('Error updating map data:', err);
         });
     }, 3000);
 
     return () => clearInterval(mapInterval);
   }, [issData]); // Re-run when issData changes
 
   const getISSStatus = () => {
     if (!issData) return 'Unknown';
 
     const now = Date.now() / 1000;
     const timeDiff = now - issData.timestamp;
 
     if (timeDiff < 60) return 'Live';
     if (timeDiff < 300) return 'Recent';
     return 'Stale';
   };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'text-green-400';
      case 'Recent': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  if (error && !issData) {
    return (
      <main className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">ISS Tracker</h1>
          <p className="text-gray-400 mb-6">Unable to load ISS tracking data.</p>
          <button
            onClick={fetchISSData}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors mr-4"
          >
            Retry
          </button>
          <Link
            href="/dashboard"
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-md font-medium transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">ISS Tracker</h1>
              <p className="text-gray-400">Follow the International Space Station in real-time</p>
            </div>
            <div className="text-right">
              <button
                onClick={fetchISSData}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-md font-medium transition-colors"
                aria-label="Refresh ISS data"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {loading && !issData ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading ISS position...</p>
          </div>
        ) : (
          <>
            {/* Status Bar */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">Status:</span>
                  <span className={`font-semibold ${getStatusColor(getISSStatus())}`}>
                    {getISSStatus()}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  Last updated: {lastUpdate?.toLocaleTimeString() || 'Unknown'}
                </div>
              </div>
            </div>
            {/* About ISS Info */}
            <div className="mt-8 mb-8 bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">About the ISS</h2>
              <p className="text-gray-300 leading-relaxed">
                The International Space Station (ISS) is a modular space station in low Earth orbit.
                It is a multinational collaborative project involving five participating space agencies:
                NASA (United States), Roscosmos (Russia), JAXA (Japan), ESA (Europe), and CSA (Canada).
                The ISS serves as a microgravity and space environment research laboratory in which scientific
                research is conducted in astrobiology, astronomy, meteorology, physics, and other fields.
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Map Section */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Current Position</h2>
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-gray-400 text-sm">Latitude</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {issData?.latitude.toFixed(4)}°
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Longitude</p>
                      <p className="text-2xl font-bold text-green-400">
                        {issData?.longitude.toFixed(4)}°
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Map */}
                <ISSMap issData={issData} />
              </div>

              {/* Data Section */}
              <div className="space-y-6">
                {/* Orbital Data */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Orbital Data</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Altitude</span>
                      <span className="font-semibold">{issData?.altitude} km</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Velocity</span>
                      <span className="font-semibold">{issData?.velocity} km/s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Orbital Period</span>
                      <span className="font-semibold">~92 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Orbits per Day</span>
                      <span className="font-semibold">~15.5</span>
                    </div>
                  </div>
                </div>

                {/* Mission Info */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Mission Info</h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">Launch Date:</span>
                      <span className="ml-2">November 20, 1998</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Crew:</span>
                      <span className="ml-2">7 astronauts</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Countries:</span>
                      <span className="ml-2">15 nations</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Size:</span>
                      <span className="ml-2">109m × 73m (football field size)</span>
                    </div>
                  </div>
                </div>

                {/* Fun Facts */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Fun Facts</h2>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• ISS travels at 17,500 mph (28,000 km/h)</li>
                    <li>• Visible to the naked eye from Earth</li>
                    <li>• Has been continuously occupied since 2000</li>
                    <li>• Cost: ~$150 billion to build and operate</li>
                    <li>• Size of a 6-bedroom house</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
} 