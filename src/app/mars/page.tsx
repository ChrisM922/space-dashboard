'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MarsRoverPhoto {
  id: number;
  sol: number;
  camera: {
    id: number;
    name: string;
    rover_id: number;
    full_name: string;
  };
  img_src: string;
  earth_date: string;
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

interface MarsRoverResponse {
  photos: MarsRoverPhoto[];
}

interface MissionManifest {
  photo_manifest: {
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
    max_sol: number;
    max_date: string;
    total_photos: number;
    photos: Array<{
      sol: number;
      earth_date: string;
      total_photos: number;
      cameras: string[];
    }>;
  };
}

interface ApiErrorResponse {
  error?: string;
  details?: string;
  retryAfter?: string;
  raw?: string;
}

type RoverInfo = {
  name: string;
  launchDate: string;
  landingDate: string;
  status: string;
  description: string;
  icon: string;
  defaultDate: string;
  missionStartDate: string;
  missionEndDate: string;
  cameras: string[];
  disabled: boolean;
  galleryUrl?: string;
};

const cameraNames: { [key: string]: string } = {
  FHAZ: 'Front Hazard Avoidance Camera',
  RHAZ: 'Rear Hazard Avoidance Camera',
  MAST: 'Mast Camera',
  CHEMCAM: 'Chemistry and Camera Complex',
  MAHLI: 'Mars Hand Lens Imager',
  MARDI: 'Mars Descent Imager',
  NAVCAM: 'Navigation Camera',
  PANCAM: 'Panoramic Camera',
  MINITES: 'Miniature Thermal Emission Spectrometer (Mini-TES)',
  // Perseverance cameras
  EDL_RUCAM: 'Entry, Descent, and Landing Rover Up-Look Camera',
  EDL_RDCAM: 'Entry, Descent, and Landing Rover Down-Look Camera',
  EDL_DDCAM: 'Entry, Descent, and Landing Descent Stage Down-Look Camera',
  EDL_PUCAM1: 'Entry, Descent, and Landing Parachute Up-Look Camera A',
  EDL_PUCAM2: 'Entry, Descent, and Landing Parachute Up-Look Camera B',
  NAVCAM_LEFT: 'Navigation Camera - Left',
  NAVCAM_RIGHT: 'Navigation Camera - Right',
  MCZ_RIGHT: 'Mast Camera Zoom - Right',
  MCZ_LEFT: 'Mast Camera Zoom - Left',
  FRONT_HAZCAM_LEFT_A: 'Front Hazard Avoidance Camera - Left A',
  FRONT_HAZCAM_RIGHT_A: 'Front Hazard Avoidance Camera - Right A',
  REAR_HAZCAM_LEFT: 'Rear Hazard Avoidance Camera - Left',
  REAR_HAZCAM_RIGHT: 'Rear Hazard Avoidance Camera - Right',
  SKYCAM: 'SkyCam',
  SHERLOC_WATSON: 'SHERLOC WATSON Camera',
  SUPERCAM_RMI: 'SuperCam Remote Micro-Imager',
  PIXL_MCC: 'PIXL Micro-Context Camera',
};

