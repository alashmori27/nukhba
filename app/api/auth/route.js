import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Rate limiting بسيط في الذاكرة
const loginAttempts = new Map()

function checkRateLimit(ip) {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 دقيقة
  const maxAttempts = 5

  const record = loginAttempts.get(ip) || { count: 0, resetAt: now + windowMs }

  // إعادة تعيين بعد انتهاء الوقت
  if (now > record.resetAt) {
    record.count = 0
    record.resetAt = now + windowMs
  }

  record.count++
  loginAttempts.set(ip, record)

  if (record.count > maxAttempts) {
    const minutesLeft = Math.ceil((record.resetAt - now) / 60000)
    return { blocked: true, minutesLeft }
  }

  return { blocked: false }
}

function getIP(req) {
  return req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
}

export async function POST(req) {
  try {
    const { mode, email, password, name, role, crn, phone } = await req.json()

    // Rate limiting على تسجيل الدخول فقط
    if (mode === 'login') {
      const ip = getIP(req)
      const limit = checkRateLimit(ip)
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
        passwordMatch = data.password === password
        if (passwordMatch) {
          const hashed = await bcrypt.hash(password, 10)
          await supabase.from('users').update({ password: hashed }).eq('id', data.id)
        }
      }

      if (!passwordMatch) return Response.json({ error: 'البريد أو كلمة المرور غير صحيحة' })

      // إعادة تعيين المحاولات عند النجاح
      const ip = getIP(req)
      loginAttempts.delete(ip)

      return Response.json({
        user: { id: data.id, name: data.name, email: data.email, role: data.role }
      })
    }

  } catch(e) {
    console.error(e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}