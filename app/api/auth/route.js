import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  try {
    const { mode, email, password, name, role } = await req.json()

    if (mode === 'register') {
      // Check if email exists
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (existing) return Response.json({ error: 'البريد الإلكتروني مستخدم مسبقاً' })

      // Create user
      const { data, error } = await supabase
        .from('users')
        .insert([{ email, password, name, role, created_at: new Date().toISOString() }])
        .select()
        .single()

      if (error) throw error
      return Response.json({ success: true })
    }

    if (mode === 'login') {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single()

      if (error || !data) return Response.json({ error: 'البريد أو كلمة المرور غير صحيحة' })

      return Response.json({
        user: { id: data.id, name: data.name, email: data.email, role: data.role }
      })
    }

  } catch(e) {
    console.error(e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}