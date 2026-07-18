import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')
    if (!userId) return Response.json({ error: 'user_id مطلوب' }, { status: 400 })

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error
    return Response.json({ notifications: data })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { user_id, type, title, body, meta } = await req.json()

    const { data, error } = await supabase
      .from('notifications')
      .insert([{ user_id, type, title, body: body||null, meta: meta||null }])
      .select()
      .single()

    if (error) throw error
    return Response.json({ id: data.id })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const { user_id } = await req.json()

    // تحديد كل إشعارات المستخدم كمقروءة
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user_id)

    if (error) throw error
    return Response.json({ success: true })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}