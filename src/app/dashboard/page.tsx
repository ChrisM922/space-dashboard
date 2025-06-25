// src/app/dashboard/page.tsx
import Link from 'next/link';

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Space Dashboard</h1>
      <p className="mb-4">Pick a feature:</p>
      <ul className="space-y-2">
        <li><Link href="/apod" className="text-blue-400 hover:underline">Astronomy Picture of the Day</Link></li>
        <li><Link href="/neo" className="text-blue-400 hover:underline">Near-Earth Objects</Link></li>
        <li><Link href="/mars" className="text-blue-400 hover:underline">Mars Rover Photos</Link></li>
        <li><Link href="/launches" className="text-blue-400 hover:underline">Upcoming Launches</Link></li>
      </ul>
    </main>
  );
}
