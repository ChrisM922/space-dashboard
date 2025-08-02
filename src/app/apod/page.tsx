// app/apod/page.tsx
import Image from 'next/image'
import Link from 'next/link'

export default async function ApodPage() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apod` || 'http://localhost:3002/api/apod' || 'https://discoverspace.christopher-mace.com/api/apod', {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!res.ok) {
      throw new Error('Failed to fetch APOD data')
    }

    const apod = await res.json()

    return (
      <main className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold mb-2">{apod.title}</h1>
            <p className="text-gray-400 text-sm">{apod.date}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <Image
              src={apod.url}
              alt={apod.title}
              width={800}
              height={600}
              className="rounded-lg w-full h-auto mb-4"
              priority
            />
            <p className="text-gray-200 leading-relaxed">{apod.explanation}</p>
          </div>

          {apod.hdurl && (
            <div className="text-center">
              <a
                href={apod.hdurl}
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
    )
  } catch {
    return (
      <main className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Error Loading APOD</h1>
          <p className="text-gray-400 mb-6">Unable to load today&apos;s Astronomy Picture of the Day.</p>
          <pre className="bg-gray-800 rounded-lg p-4 text-left overflow-x-auto text-sm mb-4">
            {JSON.stringify({ error: 'Failed to fetch APOD data' }, null, 2)}
          </pre>
          <br />
          <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </main>
    )
  }
}
