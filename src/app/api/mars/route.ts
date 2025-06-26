import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers';

// Simple in-memory cache to reduce API calls
const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const getCacheKey = (rover: string, earthDate: string, sol: string | null, camera: string | null) => {
  return `${rover}-${earthDate}-${sol || 'null'}-${camera || 'null'}`;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rover = searchParams.get('rover');
    const earthDate = searchParams.get('earth_date');
    const sol = searchParams.get('sol');
    const camera = searchParams.get('camera');

    console.log('Mars API request:', { rover, earthDate, sol, camera });

    // Check cache first
    const cacheKey = getCacheKey(rover || '', earthDate || '', sol, camera);
    const cachedData = cache.get(cacheKey);

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log('Returning cached data for:', cacheKey);
      return NextResponse.json(cachedData.data, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Cache': 'HIT',
        },
      });
    }

    if (!rover) {
      return NextResponse.json(
        { error: 'Rover parameter is required' },
        { status: 400 }
      );
    }

    if (!earthDate && !sol) {
      return NextResponse.json(
        { error: 'Either earth_date or sol parameter is required' },
        { status: 400 }
      );
    }

    if (!NASA_API_KEY) {
      console.error('NASA API key not configured');
      return NextResponse.json(
        { error: 'NASA API key not configured' },
        { status: 500 }
      );
    }

    console.log('NASA API key configured:', NASA_API_KEY ? 'Yes' : 'No');
    console.log('NASA API key length:', NASA_API_KEY?.length || 0);

    // Build the API URL
    let url = `${NASA_BASE_URL}/${rover.toLowerCase()}/photos?api_key=${NASA_API_KEY}`;

    if (earthDate) {
      url += `&earth_date=${earthDate}`;
    } else if (sol) {
      url += `&sol=${sol}`;
    }

    if (camera) {
      console.log('Camera parameter being sent:', camera);
      url += `&camera=${camera}`;
    }

    console.log('NASA API URL:', url);

    // Fetch data from NASA API
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('NASA API response status:', response.status);
    console.log('NASA API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NASA API error response:', errorText);
      console.error('Request URL:', url);
      console.error('Request parameters:', { rover, earthDate, sol, camera });
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));

      // Handle rate limiting specifically
      if (response.status === 429) {
        return NextResponse.json(
          {
            error: 'NASA API rate limit exceeded',
            details: 'Too many requests to NASA API. Please wait a moment and try again.',
            retryAfter: response.headers.get('Retry-After') || '60'
          },
          { status: 429 }
        );
      }

      throw new Error(`NASA API responded with status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('NASA API data received, photos count:', data.photos?.length || 0);

    // Validate response
    if (!data.photos) {
      throw new Error('Invalid Mars Rover data received');
    }

    // Cache in Supabase if configured
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { error } = await supabase
        .from('mars_rover_cache')
        .upsert({
          rover: rover,
          sol: sol ? parseInt(sol) : null,
          earth_date: earthDate || null,
          camera: camera || null,
          timestamp: new Date().toISOString(),
          photo_count: data.photos.length,
          data: data,
        });

      if (error) {
        console.error('Supabase error:', error);
        // Don't fail the request if caching fails
      }
    }

    // Cache the data in memory
    cache.set(cacheKey, {
      timestamp: Date.now(),
      data: data,
    });

    // Return the data with CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });

  } catch (error) {
    console.error('Error fetching Mars Rover data:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch Mars Rover data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 