import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  try {
    const { email } = await req.json()
    if (!email) return Response.json({ error: 'يرجى إدخال البريد الإلكتروني' }, { status: 400 })

    const { data: user } = await supabase.from('users').select('id, name').eq('email', email).single()

    // لأمان الخصوصية: نرجع نفس الرسالة سواء الإيميل موجود أو لا
    if (!user) {
      return Response.json({ success: true, message: 'إذا كان البريد مسجلاً، ستصلك رسالة الاستعادة' })
    }

    const token   = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // ساعة واحدة

    await supabase.from('users').update({
      reset_token: token,
      reset_token_expires: expires.toISOString()
    }).eq('id', user.id)

    const resetLink = `https://www.nukhbahr.com/auth/reset-password?token=${token}`

    await resend.emails.send({
      from: 'نخبة <no-reply@nukhbahr.com>',
      to: email,
      subject: 'استعادة كلمة المرور — نخبة',
      html: `
        <div style="font-family:sans-serif; direction:rtl; text-align:right; max-width:480px; margin:0 auto;">
          <h2 style="color:#c8a04a;">مرحباً ${user.name || ''}</h2>
          <p>وصلنا طلب لإعادة تعيين كلمة المرور لحسابك بمنصة نخبة.</p>
          <p>اضغط الرابط التالي لتعيين كلمة مرور جديدة (صالح لمدة ساعة واحدة):</p>
          <a href="${resetLink}" style="display:inline-block; padding:12px 28px; background:#c8a04a; color:#06060e; text-decoration:none; border-radius:8px; font-weight:bold; margin:16px 0;">إعادة تعيين كلمة المرور</a>
          <p style="color:#888; font-size:13px;">إذا لم تطلب هذا، تجاهل هذه الرسالة ولن يتغير شيء بحسابك.</p>
        </div>
      `
    })

    return Response.json({ success: true, message: 'إذا كان البريد مسجلاً، ستصلك رسالة الاستعادة' })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}