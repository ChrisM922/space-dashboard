import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  // 1. Fetch from NASA
  const NASA_KEY = process.env.NASA_API_KEY!
  const nasaRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`)
  const apod = await nasaRes.json()

  // 2. Write to Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { error } = await supabase
    .from('apod_cache')
    .upsert({
      date: apod.date,
      title: apod.title,
      url: apod.url,
      hdurl: apod.hdurl,
      explanation: apod.explanation,
    })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 3. Return it to the client too
  return NextResponse.json(apod)
}
