import { createClient } from '@supabase/supabase-js'
import { createSessionToken, sessionCookieHeader } from '@/lib/session'
import { checkRateLimit, getIP } from '@/lib/rateLimit'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  try {
    const { email, code } = await req.json()
    if (!email || !code) return Response.json({ error: 'بيانات ناقصة' }, { status: 400 })

    const ip = getIP(req)
    const limit = checkRateLimit(`verify:${ip}`, { windowMs: 15 * 60 * 1000, maxAttempts: 8 })
    if (limit.blocked) {
      return Response.json({ error: `تم تجاوز الحد المسموح. حاول مرة أخرى بعد ${limit.minutesLeft} دقيقة` }, { status: 429 })
    }

    const { data: pending, error: fetchErr } = await supabase
      .from('pending_registrations')
      .select('*')
      .eq('email', email)
      .single()

    if (fetchErr || !pending) return Response.json({ error: 'لا يوجد طلب تسجيل بهذا البريد' }, { status: 404 })
    if (new Date(pending.expires_at) < new Date()) {
      await supabase.from('pending_registrations').delete().eq('id', pending.id)
      return Response.json({ error: 'انتهت صلاحية الرمز — يرجى التسجيل من جديد' }, { status: 400 })
    }
    if (pending.verification_code !== String(code).trim()) {
      return Response.json({ error: 'الرمز غير صحيح' }, { status: 400 })
    }

    // إنشاء الحساب الفعلي
    const { data: user, error: insertErr } = await supabase
      .from('users')
      .insert([{
        email: pending.email,
        password: pending.password,
        name: pending.name,
        role: pending.role,
        crn: pending.crn,
        phone: pending.phone,
        created_at: new Date().toISOString()
      }])
      .select().single()
    if (insertErr) throw insertErr

    await supabase.from('pending_registrations').delete().eq('id', pending.id)

    // تسجيل دخول تلقائي
    const token = createSessionToken(user.id, user.role)
    const res = Response.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
    res.headers.set('Set-Cookie', sessionCookieHeader(token))
    return res
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}