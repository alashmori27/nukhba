import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// GET — جلب الطلبات
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId    = searchParams.get('user_id')
    const companyId = searchParams.get('company_id')
    const jobId     = searchParams.get('job_id')

    let query = supabase.from('applications').select('*').order('created_at', { ascending: false })

    if (userId)    query = query.eq('user_id', userId)
    if (companyId) query = query.eq('company_id', companyId)
    if (jobId)     query = query.eq('job_id', jobId)

    const { data, error } = await query
    if (error) throw error
    return Response.json({ applications: data })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

// POST — إنشاء طلب جديد
export async function POST(req) {
  try {
    const body = await req.json()
    const { data, error } = await supabase
      .from('applications')
      .insert([{
        job_id:       body.jobId,
        candidate_id: body.candidateId,
        company_id:   body.companyId,
        user_id:      body.userId,
        profile_json: body.profile || null,
        score:        body.score || 0,
        status:       'pending',
        created_at:   new Date().toISOString(),
        updated_at:   new Date().toISOString(),
      }])
      .select()
      .single()
    if (error) throw error
    return Response.json({ id: data.id, success: true })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}