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

const EDITABLE_FIELDS = [
  'title', 'description', 'requirements', 'location',
  'salary_range', 'salary_visible', 'work_type', 'questions', 'status',
]

async function requireOwner(req, params) {
  const user = getAuthUser(req)
  if (!user) return { error: Response.json({ error: 'غير مصرح' }, { status: 401 }) }

  if (user.role === 'admin') return { user }

  const { data: row, error } = await supabase.from('jobs').select('company_id').eq('id', params.id).single()
  if (error || !row) return { error: Response.json({ error: 'غير موجود' }, { status: 404 }) }
  if (user.role !== 'company' || user.id !== row.company_id) {
    return { error: Response.json({ error: 'غير مصرح' }, { status: 403 }) }
  }
  return { user }
}

export async function PATCH(req, { params }) {
  try {
    const { error: authError } = await requireOwner(req, params)
    if (authError) return authError

    const body = await req.json()
    const updates = {}
    for (const key of EDITABLE_FIELDS) {
      if (body[key] !== undefined) updates[key] = body[key]
    }

    const { error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', params.id)
    if (error) throw error
    return Response.json({ success: true })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const { error: authError } = await requireOwner(req, params)
    if (authError) return authError

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', params.id)
    if (error) throw error
    return Response.json({ success: true })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
