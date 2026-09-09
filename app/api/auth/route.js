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

      const safeRole = role === 'company' ? 'company' : 'candidate' // لا يسمح بأي دور آخر عبر التسجيل الذاتي
      const hashedPassword = await bcrypt.hash(password, 10)
      const code = String(Math.floor(100000 + Math.random() * 900000)) // رمز 6 أرقام
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 دقيقة

      // حذف أي تسجيل معلّق سابق بنفس الإيميل
      await supabase.from('pending_registrations').delete().eq('email', email)

      const { error } = await supabase
        .from('pending_registrations')
        .insert([{
          email, password: hashedPassword, name, role: safeRole,
          crn: crn||null, phone: phone||null,
          verification_code: code, expires_at: expiresAt.toISOString()
        }])
      if (error) throw error

      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'نخبة <no-reply@nukhbahr.com>',
        to: email,
        subject: 'رمز تأكيد حسابك — نخبة',
        html: `
          <div style="font-family:sans-serif; direction:rtl; text-align:right; max-width:480px; margin:0 auto;">
            <h2 style="color:#c8a04a;">مرحباً ${name || ''}</h2>
            <p>رمز تأكيد حسابك بمنصة نخبة هو:</p>
            <div style="font-size:32px; font-weight:bold; letter-spacing:8px; color:#c8a04a; text-align:center; padding:20px; background:#13131f; border-radius:10px; margin:16px 0;">${code}</div>
            <p style="color:#888; font-size:13px;">الرمز صالح لمدة 15 دقيقة. إذا لم تطلب هذا، تجاهل هذه الرسالة.</p>
          </div>
        `
      })

      return Response.json({ success: true, pendingVerification: true, email })
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

      // التحقق من حالة التعطيل
      if (data.is_deactivated) {
        const deactivatedAt = new Date(data.deactivated_at)
        const daysSince = (Date.now() - deactivatedAt.getTime()) / (1000 * 60 * 60 * 24)
        if (daysSince > 30) {
          return Response.json({ error: 'تم حذف هذا الحساب نهائياً' })
        }
        // استرجاع تلقائي خلال مهلة السماح
        await supabase.from('users').update({ is_deactivated: false, deactivated_at: null }).eq('id', data.id)
        if (data.role === 'candidate') {
          await supabase.from('candidates').update({ is_visible: true }).eq('user_id', data.id)
        } else if (data.role === 'company') {
          await supabase.from('jobs').update({ status: 'open' }).eq('company_id', data.id)
        }
      }

      // إعادة تعيين المحاولات عند النجاح
      resetRateLimit(`auth:${ip}`)

      const token = createSessionToken(data.id, data.role)
      const res = Response.json({
        user: { id: data.id, name: data.name, email: data.email, role: data.role },
        reactivated: data.is_deactivated || false
      })
      res.headers.set('Set-Cookie', sessionCookieHeader(token))
      return res
    }

  } catch(e) {
    console.error(e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}