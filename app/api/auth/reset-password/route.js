import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json()
    if (!token || !newPassword) return Response.json({ error: 'بيانات ناقصة' }, { status: 400 })
    if (newPassword.length < 6) return Response.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 })

    const { data: user } = await supabase.from('users').select('id, reset_token_expires').eq('reset_token', token).single()

    if (!user) return Response.json({ error: 'رابط غير صالح' }, { status: 400 })
    if (new Date(user.reset_token_expires) < new Date()) {
      return Response.json({ error: 'انتهت صلاحية الرابط — اطلب رابطاً جديداً' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await supabase.from('users').update({
      password: hashed,
      reset_token: null,
      reset_token_expires: null
    }).eq('id', user.id)

    return Response.json({ success: true })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}