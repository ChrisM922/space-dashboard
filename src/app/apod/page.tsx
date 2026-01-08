// app/apod/page.tsx

import Image from 'next/image';
import Link from 'next/link';

const defaultSpaceImage = {
  src: '/default-space-image.jpg',
  alt: 'Default Space Image',
  title: 'Astronomy Picture of the Day',
  date: '',
  explanation: 'This is a default image used when the APOD data cannot be fetched.',
  hdurl: '',
};

/* async function getAPODImage() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://discoverspace.christopher-mace.com';
    const res = await fetch(`${baseUrl}/api/apod`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch APOD');
    const apod = await res.json();
    return {
      src: apod.url,
      alt: apod.title,
      title: apod.title,
      date: apod.date,
      explanation: apod.explanation,
      hdurl: apod.hdurl || '',
    };
  } catch (error) {
    console.error('Error fetching APOD:', error instanceof Error ? error.message : String(error));
    return { ...defaultSpaceImage, hdurl: '' };
  }
} */

export default async function ApodPage() {
  /* const apod = await getAPODImage(); */

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">{defaultSpaceImage.title}</h1>
          <p className="text-gray-400 text-sm">{defaultSpaceImage.date}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <Image
            src={defaultSpaceImage.src}
            alt={defaultSpaceImage.alt}
            width={800}
            height={600}
            className="rounded-lg w-full h-auto mb-4"
            priority
          />
          <p className="text-gray-200 leading-relaxed">{defaultSpaceImage.explanation}</p>
        </div>

        {defaultSpaceImage.hdurl && defaultSpaceImage.hdurl !== '' && (
          <div className="text-center">
            <a
              href={defaultSpaceImage.hdurl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors inline-block"
            >
              View HD Version
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
