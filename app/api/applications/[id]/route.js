import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// PATCH — تحديث الحالة
export async function PATCH(req, { params }) {
  try {
    const body = await req.json()
    const updates = { updated_at: new Date().toISOString() }
    if (body.status)        updates.status        = body.status
    if (body.company_notes) updates.company_notes = body.company_notes

    const { error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', params.id)

    if (error) throw error
    return Response.json({ success: true })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}