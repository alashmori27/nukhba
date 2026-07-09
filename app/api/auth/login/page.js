'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab]       = useState('candidate')
  const [mode, setMode]     = useState('login')
  const [email, setEmail]   = useState('')
  const [password, setPass] = useState('')
  const [name, setName]     = useState('')
  const [crn, setCrn]       = useState('')  // Commercial Registration Number
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState('')

  const C = {
    bg:'#080810', card:'#181828', surface:'#13131f',
    border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28',
    text:'#ede8df', muted:'#7a7690'
  }

  function validateCRN(val) {
    if (tab !== 'company') return true
    if (mode !== 'register') return true
    return /^7\d{9}$/.test(val)
  }

  async function handleSubmit() {
    setError(''); setSuccess('')
    if (!email || !password) return setError('يرجى تعبئة جميع الحقول')
    if (mode === 'register' && !name) return setError('يرجى إدخال الاسم')
    if (mode === 'register' && tab === 'company') {
      if (!crn) return setError('يرجى إدخال رقم السجل التجاري')
      if (!validateCRN(crn)) return setError('رقم السجل التجاري يجب أن يبدأ بـ 7 ويتكون من 10 أرقام')
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, email, password, name, role: tab, crn })
      })
      const data = await res.json()
      if (data.error) { setError(data.error); setLoading(false); return }
      if (mode === 'register') {
        setSuccess('تم إنشاء الحساب! يرجى تسجيل الدخول.')
        setMode('login'); setLoading(false); return
      }
      localStorage.setItem('nukhba_user', JSON.stringify(data.user))
      if (data.user.role === 'company') router.push('/company/dashboard')
      else router.push('/candidate/dashboard')
    } catch(e) {
      setError('خطأ في الاتصال')
      setLoading(false)
    }
  }

  const onKey = e => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, fontFamily:"'Tajawal',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;600&display=swap" rel="stylesheet"/>

      <Link href="/" style={{ textAlign:'center', marginBottom:36, display:'block' }}>
        <div style={{ fontSize:40, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:C.muted, textTransform:'uppercase' }}>Nukhba</div>
      </Link>

      <div style={{ width:'100%', maxWidth:420, background:C.card, border:`1px solid ${C.border}`, borderRadius:20, overflow:'hidden' }}>

        {/* Tab */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }}>
          {[['candidate','باحث عن عمل'],['company','شركة']].map(([val,label]) => (
            <button key={val} onClick={() => { setTab(val); setError('') }} style={{
              padding:'15px', fontSize:14, fontWeight:700, cursor:'pointer', border:'none',
              fontFamily:"'Tajawal',sans-serif",
              background: tab===val ? 'linear-gradient(135deg,#7a5e28,#c8a04a)' : C.surface,
              color: tab===val ? '#06060e' : C.muted,
              borderBottom: `2px solid ${tab===val ? C.gold : C.border}`,
            }}>{label}</button>
          ))}
        </div>

        <div style={{ padding:28 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:4, textAlign:'center' }}>
            {mode==='login' ? 'أهلاً بك' : 'إنشاء حساب جديد'}
          </h2>
          <p style={{ fontSize:12, color:C.muted, textAlign:'center', marginBottom:24 }}>
            {tab==='candidate' ? 'ابدأ مسيرتك المهنية مع نخبة' : 'جد أفضل المرشحين لشركتك'}
          </p>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {mode==='register' && (
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:5, display:'block' }}>
                  {tab==='candidate' ? 'الاسم الكامل' : 'اسم الشركة'}
                </label>
                <input value={name} onChange={e => setName(e.target.value)} onKeyDown={onKey}
                  placeholder={tab==='candidate' ? 'محمد العتيبي' : 'شركة الأمل للتوظيف'}
                  style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 14px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14 }}/>
              </div>
            )}

            {/* السجل التجاري — للشركات فقط عند التسجيل */}
            {mode==='register' && tab==='company' && (
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:5, display:'block' }}>رقم السجل التجاري</label>
                <input value={crn} onChange={e => setCrn(e.target.value.replace(/\D/g,'').slice(0,10))} onKeyDown={onKey}
                  placeholder="7XXXXXXXXX — 10 أرقام يبدأ بـ 7"
                  dir="ltr"
                  style={{
                    width:'100%', background:C.surface, fontSize:14, fontFamily:"'Tajawal',sans-serif",
                    border:`1px solid ${crn && !validateCRN(crn) ? '#c94a4a' : C.border}`,
                    borderRadius:10, padding:'11px 14px', color:C.text
                  }}/>
                {crn && !validateCRN(crn) && (
                  <div style={{ fontSize:11, color:'#c94a4a', marginTop:4 }}>يجب أن يبدأ بـ 7 ويتكون من 10 أرقام</div>
                )}
                {crn && validateCRN(crn) && (
                  <div style={{ fontSize:11, color:'#4a9c6e', marginTop:4 }}>✓ رقم السجل صحيح</div>
                )}
              </div>
            )}

            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:5, display:'block' }}>البريد الإلكتروني</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={onKey}
                placeholder="example@email.com" dir="ltr"
                style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 14px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14 }}/>
            </div>

            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:5, display:'block' }}>كلمة المرور</label>
              <input type="password" value={password} onChange={e => setPass(e.target.value)} onKeyDown={onKey}
                placeholder="••••••••" dir="ltr"
                style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 14px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14 }}/>
            </div>
          </div>

          {error   && <div style={{ marginTop:12, padding:'10px 14px', background:'rgba(201,74,74,.1)', border:'1px solid rgba(201,74,74,.3)', borderRadius:8, fontSize:13, color:'#c94a4a', textAlign:'center' }}>{error}</div>}
          {success && <div style={{ marginTop:12, padding:'10px 14px', background:'rgba(74,156,110,.1)', border:'1px solid rgba(74,156,110,.3)', borderRadius:8, fontSize:13, color:'#4a9c6e', textAlign:'center' }}>{success}</div>}

          <button onClick={handleSubmit} disabled={loading} style={{
            width:'100%', marginTop:18, padding:'13px', borderRadius:10, border:'none',
            background: loading ? C.border : 'linear-gradient(135deg,#7a5e28,#c8a04a)',
            color: loading ? C.muted : '#06060e',
            fontSize:15, fontWeight:800, cursor: loading ? 'default' : 'pointer',
            fontFamily:"'Tajawal',sans-serif",
          }}>
            {loading ? '...' : mode==='login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
          </button>

          <p style={{ textAlign:'center', marginTop:16, fontSize:13, color:C.muted }}>
            {mode==='login' ? 'ما عندك حساب؟ ' : 'عندك حساب؟ '}
            <button onClick={() => { setMode(mode==='login'?'register':'login'); setError(''); setSuccess('') }}
              style={{ background:'none', border:'none', color:C.gold, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", fontSize:13, fontWeight:700 }}>
              {mode==='login' ? 'أنشئ حساباً' : 'سجّل دخولك'}
            </button>
          </p>
        </div>
      </div>

      <Link href="/" style={{ marginTop:20, fontSize:13, color:C.muted }}>← الرئيسية</Link>
    </div>
    
  )
}