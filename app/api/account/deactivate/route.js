import { createClient } from '@supabase/supabase-js'
import { getSession, clearSessionCookieHeader } from '@/lib/session'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  try {
    const session = getSession(req)
    if (!session) return Response.json({ error: 'غير مصرح' }, { status: 401 })

    const { error: userErr } = await supabase
      .from('users')
      .update({ is_deactivated: true, deactivated_at: new Date().toISOString() })
      .eq('id', session.id)
    if (userErr) throw userErr

    if (session.role === 'candidate') {
      await supabase.from('candidates').update({ is_visible: false }).eq('user_id', session.id)
    } else if (session.role === 'company') {
      await supabase.from('jobs').update({ status: 'closed' }).eq('company_id', session.id)
    }

    const res = Response.json({ success: true })
    res.headers.set('Set-Cookie', clearSessionCookieHeader())
    return res
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}