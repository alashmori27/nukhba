import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  try {
    const { mode, email, password, name, role, crn, phone } = await req.json()

    if (mode === 'register') {
      // تحقق من الإيميل
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (existing) return Response.json({ error: 'البريد الإلكتروني مستخدم مسبقاً' })

      // تشفير كلمة المرور
      const hashedPassword = await bcrypt.hash(password, 10)

      const { data, error } = await supabase
        .from('users')
        .insert([{
          email,
          password: hashedPassword,
          name,
          role,
          crn:  crn  || null,
          phone: phone || null,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return Response.json({ success: true })
    }

    if (mode === 'login') {
      // جلب المستخدم بالإيميل فقط
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !data) return Response.json({ error: 'البريد أو كلمة المرور غير صحيحة' })

      // التحقق من كلمة المرور
      let passwordMatch = false

      // دعم كلمات المرور القديمة غير المشفرة
      if (data.password.startsWith('$2')) {
        passwordMatch = await bcrypt.compare(password, data.password)
      } else {
        // كلمة مرور قديمة — نتحقق ثم نشفرها
        passwordMatch = data.password === password
        if (passwordMatch) {
          const hashed = await bcrypt.hash(password, 10)
          await supabase.from('users').update({ password: hashed }).eq('id', data.id)
        }
      }

      if (!passwordMatch) return Response.json({ error: 'البريد أو كلمة المرور غير صحيحة' })

      return Response.json({
        user: { id: data.id, name: data.name, email: data.email, role: data.role }
      })
    }

  } catch(e) {
    console.error(e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}