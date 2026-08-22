'use client'
import { useState } from 'react'
import Link from 'next/link'
import { LogoIcon, LogoText } from '@/components/brand'

export default function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit() {
    setError('')
    if (!email) return setError('يرجى إدخال البريد الإلكتروني')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setSent(true)
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
        .fp-input {
          width:100%; background:var(--surface); border:1px solid var(--border);
          border-radius:10px; padding:11px 14px; color:var(--text);
          font-family:'IBM Plex Sans Arabic',sans-serif; font-size:14px;
          transition:border-color .2s; outline:none;
        }
        .fp-input:focus { border-color:var(--gold); }
      `}</style>

      <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom:32 }}>
        <LogoIcon size={48}/>
        <div style={{ width:1, height:44, background:'rgba(200,160,74,0.3)' }}/>
        <LogoText size="md"/>
      </Link>

      <div style={{ width:'100%', maxWidth:400, background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, padding:'32px 24px', boxShadow:'0 24px 80px rgba(0,0,0,.4)' }}>

        {!sent ? (
          <>
            <div style={{ textAlign:'center', marginBottom:24 }}>
              <div style={{ fontSize:32, marginBottom:10 }}>🔑</div>
              <h2 style={{ fontSize:18, fontWeight:800, color:'var(--text)', marginBottom:4 }}>نسيت كلمة المرور؟</h2>
              <p style={{ fontSize:12, color:'var(--muted)', lineHeight:1.7 }}>أدخل بريدك الإلكتروني وسنرسل لك رابط استعادة</p>
            </div>

            <label style={{ fontSize:11, color:'var(--muted)', marginBottom:5, display:'block' }}>البريد الإلكتروني</label>
            <input className="fp-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={onKey} placeholder="example@email.com" dir="ltr"/>

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
              {loading ? '⏳ جاري الإرسال...' : 'إرسال رابط الاستعادة'}
            </button>
          </>
        ) : (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:14 }}>📧</div>
            <h2 style={{ fontSize:17, fontWeight:800, color:'var(--text)', marginBottom:10 }}>تحقق من بريدك</h2>
            <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.8 }}>
              إذا كان البريد الإلكتروني <strong style={{ color:'var(--text)' }}>{email}</strong> مسجلاً لدينا، ستصلك رسالة فيها رابط استعادة كلمة المرور خلال دقائق.
            </p>
          </div>
        )}

        <p style={{ textAlign:'center', marginTop:20, fontSize:13, color:'var(--muted)' }}>
          <Link href="/auth/login" style={{ color:'var(--gold)', textDecoration:'none', fontWeight:700 }}>← العودة لتسجيل الدخول</Link>
        </p>
      </div>
    </div>
  )
}