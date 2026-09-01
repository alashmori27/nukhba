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

export async function GET(req, { params }) {
  try {
    const user = getAuthUser(req)
    if (!user) return Response.json({ error: 'غير مصرح' }, { status: 401 })

    const { data, error } = await supabase
      .from('candidates')
      .select('is_paid, user_id, company_id')
      .eq('id', params.id)
      .single()
    if (error) throw error

    const isOwner   = user.role === 'candidate' && user.id === data.user_id
    const isCompany = user.role === 'company'   && user.id === data.company_id
    if (!isOwner && !isCompany && user.role !== 'admin') {
      return Response.json({ error: 'غير مصرح' }, { status: 403 })
    }

    return Response.json({ is_paid: data?.is_paid || false })
  } catch(e) {
    return Response.json({ is_paid: false })
  }
}