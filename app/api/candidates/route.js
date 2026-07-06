import { supabase } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { profile } = await req.json()

    if (!supabase) {
      // No DB configured yet — return success anyway for dev
      return Response.json({ id: 'local-' + Date.now(), profile })
    }

    const { data, error } = await supabase
      .from('candidates')
      .insert([{
        name:              profile.name,
        specialization:    profile.specialization,
        location:          profile.location,
        experience_years:  profile.experience_years,
        score:             profile.overall_score,
        profile_json:      profile,
        created_at:        new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) throw error
    return Response.json({ id: data.id, profile })
  } catch (e) {
    console.error('Save candidate error:', e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    if (!supabase) {
      return Response.json({ candidates: [] })
    }

    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('score', { ascending: false })

    if (error) throw error
    return Response.json({ candidates: data })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
