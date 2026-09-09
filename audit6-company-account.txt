'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

const G  = 'var(--color-primary)'
const GD = 'var(--color-primary-dark, #7a5e28)'

export default function CompanyAccountPage() {
  const router = useRouter()
  const [user, setUser]       = useState(null)
  const [form, setForm]       = useState({ name:'', phone:'' })
  const [limits, setLimits]   = useState(null)
  const [passForm, setPassForm] = useState({ current:'', newPass:'', confirm:'' })
  const [loading, setLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError]     = useState('')
  const [passSuccess, setPassSuccess] = useState('')
  const [passError, setPassError]     = useState('')

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'company') { router.push('/candidate/dashboard'); return }
    setUser(parsed)
    setForm({ name: parsed.name || '', phone: parsed.phone || '' })
    fetchLimits(parsed)
  }, [])

  async function fetchLimits(u) {
    try {
      const res  = await fetch('/api/company/limits', { headers: { 'x-user-id': u.id, 'x-user-role': u.role } })
      const data = await res.json()
      setLimits(data)
    } catch(e) { console.error(e) }
  }

  async function saveChanges() {
    setLoading(true); setError(''); setSuccess('')
    try {
      const res = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, name: form.name, phone: form.phone })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const updated = { ...user, name: form.name, phone: form.phone }
      localStorage.setItem('nukhba_user', JSON.stringify(updated))
      setUser(updated)
      setSuccess('تم حفظ التغييرات ✓')
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  async function changePassword() {
    setPassError(''); setPassSuccess('')
    if (!passForm.current || !passForm.newPass || !passForm.confirm) {
      return setPassError('يرجى تعبئة جميع الحقول')
    }
    if (passForm.newPass.length < 6) {
      return setPassError('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل')
    }
    if (passForm.newPass !== passForm.confirm) {
      return setPassError('كلمة المرور الجديدة غير متطابقة')
    }
    setPassLoading(true)
    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          currentPassword: passForm.current,
          newPassword: passForm.newPass
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setPassSuccess('تم تغيير كلمة المرور بنجاح ✓')
      setPassForm({ current:'', newPass:'', confirm:'' })
    } catch(e) { setPassError(e.message) }
    setPassLoading(false)
  }

  if (!user) return null

  const initial = (user.name || '؟')[0]

  return (
    <div style={{ minHeight:'100vh', background:'var(--color-background)', fontFamily:"'IBM Plex Sans Arabic', sans-serif", color:'var(--color-foreground)' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');`}</style>

      <Navbar/>

      <div style={{ maxWidth:600, margin:'0 auto', padding:'56px 20px 80px' }}>

        {/* Header + Avatar */}
        <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:32, padding:'28px 28px', background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:18 }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:`linear-gradient(135deg,${GD},${G})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:800, color:'#06060e', flexShrink:0 }}>
            {initial}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:19, fontWeight:800, color:'var(--color-foreground)', marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</div>
            <div style={{ fontSize:13, color:'var(--color-foreground-muted)' }}>{user.email}</div>
          </div>
        </div>

        {/* بطاقة الخطة الحالية */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <span style={{ fontSize:16 }}>💳</span>
            <h2 style={{ fontSize:15, fontWeight:800, color:'var(--color-foreground)' }}>الخطة الحالية</h2>
          </div>

          <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:16, padding:24 }}>
            {!limits ? (
              <div style={{ textAlign:'center', color:'var(--color-foreground-muted)', fontSize:13, padding:'10px 0' }}>⏳ جاري التحميل...</div>
            ) : limits.isPaid ? (
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:'rgba(74,156,110,.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>⭐</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#4a9c6e' }}>خطة مدفوعة نشطة</div>
                  <div style={{ fontSize:12, color:'var(--color-foreground-muted)', marginTop:2 }}>نشر وظائف غير محدود</div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                  <span style={{ fontSize:13, color:'var(--color-foreground-muted)' }}>الخطة المجانية — وظائف منشورة (تراكمي)</span>
                  <span style={{ fontSize:13, fontWeight:700, color: limits.remaining===0 ? '#c94a4a' : G }}>{limits.posted} / {limits.limit}</span>
                </div>
                <div style={{ height:6, background:'var(--color-border)', borderRadius:10, overflow:'hidden', marginBottom: limits.remaining===0 ? 14 : 0 }}>
                  <div style={{ height:'100%', width:`${Math.min((limits.posted/limits.limit)*100,100)}%`, background: limits.remaining===0 ? '#c94a4a' : G, borderRadius:10, transition:'width .3s' }}/>
                </div>
                {limits.remaining === 0 && (
                  <button onClick={() => alert('Moyasar — قريباً!')} style={{ width:'100%', padding:'11px', borderRadius:10, border:'none', background:`linear-gradient(135deg,${GD},${G})`, color:'#06060e', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:"'IBM Plex Sans Arabic', sans-serif" }}>
                    اشترك للمزيد — 199 ريال
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* معلومات الشركة */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <span style={{ fontSize:16 }}>🏢</span>
            <h2 style={{ fontSize:15, fontWeight:800, color:'var(--color-foreground)' }}>معلومات الشركة</h2>
          </div>

          <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:16, padding:24 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ fontSize:12, color:'var(--color-foreground-muted)', marginBottom:6, display:'block', fontWeight:500 }}>البريد الإلكتروني</label>
                <div style={{ background:'var(--color-background)', border:'1px solid var(--color-border)', borderRadius:10, padding:'11px 14px', color:'var(--color-foreground-muted)', fontSize:13 }}>{user.email}</div>
              </div>
              <div>
                <label style={{ fontSize:12, color:'var(--color-foreground-muted)', marginBottom:6, display:'block', fontWeight:500 }}>اسم الشركة</label>
                <input value={form.name} onChange={e => setForm(p => ({...p, name:e.target.value}))}
                  placeholder="اسم الشركة"
                  style={{ width:'100%', background:'var(--color-background)', border:'1px solid var(--color-border)', borderRadius:10, padding:'11px 14px', color:'var(--color-foreground)', fontFamily:"'IBM Plex Sans Arabic', sans-serif", fontSize:13, outline:'none' }}/>
              </div>
              <div>
                <label style={{ fontSize:12, color:'var(--color-foreground-muted)', marginBottom:6, display:'block', fontWeight:500 }}>رقم التواصل</label>
                <input value={form.phone} onChange={e => setForm(p => ({...p, phone:e.target.value.replace(/\D/g,'').slice(0,10)}))}
                  placeholder="05XXXXXXXX" dir="ltr" maxLength={10}
                  style={{ width:'100%', background:'var(--color-background)', border:'1px solid var(--color-border)', borderRadius:10, padding:'11px 14px', color:'var(--color-foreground)', fontFamily:"'IBM Plex Sans Arabic', sans-serif", fontSize:13, outline:'none' }}/>
              </div>
              {user.crn && (
                <div>
                  <label style={{ fontSize:12, color:'var(--color-foreground-muted)', marginBottom:6, display:'block', fontWeight:500 }}>رقم السجل التجاري</label>
                  <div style={{ background:'var(--color-background)', border:'1px solid var(--color-border)', borderRadius:10, padding:'11px 14px', color:'var(--color-foreground-muted)', fontSize:13 }} dir="ltr">{user.crn}</div>
                </div>
              )}
            </div>

            {error   && <div style={{ marginTop:14, padding:'10px 14px', background:'rgba(201,74,74,.08)', border:'1px solid rgba(201,74,74,.25)', borderRadius:8, fontSize:12, color:'#c94a4a' }}>{error}</div>}
            {success && <div style={{ marginTop:14, padding:'10px 14px', background:'rgba(74,156,110,.08)', border:'1px solid rgba(74,156,110,.25)', borderRadius:8, fontSize:12, color:'#4a9c6e' }}>{success}</div>}

            <button onClick={saveChanges} disabled={loading} style={{ width:'100%', marginTop:18, padding:'13px', borderRadius:10, border:'none', background:loading?'var(--color-border)':`linear-gradient(135deg,${GD},${G})`, color:loading?'var(--color-foreground-muted)':'#06060e', fontSize:14, fontWeight:800, cursor:loading?'default':'pointer', fontFamily:"'IBM Plex Sans Arabic', sans-serif", transition:'filter .2s' }}>
              {loading ? '⏳ جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </div>

        {/* تغيير كلمة المرور */}
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <span style={{ fontSize:16 }}>🔒</span>
            <h2 style={{ fontSize:15, fontWeight:800, color:'var(--color-foreground)' }}>تغيير كلمة المرور</h2>
          </div>

          <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:16, padding:24 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ fontSize:12, color:'var(--color-foreground-muted)', marginBottom:6, display:'block', fontWeight:500 }}>كلمة المرور الحالية</label>
                <input type="password" value={passForm.current} onChange={e => setPassForm(p => ({...p, current:e.target.value}))}
                  placeholder="••••••••" dir="ltr"
                  style={{ width:'100%', background:'var(--color-background)', border:'1px solid var(--color-border)', borderRadius:10, padding:'11px 14px', color:'var(--color-foreground)', fontFamily:"'IBM Plex Sans Arabic', sans-serif", fontSize:13, outline:'none' }}/>
              </div>
              <div>
                <label style={{ fontSize:12, color:'var(--color-foreground-muted)', marginBottom:6, display:'block', fontWeight:500 }}>كلمة المرور الجديدة</label>
                <input type="password" value={passForm.newPass} onChange={e => setPassForm(p => ({...p, newPass:e.target.value}))}
                  placeholder="••••••••" dir="ltr"
                  style={{ width:'100%', background:'var(--color-background)', border:'1px solid var(--color-border)', borderRadius:10, padding:'11px 14px', color:'var(--color-foreground)', fontFamily:"'IBM Plex Sans Arabic', sans-serif", fontSize:13, outline:'none' }}/>
              </div>
              <div>
                <label style={{ fontSize:12, color:'var(--color-foreground-muted)', marginBottom:6, display:'block', fontWeight:500 }}>تأكيد كلمة المرور</label>
                <input type="password" value={passForm.confirm} onChange={e => setPassForm(p => ({...p, confirm:e.target.value}))}
                  placeholder="••••••••" dir="ltr"
                  style={{ width:'100%', background:'var(--color-background)', border:'1px solid var(--color-border)', borderRadius:10, padding:'11px 14px', color:'var(--color-foreground)', fontFamily:"'IBM Plex Sans Arabic', sans-serif", fontSize:13, outline:'none' }}/>
              </div>
            </div>

            {passError   && <div style={{ marginTop:14, padding:'10px 14px', background:'rgba(201,74,74,.08)', border:'1px solid rgba(201,74,74,.25)', borderRadius:8, fontSize:12, color:'#c94a4a' }}>{passError}</div>}
            {passSuccess && <div style={{ marginTop:14, padding:'10px 14px', background:'rgba(74,156,110,.08)', border:'1px solid rgba(74,156,110,.25)', borderRadius:8, fontSize:12, color:'#4a9c6e' }}>{passSuccess}</div>}

            <button onClick={changePassword} disabled={passLoading} style={{ width:'100%', marginTop:18, padding:'13px', borderRadius:10, border:'1px solid var(--color-border)', background:'transparent', color:'var(--color-foreground)', fontSize:14, fontWeight:700, cursor:passLoading?'default':'pointer', fontFamily:"'IBM Plex Sans Arabic', sans-serif", opacity:passLoading?.7:1, transition:'border-color .2s' }}
              onMouseEnter={e => !passLoading && (e.currentTarget.style.borderColor = 'var(--color-primary)')}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}>
              {passLoading ? '⏳ جاري التغيير...' : 'تغيير كلمة المرور'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}