const roverInfo: Record<string, RoverInfo> = {
  curiosity: {
    name: 'Curiosity',
    launchDate: 'November 26, 2011',
    landingDate: 'August 6, 2012',
    status: 'Active',
    description: 'Investigating Mars climate and geology, assessing whether the planet could have supported life.',
    icon: '🔬',
    defaultDate: '2012-08-08',
    missionStartDate: '2012-08-06',
    missionEndDate: new Date().toISOString().split('T')[0],
    cameras: ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'],
    disabled: false,
  },
  perseverance: {
    name: 'Perseverance',
    launchDate: 'July 30, 2020',
    landingDate: 'February 18, 2021',
    status: 'Active',
    description: 'Searching for signs of ancient life and collecting samples for future return to Earth.',
    icon: '🚀',
    defaultDate: '2021-02-18',
    missionStartDate: '2021-02-18',
    missionEndDate: new Date().toISOString().split('T')[0],
    cameras: ['EDL_RUCAM', 'EDL_RDCAM', 'EDL_DDCAM', 'EDL_PUCAM1', 'EDL_PUCAM2', 'NAVCAM_LEFT', 'NAVCAM_RIGHT', 'MCZ_RIGHT', 'MCZ_LEFT', 'FRONT_HAZCAM_LEFT_A', 'FRONT_HAZCAM_RIGHT_A', 'REAR_HAZCAM_LEFT', 'REAR_HAZCAM_RIGHT', 'SKYCAM', 'SHERLOC_WATSON', 'SUPERCAM_RMI', 'PIXL_MCC'],
    disabled: false,
  },
  opportunity: {
    name: 'Opportunity',
    launchDate: 'July 7, 2003',
    landingDate: 'January 25, 2004',
    status: 'End of Mission',
    description: 'Images no longer available via NASA API. See official MER Gallery for archives.',
    icon: '📡',
    defaultDate: '2004-01-27',
    missionStartDate: '2004-01-25',
    missionEndDate: '2019-02-13',
    cameras: [],
    disabled: true,
    galleryUrl: 'https://mars.nasa.gov/mer/gallery/all/',
  },
  spirit: {
    name: 'Spirit',
    launchDate: 'June 10, 2003',
    landingDate: 'January 4, 2004',
    status: 'End of Mission',
    description: 'Images no longer available via NASA API. See official MER Gallery for archives.',
    icon: '🔍',
    defaultDate: '2004-01-06',
    missionStartDate: '2004-01-04',
    missionEndDate: '2011-05-25',
    cameras: [],
    disabled: true,
    galleryUrl: 'https://mars.nasa.gov/mer/gallery/all/',
  },
};

