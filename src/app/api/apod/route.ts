import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Validate environment variables
    const NASA_KEY = process.env.NASA_API_KEY;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!NASA_KEY) {
      return NextResponse.json(
        { error: 'NASA API key not configured' },
        { status: 500 }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    // 1. Fetch from NASA
    const nasaRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`);

    if (!nasaRes.ok) {
      throw new Error(`NASA API error: ${nasaRes.status}`);
    }

    const apod = await nasaRes.json();

    // Validate APOD data
    if (!apod.title || !apod.url) {
      throw new Error('Invalid APOD data received');
    }

    // 2. Write to Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await supabase
      .from('apod_cache')
      .upsert({
        date: apod.date,
        title: apod.title,
        url: apod.url,
        hdurl: apod.hdurl,
        explanation: apod.explanation,
      });

    if (error) {
      console.error('Supabase error:', error);
      // Don't fail the request if caching fails, just log it
    }

    // 3. Return it to the client
    return NextResponse.json(apod);
  } catch (error) {
    console.error('APOD API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch APOD data' },
      { status: 500 }
    );
  }
}
