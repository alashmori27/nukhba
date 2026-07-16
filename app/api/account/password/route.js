import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  try {
    const { id, currentPassword, newPassword } = await req.json()

    // جلب كلمة المرور الحالية
    const { data: user, error } = await supabase
      .from('users')
      .select('password')
      .eq('id', id)
      .single()

    if (error || !user) throw new Error('المستخدم غير موجود')

    // التحقق من كلمة المرور الحالية
    let isMatch = false
    if (user.password.startsWith('$2')) {
      isMatch = await bcrypt.compare(currentPassword, user.password)
    } else {
      isMatch = user.password === currentPassword
    }

    if (!isMatch) throw new Error('كلمة المرور الحالية غير صحيحة')

    // تشفير وحفظ الجديدة
    const hashed = await bcrypt.hash(newPassword, 10)
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashed })
      .eq('id', id)

    if (updateError) throw updateError

    return Response.json({ success: true })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 400 })
  }
}