'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a'
}

const STATUSES = [
  { value:'pending',   label:'قيد المراجعة', color:'#7a7690' },
  { value:'viewed',    label:'تم الاطلاع',   color:'#4a6fa5' },
  { value:'contacted', label:'تم التواصل',   color:'#4a9c6e' },
  { value:'accepted',  label:'مقبول',        color:'#4a9c6e' },
  { value:'rejected',  label:'مرفوض',        color:'#c94a4a' },
]

export default function CompanyApplicants() {
  const router = useRouter()
  const [user, setUser]         = useState(null)
  const [candidates, setCands]  = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter]     = useState('all')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'company') { router.push('/candidate/dashboard'); return }
    setUser(parsed)
    fetchCandidates(parsed)
  }, [])

  async function fetchCandidates(u) {
    try {
      const res  = await fetch(`/api/candidates?company_id=${u.id}`, {
        headers: { 'x-user-id': u.id, 'x-user-role': u.role }
      })
      const data = await res.json()
      setCands(data.candidates || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  async function updateStatus(id, status, userId, jobTitle) {
    setUpdating(id)
    try {
      await fetch(`/api/candidates/${id}`, {
        method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ status })
      })
      setCands(p => p.map(c => c.id===id ? {...c, status} : c))

      // إشعار للمتقدم
      if (userId) {
        const labels = {
          viewed:    'اطلعت الشركة على طلبك',
          contacted: 'الشركة تواصلت معك — تحقق من جوالك وإيميلك',
          accepted:  'مبروك! تم قبول طلبك 🎉',
          rejected:  'نأسف — لم يتم قبول طلبك هذه المرة',
        }
        if (labels[status]) {
          await fetch('/api/notifications', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
              user_id: userId,
              type:    status,
              title:   labels[status],
              body:    `بخصوص وظيفة: ${jobTitle || ''}`,
              meta:    { candidate_id: id }
            })
          })
        }
      }
    } catch(e) { console.error(e) }
    setUpdating(null)
  }

  function contactWhatsapp(phone, name) {
    const msg = encodeURIComponent(`مرحباً ${name}، تواصلت معك من منصة نخبة للتوظيف بخصوص وظيفتنا المعلنة.`)
    const num = phone?.replace(/\D/g,'').replace(/^0/, '966')
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank')
  }

  function contactEmail(email, name) {
    const subject = encodeURIComponent('بخصوص طلب توظيفك — نخبة')
    const body = encodeURIComponent(`مرحباً ${name}،\n\nشكراً لتقدمك على وظيفتنا عبر منصة نخبة.\nيسعدنا التحدث معك لمزيد من التفاصيل.\n\nمع التقدير`)
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank')
  }

  const scoreColor = s => s >= 80 ? C.success : s >= 60 ? C.gold : C.error
  const scoreLabel = s => s >= 80 ? 'ممتاز' : s >= 60 ? 'جيد' : 'يحتاج تطوير'

  const filtered = candidates
    .filter(c => filter === 'all' || (c.status || 'pending') === filter)
    .sort((a,b) => (b.score||0) - (a.score||0))

  if (!user) return null

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'IBM Plex Sans Arabic', sans-serif", color:C.text }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@300;400;600&display=swap');`}</style>

      <Navbar/>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'36px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>المتقدمون على وظائفي</h1>
            <p style={{ fontSize:13, color:C.muted }}>إجمالي <span style={{ color:C.gold }}>{candidates.length} متقدم</span></p>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {[['all','الكل'], ...STATUSES.map(s => [s.value, s.label])].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)} style={{ padding:'7px 14px', borderRadius:20, fontSize:12, cursor:'pointer', fontFamily:"'IBM Plex Sans Arabic', sans-serif", border:`1px solid ${filter===val?C.gold:C.border}`, background:filter===val?'rgba(200,160,74,.1)':'transparent', color:filter===val?C.gold:C.muted }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading && <div style={{ textAlign:'center', padding:60, color:C.muted }}>⏳ جاري التحميل...</div>}

        {!loading && candidates.length === 0 && (
          <div style={{ textAlign:'center', padding:60, background:C.card, borderRadius:14, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🎯</div>
            <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:8 }}>لا يوجد متقدمون بعد</div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:20 }}>سيظهر هنا من تقدموا على وظائفك</div>
            <Link href="/company/post-job" style={{ padding:'11px 24px', borderRadius:10, fontSize:14, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', textDecoration:'none' }}>انشر وظيفة جديدة</Link>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {filtered.map(c => {
            const p     = c.profile_json || {}
            const name  = p.name  || c.name  || 'مرشح'
            const phone = p.phone || c.phone  || ''
            const email = p.email || c.email  || ''
            const score = c.score || 0
            const sc    = scoreColor(score)
            const circ  = 2 * Math.PI * 22
            const dash  = circ - (score / 100) * circ
            const currentStatus = STATUSES.find(s => s.value === (c.status||'pending')) || STATUSES[0]

            return (
              <div key={c.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden', transition:'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(200,160,74,.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
              >
                <div style={{ padding:20 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16 }}>
                    <div style={{ display:'flex', gap:14, alignItems:'flex-start', flex:1 }}>
                      {score > 0 && (
                        <div style={{ textAlign:'center', flexShrink:0 }}>
                          <div style={{ width:52, height:52, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <svg width="52" height="52" viewBox="0 0 48 48" style={{ position:'absolute', transform:'rotate(-90deg)' }}>
                              <circle cx="24" cy="24" r="22" fill="none" stroke="#252538" strokeWidth="3"/>
                              <circle cx="24" cy="24" r="22" fill="none" stroke={sc} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"/>
                            </svg>
                            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:600, color:sc }}>{score}</span>
                          </div>
                          <div style={{ fontSize:9, color:sc, marginTop:2, fontWeight:700 }}>{scoreLabel(score)}</div>
                        </div>
                      )}
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:3 }}>{name}</div>
                        <div style={{ fontSize:13, color:C.gold, marginBottom:4 }}>{p.specialization || c.specialization || ''}</div>
                        <div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>
                          {phone && <span style={{ marginLeft:12 }}>📱 {phone}</span>}
                          {email && <span>📧 {email}</span>}
                        </div>
                        <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:`${currentStatus.color}15`, border:`1px solid ${currentStatus.color}33`, color:currentStatus.color }}>
                          {currentStatus.label}
                        </div>
                      </div>
                    </div>

                    <div style={{ display:'flex', flexDirection:'column', gap:8, flexShrink:0 }}>
                      <button onClick={() => setSelected(selected===c.id?null:c.id)} style={{ padding:'7px 14px', borderRadius:8, fontSize:12, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer', fontFamily:"'IBM Plex Sans Arabic', sans-serif" }}>
                        {selected===c.id?'إخفاء ▲':'تفاصيل ▼'}
                      </button>
                      {phone && <button onClick={() => contactWhatsapp(phone, name)} style={{ padding:'7px 14px', borderRadius:8, fontSize:12, fontWeight:700, border:'none', background:'#25D366', color:'#fff', cursor:'pointer', fontFamily:"'IBM Plex Sans Arabic', sans-serif" }}>💬 واتساب</button>}
                      {email && <button onClick={() => contactEmail(email, name)} style={{ padding:'7px 14px', borderRadius:8, fontSize:12, fontWeight:700, border:`1px solid ${C.gold}`, background:'transparent', color:C.gold, cursor:'pointer', fontFamily:"'IBM Plex Sans Arabic', sans-serif" }}>📧 إيميل</button>}
                    </div>
                  </div>

                  {selected===c.id && (
                    <div style={{ marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}` }}>

                      {/* تغيير الحالة */}
                      <div style={{ marginBottom:16 }}>
                        <div style={{ fontSize:11, color:C.muted, marginBottom:8, letterSpacing:2, textTransform:'uppercase' }}>تغيير حالة الطلب</div>
                        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                          {STATUSES.map(s => (
                            <button key={s.value}
                              onClick={() => updateStatus(c.id, s.value, c.user_id, p.specialization)}
                              disabled={(c.status||'pending')===s.value || updating===c.id}
                              style={{ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, cursor:(c.status||'pending')===s.value?'default':'pointer', fontFamily:"'IBM Plex Sans Arabic', sans-serif", border:`1px solid ${s.color}44`, background:(c.status||'pending')===s.value?`${s.color}22`:'transparent', color:s.color, opacity:updating===c.id?.6:1 }}>
                              {(c.status||'pending')===s.value?'✓ ':''}{s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ملخص */}
                      {p.summary_ar && (
                        <div style={{ marginBottom:14, background:C.surface, borderRadius:10, padding:14 }}>
                          <div style={{ fontSize:10, letterSpacing:3, color:C.gold, textTransform:'uppercase', marginBottom:8 }}>الملخص</div>
                          <p style={{ fontSize:13, color:C.text, lineHeight:1.8 }}>{p.summary_ar}</p>
                        </div>
                      )}

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

                      {/* الملاحظات */}
                      {p.flags?.length > 0 && (
                        <div style={{ marginBottom:14 }}>
                          <div style={{ fontSize:10, letterSpacing:3, color:C.error, textTransform:'uppercase', marginBottom:8 }}>⚠️ ملاحظات</div>
                          {p.flags.map((f,i) => <div key={i} style={{ fontSize:13, color:C.text, marginBottom:5 }}>· {f}</div>)}
                        </div>
                      )}

                      {/* نص المقابلة */}
                      {c.transcript && (
                        <div>
                          <div style={{ fontSize:10, letterSpacing:3, color:C.gold, textTransform:'uppercase', marginBottom:10 }}>🎙️ نص المقابلة</div>
                          <div style={{ background:C.surface, borderRadius:10, padding:16, maxHeight:300, overflowY:'auto' }}>
                            {c.transcript.split('\n\n').map((line, i) => {
                              const isCandidate   = line.startsWith('Candidate:')
                              const isInterviewer = line.startsWith('Interviewer:')
                              if (!isCandidate && !isInterviewer) return null
                              return (
                                <div key={i} style={{ marginBottom:10, display:'flex', gap:10, alignItems:'flex-start' }}>
                                  <span style={{ fontSize:11, fontWeight:700, color:isCandidate?C.gold:C.muted, flexShrink:0, minWidth:52 }}>{isCandidate?'المتقدم':'نخبة'}:</span>
                                  <span style={{ fontSize:13, color:C.text, lineHeight:1.7 }}>{line.replace(/^(Candidate|Interviewer): /, '')}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* أزرار تواصل */}
                      <div style={{ display:'flex', gap:10, marginTop:16, flexWrap:'wrap' }}>
                        {phone && <button onClick={() => contactWhatsapp(phone, name)} style={{ flex:1, padding:'11px', borderRadius:10, fontSize:13, fontWeight:700, border:'none', background:'#25D366', color:'#fff', cursor:'pointer', fontFamily:"'IBM Plex Sans Arabic', sans-serif" }}>💬 تواصل عبر واتساب</button>}
                        {email && <button onClick={() => contactEmail(email, name)} style={{ flex:1, padding:'11px', borderRadius:10, fontSize:13, fontWeight:700, border:`1px solid ${C.gold}`, background:'transparent', color:C.gold, cursor:'pointer', fontFamily:"'IBM Plex Sans Arabic', sans-serif" }}>📧 تواصل عبر إيميل</button>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}