import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET(req) {
  try {
    const userId   = req.headers.get('x-user-id')
    const userRole = req.headers.get('x-user-role')
    if (!userId || !userRole) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const filterUserId    = searchParams.get('user_id')
    const filterCompanyId = searchParams.get('company_id')

    let query = supabase.from('candidates').select('*').order('created_at', { ascending: false })

    if (userRole === 'candidate' && filterUserId) {
      query = query.eq('user_id', filterUserId)
    } else if (userRole === 'company') {
      if (filterCompanyId) {
        query = query.eq('company_id', filterCompanyId)
      } else {
        query = query.eq('is_visible', true)
      }
    } else if (userRole === 'admin') {
      // admin يرى الكل
    } else {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await query
    if (error) throw error
    return Response.json({ candidates: data })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { data, error } = await supabase
      .from('candidates')
      .insert([{
        profile_json: body.profile,
        user_id:      body.userId,
        job_id:       body.jobId || null,
        company_id:   body.companyId || null,
        transcript:   body.transcript,
        name:         body.profile?.name,
        specialization: body.profile?.specialization,
        location:     body.profile?.location,
        experience_years: body.profile?.experience_years,
        score:        body.profile?.overall_score || 0,
        is_visible:   false,
        is_paid:      false,
      }])
      .select()
      .single()
    if (error) throw error
    return Response.json({ id: data.id, success: true })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}