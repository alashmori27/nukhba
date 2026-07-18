import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function PATCH(req, { params }) {
  try {
    const body = await req.json()
    
    // بناء object التحديث بشكل صريح
    const updates = {}
    if (body.is_visible !== undefined) updates.is_visible = body.is_visible === true || body.is_visible === 'true'
    if (body.notes !== undefined) updates.notes = body.notes
    
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