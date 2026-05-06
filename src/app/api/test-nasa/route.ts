import { NextResponse } from 'next/server';

const NASA_API_KEY = process.env.NASA_API_KEY;

export async function GET() {
  try {
    if (!NASA_API_KEY) {
      return NextResponse.json({ error: 'NASA API key not configured' }, { status: 500 });
    }

    const apodUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
    const apodResponse = await fetch(apodUrl);

    if (!apodResponse.ok) {
      const errorText = await apodResponse.text();
      return NextResponse.json({ error: `APOD API failed: ${apodResponse.status}`, details: errorText }, { status: 500 });
    }

    const apodData = await apodResponse.json();

    return NextResponse.json({
      success: true,
      apod: { title: apodData.title, date: apodData.date },
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
