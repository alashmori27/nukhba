import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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
  const rawKey = process.env.SUPABASE_SERVICE_KEY
  const debug = {
    usingServiceKey: !!rawKey,
    keyPrefix: rawKey ? rawKey.slice(0, 12) : null,
    keyLength: rawKey ? rawKey.length : null,
  }
  try {
    const body = await req.json()
    const updates = {}
    if (body.is_banned !== undefined) updates.is_banned = body.is_banned

    const before = await supabase.from('users').select('id,is_banned').eq('id', params.id).maybeSingle()
    debug.before = { data: before.data, error: before.error?.message }

    const { data, error, status, statusText } = await supabase
      .from('users')
      .update(updates)
      .eq('id', params.id)
      .select()
    debug.update = { data, error: error?.message, status, statusText }
    if (error) throw error
    if (!data?.length) throw new Error('لم يتم تحديث أي مستخدم — تحقق من صلاحيات RLS أو SUPABASE_SERVICE_KEY')

    const after = await supabase.from('users').select('id,is_banned').eq('id', params.id).maybeSingle()
    debug.after = { data: after.data, error: after.error?.message }

    return Response.json({ success: true, debug })
  } catch(e) {
    return Response.json({ error: e.message, debug }, { status: 500 })
  }
}