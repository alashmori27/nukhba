import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/adminAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { global: { fetch: (url, opts={}) => fetch(url, { ...opts, cache: 'no-store' }) } }
)

export const dynamic = 'force-dynamic'

export async function GET(req) {
  const denied = requireAdmin(req)
  if (denied) return denied
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id,email,name,role,phone,crn,is_banned,created_at')
      .order('created_at', { ascending: false })
    if (error) throw error
    return Response.json({ users: data })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}