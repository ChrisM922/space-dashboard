import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const NASA_KEY = process.env.NASA_API_KEY;

    if (!NASA_KEY) {
      return NextResponse.json(
        { error: 'NASA API key not configured' },
        { status: 500 }
      );
    }

    const nasaRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`);

    if (!nasaRes.ok) {
      throw new Error(`NASA API error: ${nasaRes.status}`);
    }

    const apod = await nasaRes.json();

    if (!apod.title || !apod.url) {
      throw new Error('Invalid APOD data received');
    }

    return NextResponse.json(apod);
  } catch (error) {
    console.error('APOD API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch APOD data' },
      { status: 500 }
    );
  }
}
