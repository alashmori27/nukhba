import { createClient } from '@supabase/supabase-js'
import { isAdminRequest } from '@/lib/adminAuth'
import { getSession } from '@/lib/session'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function getAuthUser(req) {
  if (isAdminRequest(req)) return { id: 'admin', role: 'admin' }
  return getSession(req)
}

// GET — جلب الطلبات
export async function GET(req) {
  try {
    const user = getAuthUser(req)
    if (!user) return Response.json({ error: 'غير مصرح' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const userId    = searchParams.get('user_id')
    const companyId = searchParams.get('company_id')
    const jobId     = searchParams.get('job_id')

    if (user.role === 'candidate' && userId && userId !== user.id) {
      return Response.json({ error: 'غير مصرح' }, { status: 403 })
    }
    if (user.role === 'company' && companyId && companyId !== user.id) {
      return Response.json({ error: 'غير مصرح' }, { status: 403 })
    }

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
    const user = getAuthUser(req)
    if (!user || user.role !== 'candidate') return Response.json({ error: 'غير مصرح' }, { status: 401 })

    const body = await req.json()
    const { data, error } = await supabase
      .from('applications')
      .insert([{
        job_id:       body.jobId,
        candidate_id: body.candidateId,
        company_id:   body.companyId,
        user_id:      user.id,
        profile_json: body.profile || null,
        score:        body.score || 0,
        transcript:   body.transcript || null,
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
