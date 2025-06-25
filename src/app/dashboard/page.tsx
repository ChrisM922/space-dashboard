// src/app/dashboard/page.tsx
import Link from 'next/link';

const dashboardFeatures = [
  {
    title: "Astronomy Picture of the Day",
    description: "Explore the cosmos through NASA's daily featured image and explanation.",
    link: "/apod",
    icon: "🌌",
    status: "active"
  },
  {
    title: "Near-Earth Objects",
    description: "Track asteroids and comets that approach Earth's orbit.",
    link: "/neo",
    icon: "☄️",
    status: "active"
  },
  {
    title: "ISS Tracker",
    description: "Follow the International Space Station in real-time as it orbits Earth.",
    link: "/iss",
    icon: "🛰️",
    status: "active"
  },
  {
    title: "Mars Rovers",
    description: "Get the latest images and discoveries from Perseverance and Curiosity.",
    link: "/mars",
    icon: "🚀",
    status: "coming-soon"
  },
  {
    title: "Launch Schedule",
    description: "Stay updated with upcoming rocket launches from space agencies worldwide.",
    link: "/launches",
    icon: "🚀",
    status: "coming-soon"
  },
  {
    title: "Space News",
    description: "Read the latest headlines and developments in space exploration.",
    link: "/news",
    icon: "📰",
    status: "coming-soon"
  }
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Space Dashboard</h1>
          <p className="text-gray-400">Your gateway to real-time space data and discoveries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardFeatures.map((feature, index) => (
            <div
              key={index}
              className={`bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all ${feature.status === 'coming-soon' ? 'opacity-60' : 'hover:bg-gray-750'
                }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{feature.icon}</span>
                {feature.status === 'coming-soon' && (
                  <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                    Coming Soon
                  </span>
                )}
              </div>

              <h2 className="text-xl font-semibold mb-3">{feature.title}</h2>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                {feature.description}
              </p>

              {feature.status === 'active' ? (
                <Link
                  href={feature.link}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Explore →
                </Link>
              ) : (
                <span className="text-gray-500 font-medium">Coming Soon</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">2</div>
              <div className="text-gray-400 text-sm">Active Features</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">24/7</div>
              <div className="text-gray-400 text-sm">Data Updates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">NASA</div>
              <div className="text-gray-400 text-sm">Data Source</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
