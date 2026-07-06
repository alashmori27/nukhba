'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a'
}

export default function CompanyCandidates() {
  const router = useRouter()
  const [user, setUser]         = useState(null)
  const [candidates, setCands]  = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter]     = useState('all')

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'company') { router.push('/candidate/dashboard'); return }
    setUser(parsed)
    fetchCandidates()
  }, [])

  async function fetchCandidates() {
    try {
      const res = await fetch('/api/candidates')
      const data = await res.json()
      setCands(data.candidates || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  const sc = s => s >= 80 ? C.success : s >= 60 ? C.gold : C.error

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet"/>

      {/* Nav */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة · للشركات</div>
        <Link href="/company/dashboard" style={{ fontSize:13, color:C.muted, padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}` }}>← لوحة التحكم</Link>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'36px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32, flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>المرشحون</h1>
            <p style={{ fontSize:14, color:C.muted }}>ملفات مرشحين بُنيت من مقابلات ذكية — <span style={{ color:C.gold }}>{candidates.length} مرشح</span></p>
          </div>
          {/* Filter */}
          <div style={{ display:'flex', gap:8 }}>
            {[['all','الكل'],['high','تقييم +٨٠'],['available','متاح فوراً']].map(([val,label]) => (
              <button key={val} onClick={() => setFilter(val)} style={{
                padding:'7px 16px', borderRadius:20, fontSize:13, cursor:'pointer',
                fontFamily:"'Tajawal',sans-serif",
                border:`1px solid ${filter===val?C.gold:C.border}`,
                background: filter===val?'rgba(200,160,74,.1)':'transparent',
                color: filter===val?C.gold:C.muted
              }}>{label}</button>
            ))}
          </div>
        </div>

        {loading && (
          <div style={{ textAlign:'center', padding:60, color:C.muted }}>
            <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
            جاري تحميل المرشحين...
          </div>
        )}

        {!loading && candidates.length === 0 && (
          <div style={{ textAlign:'center', padding:60, color:C.muted, background:C.card, borderRadius:14, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:48, marginBottom:16 }}>👥</div>
            <div style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:8 }}>لا يوجد مرشحون بعد</div>
            <div style={{ fontSize:14 }}>سيظهر هنا المرشحون بعد إكمال مقابلاتهم</div>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {candidates
            .filter(c => {
              const p = c.profile_json
              if (filter==='high') return c.score >= 80
              if (filter==='available') return p?.availability === 'فوري' || p?.availability?.includes('فور')
              return true
            })
            .sort((a,b) => b.score - a.score)
            .map(c => {
              const p = c.profile_json || {}
              return (
                <div key={c.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24, transition:'border-color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='rgba(200,160,74,.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
                >
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16 }}>
                    <div style={{ display:'flex', gap:14, alignItems:'center', flex:1 }}>
                      {/* Avatar */}
                      <div style={{ width:48, height:48, borderRadius:'50%', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, color:'#06060e', flexShrink:0 }}>
                        {(p.name || c.name || '؟')[0]}
                      </div>
                      <div>
                        <div style={{ fontSize:17, fontWeight:700, color:C.text }}>{p.name || c.name}</div>
                        <div style={{ fontSize:13, color:C.gold, marginTop:3 }}>{p.specialization || c.specialization}</div>
                        <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>📍 {p.location || c.location} · {p.experience_years || c.experience_years}</div>
                      </div>
                    </div>

                    {/* Score */}
                    <div style={{ textAlign:'center', flexShrink:0 }}>
                      <div style={{ width:48, height:48, borderRadius:'50%', border:`2px solid ${sc(c.score)}`, background:`${sc(c.score)}18`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:sc(c.score) }}>{c.score}</div>
                      <div style={{ fontSize:9, color:C.muted, marginTop:3 }}>تقييم</div>
                    </div>
                  </div>

                  {/* Summary */}
                  {p.summary_ar && (
                    <div style={{ fontSize:13, color:C.muted, lineHeight:1.75, margin:'14px 0', paddingTop:14, borderTop:`1px solid ${C.border}`, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {p.summary_ar}
                    </div>
                  )}

                  {/* Info row */}
                  <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:14 }}>
                    {p.salary_expectation && <span style={{ fontSize:12, color:C.muted }}>💰 <strong style={{ color:C.text }}>{p.salary_expectation}</strong></span>}
                    {p.availability && <span style={{ fontSize:12, color:C.muted }}>📅 <strong style={{ color:C.text }}>{p.availability}</strong></span>}
                    {p.open_to_relocation && <span style={{ fontSize:12, color:C.muted }}>✈️ التنقل: <strong style={{ color:C.text }}>{p.open_to_relocation}</strong></span>}
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                    <button onClick={() => setSelected(selected?.id===c.id ? null : c)} style={{ padding:'8px 18px', borderRadius:9, fontSize:13, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                      {selected?.id===c.id ? 'إخفاء ▲' : 'عرض الملف ▼'}
                    </button>
                    <button onClick={() => alert(`للتواصل مع ${p.name} — ميزة التواصل المباشر قادمة قريباً!`)} style={{ padding:'8px 18px', borderRadius:9, fontSize:13, fontWeight:700, border:'none', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                      📩 تواصل
                    </button>
                  </div>

                  {/* Expanded profile */}
                  {selected?.id===c.id && p && (
                    <div style={{ marginTop:20, paddingTop:20, borderTop:`1px solid ${C.border}` }}>
                      {p.achievements?.length > 0 && (
                        <div style={{ marginBottom:16 }}>
                          <div style={{ fontSize:11, letterSpacing:3, color:C.gold, textTransform:'uppercase', marginBottom:10 }}>🏆 الإنجازات</div>
                          {p.achievements.map((a,i) => <div key={i} style={{ fontSize:13, color:C.text, marginBottom:6 }}>· {a}</div>)}
                        </div>
                      )}
                      {p.soft_skills?.length > 0 && (
                        <div style={{ marginBottom:16 }}>
                          <div style={{ fontSize:11, letterSpacing:3, color:C.gold, textTransform:'uppercase', marginBottom:10 }}>المهارات</div>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                            {p.soft_skills.map((s,i) => <span key={i} style={{ padding:'4px 12px', borderRadius:20, fontSize:12, background:C.surface, border:`1px solid ${C.border}`, color:C.text }}>{s}</span>)}
                          </div>
                        </div>
                      )}
                      {p.strengths?.length > 0 && (
                        <div>
                          <div style={{ fontSize:11, letterSpacing:3, color:C.success, textTransform:'uppercase', marginBottom:10 }}>✅ نقاط القوة</div>
                          {p.strengths.map((s,i) => <div key={i} style={{ fontSize:13, color:C.text, marginBottom:5 }}>· {s}</div>)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}