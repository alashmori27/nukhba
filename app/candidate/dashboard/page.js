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

  function viewProfile(profile) {
    sessionStorage.setItem('nukhba_profile', JSON.stringify(profile.profile_json))
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
          <span style={{ fontSize:13, color:C.muted }}>{user.name}</span>
          <button onClick={logout} style={{ padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>خروج</button>
        </div>
      </nav>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'36px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:24, fontWeight:800, color:C.text, marginBottom:4 }}>أهلاً {user.name} 👋</h1>
          <p style={{ fontSize:13, color:C.muted }}>
            {hasProfile ? `لديك ${profiles.length} ملف مهني — اعرضه أو قدّم على وظيفة` : 'ابدأ مقابلتك الذكية وابنِ ملفك المهني'}
          </p>
        </div>

        {/* إذا ما عنده مقابلة — رحلة واضحة */}
        {!hasProfile && !loading && (
          <div style={{ background:C.card, border:`1px solid ${C.gold}`, borderRadius:16, padding:40, textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🎙️</div>
            <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:8 }}>ابدأ مقابلتك المجانية</h2>
            <p style={{ fontSize:14, color:C.muted, lineHeight:1.8, marginBottom:24, maxWidth:480, margin:'0 auto 24px' }}>
              مقابلة ذكية مع AI تكشف قيمتك الحقيقية — بعد انتهائها تحصل على ملف مهني احترافي جاهز للتقديم
            </p>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/candidate/interview" style={{ padding:'13px 32px', borderRadius:10, fontSize:15, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', textDecoration:'none' }}>
                ابدأ المقابلة المجانية
              </Link>
              <Link href="/candidate/jobs" style={{ padding:'13px 32px', borderRadius:10, fontSize:15, fontWeight:700, border:`1px solid ${C.border}`, color:C.muted, background:'transparent', textDecoration:'none' }}>
                تصفح الوظائف
              </Link>
            </div>
          </div>
        )}

        {/* أزرار سريعة */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:32 }}>
          <Link href="/candidate/interview" style={{ textDecoration:'none' }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24, transition:'all .2s', cursor:'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none' }}
            >
              <div style={{ fontSize:28, marginBottom:12 }}>🎙️</div>
              <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:6 }}>مقابلة جديدة</div>
              <div style={{ fontSize:12, color:C.muted, lineHeight:1.7 }}>أجرِ مقابلة عامة وابنِ ملفاً جديداً</div>
            </div>
          </Link>
          <Link href="/candidate/jobs" style={{ textDecoration:'none' }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24, transition:'all .2s', cursor:'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none' }}
            >
              <div style={{ fontSize:28, marginBottom:12 }}>🏢</div>
              <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:6 }}>تصفح الوظائف</div>
              <div style={{ fontSize:12, color:C.muted, lineHeight:1.7 }}>تقدّم على وظيفة بمقابلة مخصصة</div>
            </div>
          </Link>
        </div>

        {/* ملفاتي المهنية */}
        {hasProfile && (
          <div>
            <h2 style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:16 }}>ملفاتي المهنية</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {profiles.map((c, idx) => {
                const p  = c.profile_json || {}
                const sc = scoreColor(c.score)
                const circ = 2 * Math.PI * 20
                const dash = circ - (c.score / 100) * circ
                const date = new Date(c.created_at).toLocaleDateString('ar-SA')

                return (
                  <div key={c.id} style={{ background:C.card, border:`1px solid ${c.is_visible===false?C.border:C.gold+'44'}`, borderRadius:14, padding:22 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16 }}>

                      {/* Score + Info */}
                      <div style={{ display:'flex', gap:14, alignItems:'center', flex:1 }}>
                        <div style={{ textAlign:'center', flexShrink:0 }}>
                          <div style={{ width:44, height:44, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <svg width="44" height="44" viewBox="0 0 44 44" style={{ position:'absolute', transform:'rotate(-90deg)' }}>
                              <circle cx="22" cy="22" r="20" fill="none" stroke="#252538" strokeWidth="3"/>
                              <circle cx="22" cy="22" r="20" fill="none" stroke={sc} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"/>
                            </svg>
                            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontWeight:600, color:sc }}>{c.score}</span>
                          </div>
                          <div style={{ fontSize:9, color:sc, marginTop:2, fontWeight:700 }}>{scoreLabel(c.score)}</div>
                        </div>

                        <div>
                          <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:3 }}>
                            {p.specialization || 'ملف مهني'} {idx===0 && <span style={{ fontSize:10, background:'rgba(200,160,74,.15)', color:C.gold, padding:'2px 8px', borderRadius:10, marginRight:6 }}>الأحدث</span>}
                          </div>
                          <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>
                            📍 {p.location} · {p.experience_years}
                          </div>
                          <div style={{ fontSize:11, color:C.muted }}>
                            📅 {date} ·
                            <span style={{ color: c.is_visible===false ? C.error : C.success, marginRight:4 }}>
                              {c.is_visible===false ? ' مخفي عن الشركات' : ' ظاهر للشركات'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display:'flex', flexDirection:'column', gap:8, flexShrink:0 }}>
                        <button onClick={() => viewProfile(c)} style={{ padding:'7px 16px', borderRadius:8, fontSize:12, fontWeight:700, border:'none', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                          عرض الملف
                        </button>
                        <button onClick={() => toggleVisibility(c.id, c.is_visible!==false)} style={{ padding:'7px 16px', borderRadius:8, fontSize:12, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                          {c.is_visible===false ? '👁️ إظهار' : '🙈 إخفاء'}
                        </button>
                        <button onClick={() => deleteProfile(c.id)} style={{ padding:'7px 16px', borderRadius:8, fontSize:12, border:`1px solid ${C.error}`, background:'transparent', color:C.error, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                          حذف
                        </button>
                      </div>
                    </div>

                    {/* ملخص */}
                    {p.summary_ar && (
                      <p style={{ fontSize:13, color:C.muted, lineHeight:1.75, marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}`, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                        {p.summary_ar}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign:'center', padding:40, color:C.muted }}>⏳ جاري التحميل...</div>
        )}
      </div>
    </div>
  )
}