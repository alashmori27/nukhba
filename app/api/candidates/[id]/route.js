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
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', params.id)
      .single()
    if (error) throw error

    const user = getAuthUser(req)
    const isOwner   = user?.role === 'candidate' && user.id === data.user_id
    const isCompany = user?.role === 'company'   && user.id === data.company_id
    if (!user || (!isOwner && !isCompany && user.role !== 'admin')) {
      return Response.json({ error: 'غير مصرح' }, { status: 403 })
    }

    return Response.json(data)
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(req, { params }) {
  try {
    const body = await req.json()
    const user = getAuthUser(req)
    if (!user) return Response.json({ error: 'غير مصرح' }, { status: 401 })

    const { data: row, error: fetchErr } = await supabase
      .from('candidates').select('user_id,company_id').eq('id', params.id).single()
    if (fetchErr || !row) return Response.json({ error: 'غير موجود' }, { status: 404 })

    const updates = {}

    if (body.is_visible !== undefined || body.is_paid !== undefined) {
      const isOwner = user.role === 'candidate' && user.id === row.user_id
      if (!isOwner && user.role !== 'admin') return Response.json({ error: 'غير مصرح' }, { status: 403 })
      if (body.is_visible !== undefined) updates.is_visible = body.is_visible === true || body.is_visible === 'true'
      if (body.is_paid    !== undefined) updates.is_paid    = body.is_paid === true || body.is_paid === 'true'
    }

    if (body.status !== undefined || body.notes !== undefined) {
      const isCompany = user.role === 'company' && user.id === row.company_id
      if (!isCompany && user.role !== 'admin') return Response.json({ error: 'غير مصرح' }, { status: 403 })
      if (body.status !== undefined) updates.status = body.status
      if (body.notes  !== undefined) updates.notes  = body.notes
    }

    const { error } = await supabase
      .from('candidates')
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
    const user = getAuthUser(req)
    if (!user) return Response.json({ error: 'غير مصرح' }, { status: 401 })

    if (user.role !== 'admin') {
      const { data: row, error: fetchErr } = await supabase
        .from('candidates').select('user_id').eq('id', params.id).single()
      if (fetchErr || !row) return Response.json({ error: 'غير موجود' }, { status: 404 })
      if (user.role !== 'candidate' || user.id !== row.user_id) {
        return Response.json({ error: 'غير مصرح' }, { status: 403 })
      }
    }

    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', params.id)
    if (error) throw error
    return Response.json({ success: true })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
