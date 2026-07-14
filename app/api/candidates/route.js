import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  try {
    const { profile, userId, jobId, companyId, transcript } = await req.json()

    // إذا تقدم على وظيفة — نجلب company_id من الوظيفة
    let resolvedCompanyId = companyId || null
    if (jobId && !resolvedCompanyId) {
      const { data: job } = await supabase
        .from('jobs')
        .select('company_id')
        .eq('id', jobId)
        .single()
      if (job) resolvedCompanyId = job.company_id
    }

    const { data, error } = await supabase
      .from('candidates')
      .insert([{
        name:             profile.name,
        specialization:   profile.specialization,
        location:         profile.location,
        experience_years: profile.experience_years,
        score:            profile.overall_score || 0,
        profile_json:     profile,
        transcript:       transcript || null,
        job_id:           jobId || null,
        company_id:       resolvedCompanyId,
        created_at:       new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return Response.json({ id: data.id })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const companyId = searchParams.get('company_id')

    let query = supabase
      .from('candidates')
      .select('*')
      .order('score', { ascending: false })

    // إذا طلبت شركة معينة — أرجع متقدمي وظائفها فقط
    if (companyId) {
      query = query.eq('company_id', companyId)
    }

    const { data, error } = await query
    if (error) throw error
    return Response.json({ candidates: data })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}