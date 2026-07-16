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
  const [user, setUser]         = useState(null)
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading]   = useState(true)

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
        method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ is_visible: !current })
      })
      setProfiles(p => p.map(c => c.id===id ? {...c, is_visible:!current} : c))
    } catch(e) { alert('خطأ') }
  }

  async function deleteProfile(id) {
    if (!confirm('هل أنت متأكد من الحذف؟')) return
    try {
      await fetch(`/api/candidates/${id}`, { method:'DELETE' })
      setProfiles(p => p.filter(c => c.id !== id))
    } catch(e) { alert('خطأ') }
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
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:58, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Link href="/candidate/account" style={{ display:'flex', alignItems:'center', gap:7, textDecoration:'none' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#06060e' }}>
              {(user.name||'؟')[0]}
            </div>
            <span style={{ fontSize:13, color:C.muted }}>{user.name}</span>
          </Link>
          <button onClick={logout} style={{ padding:'5px 12px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>خروج</button>
        </div>
      </nav>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'32px 20px' }}>

        {/* ── إذا ما عنده ملف ── */}
        {!loading && !hasProfile && (
          <div style={{ background:C.card, border:`2px solid ${C.gold}`, borderRadius:18, padding:'48px 32px', textAlign:'center' }}>
            <div style={{ fontSize:52, marginBottom:16 }}>🎙️</div>
            <h1 style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:10 }}>أهلاً {user.name}!</h1>
            <p style={{ fontSize:14, color:C.muted, lineHeight:1.85, marginBottom:28, maxWidth:460, margin:'0 auto 28px' }}>
              ابدأ مقابلتك الذكية المجانية — الذكاء الاصطناعي يسألك ويبني ملفك المهني الاحترافي تلقائياً
            </p>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/candidate/interview" style={{ padding:'13px 32px', borderRadius:10, fontSize:15, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', textDecoration:'none' }}>
                🎙️ ابدأ المقابلة المجانية
              </Link>
              <Link href="/candidate/jobs" style={{ padding:'13px 32px', borderRadius:10, fontSize:15, fontWeight:700, border:`1px solid ${C.border}`, color:C.muted, background:'transparent', textDecoration:'none' }}>
                🏢 تصفح الوظائف
              </Link>
            </div>
          </div>
        )}

        {/* ── إذا عنده ملفات ── */}
        {!loading && hasProfile && (
          <>
            {/* Header + أزرار صغيرة */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
              <div>
                <h1 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:3 }}>أهلاً {user.name} 👋</h1>
                <p style={{ fontSize:12, color:C.muted }}>لديك {profiles.length} ملف مهني</p>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <Link href="/candidate/interview" style={{ padding:'8px 16px', borderRadius:8, fontSize:12, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', textDecoration:'none' }}>
                  + مقابلة جديدة
                </Link>
                <Link href="/candidate/jobs" style={{ padding:'8px 16px', borderRadius:8, fontSize:12, fontWeight:700, border:`1px solid ${C.border}`, color:C.muted, background:'transparent', textDecoration:'none' }}>
                  🏢 الوظائف
                </Link>
              </div>
            </div>

            {/* قائمة الملفات */}
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {profiles.map((c, idx) => {
                const p    = c.profile_json || {}
                const sc   = scoreColor(c.score)
                const circ = 2 * Math.PI * 18
                const dash = circ - (c.score / 100) * circ
                const date = new Date(c.created_at).toLocaleDateString('ar-SA')

                return (
                  <div key={c.id} style={{ background:C.card, border:`1px solid ${c.is_visible===false?C.border:C.gold+'33'}`, borderRadius:13, padding:18, transition:'border-color .2s' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:14 }}>

                      {/* Score + Info */}
                      <div style={{ display:'flex', gap:12, alignItems:'center', flex:1 }}>
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

                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:2, display:'flex', alignItems:'center', gap:6 }}>
                            {p.specialization || 'ملف مهني'}
                            {idx===0 && <span style={{ fontSize:9, background:'rgba(200,160,74,.15)', color:C.gold, padding:'2px 7px', borderRadius:8 }}>الأحدث</span>}
                          </div>
                          <div style={{ fontSize:11, color:C.muted, marginBottom:2 }}>
                            📍 {p.location}{p.experience_years ? ` · ${p.experience_years}` : ''}
                          </div>
                          <div style={{ fontSize:10, color:c.is_visible===false?C.error:C.success }}>
                            {c.is_visible===false ? '🙈 مخفي عن الشركات' : '👁️ ظاهر للشركات'} · {date}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                        <button onClick={() => viewProfile(c)} style={{ padding:'7px 14px', borderRadius:8, fontSize:12, fontWeight:700, border:'none', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                          عرض
                        </button>
                        <button onClick={() => toggleVisibility(c.id, c.is_visible!==false)} title={c.is_visible===false?'إظهار':'إخفاء'} style={{ padding:'7px 10px', borderRadius:8, fontSize:13, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer' }}>
                          {c.is_visible===false ? '👁️' : '🙈'}
                        </button>
                        <button onClick={() => deleteProfile(c.id)} title="حذف" style={{ padding:'7px 10px', borderRadius:8, fontSize:13, border:`1px solid ${C.error}`, background:'transparent', color:C.error, cursor:'pointer' }}>
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* ملخص */}
                    {p.summary_ar && (
                      <p style={{ fontSize:12, color:C.muted, lineHeight:1.7, marginTop:10, paddingTop:10, borderTop:`1px solid ${C.border}`, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                        {p.summary_ar}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {loading && <div style={{ textAlign:'center', padding:60, color:C.muted }}>⏳ جاري التحميل...</div>}

      </div>
    </div>
  )
}