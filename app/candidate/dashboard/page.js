'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a'
}

export default function CandidateDashboard() {
  const router = useRouter()
  const [user, setUser]       = useState(null)
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'candidate') { router.push('/company/dashboard'); return }
    setUser(parsed)
    fetchMyProfiles(parsed.id)
  }, [])

  async function fetchMyProfiles(userId) {
    try {
      const res  = await fetch(`/api/candidates?user_id=${userId}`)
      const data = await res.json()
      setProfiles(data.candidates || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  async function toggleVisibility(id, current) {
    try {
      await fetch(`/api/candidates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: !current })
      })
      setProfiles(p => p.map(c => c.id===id ? {...c, is_visible:!current} : c))
    } catch(e) { alert('خطأ') }
  }

  async function deleteProfile(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الملف نهائياً؟')) return
    try {
      await fetch(`/api/candidates/${id}`, { method: 'DELETE' })
      setProfiles(p => p.filter(c => c.id !== id))
    } catch(e) { alert('خطأ في الحذف') }
  }

  function viewProfile(c) {
    sessionStorage.setItem('nukhba_profile', JSON.stringify(c.profile_json))
    router.push('/candidate/profile')
  }

  function logout() {
    localStorage.removeItem('nukhba_user')
    router.push('/auth/login')
  }

  const scoreColor = s => s >= 80 ? C.success : s >= 60 ? C.gold : C.error
  const scoreLabel = s => s >= 80 ? 'ممتاز' : s >= 60 ? 'جيد' : 'يحتاج تطوير'

  if (!user) return null

  const hasProfile = profiles.length > 0

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {/* اسم المستخدم — قابل للضغط للذهاب لإعدادات الحساب */}
          <Link href="/candidate/account" style={{ fontSize:13, color:C.muted, textDecoration:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#06060e' }}>
              {(user.name||'؟')[0]}
            </div>
            {user.name}
          </Link>
          <button onClick={logout} style={{ padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>خروج</button>
        </div>
      </nav>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'36px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:4 }}>أهلاً {user.name} 👋</h1>
          <p style={{ fontSize:13, color:C.muted }}>
            {loading ? '...' : hasProfile ? `لديك ${profiles.length} ملف مهني` : 'ابدأ مقابلتك الذكية وابنِ ملفك المهني'}
          </p>
        </div>

        {/* رحلة واضحة — إذا ما عنده ملف */}
        {!hasProfile && !loading && (
          <div style={{ background:C.card, border:`2px solid ${C.gold}`, borderRadius:16, padding:36, textAlign:'center', marginBottom:28 }}>
            <div style={{ fontSize:44, marginBottom:14 }}>🎙️</div>
            <h2 style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:8 }}>ابدأ مقابلتك المجانية</h2>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.8, marginBottom:22, maxWidth:440, margin:'0 auto 22px' }}>
              مقابلة ذكية مع AI تكشف قيمتك الحقيقية — بعد انتهائها تحصل على ملف مهني احترافي
            </p>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/candidate/interview" style={{ padding:'12px 28px', borderRadius:10, fontSize:14, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', textDecoration:'none' }}>
                ابدأ المقابلة المجانية
              </Link>
              <Link href="/candidate/jobs" style={{ padding:'12px 28px', borderRadius:10, fontSize:14, fontWeight:700, border:`1px solid ${C.border}`, color:C.muted, background:'transparent', textDecoration:'none' }}>
                تصفح الوظائف
              </Link>
            </div>
          </div>
        )}

        {/* أزرار سريعة */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:28 }}>
          <Link href="/candidate/interview" style={{ textDecoration:'none' }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:20, transition:'all .2s', cursor:'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none' }}
            >
              <div style={{ fontSize:24, marginBottom:10 }}>🎙️</div>
              <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>مقابلة جديدة</div>
              <div style={{ fontSize:11, color:C.muted }}>أجرِ مقابلة وابنِ ملفاً جديداً</div>
            </div>
          </Link>
          <Link href="/candidate/jobs" style={{ textDecoration:'none' }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:20, transition:'all .2s', cursor:'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none' }}
            >
              <div style={{ fontSize:24, marginBottom:10 }}>🏢</div>
              <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>تصفح الوظائف</div>
              <div style={{ fontSize:11, color:C.muted }}>تقدّم على وظيفة بمقابلة مخصصة</div>
            </div>
          </Link>
        </div>

        {/* ملفاتي المهنية */}
        {hasProfile && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h2 style={{ fontSize:16, fontWeight:800, color:C.text }}>ملفاتي المهنية</h2>
              <span style={{ fontSize:12, color:C.muted }}>{profiles.length} ملف</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {profiles.map((c, idx) => {
                const p    = c.profile_json || {}
                const sc   = scoreColor(c.score)
                const circ = 2 * Math.PI * 18
                const dash = circ - (c.score / 100) * circ
                const date = new Date(c.created_at).toLocaleDateString('ar-SA')

                return (
                  <div key={c.id} style={{ background:C.card, border:`1px solid ${c.is_visible===false?C.border:C.gold+'33'}`, borderRadius:12, padding:18 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:14 }}>

                      <div style={{ display:'flex', gap:12, alignItems:'center', flex:1 }}>
                        {/* Score */}
                        <div style={{ textAlign:'center', flexShrink:0 }}>
                          <div style={{ width:40, height:40, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <svg width="40" height="40" viewBox="0 0 40 40" style={{ position:'absolute', transform:'rotate(-90deg)' }}>
                              <circle cx="20" cy="20" r="18" fill="none" stroke="#252538" strokeWidth="3"/>
                              <circle cx="20" cy="20" r="18" fill="none" stroke={sc} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"/>
                            </svg>
                            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, fontWeight:600, color:sc }}>{c.score}</span>
                          </div>
                          <div style={{ fontSize:8, color:sc, marginTop:1, fontWeight:700 }}>{scoreLabel(c.score)}</div>
                        </div>

                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:2 }}>
                            {p.specialization || 'ملف مهني'}
                            {idx===0 && <span style={{ fontSize:9, background:'rgba(200,160,74,.15)', color:C.gold, padding:'2px 7px', borderRadius:8, marginRight:6 }}>الأحدث</span>}
                          </div>
                          <div style={{ fontSize:11, color:C.muted, marginBottom:2 }}>📍 {p.location} · {p.experience_years}</div>
                          <div style={{ fontSize:10, color:c.is_visible===false?C.error:C.success }}>
                            {c.is_visible===false ? '🙈 مخفي عن الشركات' : '👁️ ظاهر للشركات'} · {date}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                        <button onClick={() => viewProfile(c)} style={{ padding:'6px 12px', borderRadius:7, fontSize:11, fontWeight:700, border:'none', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                          عرض
                        </button>
                        <button onClick={() => toggleVisibility(c.id, c.is_visible!==false)} style={{ padding:'6px 10px', borderRadius:7, fontSize:11, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                          {c.is_visible===false ? '👁️' : '🙈'}
                        </button>
                        <button onClick={() => deleteProfile(c.id)} style={{ padding:'6px 10px', borderRadius:7, fontSize:11, border:`1px solid ${C.error}`, background:'transparent', color:C.error, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                          🗑️
                        </button>
                      </div>
                    </div>

                    {p.summary_ar && (
                      <p style={{ fontSize:12, color:C.muted, lineHeight:1.7, marginTop:10, paddingTop:10, borderTop:`1px solid ${C.border}`, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                        {p.summary_ar}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {loading && <div style={{ textAlign:'center', padding:40, color:C.muted }}>⏳ جاري التحميل...</div>}

      </div>
    </div>
  )
}