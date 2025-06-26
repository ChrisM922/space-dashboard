import { NextRequest, NextResponse } from 'next/server';

const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/manifests';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rover = searchParams.get('rover');

    if (!rover) {
      return NextResponse.json(
        { error: 'Rover parameter is required' },
        { status: 400 }
      );
    }

    if (!NASA_API_KEY) {
      return NextResponse.json(
        { error: 'NASA API key not configured' },
        { status: 500 }
      );
    }

    // Build the API URL
    const url = `${NASA_BASE_URL}/${rover.toLowerCase()}?api_key=${NASA_API_KEY}`;

    // Fetch data from NASA API
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`NASA API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Validate response
    if (!data.photo_manifest) {
      throw new Error('Invalid mission manifest data received');
    }

    // Return the data with CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });

  } catch (error) {
    console.error('Error fetching mission manifest:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch mission manifest',
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