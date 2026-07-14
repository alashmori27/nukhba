import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  try {
    const { profile, userId, jobId, transcript } = await req.json()

    const { data, error } = await supabase
      .from('candidates')
      .insert([{
        name:           profile.name,
        specialization: profile.specialization,
        location:       profile.location,
        experience_years: profile.experience_years,
        score:          profile.overall_score || 0,
        profile_json:   profile,
        transcript:     transcript || null,
        created_at:     new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return Response.json({ id: data.id })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return Response.json({ candidates: data })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}