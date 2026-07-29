import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { checkRateLimit, resetRateLimit, getIP } from '@/lib/rateLimit'
import { safeEqual } from '@/lib/crypto'
import { createSessionToken, sessionCookieHeader } from '@/lib/session'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  try {
    const { mode, email, password, name, role, crn, phone } = await req.json()
    const ip = getIP(req)

    // Rate limiting على تسجيل الدخول فقط
    if (mode === 'login') {
      const limit = checkRateLimit(`auth:${ip}`, { windowMs: 15 * 60 * 1000, maxAttempts: 5 })
      if (limit.blocked) {
        return Response.json({
          error: `تم تجاوز الحد المسموح. حاول مرة أخرى بعد ${limit.minutesLeft} دقيقة`
        }, { status: 429 })
      }
    }

    if (mode === 'register') {
      const { data: existing } = await supabase
        .from('users').select('id').eq('email', email).single()
      if (existing) return Response.json({ error: 'البريد الإلكتروني مستخدم مسبقاً' })

      const hashedPassword = await bcrypt.hash(password, 10)
      const { data, error } = await supabase
        .from('users')
        .insert([{ email, password: hashedPassword, name, role, crn: crn||null, phone: phone||null, created_at: new Date().toISOString() }])
        .select().single()
      if (error) throw error
      return Response.json({ success: true })
    }

    if (mode === 'login') {
      const { data, error } = await supabase
        .from('users').select('*').eq('email', email).single()

      if (error || !data) return Response.json({ error: 'البريد أو كلمة المرور غير صحيحة' })

      let passwordMatch = false
      if (data.password?.startsWith('$2')) {
        passwordMatch = await bcrypt.compare(password, data.password)
      } else {
        passwordMatch = safeEqual(data.password, password)
        if (passwordMatch) {
          const hashed = await bcrypt.hash(password, 10)
          await supabase.from('users').update({ password: hashed }).eq('id', data.id)
        }
      }

      if (!passwordMatch) return Response.json({ error: 'البريد أو كلمة المرور غير صحيحة' })

      // إعادة تعيين المحاولات عند النجاح
      resetRateLimit(`auth:${ip}`)

      const token = createSessionToken(data.id, data.role)
      const res = Response.json({
        user: { id: data.id, name: data.name, email: data.email, role: data.role }
      })
      res.headers.set('Set-Cookie', sessionCookieHeader(token))
      return res
    }

  } catch(e) {
    console.error(e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}