export default function MarsPage() {
  const [selectedRover, setSelectedRover] = useState('curiosity');
  const [selectedDate, setSelectedDate] = useState(roverInfo.curiosity.defaultDate);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [marsData, setMarsData] = useState<MarsRoverResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allAvailableCameras, setAllAvailableCameras] = useState<string[]>([]);
  const [missionManifest, setMissionManifest] = useState<MissionManifest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [filterChangeKey, setFilterChangeKey] = useState(0);

  const fetchMissionManifest = async (rover: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/mars/manifest?rover=${rover}`);

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setMissionManifest(data);
    } catch (err) {
      console.error('Error fetching mission manifest:', err);
    }
  };

  const getSuggestedDates = () => {
    if (!missionManifest) return [];

    const photos = missionManifest.photo_manifest.photos;
    if (!photos || photos.length === 0) return [];

    // Get dates with the most photos
    const sortedPhotos = [...photos].sort((a, b) => b.total_photos - a.total_photos);
    return sortedPhotos.slice(0, 5).map(photo => photo.earth_date);
  };

  const fetchMarsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Add a small delay to help with rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      let url = `${baseUrl}/api/mars?rover=${selectedRover}&earth_date=${selectedDate}`;
      if (selectedCamera) {
        url += `&camera=${selectedCamera}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        let errorData: ApiErrorResponse = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}`, raw: await response.text() };
        }

        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.photos || data.photos.length === 0) {
        setError(`No images found for ${roverInfo[selectedRover as keyof typeof roverInfo]?.name} on ${selectedDate}. Try a different date.`);
        setMarsData(null);
      } else {
        setMarsData(data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';

      // If it's a rate limit error, suggest retrying
      if (errorMessage.includes('rate limit')) {
        setError(`NASA API rate limit exceeded. The system will automatically retry. If the problem persists, please wait a few minutes and try again. (${errorMessage})`);
      } else {
        setError(`Unable to load Mars Rover data: ${errorMessage}`);
      }
      setMarsData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedRover, selectedDate, selectedCamera]);

  useEffect(() => {
    fetchMarsData();
  }, [selectedRover, selectedDate, selectedCamera, fetchMarsData]);

  useEffect(() => {
    fetchMissionManifest(selectedRover);
  }, [selectedRover]);

  // Fetch all available cameras for the current rover/date (no camera filter)
  const fetchAllAvailableCameras = useCallback(async (rover: string, date: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const url = `${baseUrl}/api/mars?rover=${rover}&earth_date=${date}`;
      const response = await fetch(url);
      if (!response.ok) return setAllAvailableCameras([]);
      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        const cameras = [...new Set(data.photos.map((photo: MarsRoverPhoto) => photo.camera.name))] as string[];
        setAllAvailableCameras(cameras);
      } else {
        setAllAvailableCameras([]);
      }
    } catch {
      setAllAvailableCameras([]);
    }
  }, []);

  // Update allAvailableCameras when rover or date changes
  useEffect(() => {
    fetchAllAvailableCameras(selectedRover, selectedDate);
  }, [selectedRover, selectedDate, fetchAllAvailableCameras]);

  const handleRoverChange = (rover: string) => {
    setSelectedRover(rover);
    setSelectedCamera(''); // Reset camera when rover changes
    setSelectedDate(roverInfo[rover as keyof typeof roverInfo]?.defaultDate || '2023-01-01');
    setError(null); // Clear any previous errors
    setMissionManifest(null); // Clear previous manifest
    setFilterChangeKey(prev => prev + 1); // Trigger page reset
    setAllAvailableCameras([]); // Clear camera list
    fetchMissionManifest(rover); // Fetch new manifest
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedCamera(''); // Reset camera when date changes
    setFilterChangeKey(prev => prev + 1); // Trigger page reset
    setAllAvailableCameras([]); // Clear camera list
  };

  const handleCameraChange = (camera: string) => {
    setSelectedCamera(camera);
    setFilterChangeKey(prev => prev + 1); // Trigger page reset
  };

  const handleSuggestedDateClick = useCallback((date: string) => {
    setCurrentPage(1);
    setSelectedDate(date);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterChangeKey]);

  const handleRetry = useCallback(() => {
    fetchMarsData();
  }, [fetchMarsData]);

  // Get current rover's mission date range
  const getCurrentRoverDateRange = () => {
    const rover = roverInfo[selectedRover as keyof typeof roverInfo];
    return {
      min: rover?.missionStartDate || '2004-01-01',
      max: rover?.missionEndDate || new Date().toISOString().split('T')[0],
    };
  };

  // Pagination logic
  const totalImages = marsData?.photos.length || 0;
  const totalPages = Math.ceil(totalImages / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = marsData?.photos.slice(startIndex, endIndex) || [];

  if (error && !marsData) {
    return (
      <main className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Mars Rovers</h1>
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 mb-6">
            <p className="text-red-300 mb-4">{error}</p>
            <div className="text-sm text-gray-400">
              <p className="mb-2">Suggested date values for each rover:</p>
              <ul className="space-y-1">
                <li><strong>Curiosity:</strong> {roverInfo.curiosity.missionStartDate} to {roverInfo.curiosity.missionEndDate} (active)</li>
                <li><strong>Perseverance:</strong> {roverInfo.perseverance.missionStartDate} to {roverInfo.perseverance.missionEndDate} (active)</li>
                <li><strong>Opportunity:</strong> {roverInfo.opportunity.missionStartDate} to {roverInfo.opportunity.missionEndDate} (mission ended 2019)</li>
                <li><strong>Spirit:</strong> {roverInfo.spirit.missionStartDate} to {roverInfo.spirit.missionEndDate} (mission ended 2011)</li>
              </ul>
              <p className="mt-3 mb-2">Try these dates that are more likely to have images:</p>
              <ul className="space-y-1">
                <li><strong>Curiosity:</strong> 2012-08-08, 2012-08-15, 2013-01-01, 2015-01-01, 2020-01-01</li>
                <li><strong>Perseverance:</strong> 2021-02-18, 2021-02-20, 2021-03-01, 2022-01-01, 2023-01-01</li>
                <li><strong>Opportunity:</strong> 2004-01-27, 2004-02-01, 2005-01-01, 2010-01-01, 2015-01-01</li>
                <li><strong>Spirit:</strong> 2004-01-06, 2004-01-10, 2005-01-01, 2008-01-01, 2010-01-01</li>
              </ul>
            </div>
          </div>
          <div className="space-x-4">
            <button
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => {
                setSelectedRover('curiosity');
                setSelectedDate(roverInfo.curiosity.defaultDate);
                setSelectedCamera('');
                setError(null);
              }}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Back to Default
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Mars Rovers</h1>
          <p className="text-gray-400">Explore the Red Planet through the eyes of NASA&apos;s robotic explorers</p>
        </div>

        {/* Rover Selection */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Select Rover</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(roverInfo).map(([key, rover]) => (
              <button
                key={key}
                onClick={() => !rover.disabled && handleRoverChange(key)}
                className={`p-4 rounded-lg border-2 transition-all ${selectedRover === key
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-500'
                  } ${rover.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={rover.disabled}
                aria-disabled={rover.disabled}
                tabIndex={rover.disabled ? -1 : 0}
                title={rover.disabled ? rover.description : undefined}
              >
                <div className="text-3xl mb-2">{rover.icon}</div>
                <h3 className="font-semibold mb-1">{rover.name}</h3>
                <p className={`text-sm mb-2 ${rover.status === 'Active' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                  {rover.status}
                </p>
                <p className="text-xs text-gray-500">{rover.description}</p>
                {rover.disabled && rover.galleryUrl && (
                  <a
                    href={rover.galleryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-blue-400 hover:text-blue-300 text-xs underline"
                  >
                    View {rover.name} Gallery →
                  </a>
                )}
              </button>
            ))}
          </div>
          {Object.values(roverInfo).some(r => r.disabled) && (
            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg text-yellow-300 text-sm">
              Images for <strong>Opportunity</strong> and <strong>Spirit</strong> are not available via the NASA API. Please visit the official galleries for historical images.
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-2">Date (Earth Date)</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                min={getCurrentRoverDateRange().min}
                max={getCurrentRoverDateRange().max}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mission period: {getCurrentRoverDateRange().min} to {getCurrentRoverDateRange().max}
              </p>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-2">Camera</label>
              <select
                value={selectedCamera}
                onChange={(e) => handleCameraChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                disabled={allAvailableCameras.length === 0}
              >
                <option value="">All Cameras</option>
                {allAvailableCameras.length > 0 ? (
                  allAvailableCameras.map((camera) => (
                    <option key={camera} value={camera}>
                      {cameraNames[camera as keyof typeof cameraNames] || camera}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No cameras available</option>
                )}
              </select>
              {allAvailableCameras.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">Load data first to see available cameras</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-2">Actions</label>
              <button
                onClick={handleRetry}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-md font-medium transition-colors"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <div className="flex-1"></div>
            </div>
          </div>

          {/* Available Cameras Info */}
          {allAvailableCameras.length > 0 && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
              <p className="text-blue-300 text-sm mb-2">
                <strong>Available cameras for this selection:</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCameraChange('')}
                  className={`text-xs px-2 py-1 rounded transition-colors ${selectedCamera === ''
                    ? 'bg-blue-600 text-blue-200'
                    : 'bg-blue-700 text-blue-200 hover:bg-blue-600'
                    }`}
                >
                  All Cameras
                </button>
                {allAvailableCameras.map((camera) => (
                  <button
                    key={camera}
                    onClick={() => handleCameraChange(camera)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${selectedCamera === camera
                      ? 'bg-blue-600 text-blue-200'
                      : 'bg-blue-700 text-blue-200 hover:bg-blue-600'
                      }`}
                    title={cameraNames[camera as keyof typeof cameraNames] || camera}
                  >
                    {cameraNames[camera as keyof typeof cameraNames] || camera}
                  </button>
                ))}
              </div>
              {selectedCamera && (
                <p className="text-blue-200 text-xs mt-2">
                  Currently filtering by: <strong>{cameraNames[selectedCamera as keyof typeof cameraNames] || selectedCamera}</strong>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Rover Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Mission Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">Launch Date</h3>
              <p>{roverInfo[selectedRover as keyof typeof roverInfo]?.launchDate}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-400 mb-2">Landing Date</h3>
              <p>{roverInfo[selectedRover as keyof typeof roverInfo]?.landingDate}</p>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-400 mb-2">Status</h3>
              <p>{roverInfo[selectedRover as keyof typeof roverInfo]?.status}</p>
            </div>
          </div>

          {/* Mission Manifest Info */}
          {missionManifest && (
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <h3 className="font-semibold text-blue-300 mb-3">Mission Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total Photos:</span>
                  <p className="text-white font-semibold">{missionManifest.photo_manifest.total_photos.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-400">Max Sol:</span>
                  <p className="text-white font-semibold">{missionManifest.photo_manifest.max_sol}</p>
                </div>
                <div>
                  <span className="text-gray-400">Last Photo Date:</span>
                  <p className="text-white font-semibold">{missionManifest.photo_manifest.max_date}</p>
                </div>
                <div>
                  <span className="text-gray-400">Days with Photos:</span>
                  <p className="text-white font-semibold">{missionManifest.photo_manifest.photos.length}</p>
                </div>
              </div>

              {/* Suggested Dates */}
              {getSuggestedDates().length > 0 && (
                <div className="mt-4">
                  <p className="text-blue-300 text-sm mb-2">Dates with most photos:</p>
                  <div className="flex flex-wrap gap-2">
                    {getSuggestedDates().map((date) => (
                      <button
                        key={date}
                        onClick={() => handleSuggestedDateClick(date)}
                        className="text-xs bg-blue-700 text-blue-200 px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Images Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading Mars images...</p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Mars Images</h2>
              <p className="text-gray-400">
                {totalImages} images found
              </p>
            </div>

            {totalImages === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No Images Found</h3>
                <p className="text-gray-400">
                  Try adjusting the filters or selecting a different date.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentImages.map((photo) => (
                  <div key={photo.id} className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="relative h-64">
                      <Image
                        src={photo.img_src}
                        alt={`Mars photo from ${photo.rover.name} - ${photo.camera.full_name}`}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex items-center justify-center h-full bg-gray-700 text-gray-400">
                                <div class="text-center">
                                  <div class="text-4xl mb-2">📷</div>
                                  <p class="text-sm">Image unavailable</p>
                                  <a href="${photo.img_src}" target="_blank" class="text-blue-400 hover:text-blue-300 text-xs mt-2 block">
                                    View on NASA →
                                  </a>
                                </div>
                              </div>
                            `;
                          }
                        }}
                        onLoad={() => {
                        }}
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{photo.camera.full_name}</h3>
                      <div className="text-sm text-gray-400 space-y-1">
                        <p><span className="text-gray-500">Rover:</span> {photo.rover.name}</p>
                        <p><span className="text-gray-500">Earth Date:</span> {photo.earth_date}</p>
                      </div>
                      <a
                        href={photo.img_src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View Full Size →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-4">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-md transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-2">
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors"
                      >
                        1
                      </button>
                      {currentPage > 4 && <span className="text-gray-500">...</span>}
                    </>
                  )}

                  {/* Pages around current page */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => Math.abs(page - currentPage) <= 1)
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md transition-colors ${currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                  {/* Last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="text-gray-500">...</span>}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-md transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 