import Link from 'next/link';
import Image from 'next/image';

// Fallback image if APOD fails
/* const defaultSpaceImage = {
  src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop',
  alt: 'Space Nebula',
}; */

// Fetch APOD image for hero background
/* async function getAPODImage() {
  try {
    // Prefer fetching directly from NASA when the API key is available server-side.
    const NASA_KEY = process.env.NASA_API_KEY;
    if (NASA_KEY) {
      const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`);
      if (!res.ok) throw new Error(`NASA API error: ${res.status}`);
      const apod = await res.json();
      return { src: apod.url, alt: apod.title, title: apod.title, date: apod.date, explanation: apod.explanation };
    }

    // Fallback: call the internal API route if no NASA key is present.
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000' ||
      (process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://discoverspace.christopher-mace.com');
    const res = await fetch(`${baseUrl}/api/apod`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Internal APOD API error: ${res.status}`);
    const apod = await res.json();
    return { src: apod.url, alt: apod.title, title: apod.title, date: apod.date, explanation: apod.explanation };
  } catch (error) {
    console.error('Error fetching APOD:', error instanceof Error ? error.message : String(error));
    return { ...defaultSpaceImage, title: 'Astronomy Picture of the Day', date: '', explanation: '' };
  }
} */

const features = [
  {
    icon: '🌌',
    title: 'Astronomy Picture of the Day',
    description: 'Explore the cosmos through NASA\'s daily featured image.',
    link: '/apod',
    available: true,
  },
  {
    icon: '☄️',
    title: 'Near-Earth Objects',
    description: 'Track asteroids and comets that approach Earth\'s orbit.',
    link: '/neo',
    available: true,
  },
  {
    icon: '🛰️',
    title: 'ISS Tracker',
    description: 'Follow the International Space Station\'s orbit.',
    link: '/iss',
    available: true,
  },
  {
    icon: '🚀',
    title: 'Mars Rovers',
    description: 'Get the latest images and discoveries from Curiosity, Opportunity, and Spirit.',
    link: '/mars',
    available: true,
  },
  {
    icon: '🚀',
    title: 'Launches',
    description: 'Upcoming rocket launches from around the world.',
    link: '/launches',
    available: false,
  },
  {
    icon: '📰',
    title: 'Space News',
    description: 'Latest headlines in space exploration and astronomy.',
    link: '/news',
    available: false,
  },
  {
    icon: '🪐',
    title: 'Exoplanets',
    description: 'Discover planets orbiting other stars.',
    link: '/exoplanets',
    available: false,
  },
];

const liveData = [
  {
    label: 'ISS Location',
    value: 'Tracking…',
    color: 'text-blue-400',
    aria: 'Current location of the International Space Station',
  },
  {
    label: 'Next Launch',
    value: '2d 14h 33m',
    color: 'text-green-400',
    aria: 'Time until next rocket launch',
  },
  {
    label: 'Mars Weather',
    value: '-63°C',
    color: 'text-red-400',
    aria: 'Current weather on Mars',
  },
];

export default async function Home() {
  /* const apod = await getAPODImage(); */

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center text-center p-4 overflow-hidden">
        <Image
          src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop'
          alt=/* {apod.alt} */ 'Space Nebula'
          fill
          quality={100}
          sizes="100vw"
          className="absolute inset-0 object-cover z-0"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-0"></div>
        <div className="z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Explore The Cosmos</h1>
          <p className="text-xl mb-8 drop-shadow">Your gateway to real-time space data, astronomy news, and celestial discoveries.</p>
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-md font-medium text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            tabIndex={0}
            aria-label="Launch Dashboard"
          >
            Launch Dashboard
          </Link>
        <div className="mt-6">
          <p>Due to the government shutodown in 2025, NASA has archived some of the API's and they are no longer maintained or have been archived. Alternatives are being explored and integrated where possible.</p>
        </div>
        </div> 
      </section>


       

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-gray-800 rounded-lg p-6 flex flex-col items-start hover:bg-gray-700 transition-colors focus-within:ring-2 focus-within:ring-blue-400"
            tabIndex={0}
            aria-label={feature.title}
          >
            <span className="text-3xl mb-2">{feature.icon}</span>
            <h2 className="text-2xl font-bold mb-2">{feature.title}</h2>
            <p className="mb-4 text-gray-300 flex-1">{feature.description}</p>
            {feature.available ? (
              <Link
                href={feature.link}
                className="text-blue-400 hover:text-blue-300 font-medium focus:outline-none"
                tabIndex={0}
                aria-label={`Go to ${feature.title}`}
              >
                Explore →
              </Link>
            ) : (
              <span className="text-gray-500 font-medium bg-gray-700 rounded px-2 py-1 text-xs">Coming Soon</span>
            )}
          </div>
        ))}
      </section>

      {/* Live Data Section */}
      <section className="bg-gray-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Live Space Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveData.map((item) => (
              <div
                key={item.label}
                className="bg-gray-700 p-6 rounded-lg shadow flex flex-col items-center"
                tabIndex={0}
                aria-label={item.aria}
              >
                <p className="text-gray-400 mb-1">{item.label}</p>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6">Subscribe to our newsletter for the latest space discoveries and mission updates.</p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2 rounded-md flex-grow text-black"
              required
              aria-label="Email address"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md whitespace-nowrap text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Subscribe to newsletter"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-400 mb-4">© {new Date().getFullYear()} Space Dashboard</p>
          <div className="flex justify-center gap-6">
            <Link href="/about" className="text-gray-400 hover:text-white" tabIndex={0} aria-label="About">About</Link>
            <Link href="/API" className="text-gray-400 hover:text-white" tabIndex={0} aria-label="API">API</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white" tabIndex={0} aria-label="Contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}