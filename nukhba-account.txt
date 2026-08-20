'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a'
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser]       = useState(null)
  const [form, setForm]       = useState({ name:'', phone:'' })
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
    setUser(parsed)
    setForm({ name: parsed.name || '', phone: parsed.phone || '' })
  }, [])

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
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet"/>

      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</div>
        <Link href="/candidate/dashboard" style={{ fontSize:13, color:C.muted, padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}`, textDecoration:'none' }}>← لوحة التحكم</Link>
      </nav>

      <div style={{ maxWidth:520, margin:'0 auto', padding:'48px 24px' }}>

        {/* Avatar */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:68, height:68, borderRadius:'50%', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:800, color:'#06060e', margin:'0 auto 12px' }}>
            {initial}
          </div>
          <div style={{ fontSize:17, fontWeight:700, color:C.text }}>{user.name}</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{user.email}</div>
        </div>

        {/* معلومات الحساب */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24, marginBottom:16 }}>
          <h2 style={{ fontSize:16, fontWeight:800, marginBottom:20 }}>معلومات الحساب</h2>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:5, display:'block' }}>البريد الإلكتروني</label>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', color:C.muted, fontSize:13 }}>{user.email}</div>
            </div>
            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:5, display:'block' }}>الاسم الكامل</label>
              <input value={form.name} onChange={e => setForm(p => ({...p, name:e.target.value}))}
                placeholder="اسمك الكامل"
                style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:13 }}/>
            </div>
            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:5, display:'block' }}>رقم الجوال <span style={{ fontSize:10 }}>(يظهر في الـ CV)</span></label>
              <input value={form.phone} onChange={e => setForm(p => ({...p, phone:e.target.value.replace(/\D/g,'').slice(0,10)}))}
                placeholder="05XXXXXXXX" dir="ltr" maxLength={10}
                style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:13 }}/>
            </div>
          </div>

          {error   && <div style={{ marginTop:12, padding:'9px 14px', background:'rgba(201,74,74,.1)', border:'1px solid rgba(201,74,74,.3)', borderRadius:8, fontSize:12, color:C.error }}>{error}</div>}
          {success && <div style={{ marginTop:12, padding:'9px 14px', background:'rgba(74,156,110,.1)', border:'1px solid rgba(74,156,110,.3)', borderRadius:8, fontSize:12, color:C.success }}>{success}</div>}

          <button onClick={saveChanges} disabled={loading} style={{ width:'100%', marginTop:16, padding:'12px', borderRadius:10, border:'none', background:loading?C.border:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:loading?C.muted:'#06060e', fontSize:14, fontWeight:800, cursor:loading?'default':'pointer', fontFamily:"'Tajawal',sans-serif" }}>
            {loading ? '⏳ جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>

        {/* تغيير كلمة المرور */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
          <h2 style={{ fontSize:16, fontWeight:800, marginBottom:20 }}>تغيير كلمة المرور</h2>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:5, display:'block' }}>كلمة المرور الحالية</label>
              <input type="password" value={passForm.current} onChange={e => setPassForm(p => ({...p, current:e.target.value}))}
                placeholder="••••••••" dir="ltr"
                style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:13 }}/>
            </div>
            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:5, display:'block' }}>كلمة المرور الجديدة</label>
              <input type="password" value={passForm.newPass} onChange={e => setPassForm(p => ({...p, newPass:e.target.value}))}
                placeholder="••••••••" dir="ltr"
                style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:13 }}/>
            </div>
            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:5, display:'block' }}>تأكيد كلمة المرور</label>
              <input type="password" value={passForm.confirm} onChange={e => setPassForm(p => ({...p, confirm:e.target.value}))}
                placeholder="••••••••" dir="ltr"
                style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:13 }}/>
            </div>
          </div>

          {passError   && <div style={{ marginTop:12, padding:'9px 14px', background:'rgba(201,74,74,.1)', border:'1px solid rgba(201,74,74,.3)', borderRadius:8, fontSize:12, color:C.error }}>{passError}</div>}
          {passSuccess && <div style={{ marginTop:12, padding:'9px 14px', background:'rgba(74,156,110,.1)', border:'1px solid rgba(74,156,110,.3)', borderRadius:8, fontSize:12, color:C.success }}>{passSuccess}</div>}

          <button onClick={changePassword} disabled={passLoading} style={{ width:'100%', marginTop:16, padding:'12px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', color:C.text, fontSize:14, fontWeight:700, cursor:passLoading?'default':'pointer', fontFamily:"'Tajawal',sans-serif", opacity:passLoading?.7:1 }}>
            {passLoading ? '⏳ جاري التغيير...' : 'تغيير كلمة المرور'}
          </button>
        </div>

      </div>
    </div>
  )
}