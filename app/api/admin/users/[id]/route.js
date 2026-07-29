import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { global: { fetch: (url, opts={}) => fetch(url, { ...opts, cache: 'no-store' }) } }
)

export async function DELETE(req, { params }) {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', params.id)
    if (error) throw error
    return Response.json({ success: true })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(req, { params }) {
  try {
    const body = await req.json()
    const updates = {}
    if (body.is_banned !== undefined) updates.is_banned = body.is_banned
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', params.id)
      .select('id')
    if (error) throw error
    if (!data?.length) throw new Error('لم يتم تحديث أي مستخدم — تحقق من صلاحيات RLS أو SUPABASE_SERVICE_KEY')
    return Response.json({ success: true })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}