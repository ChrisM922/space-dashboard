import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: number;
  visibility: string;
}

export async function GET() {
  try {
    // Validate environment variables
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Fetch ISS position from open-notify API (free and reliable)
    const response = await fetch('http://api.open-notify.org/iss-now.json');

    if (!response.ok) {
      throw new Error(`ISS API error: ${response.status}`);
    }

    const data = await response.json();

    // Parse the ISS position data
    const issPosition: ISSPosition = {
      latitude: parseFloat(data.iss_position.latitude),
      longitude: parseFloat(data.iss_position.longitude),
      altitude: 408, // Average ISS altitude in km
      velocity: 7.66, // Average ISS velocity in km/s
      timestamp: data.timestamp,
      visibility: 'day', // Simplified - could be enhanced with sunrise/sunset data
    };

    // Cache in Supabase if configured
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { error } = await supabase
        .from('iss_cache')
        .upsert({
          timestamp: new Date(issPosition.timestamp * 1000).toISOString(),
          latitude: issPosition.latitude,
          longitude: issPosition.longitude,
          altitude: issPosition.altitude,
          velocity: issPosition.velocity,
          data: issPosition,
        });

      if (error) {
        console.error('Supabase error:', error);
        // Don't fail the request if caching fails
      }
    }

    return NextResponse.json(issPosition);
  } catch (error) {
    console.error('ISS API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ISS data' },
      { status: 500 }
    );
  }
} 