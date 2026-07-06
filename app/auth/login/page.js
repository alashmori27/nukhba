'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab]         = useState('candidate') // candidate | company
  const [mode, setMode]       = useState('login')     // login | register
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [name, setName]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const C = {
    bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
    border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', goldLt:'#e4c87a',
    text:'#ede8df', muted:'#7a7690'
  }

  async function handleSubmit() {
    setError(''); setSuccess('')
    if (!email || !password) return setError('يرجى تعبئة جميع الحقول')
    if (mode === 'register' && !name) return setError('يرجى إدخال الاسم')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, email, password, name, role: tab })
      })
      const data = await res.json()

      if (data.error) { setError(data.error); setLoading(false); return }

      if (mode === 'register') {
        setSuccess('تم إنشاء الحساب! يرجى تسجيل الدخول.')
        setMode('login'); setLoading(false); return
      }

      // Save session
      localStorage.setItem('nukhba_user', JSON.stringify(data.user))

      // Redirect by role
      if (data.user.role === 'company') router.push('/company/dashboard')
      else router.push('/candidate/dashboard')

    } catch(e) {
      setError('خطأ في الاتصال — حاول مرة ثانية')
      setLoading(false)
    }
  }

  const onKey = e => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, fontFamily:"'Tajawal',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&display=swap" rel="stylesheet"/>

      {/* Logo */}
      <Link href="/" style={{ textAlign:'center', marginBottom:40, display:'block' }}>
        <div style={{ fontSize:42, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:C.muted, textTransform:'uppercase' }}>Nukhba</div>
      </Link>

      {/* Card */}
      <div style={{ width:'100%', maxWidth:420, background:C.card, border:`1px solid ${C.border}`, borderRadius:20, overflow:'hidden' }}>

        {/* Tab — من أنت */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }}>
          {[['candidate','باحث عن عمل'],['company','شركة']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)} style={{
              padding:'16px', fontSize:14, fontWeight:700, cursor:'pointer', border:'none',
              fontFamily:"'Tajawal',sans-serif",
              background: tab===val ? 'linear-gradient(135deg,#7a5e28,#c8a04a)' : C.surface,
              color: tab===val ? '#06060e' : C.muted,
              borderBottom: `2px solid ${tab===val ? C.gold : C.border}`,
              transition:'all .2s'
            }}>{label}</button>
          ))}
        </div>

        <div style={{ padding:32 }}>
          <h2 style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:6, textAlign:'center' }}>
            {mode==='login' ? 'أهلاً بك' : 'إنشاء حساب جديد'}
          </h2>
          <p style={{ fontSize:13, color:C.muted, textAlign:'center', marginBottom:28 }}>
            {tab==='candidate' ? 'ابدأ مسيرتك المهنية مع نخبة' : 'جد أفضل المرشحين لشركتك'}
          </p>

          {/* Fields */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {mode==='register' && (
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:'block' }}>
                  {tab==='candidate' ? 'الاسم الكامل' : 'اسم الشركة'}
                </label>
                <input
                  value={name} onChange={e => setName(e.target.value)} onKeyDown={onKey}
                  placeholder={tab==='candidate' ? 'محمد العتيبي' : 'شركة الأمل للتوظيف'}
                  style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 16px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14 }}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:'block' }}>البريد الإلكتروني</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={onKey}
                placeholder="example@email.com"
                dir="ltr"
                style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 16px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14 }}
              />
            </div>

            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:'block' }}>كلمة المرور</label>
              <input
                type="password" value={password} onChange={e => setPass(e.target.value)} onKeyDown={onKey}
                placeholder="••••••••"
                dir="ltr"
                style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 16px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14 }}
              />
            </div>
          </div>

          {/* Error / Success */}
          {error   && <div style={{ marginTop:14, padding:'10px 14px', background:'rgba(201,74,74,.1)', border:'1px solid rgba(201,74,74,.3)', borderRadius:8, fontSize:13, color:'#c94a4a', textAlign:'center' }}>{error}</div>}
          {success && <div style={{ marginTop:14, padding:'10px 14px', background:'rgba(74,156,110,.1)', border:'1px solid rgba(74,156,110,.3)', borderRadius:8, fontSize:13, color:'#4a9c6e', textAlign:'center' }}>{success}</div>}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading} style={{
            width:'100%', marginTop:20, padding:'14px', borderRadius:10, border:'none',
            background: loading ? C.border : 'linear-gradient(135deg,#7a5e28,#c8a04a)',
            color: loading ? C.muted : '#06060e',
            fontSize:15, fontWeight:800, cursor: loading ? 'default' : 'pointer',
            fontFamily:"'Tajawal',sans-serif", transition:'all .2s'
          }}>
            {loading ? '...' : mode==='login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
          </button>

          {/* Toggle mode */}
          <p style={{ textAlign:'center', marginTop:18, fontSize:13, color:C.muted }}>
            {mode==='login' ? 'ما عندك حساب؟ ' : 'عندك حساب؟ '}
            <button onClick={() => { setMode(mode==='login'?'register':'login'); setError(''); setSuccess('') }}
              style={{ background:'none', border:'none', color:C.gold, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", fontSize:13, fontWeight:700 }}>
              {mode==='login' ? 'أنشئ حساباً' : 'سجّل دخولك'}
            </button>
          </p>
        </div>
      </div>

      <Link href="/" style={{ marginTop:24, fontSize:13, color:C.muted }}>← الرئيسية</Link>
    </div>
  )
}