import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/session'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function PATCH(req) {
  try {
    const { id, name, phone } = await req.json()

    const session = getSession(req)
    if (!session || session.id !== id) {
      return Response.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { error } = await supabase
      .from('users')
      .update({ name, phone })
      .eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}