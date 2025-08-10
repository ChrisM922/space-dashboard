import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <section className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">About Space Dashboard</h1>
        <p className="text-lg mb-6 text-gray-300">
          Space Dashboard is an open-source project designed to make space data, astronomy news, and celestial discoveries accessible to everyone. Our mission is to inspire curiosity and exploration by providing real-time information from NASA, live tracking of the International Space Station, Mars rover updates, and more.
        </p>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Features</h2>
          <ul className="list-disc list-inside text-left text-gray-200 mx-auto max-w-md">
            <li>Astronomy Picture of the Day (APOD)</li>
            <li>Near-Earth Object tracking</li>
            <li>ISS live location</li>
            <li>Mars rover imagery and discoveries</li>
            <li>Upcoming rocket launches</li>
            <li>Space news and exoplanet discoveries (coming soon)</li>
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Tech Stack</h2>
          <p className="text-gray-300">Built with Next.js, Supabase, and Tailwind CSS. Deployed on modern cloud infrastructure for speed and reliability.</p>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Get Involved</h2>
          <p className="text-gray-300 mb-2">Space Dashboard is open source! Contributions, feedback, and feature requests are welcome.</p>
          <Link href="https://github.com/ChrisM922/space-dashboard" className="text-blue-400 hover:text-blue-300 font-medium" target="_blank" rel="noopener noreferrer">View on GitHub</Link>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Contact</h2>
          <p className="text-gray-300">Questions or suggestions? <Link href="/contact" className="text-blue-400 hover:text-blue-300">Contact us</Link>.</p>
        </div>
        <footer className="mt-8 text-gray-500 text-sm">© {new Date().getFullYear()} Space Dashboard. All rights reserved.</footer>
      </section>
    </main>
  );
}
