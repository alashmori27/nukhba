import { createClient } from '@supabase/supabase-js'
import { isAdminRequest } from '@/lib/adminAuth'
import { getSession } from '@/lib/session'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { global: { fetch: (url, opts={}) => fetch(url, { ...opts, cache: 'no-store' }) } }
)

function getAuthUser(req) {
  if (isAdminRequest(req)) return { id: 'admin', role: 'admin' }
  return getSession(req)
}

export async function POST(req) {
  try {
    const user = getAuthUser(req)
    if (!user || user.role !== 'candidate') return Response.json({ error: 'غير مصرح' }, { status: 401 })

    const { profile, jobId, transcript } = await req.json()

    let resolvedCompanyId = null
    if (jobId) {
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
        user_id:          user.id,
        is_visible:       jobId ? false : true,
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
    const user = getAuthUser(req)
    if (!user) return Response.json({ error: 'غير مصرح' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const companyId = searchParams.get('company_id')
    const userId    = searchParams.get('user_id')

    let query = supabase.from('candidates').select('*').order('score', { ascending: false })

    if (user.role === 'candidate') {
      // يجلب فقط ملفات المستخدم الحالي — يتجاهل user_id من الـ URL
      query = query.eq('user_id', user.id)
    } else if (user.role === 'company') {
      if (companyId) {
        if (companyId !== user.id) return Response.json({ error: 'غير مصرح' }, { status: 403 })
        query = query.eq('company_id', companyId)
      } else {
        // تصفح عام — الملفات الظاهرة فقط
        query = query.eq('is_visible', true).is('job_id', null)
      }
    } else if (user.role === 'admin') {
      // الأدمن يرى الكل
    }

    const { data, error } = await query
    if (error) throw error
    return Response.json({ candidates: data })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}