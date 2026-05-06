import { NextResponse } from 'next/server';

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
    const response = await fetch('http://api.open-notify.org/iss-now.json');

    if (!response.ok) {
      throw new Error(`ISS API error: ${response.status}`);
    }

    const data = await response.json();

    const issPosition: ISSPosition = {
      latitude: parseFloat(data.iss_position.latitude),
      longitude: parseFloat(data.iss_position.longitude),
      altitude: 408,
      velocity: 7.66,
      timestamp: data.timestamp,
      visibility: 'day',
    };

    return NextResponse.json(issPosition);
  } catch (error) {
    console.error('ISS API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ISS data' },
      { status: 500 }
    );
  }
}
