import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const NASA_KEY = process.env.NASA_API_KEY;

    if (!NASA_KEY) {
      return NextResponse.json(
        { error: 'NASA API key not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start') || new Date().toISOString().slice(0, 10);
    const end = searchParams.get('end') || start;

    const resp = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${NASA_KEY}`
    );

    if (!resp.ok) {
      throw new Error(`NASA API error: ${resp.status}`);
    }

    const neo = await resp.json();

    if (!neo.element_count || !neo.near_earth_objects) {
      throw new Error('Invalid NEO data received');
    }

    return NextResponse.json(neo);
  } catch (error) {
    console.error('NEO API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NEO data' },
      { status: 500 }
    );
  }
}
