import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function getAuthUser(req) {
  const userId   = req.headers.get('x-user-id')
  const userRole = req.headers.get('x-user-role')
  if (!userId || !userRole) return null
  // تحقق فقط أن المستخدم موجود في DB
  const { data } = await supabase.from('users').select('id').eq('id', userId).single()
  if (!data) return null
  // نستخدم الدور من الـ header لأنه أسرع
  return { id: userId, role: userRole }
}

export async function POST(req) {
  try {
    const { profile, userId, jobId, companyId, transcript } = await req.json()

    let resolvedCompanyId = companyId || null
    if (jobId && !resolvedCompanyId) {
      const { data: job } = await supabase.from('jobs').select('company_id').eq('id', jobId).single()
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
        user_id:          userId || null,
        is_visible:       true,
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
    const user = await getAuthUser(req)
    if (!user) return Response.json({ error: 'غير مصرح' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const companyId = searchParams.get('company_id')
    const userId    = searchParams.get('user_id')

    let query = supabase.from('candidates').select('*').order('score', { ascending: false })

    if (user.role === 'candidate') {
      if (!userId || userId !== user.id) return Response.json({ error: 'غير مصرح' }, { status: 403 })
      query = query.eq('user_id', userId)
    }

    if (user.role === 'company') {
      if (companyId) {
        query = query.eq('company_id', companyId)
      } else {
        // تصفح عام — الملفات الظاهرة فقط
        query = query.eq('is_visible', true)
      }
    }

    const { data, error } = await query
    if (error) throw error
    return Response.json({ candidates: data })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}