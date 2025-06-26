import { NextResponse } from 'next/server';

const NASA_API_KEY = process.env.NASA_API_KEY;

export async function GET() {
  try {
    console.log('NASA API Key available:', !!NASA_API_KEY);
    console.log('NASA API Key (first 10 chars):', NASA_API_KEY?.substring(0, 10));

    if (!NASA_API_KEY) {
      return NextResponse.json({ error: 'NASA API key not configured' }, { status: 500 });
    }

    // Test with a simple APOD request first
    const apodUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
    console.log('Testing APOD URL:', apodUrl);

    const apodResponse = await fetch(apodUrl);
    console.log('APOD Response status:', apodResponse.status);

    if (!apodResponse.ok) {
      const errorText = await apodResponse.text();
      console.error('APOD Error:', errorText);
      return NextResponse.json({ error: `APOD API failed: ${apodResponse.status}`, details: errorText }, { status: 500 });
    }

    const apodData = await apodResponse.json();
    console.log('APOD Data received successfully');

    // Now test Mars Rover API
    const marsUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2012-08-08&api_key=${NASA_API_KEY}`;
    console.log('Testing Mars URL:', marsUrl);

    const marsResponse = await fetch(marsUrl);
    console.log('Mars Response status:', marsResponse.status);

    if (!marsResponse.ok) {
      const errorText = await marsResponse.text();
      console.error('Mars Error:', errorText);
      return NextResponse.json({ error: `Mars API failed: ${marsResponse.status}`, details: errorText }, { status: 500 });
    }

    const marsData = await marsResponse.json();
    console.log('Mars Data received, photos count:', marsData.photos?.length || 0);

    return NextResponse.json({
      success: true,
      apod: { title: apodData.title, date: apodData.date },
      mars: {
        rover: 'curiosity',
        date: '2012-08-08',
        photoCount: marsData.photos?.length || 0,
        samplePhoto: marsData.photos?.[0]?.img_src || null
      }
    });

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 