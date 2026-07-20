'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [tab, setTab]       = useState('candidate')
  const [mode, setMode]     = useState('login')
  const [email, setEmail]   = useState('')
  const [password, setPass] = useState('')
  const [name, setName]     = useState('')
  const [phone, setPhone]   = useState('')
  const [crn, setCrn]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState('')

  // قراءة role من الـ URL
  useEffect(() => {
    const role = searchParams.get('role')
    if (role === 'company') setTab('company')
  }, [searchParams])

  function validateCRN(val) { return /^7\d{9}$/.test(val) }

  async function handleSubmit() {
    setError(''); setSuccess('')
    if (!email || !password) return setError('يرجى تعبئة جميع الحقول')
    if (mode === 'register' && !name) return setError('يرجى إدخال الاسم')
    if (mode === 'register' && tab === 'company') {
      if (!crn) return setError('يرجى إدخال رقم السجل التجاري')
      if (!validateCRN(crn)) return setError('رقم السجل يجب أن يبدأ بـ 7 ويتكون من 10 أرقام')
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ mode, email, password, name, role:tab, crn, phone })
      })
      const data = await res.json()
      if (data.error) { setError(data.error); setLoading(false); return }
      if (mode === 'register') {
        setSuccess('تم إنشاء الحساب! سجّل دخولك الآن.')
        setMode('login'); setLoading(false); return
      }
      localStorage.setItem('nukhba_user', JSON.stringify(data.user))
      router.push(data.user.role === 'company' ? '/company/dashboard' : '/candidate/dashboard')
    } catch(e) {
      setError('خطأ في الاتصال — حاول مجدداً')
      setLoading(false)
    }
  }

  const onKey = e => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 16px', fontFamily:"'Tajawal',sans-serif" }}>
      <style>{`
        .login-input {
          width:100%; background:var(--surface); border:1px solid var(--border);
          border-radius:10px; padding:11px 14px; color:var(--text);
          font-family:'Tajawal',sans-serif; font-size:14px;
          transition:border-color .2s; outline:none;
        }
        .login-input:focus { border-color:var(--gold); }
        .login-input::placeholder { color:var(--muted); }
        .tab-btn { transition:all .2s; cursor:pointer; border:none; font-family:'Tajawal',sans-serif; }
        .tab-btn:hover { opacity:.9; }
      `}</style>

      {/* Logo */}
      <Link href="/" style={{ textAlign:'center', marginBottom:32, display:'block', textDecoration:'none' }}>
        <div style={{ fontSize:36, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-1px' }}>نخبة</div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, letterSpacing:5, color:'var(--muted)', textTransform:'uppercase', marginTop:4 }}>Nukhba · AI Talent Platform</div>
      </Link>

      <div style={{ width:'100%', maxWidth:400, background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, overflow:'hidden', boxShadow:'0 24px 80px rgba(0,0,0,.4)' }}>

        {/* Tabs */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:'1px solid var(--border)' }}>
          {[['candidate','👤 باحث عن عمل'],['company','🏢 شركة']].map(([val,label]) => (
            <button key={val} className="tab-btn"
              onClick={() => { setTab(val); setError(''); setCrn(''); setPhone('') }}
              style={{
                padding:'14px 8px', fontSize:13, fontWeight:700,
                background: tab===val ? 'linear-gradient(135deg,#7a5e28,#c8a04a)' : 'var(--surface)',
                color: tab===val ? '#06060e' : 'var(--muted)',
              }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ padding:'28px 24px' }}>

          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:'var(--text)', marginBottom:4 }}>
              {mode==='login' ? 'أهلاً بك' : 'إنشاء حساب'}
            </h2>
            <p style={{ fontSize:12, color:'var(--muted)' }}>
              {tab==='candidate' ? 'ابدأ مسيرتك المهنية مع نخبة' : 'جد أفضل المرشحين لشركتك'}
            </p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {/* الاسم */}
            {mode==='register' && (
              <div>
                <label style={{ fontSize:11, color:'var(--muted)', marginBottom:5, display:'block' }}>
                  {tab==='candidate' ? 'الاسم الكامل' : 'اسم الشركة'}
                </label>
                <input className="login-input" value={name} onChange={e => setName(e.target.value)} onKeyDown={onKey}
                  placeholder={tab==='candidate' ? 'محمد العتيبي' : 'شركة الأمل'}/>
              </div>
            )}

            {/* جوال المتقدم */}
            {mode==='register' && tab==='candidate' && (
              <div>
                <label style={{ fontSize:11, color:'var(--muted)', marginBottom:5, display:'block' }}>
                  رقم الجوال <span style={{ fontSize:10, color:'var(--muted)', opacity:.7 }}>(اختياري — يظهر في CV)</span>
                </label>
                <input className="login-input" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                  onKeyDown={onKey} placeholder="05XXXXXXXX" dir="ltr" maxLength={10}/>
              </div>
            )}

            {/* السجل التجاري */}
            {mode==='register' && tab==='company' && (
              <div>
                <label style={{ fontSize:11, color:'var(--muted)', marginBottom:5, display:'block' }}>رقم السجل التجاري</label>
                <input className="login-input" value={crn}
                  onChange={e => setCrn(e.target.value.replace(/\D/g,'').slice(0,10))}
                  onKeyDown={onKey} placeholder="7XXXXXXXXX" dir="ltr" maxLength={10}
                  style={{ borderColor: crn.length>0 ? (validateCRN(crn)?'var(--success)':'var(--error)') : 'var(--border)' }}/>
                {crn.length>0 && (
                  <p style={{ fontSize:11, marginTop:4, color: validateCRN(crn)?'var(--success)':'var(--error)' }}>
                    {validateCRN(crn) ? '✓ رقم السجل صحيح' : 'يجب أن يبدأ بـ 7 ويتكون من 10 أرقام'}
                  </p>
                )}
              </div>
            )}

            {/* الإيميل */}
            <div>
              <label style={{ fontSize:11, color:'var(--muted)', marginBottom:5, display:'block' }}>البريد الإلكتروني</label>
              <input className="login-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={onKey} placeholder="example@email.com" dir="ltr"/>
            </div>

            {/* كلمة المرور */}
            <div>
              <label style={{ fontSize:11, color:'var(--muted)', marginBottom:5, display:'block' }}>كلمة المرور</label>
              <input className="login-input" type="password" value={password} onChange={e => setPass(e.target.value)}
                onKeyDown={onKey} placeholder="••••••••" dir="ltr"/>
            </div>
          </div>

          {/* رسائل */}
          {error && (
            <div style={{ marginTop:14, padding:'10px 14px', background:'rgba(201,74,74,.08)', border:'1px solid rgba(201,74,74,.25)', borderRadius:9, fontSize:13, color:'var(--error)', textAlign:'center' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ marginTop:14, padding:'10px 14px', background:'rgba(74,156,110,.08)', border:'1px solid rgba(74,156,110,.25)', borderRadius:9, fontSize:13, color:'var(--success)', textAlign:'center' }}>
              {success}
            </div>
          )}

          {/* زر الإرسال */}
          <button onClick={handleSubmit} disabled={loading} style={{
            width:'100%', marginTop:18, padding:'13px', borderRadius:10, border:'none',
            background: loading ? 'var(--surface)' : 'linear-gradient(135deg,#7a5e28,#c8a04a)',
            color: loading ? 'var(--muted)' : '#06060e',
            fontSize:15, fontWeight:800, cursor: loading ? 'default' : 'pointer',
            fontFamily:"'Tajawal',sans-serif", transition:'filter .2s',
          }}>
            {loading ? '⏳ جاري التحميل...' : mode==='login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
          </button>

          {/* تبديل الوضع */}
          <p style={{ textAlign:'center', marginTop:18, fontSize:13, color:'var(--muted)' }}>
            {mode==='login' ? 'ما عندك حساب؟ ' : 'عندك حساب؟ '}
            <button onClick={() => { setMode(mode==='login'?'register':'login'); setError(''); setSuccess(''); setCrn(''); setPhone('') }}
              style={{ background:'none', border:'none', color:'var(--gold)', cursor:'pointer', fontFamily:"'Tajawal',sans-serif", fontSize:13, fontWeight:700 }}>
              {mode==='login' ? 'أنشئ حساباً' : 'سجّل دخولك'}
            </button>
          </p>
        </div>
      </div>

      {/* رابط الرئيسية */}
      <Link href="/" style={{ marginTop:20, fontSize:13, color:'var(--muted)', textDecoration:'none', transition:'color .2s' }}
        onMouseEnter={e => e.currentTarget.style.color='var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color='var(--muted)'}>
        ← العودة للرئيسية
      </Link>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}