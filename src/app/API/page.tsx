import Link from 'next/link';

export default function APIOverview() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <section className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Space Dashboard API Overview</h1>
        <p className="text-lg mb-6 text-gray-300">
          The Space Dashboard API provides programmatic access to real-time space data, astronomy images, and celestial event information. Designed for developers, educators, and enthusiasts, our API makes it easy to integrate space data into your own applications and projects.
        </p>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Available Endpoints</h2>
          <ul className="list-disc list-inside text-left text-gray-200 mx-auto max-w-md">
            <li><strong>/api/apod</strong> — Get NASA&apos;s Astronomy Picture of the Day (APOD)</li>
            <li><strong>/api/neo</strong> — Near-Earth Object tracking data</li>
            <li><strong>/api/iss</strong> — Live International Space Station location</li>
            <li><strong>/api/mars</strong> — Latest Mars rover images and discoveries</li>
            <li><strong>/api/launches</strong> — Upcoming rocket launches</li>
            <li><strong>/api/news</strong> — Space news headlines (coming soon)</li>
            <li><strong>/api/exoplanets</strong> — Exoplanet discoveries (coming soon)</li>
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Usage</h2>
          <p className="text-gray-300">All endpoints return JSON. No authentication is required for public data. For advanced features or higher rate limits, contact us for API access.</p>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Documentation & Support</h2>
          <p className="text-gray-300 mb-2">Full API documentation is available on our GitHub repository.</p>
          <Link href="https://github.com/ChrisM922/space-dashboard" className="text-blue-400 hover:text-blue-300 font-medium" target="_blank" rel="noopener noreferrer">View API Docs</Link>
        </div>
        <footer className="mt-8 text-gray-500 text-sm">© {new Date().getFullYear()} Space Dashboard API</footer>
      </section>
    </main>
  );
}
