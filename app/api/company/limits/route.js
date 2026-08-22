import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/session'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const FREE_LIMIT = 3

export async function GET(req) {
  try {
    const user = getSession(req)
    if (!user || user.role !== 'company') return Response.json({ error: 'غير مصرح' }, { status: 401 })

    const { data: company } = await supabase.from('users').select('jobs_posted_count, plan').eq('id', user.id).single()

    const isPaid    = company?.plan && company.plan !== 'free'
    const posted    = company?.jobs_posted_count || 0
    const remaining = isPaid ? null : Math.max(FREE_LIMIT - posted, 0)

    return Response.json({ isPaid, posted, remaining, limit: FREE_LIMIT })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}