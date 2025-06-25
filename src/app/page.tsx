import Link from 'next/link';
import Image from 'next/image';

// Default space image for fallback
const defaultSpaceImage = {
  src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop",
  alt: "Space Nebula",
};

// Retrieve the APOD image from the route
async function getAPODImage() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/apod`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error('Failed to fetch APOD');
    }

    const apod = await res.json();
    return {
      src: apod.url,
      alt: apod.title,
    };
  } catch (error) {
    // Improved error logging
    if (error instanceof Error) {
      console.error('Error fetching APOD:', error.message);
    } else {
      console.error('Unknown error fetching APOD:', error);
    }
    return defaultSpaceImage;
  }
}

export default async function Home() {
  const spaceImage = await getAPODImage();

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center p-4 overflow-hidden">
        <Image
          src={spaceImage.src}
          alt={spaceImage.alt}
          fill
          quality={100}
          sizes="100vw"
          className="absolute inset-0 object-cover z-0"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div className="z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Explore The Cosmos</h1>
          <p className="text-xl mb-8">Your gateway to real-time space data, astronomy news, and celestial discoveries</p>
          <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors">
            Launch Dashboard
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Feature Cards */}
        {spaceFeatures.map((feature, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
            <h2 className="text-2xl font-bold mb-3">{feature.title}</h2>
            <p className="mb-4 text-gray-300">{feature.description}</p>
            <Link href={feature.link} className="text-blue-400 hover:text-blue-300 font-medium">
              {feature.linkText} →
            </Link>
          </div>
        ))}
      </section>

      {/* Live Data Section */}
      <section className="bg-gray-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Live Space Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-700 p-6 rounded-lg">
              <p className="text-gray-400 mb-1">ISS Location</p>
              <p className="text-2xl font-bold">Tracking...</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <p className="text-gray-400 mb-1">Next Launch</p>
              <p className="text-2xl font-bold">2d 14h 33m</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <p className="text-gray-400 mb-1">Mars Weather</p>
              <p className="text-2xl font-bold">-63°C</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6">Subscribe to our newsletter for the latest space discoveries and mission updates.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2 rounded-md flex-grow text-black"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-400 mb-4">© {new Date().getFullYear()} Space Dashboard</p>
          <div className="flex justify-center gap-6">
            <Link href="/about" className="text-gray-400 hover:text-white">About</Link>
            <Link href="/api" className="text-gray-400 hover:text-white">API</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Data for feature cards
const spaceFeatures = [
  {
    title: "ISS Tracker",
    description: "Follow the International Space Station in real-time as it orbits Earth at 17,500 mph.",
    link: "/iss",
    linkText: "Track now"
  },
  {
    title: "Mars Rovers",
    description: "Get the latest images and discoveries from Perseverance, Curiosity and other Mars missions.",
    link: "/mars",
    linkText: "See latest findings"
  },
  {
    title: "Launch Schedule",
    description: "Stay updated with upcoming rocket launches from SpaceX, NASA, and other space agencies.",
    link: "/launches",
    linkText: "View calendar"
  },
  {
    title: "Astronomy Picture of the Day",
    description: "Explore the cosmos through NASA's daily featured image and explanation.",
    link: "/apod",
    linkText: "View today's image"
  },
  {
    title: "Space News",
    description: "Read the latest headlines and developments in space exploration and astronomy.",
    link: "/news",
    linkText: "Read news"
  },
  {
    title: "Exoplanet Database",
    description: "Explore thousands of confirmed planets orbiting other stars beyond our solar system.",
    link: "/exoplanets",
    linkText: "Discover exoplanets"
  }
];