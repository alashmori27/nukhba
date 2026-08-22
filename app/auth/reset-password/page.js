'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { LogoIcon, LogoText } from '@/components/brand'

function ResetForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  async function handleSubmit() {
    setError('')
    if (!token) return setError('رابط غير صالح')
    if (!password || !confirm) return setError('يرجى تعبئة جميع الحقول')
    if (password.length < 6) return setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    if (password !== confirm) return setError('كلمتا المرور غير متطابقتين')

    setLoading(true)
    try {
      const res  = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setSuccess(true)
      setTimeout(() => router.push('/auth/login'), 2500)
    } catch(e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const onKey = e => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 16px', fontFamily:"'IBM Plex Sans Arabic', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        .rp-input {
          width:100%; background:var(--surface); border:1px solid var(--border);
          border-radius:10px; padding:11px 14px; color:var(--text);
          font-family:'IBM Plex Sans Arabic',sans-serif; font-size:14px;
          transition:border-color .2s; outline:none;
        }
        .rp-input:focus { border-color:var(--gold); }
      `}</style>

      <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom:32 }}>
        <LogoIcon size={48}/>
        <div style={{ width:1, height:44, background:'rgba(200,160,74,0.3)' }}/>
        <LogoText size="md"/>
      </Link>

      <div style={{ width:'100%', maxWidth:400, background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, padding:'32px 24px', boxShadow:'0 24px 80px rgba(0,0,0,.4)' }}>

        {!token ? (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:14 }}>⚠️</div>
            <h2 style={{ fontSize:17, fontWeight:800, color:'var(--text)', marginBottom:10 }}>رابط غير صالح</h2>
            <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.8, marginBottom:20 }}>
              يبدو أن هذا الرابط غير مكتمل. تأكد من نسخ الرابط كاملاً من رسالة البريد الإلكتروني.
            </p>
            <Link href="/auth/forgot-password" style={{ color:'var(--gold)', textDecoration:'none', fontWeight:700, fontSize:13 }}>← اطلب رابطاً جديداً</Link>
          </div>
        ) : success ? (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:14 }}>✅</div>
            <h2 style={{ fontSize:17, fontWeight:800, color:'var(--text)', marginBottom:10 }}>تم بنجاح!</h2>
            <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.8 }}>
              تم تحديث كلمة المرور. جاري تحويلك لتسجيل الدخول...
            </p>
          </div>
        ) : (
          <>
            <div style={{ textAlign:'center', marginBottom:24 }}>
              <div style={{ fontSize:32, marginBottom:10 }}>🔒</div>
              <h2 style={{ fontSize:18, fontWeight:800, color:'var(--text)', marginBottom:4 }}>كلمة مرور جديدة</h2>
              <p style={{ fontSize:12, color:'var(--muted)' }}>اختر كلمة مرور قوية لحسابك</p>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ fontSize:11, color:'var(--muted)', marginBottom:5, display:'block' }}>كلمة المرور الجديدة</label>
                <input className="rp-input" type="password" value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={onKey} placeholder="••••••••" dir="ltr"/>
              </div>
              <div>
                <label style={{ fontSize:11, color:'var(--muted)', marginBottom:5, display:'block' }}>تأكيد كلمة المرور</label>
                <input className="rp-input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  onKeyDown={onKey} placeholder="••••••••" dir="ltr"/>
              </div>
            </div>

            {error && (
              <div style={{ marginTop:14, padding:'10px 14px', background:'rgba(201,74,74,.08)', border:'1px solid rgba(201,74,74,.25)', borderRadius:9, fontSize:13, color:'var(--error)', textAlign:'center' }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading} style={{
              width:'100%', marginTop:18, padding:'13px', borderRadius:10, border:'none',
              background: loading ? 'var(--surface)' : 'linear-gradient(135deg,#7a5e28,#c8a04a)',
              color: loading ? 'var(--muted)' : '#06060e',
              fontSize:15, fontWeight:800, cursor: loading ? 'default' : 'pointer',
              fontFamily:"'IBM Plex Sans Arabic', sans-serif", transition:'filter .2s',
            }}>
              {loading ? '⏳ جاري الحفظ...' : 'حفظ كلمة المرور الجديدة'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  )
}