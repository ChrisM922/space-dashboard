import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    // Validate environment variables
    const NASA_KEY = process.env.NASA_API_KEY
    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!NASA_KEY) {
      return NextResponse.json(
        { error: 'NASA API key not configured' },
        { status: 500 }
      )
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start') || new Date().toISOString().slice(0, 10);
    const end = searchParams.get('end') || start;

    const resp = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${NASA_KEY}`
    );

    if (!resp.ok) {
      throw new Error(`NASA API error: ${resp.status}`)
    }

    const neo = await resp.json();

    // Validate NEO data
    if (!neo.element_count || !neo.near_earth_objects) {
      throw new Error('Invalid NEO data received')
    }

    // Cache in Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await supabase
      .from('neo_cache')
      .upsert({ date: start, data: neo });

    if (error) {
      console.error('Supabase error:', error)
      // Don't fail the request if caching fails, just log it
    }

    return NextResponse.json(neo);
  } catch (error) {
    console.error('NEO API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch NEO data' },
      { status: 500 }
    )
  }
}
