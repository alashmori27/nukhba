'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a'
}

function authHeaders(user) {
  return {
    'Content-Type': 'application/json',
    'x-user-id':   user.id,
    'x-user-role': user.role,
  }
}

export default function CandidateProfiles() {
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
    fetchProfiles(parsed)
  }, [])

  async function fetchProfiles(u) {
    try {
      const res  = await fetch(`/api/candidates?user_id=${u.id}`, { headers: authHeaders(u) })
      const data = await res.json()
      setProfiles(data.candidates || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  async function toggleVisibility(id, current) {
    try {
      await fetch(`/api/candidates/${id}`, {
        method:'PATCH',
        headers: authHeaders(user),
        body: JSON.stringify({ is_visible: !current })
      })
      setProfiles(p => p.map(c => c.id===id ? {...c, is_visible: !current} : c))
    } catch(e) { alert('خطأ') }
  }

  async function deleteProfile(id) {
    if (!window.confirm('هل أنت متأكد من الحذف نهائياً؟')) return
    try {
      await fetch(`/api/candidates/${id}`, { method:'DELETE', headers: authHeaders(user) })
      setProfiles(p => p.filter(c => c.id !== id))
    } catch(e) { alert('خطأ') }
  }

  function viewProfile(c) {
    sessionStorage.setItem('nukhba_profile', JSON.stringify(c.profile_json))
    router.push('/candidate/profile')
  }

  if (!user) return null

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      <style>{`
        .profile-card { transition: border-color .2s; }
        .profile-card:hover { border-color: rgba(200,160,74,.4) !important; }
        .actions-row { display: flex; gap: 8px; flex-wrap: wrap; }
        @media(max-width: 600px) {
          .card-header { flex-direction: column !important; align-items: flex-start !important; }
          .actions-row { width: 100%; justify-content: stretch; }
          .actions-row button { flex: 1; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</div>
        <Link href="/candidate/dashboard" style={{ fontSize:13, color:C.muted, padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}`, textDecoration:'none' }}>← لوحة التحكم</Link>
      </nav>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'32px 16px' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:4 }}>ملفاتي المهنية</h1>
            <p style={{ fontSize:13, color:C.muted }}>
              {loading ? '...' : profiles.length > 0 ? `${profiles.length} ملف مهني` : 'لا يوجد ملفات بعد'}
            </p>
          </div>
          <Link href="/candidate/interview" style={{ padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', textDecoration:'none' }}>
            + مقابلة جديدة
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:'center', padding:60, color:C.muted }}>⏳ جاري التحميل...</div>
        )}

        {/* لا يوجد ملفات */}
        {!loading && profiles.length === 0 && (
          <div style={{ background:C.card, border:`2px solid ${C.gold}`, borderRadius:18, padding:'60px 24px', textAlign:'center' }}>
            <div style={{ fontSize:52, marginBottom:16 }}>🎙️</div>
            <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:10 }}>ما عندك ملف بعد</h2>
            <p style={{ fontSize:14, color:C.muted, lineHeight:1.85, marginBottom:28, maxWidth:420, margin:'0 auto 28px' }}>
              أجرِ مقابلة ذكية مجانية والذكاء الاصطناعي يبني ملفك المهني تلقائياً
            </p>
            <Link href="/candidate/interview" style={{ padding:'13px 32px', borderRadius:10, fontSize:15, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', textDecoration:'none' }}>
              🎙️ ابدأ المقابلة المجانية
            </Link>
          </div>
        )}

        {/* قائمة الملفات */}
        {!loading && profiles.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {profiles.map((c, idx) => {
              const p       = c.profile_json || {}
              const visible = c.is_visible !== false
              const date    = new Date(c.created_at).toLocaleDateString('ar-SA')
              return (
                <div key={c.id} className="profile-card" style={{ background:C.card, border:`1px solid ${visible ? C.gold+'44' : C.border}`, borderRadius:16, overflow:'hidden' }}>

                  {/* Header البطاقة */}
                  <div className="card-header" style={{ background: visible ? 'rgba(200,160,74,.04)' : C.surface, padding:'18px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:14 }}>

                    {/* Info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, flexWrap:'wrap' }}>
                        {idx === 0 && (
                          <span style={{ fontSize:9, background:'rgba(200,160,74,.15)', color:C.gold, padding:'2px 8px', borderRadius:8, fontWeight:700 }}>الأحدث</span>
                        )}
                        {/* حالة الظهور */}
                        <span style={{ fontSize:11, color: visible ? C.success : C.error, background: visible ? 'rgba(74,156,110,.1)' : 'rgba(201,74,74,.1)', padding:'3px 10px', borderRadius:20, fontWeight:600 }}>
                          {visible ? '👁️ ظاهر للشركات' : '🙈 مخفي'}
                        </span>
                        {c.job_id && (
                          <span style={{ fontSize:11, color:'#4a6fa5', background:'rgba(74,111,165,.1)', padding:'3px 10px', borderRadius:20 }}>
                            📋 وظيفة محددة
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {p.specialization || 'ملف مهني'}
                      </div>
                      <div style={{ fontSize:12, color:C.muted }}>
                        {p.location && `📍 ${p.location}`}
                        {p.experience_years && ` · ${p.experience_years} سنوات خبرة`}
                        {` · ${date}`}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="actions-row">
                      <button onClick={() => viewProfile(c)} style={{ padding:'8px 16px', borderRadius:9, fontSize:12, fontWeight:700, border:'none', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', cursor:'pointer', fontFamily:"'Tajawal',sans-serif", whiteSpace:'nowrap' }}>
                        📄 عرض CV
                      </button>
                      <button onClick={() => toggleVisibility(c.id, visible)}
                        style={{ padding:'8px 14px', borderRadius:9, fontSize:12, fontWeight:600, border:`1px solid ${visible ? C.error : C.success}`, background:'transparent', color: visible ? C.error : C.success, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", whiteSpace:'nowrap' }}>
                        {visible ? '🙈 إخفاء' : '👁️ إظهار'}
                      </button>
                      <button onClick={() => deleteProfile(c.id)}
                        style={{ padding:'8px 14px', borderRadius:9, fontSize:12, fontWeight:600, border:`1px solid ${C.error}`, background:'transparent', color:C.error, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", whiteSpace:'nowrap' }}>
                        🗑️ حذف
                      </button>
                    </div>
                  </div>

                  {/* ملخص */}
                  {p.summary_ar && (
                    <div style={{ padding:'12px 20px', borderTop:`1px solid ${C.border}` }}>
                      <p style={{ fontSize:13, color:C.muted, lineHeight:1.8, margin:0, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                        {p.summary_ar}
                      </p>
                    </div>
                  )}

                  {/* مهارات */}
                  {p.soft_skills?.length > 0 && (
                    <div style={{ padding:'10px 20px', borderTop:`1px solid ${C.border}`, display:'flex', flexWrap:'wrap', gap:6 }}>
                      {p.soft_skills.slice(0,5).map((s,i) => (
                        <span key={i} style={{ padding:'3px 10px', borderRadius:20, fontSize:11, background:C.surface, border:`1px solid ${C.border}`, color:C.muted }}>{s}</span>
                      ))}
                      {p.soft_skills.length > 5 && (
                        <span style={{ fontSize:11, color:C.muted, padding:'3px 10px' }}>+{p.soft_skills.length - 5}</span>
                      )}
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}