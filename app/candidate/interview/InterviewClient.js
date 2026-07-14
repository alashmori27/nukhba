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
  const [user, setUser]        = useState(null)
  const [candidates, setCands] = useState([])
  const [loading, setLoading]  = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter]    = useState('all')

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
      const res  = await fetch('/api/candidates')
      const data = await res.json()
      setCands(data.candidates || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  const scoreColor = s => s >= 80 ? C.success : s >= 60 ? C.gold : C.error
  const scoreLabel = s => s >= 80 ? 'ممتاز' : s >= 60 ? 'جيد' : 'يحتاج تطوير'

  function contactWhatsapp(phone, name) {
    const msg = encodeURIComponent(`مرحباً ${name}، تواصلت معك من منصة نخبة للتوظيف بخصوص فرصة عمل مناسبة لملفك المهني.`)
    const num = phone?.replace(/\D/g,'').replace(/^0/, '966')
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank')
  }

  function contactEmail(email, name) {
    const subject = encodeURIComponent('فرصة عمل من منصة نخبة')
    const body = encodeURIComponent(`مرحباً ${name}،\n\nتواصلنا معك من خلال منصة نخبة للتوظيف بخصوص فرصة عمل تتناسب مع ملفك المهني.\n\nيسعدنا التحدث معك لمزيد من التفاصيل.\n\nمع التقدير`)
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank')
  }

  const filtered = candidates
    .filter(c => {
      if (filter === 'high') return c.score >= 80
      if (filter === 'mid')  return c.score >= 60 && c.score < 80
      return true
    })
    .sort((a,b) => b.score - a.score)

  if (!user) return null

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة · للشركات</div>
        <Link href="/company/dashboard" style={{ fontSize:13, color:C.muted, padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}`, textDecoration:'none' }}>← لوحة التحكم</Link>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'36px 24px' }}>

        {/* Header + Filter */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>المرشحون</h1>
            <p style={{ fontSize:13, color:C.muted }}>ملفات بُنيت من مقابلات ذكية — <span style={{ color:C.gold }}>{candidates.length} مرشح</span></p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {[['all','الكل'],['high','ممتاز +٨٠'],['mid','جيد ٦٠-٨٠']].map(([val,label]) => (
              <button key={val} onClick={() => setFilter(val)} style={{ padding:'7px 14px', borderRadius:20, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", border:`1px solid ${filter===val?C.gold:C.border}`, background:filter===val?'rgba(200,160,74,.1)':'transparent', color:filter===val?C.gold:C.muted }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading && <div style={{ textAlign:'center', padding:60, color:C.muted }}>⏳ جاري التحميل...</div>}

        {!loading && candidates.length === 0 && (
          <div style={{ textAlign:'center', padding:60, background:C.card, borderRadius:14, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:48, marginBottom:16 }}>👥</div>
            <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:8 }}>لا يوجد مرشحون بعد</div>
            <div style={{ fontSize:13, color:C.muted }}>سيظهرون هنا بعد إكمال مقابلاتهم</div>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {filtered.map(c => {
            const p     = c.profile_json || {}
            const sc    = scoreColor(c.score)
            const circ  = 2 * Math.PI * 22
            const dash  = circ - (c.score / 100) * circ
            const email = p.email || c.email
            const phone = p.phone || c.phone

            return (
              <div key={c.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:22, transition:'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(200,160,74,.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
              >
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16 }}>

                  {/* Score + Info */}
                  <div style={{ display:'flex', gap:14, alignItems:'flex-start', flex:1 }}>

                    {/* Score circle */}
                    <div style={{ textAlign:'center', flexShrink:0 }}>
                      <div style={{ width:52, height:52, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <svg width="52" height="52" viewBox="0 0 48 48" style={{ position:'absolute', transform:'rotate(-90deg)' }}>
                          <circle cx="24" cy="24" r="22" fill="none" stroke="#252538" strokeWidth="3"/>
                          <circle cx="24" cy="24" r="22" fill="none" stroke={sc} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"/>
                        </svg>
                        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:600, color:sc }}>{c.score}</span>
                      </div>
                      <div style={{ fontSize:9, color:sc, marginTop:2, fontWeight:700 }}>{scoreLabel(c.score)}</div>
                    </div>

                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:3 }}>{p.name || c.name}</div>
                      <div style={{ fontSize:13, color:C.gold, marginBottom:4 }}>{p.specialization || c.specialization}</div>
                      <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>
                        📍 {p.location || c.location}
                        {p.experience_years && ` · ${p.experience_years}`}
                      </div>
                      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                        {email && <span style={{ fontSize:11, color:C.muted }}>📧 {email}</span>}
                        {phone && <span style={{ fontSize:11, color:C.muted }}>📱 {phone}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display:'flex', flexDirection:'column', gap:8, flexShrink:0 }}>
                    <button onClick={() => setSelected(selected?.id===c.id?null:c)} style={{ padding:'7px 14px', borderRadius:8, fontSize:12, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                      {selected?.id===c.id?'إخفاء ▲':'الملف ▼'}
                    </button>
                    {phone && (
                      <button onClick={() => contactWhatsapp(phone, p.name||c.name)} style={{ padding:'7px 14px', borderRadius:8, fontSize:12, fontWeight:700, border:'none', background:'#25D366', color:'#fff', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                        💬 واتساب
                      </button>
                    )}
                    {email && (
                      <button onClick={() => contactEmail(email, p.name||c.name)} style={{ padding:'7px 14px', borderRadius:8, fontSize:12, fontWeight:700, border:`1px solid ${C.gold}`, background:'transparent', color:C.gold, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                        📧 إيميل
                      </button>
                    )}
                  </div>
                </div>

                {/* ملخص */}
                {p.summary_ar && (
                  <div style={{ fontSize:13, color:C.muted, lineHeight:1.75, margin:'12px 0 0', paddingTop:12, borderTop:`1px solid ${C.border}`, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                    {p.summary_ar}
                  </div>
                )}

                {/* تفاصيل موسعة */}
                {selected?.id===c.id && (
                  <div style={{ marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}` }}>

                    {/* معلومات التواصل */}
                    <div style={{ background:C.surface, borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', gap:20, flexWrap:'wrap', alignItems:'center' }}>
                      <span style={{ fontSize:11, color:C.muted }}>التواصل:</span>
                      {email && <span style={{ fontSize:13, color:C.text }}>📧 {email}</span>}
                      {phone && <span style={{ fontSize:13, color:C.text }}>📱 {phone}</span>}
                      {p.salary_expectation && <span style={{ fontSize:13, color:C.text }}>💰 {p.salary_expectation}</span>}
                      {p.availability && <span style={{ fontSize:13, color:C.text }}>📅 {p.availability}</span>}
                    </div>

                    {/* الإنجازات */}
                    {p.achievements?.length > 0 && (
                      <div style={{ marginBottom:14 }}>
                        <div style={{ fontSize:10, letterSpacing:3, color:C.gold, textTransform:'uppercase', marginBottom:8 }}>🏆 الإنجازات</div>
                        {p.achievements.map((a,i) => <div key={i} style={{ fontSize:13, color:C.text, marginBottom:5 }}>◆ {a}</div>)}
                      </div>
                    )}

                    {/* نقاط القوة */}
                    {p.strengths?.length > 0 && (
                      <div style={{ marginBottom:14 }}>
                        <div style={{ fontSize:10, letterSpacing:3, color:C.success, textTransform:'uppercase', marginBottom:8 }}>✅ نقاط القوة</div>
                        {p.strengths.map((s,i) => <div key={i} style={{ fontSize:13, color:C.text, marginBottom:5 }}>✓ {s}</div>)}
                      </div>
                    )}

                    {/* المهارات */}
                    {p.soft_skills?.length > 0 && (
                      <div style={{ marginBottom:14 }}>
                        <div style={{ fontSize:10, letterSpacing:3, color:C.gold, textTransform:'uppercase', marginBottom:8 }}>المهارات</div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                          {p.soft_skills.map((s,i) => <span key={i} style={{ padding:'4px 12px', borderRadius:20, fontSize:11, background:C.surface, border:`1px solid ${C.border}`, color:C.text }}>{s}</span>)}
                        </div>
                      </div>
                    )}

                    {/* الملاحظات */}
                    {p.flags?.length > 0 && (
                      <div style={{ marginBottom:14 }}>
                        <div style={{ fontSize:10, letterSpacing:3, color:C.error, textTransform:'uppercase', marginBottom:8 }}>⚠️ ملاحظات</div>
                        {p.flags.map((f,i) => <div key={i} style={{ fontSize:13, color:C.text, marginBottom:5 }}>· {f}</div>)}
                      </div>
                    )}

                    {/* نص المقابلة */}
                    {c.transcript && (
                      <div style={{ marginBottom:14 }}>
                        <div style={{ fontSize:10, letterSpacing:3, color:C.gold, textTransform:'uppercase', marginBottom:12 }}>🎙️ نص المقابلة</div>
                        <div style={{ background:C.surface, borderRadius:10, padding:16, maxHeight:400, overflowY:'auto' }}>
                          {c.transcript.split('\n\n').map((line, i) => {
                            const isCandidate   = line.startsWith('Candidate:')
                            const isInterviewer = line.startsWith('Interviewer:')
                            if (!isCandidate && !isInterviewer) return null
                            const role = isCandidate ? 'المتقدم' : 'نخبة'
                            const text = line.replace(/^(Candidate|Interviewer): /, '')
                            return (
                              <div key={i} style={{ marginBottom:12, display:'flex', gap:10, alignItems:'flex-start' }}>
                                <span style={{ fontSize:11, fontWeight:700, color:isCandidate?C.gold:C.muted, flexShrink:0, minWidth:52 }}>{role}:</span>
                                <span style={{ fontSize:13, color:C.text, lineHeight:1.75 }}>{text}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* أزرار تواصل موسعة */}
                    <div style={{ display:'flex', gap:10, marginTop:16, flexWrap:'wrap' }}>
                      {phone && (
                        <button onClick={() => contactWhatsapp(phone, p.name||c.name)} style={{ flex:1, padding:'11px', borderRadius:10, fontSize:13, fontWeight:700, border:'none', background:'#25D366', color:'#fff', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                          💬 تواصل عبر واتساب
                        </button>
                      )}
                      {email && (
                        <button onClick={() => contactEmail(email, p.name||c.name)} style={{ flex:1, padding:'11px', borderRadius:10, fontSize:13, fontWeight:700, border:`1px solid ${C.gold}`, background:'transparent', color:C.gold, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                          📧 تواصل عبر إيميل
                        </button>
                      )}
                    </div>
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