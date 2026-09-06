'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { LogoIcon, LogoText } from '@/components/brand'

function VerifyForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [code, setCode]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit() {
    setError('')
    if (!code || code.length !== 6) return setError('أدخل الرمز المكوّن من 6 أرقام')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      sessionStorage.clear()
      localStorage.removeItem('nukhba_profile_edited')
      localStorage.setItem('nukhba_user', JSON.stringify(data.user))
      router.push(data.user.role === 'company' ? '/company/dashboard' : '/candidate/dashboard')
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
        .code-input {
          width:100%; background:var(--surface); border:1px solid var(--border);
          border-radius:10px; padding:16px; color:var(--text);
          font-family:'IBM Plex Sans Arabic',sans-serif; font-size:28px; font-weight:800;
          letter-spacing:12px; text-align:center; outline:none; transition:border-color .2s;
        }
        .code-input:focus { border-color:var(--gold); }
      `}</style>

      <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom:32 }}>
        <LogoIcon size={48}/>
        <div style={{ width:1, height:44, background:'rgba(200,160,74,0.3)' }}/>
        <LogoText size="md"/>
      </Link>

      <div style={{ width:'100%', maxWidth:400, background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, padding:'32px 24px', boxShadow:'0 24px 80px rgba(0,0,0,.4)' }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:32, marginBottom:10 }}>📧</div>
          <h2 style={{ fontSize:18, fontWeight:800, color:'var(--text)', marginBottom:4 }}>تأكيد بريدك الإلكتروني</h2>
          <p style={{ fontSize:12, color:'var(--muted)', lineHeight:1.7 }}>
            أرسلنا رمزاً مكوناً من 6 أرقام إلى<br/>
            <strong style={{ color:'var(--text)' }}>{email}</strong>
          </p>
        </div>

        <input className="code-input" value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g,'').slice(0,6))}
          onKeyDown={onKey} placeholder="------" dir="ltr" maxLength={6} inputMode="numeric"/>

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
          {loading ? '⏳ جاري التحقق...' : 'تأكيد وإنشاء الحساب'}
        </button>

        <p style={{ textAlign:'center', marginTop:20, fontSize:13, color:'var(--muted)' }}>
          <Link href="/auth/login" style={{ color:'var(--gold)', textDecoration:'none', fontWeight:700 }}>← العودة لتسجيل الدخول</Link>
        </p>
      </div>
    </div>
  )
}

export default function VerifyCodePage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  )
}