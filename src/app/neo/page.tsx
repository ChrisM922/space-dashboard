import Link from 'next/link'

interface NEOData {
  element_count: number
  near_earth_objects: {
    [date: string]: Array<{
      id: string
      name: string
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: number
          estimated_diameter_max: number
        }
      }
      close_approach_data: Array<{
        close_approach_date: string
        relative_velocity: {
          kilometers_per_second: string
        }
        miss_distance: {
          kilometers: string
        }
      }>
      is_potentially_hazardous_asteroid: boolean
    }>
  }
}

export default async function NEOPage() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/neo`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!res.ok) {
      throw new Error('Failed to fetch NEO data')
    }

    const neoData: NEOData = await res.json()
    const dates = Object.keys(neoData.near_earth_objects)
    const allNEOs = dates.flatMap(date =>
      neoData.near_earth_objects[date].map(neo => ({ ...neo, date }))
    )

    return (
      <main className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold mb-2">Near-Earth Objects</h1>
            <p className="text-gray-400">
              Tracking {neoData.element_count} objects from {dates[0]} to {dates[dates.length - 1]}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {allNEOs.map((neo) => (
              <div
                key={neo.id}
                className={`bg-gray-800 rounded-lg p-6 border-l-4 ${neo.is_potentially_hazardous_asteroid
                  ? 'border-red-500'
                  : 'border-blue-500'
                  }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-blue-300">{neo.name}</h3>
                  {neo.is_potentially_hazardous_asteroid && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                      Hazardous
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Date:</span> {neo.date}</p>
                  <p>
                    <span className="text-gray-400">Diameter:</span> {
                      neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)
                    } - {
                      neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)
                    } km
                  </p>

                  {neo.close_approach_data[0] && (
                    <>
                      <p>
                        <span className="text-gray-400">Velocity:</span> {
                          parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(2)
                        } km/s
                      </p>
                      <p>
                        <span className="text-gray-400">Miss Distance:</span> {
                          (parseFloat(neo.close_approach_data[0].miss_distance.kilometers) / 1000000).toFixed(2)
                        } million km
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  } catch {
    return (
      <main className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Error Loading NEO Data</h1>
          <p className="text-gray-400 mb-6">Unable to load Near-Earth Objects data.</p>
          <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </main>
    )
  }
}
