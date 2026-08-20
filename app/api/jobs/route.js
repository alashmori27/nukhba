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

export async function GET(req) {
  try {
    const user = getAuthUser(req)
    if (!user) return Response.json({ error: 'غير مصرح' }, { status: 401 })

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return Response.json({ jobs: data })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const user = getAuthUser(req)
    if (!user || user.role !== 'company') return Response.json({ error: 'غير مصرح' }, { status: 401 })

    const { data: company } = await supabase.from('users').select('name, jobs_posted_count, plan').eq('id', user.id).single()

    const FREE_LIMIT = 3
    const isPaid = company?.plan && company.plan !== 'free'
    if (!isPaid && (company?.jobs_posted_count || 0) >= FREE_LIMIT) {
      return Response.json({ error: 'استهلكت وظائفك المجانية الثلاث. يرجى الاشتراك لنشر المزيد.' }, { status: 403 })
    }

    const body = await req.json()
    console.log('🔍 nationality_preference received:', body.nationality_preference)
    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        company_id:   user.id,
        company_name: company?.name || body.company_name,
        title:        body.title,
        description:  body.description,
        requirements: body.requirements,
        location:     body.location,
        salary_range: body.salary_range,
        salary_visible: body.salary_visible,
        work_type:    body.work_type,
        questions:    body.questions,
        nationality_preference: body.nationality_preference || 'all',
        created_at:   new Date().toISOString()
      }])
      .select()
      .single()
    if (error) throw error
    return Response.json({ id: data.id })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
