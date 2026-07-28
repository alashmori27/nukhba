'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a', blue:'#4a6fa5', warning:'#c8844a'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab]            = useState('stats')
  const [users, setUsers]        = useState([])
  const [jobs, setJobs]          = useState([])
  const [candidates, setCands]   = useState([])
  const [loading, setLoading]    = useState(true)
  const [search, setSearch]      = useState('')
  const [deleting, setDeleting]  = useState(null)
  const [banning, setBanning]    = useState(null)
  const [viewTranscript, setViewTranscript] = useState(null)

  useEffect(() => {
    const admin = sessionStorage.getItem('nukhba_admin')
    if (!admin) { router.push('/admin'); return }
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const [ur, jr, cr] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/jobs'),
        fetch('/api/candidates', { headers: { 'x-user-id':'admin', 'x-user-role':'admin' } }),
      ])
      setUsers((await ur.json()).users || [])
      setJobs((await jr.json()).jobs || [])
      setCands((await cr.json()).candidates || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  async function deleteUser(id) {
    if (!window.confirm('هل أنت متأكد من الحذف النهائي؟')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method:'DELETE' })
      const data = await res.json()
      if (data.success) setUsers(p => p.filter(u => u.id !== id))
      else alert('خطأ: ' + data.error)
    } catch(e) { alert('خطأ في الحذف') }
    setDeleting(null)
  }

  async function toggleBan(id, currentBanned) {
    setBanning(id)
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_banned: !currentBanned })
      })
      const data = await res.json()
      if (data.success) {
        setUsers(p => p.map(u => u.id === id ? { ...u, is_banned: !currentBanned } : u))
      }
    } catch(e) { console.error(e) }
    setBanning(null)
  }

  async function deleteJob(id) {
    if (!window.confirm('هل أنت متأكد من حذف هذه الوظيفة؟')) return
    setDeleting(id)
    try {
      await fetch(`/api/jobs/${id}`, { method:'DELETE' })
      setJobs(p => p.filter(j => j.id !== id))
    } catch(e) { alert('خطأ في الحذف') }
    setDeleting(null)
  }

  async function deleteCandidate(id) {
    if (!window.confirm('هل أنت متأكد من حذف هذا الملف؟')) return
    setDeleting(id)
    try {
      await fetch(`/api/candidates/${id}`, { method:'DELETE' })
      setCands(p => p.filter(c => c.id !== id))
    } catch(e) { alert('خطأ في الحذف') }
    setDeleting(null)
  }

  const candidates_count = users.filter(u => u.role === 'candidate').length
  const companies_count  = users.filter(u => u.role === 'company').length
  const banned_count     = users.filter(u => u.is_banned).length
  const paid_count       = candidates.filter(c => c.is_paid).length

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date)
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'اليوم'
    if (days === 1) return 'أمس'
    if (days < 30) return `${days} يوم`
    return `${Math.floor(days / 30)} شهر`
  }

  const scoreColor = s => s >= 80 ? C.success : s >= 60 ? C.gold : s > 0 ? C.error : C.muted

  const tabs = [
    { id:'stats',      label:'لوحة التحكم', icon:'📊' },
    { id:'candidates', label:'الباحثون',    icon:'👤', count: candidates_count },
    { id:'companies',  label:'الشركات',     icon:'🏢', count: companies_count },
    { id:'jobs',       label:'الوظائف',     icon:'📋', count: jobs.length },
    { id:'profiles',   label:'الملفات',     icon:'📁', count: candidates.length },
    { id:'banned',     label:'الموقوفون',   icon:'🚫', count: banned_count },
  ]

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text, display:'flex', flexDirection:'column' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      {/* Modal نص المقابلة */}
      {viewTranscript && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }} onClick={() => setViewTranscript(null)}>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, width:'100%', maxWidth:700, maxHeight:'80vh', overflow:'hidden', display:'flex', flexDirection:'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ fontSize:14, fontWeight:700, color:C.text }}>🎙️ نص المقابلة</div>
              <button onClick={() => setViewTranscript(null)} style={{ background:'transparent', border:'none', color:C.muted, fontSize:18, cursor:'pointer' }}>✕</button>
            </div>
            <div style={{ overflowY:'auto', padding:'16px 20px', flex:1 }}>
              {viewTranscript.split('\n\n').map((line, i) => {
                const isCandidate   = line.startsWith('Candidate:')
                const isInterviewer = line.startsWith('Interviewer:')
                if (!isCandidate && !isInterviewer) return null
                return (
                  <div key={i} style={{ marginBottom:12, display:'flex', gap:10, alignItems:'flex-start' }}>
                    <span style={{ fontSize:11, fontWeight:700, color:isCandidate ? C.gold : C.muted, flexShrink:0, minWidth:60 }}>
                      {isCandidate ? 'المتقدم' : 'نخبة'}:
                    </span>
                    <span style={{ fontSize:13, color:C.text, lineHeight:1.7 }}>{line.replace(/^(Candidate|Interviewer): /, '')}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Top Nav */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}`, flexShrink:0, position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ fontSize:20, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</div>
          <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(200,160,74,.08)', border:`1px solid ${C.gold}44`, padding:'3px 12px', borderRadius:20 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:C.success, display:'inline-block' }}/>
            <span style={{ fontSize:11, color:C.gold, fontWeight:700, letterSpacing:2 }}>ADMIN</span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={fetchAll} style={{ padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
            🔄 تحديث
          </button>
          <button onClick={() => { sessionStorage.removeItem('nukhba_admin'); router.push('/admin') }} style={{ padding:'6px 14px', borderRadius:8, border:`1px solid ${C.error}44`, background:'transparent', color:C.error, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
            خروج
          </button>
        </div>
      </div>

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* Sidebar */}
        <div style={{ width:220, background:C.bg2, borderLeft:`1px solid ${C.border}`, flexShrink:0, display:'flex', flexDirection:'column', paddingTop:12 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSearch('') }} style={{
              width:'100%', padding:'13px 20px', border:'none',
              background: tab === t.id ? 'rgba(200,160,74,.08)' : 'transparent',
              color: tab === t.id ? C.gold : t.id === 'banned' ? C.warning : C.muted,
              fontSize:14, fontWeight: tab === t.id ? 700 : 400,
              cursor:'pointer', fontFamily:"'Tajawal',sans-serif",
              textAlign:'right', display:'flex', alignItems:'center', justifyContent:'space-between',
              borderRight: tab === t.id ? `3px solid ${C.gold}` : '3px solid transparent',
              transition:'all .15s', marginBottom:2
            }}>
              <span style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:16 }}>{t.icon}</span>
                {t.label}
              </span>
              {t.count !== undefined && t.count > 0 && (
                <span style={{ fontSize:11, background: tab === t.id ? C.gold : t.id === 'banned' ? `${C.warning}22` : C.surface, color: tab === t.id ? C.bg : t.id === 'banned' ? C.warning : C.muted, padding:'2px 8px', borderRadius:20, fontWeight:700 }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
          <div style={{ marginTop:'auto', padding:'16px 20px', borderTop:`1px solid ${C.border}` }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>nukhbahr.com</div>
            <div style={{ fontSize:10, color:C.muted, opacity:.6 }}>Admin Panel v3</div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'28px 32px' }}>

          {/* STATS */}
          {tab === 'stats' && (
            <div>
              <div style={{ marginBottom:28 }}>
                <h1 style={{ fontSize:24, fontWeight:800, color:C.text, marginBottom:4 }}>لوحة التحكم</h1>
                <p style={{ fontSize:13, color:C.muted }}>نظرة عامة على نخبة</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:32 }}>
                {[
                  { icon:'👤', num:candidates_count, label:'باحثون عن عمل', color:C.gold },
                  { icon:'🏢', num:companies_count,  label:'شركات مسجلة',   color:C.blue },
                  { icon:'📋', num:jobs.length,       label:'وظائف منشورة',  color:C.success },
                  { icon:'📁', num:candidates.length, label:'ملفات مرشحين', color:'#8a4a9c' },
                  { icon:'💳', num:paid_count,        label:'دفعوا للخدمة',  color:C.success },
                  { icon:'🚫', num:banned_count,      label:'حسابات موقوفة', color:C.error },
                ].map(s => (
                  <div key={s.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:20, position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:12, left:12, fontSize:24, opacity:.1 }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:38, fontWeight:600, color:s.color, lineHeight:1, marginBottom:8 }}>
                      {loading ? '...' : s.num}
                    </div>
                    <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
                <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16 }}>آخر المسجلين</div>
                {users.slice(0, 8).map(u => (
                  <div key={u.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', background: u.role === 'company' ? 'linear-gradient(135deg,#4a6fa5,#6a9fce)' : `linear-gradient(135deg,${C.goldDk},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#06060e' }}>
                        {(u.name || '؟')[0]}
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color: u.is_banned ? C.error : C.text }}>
                          {u.name} {u.is_banned && '🚫'}
                        </div>
                        <div style={{ fontSize:11, color:C.muted }}>{u.email}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:11, padding:'2px 10px', borderRadius:20, background: u.role === 'company' ? 'rgba(74,111,165,.15)' : 'rgba(200,160,74,.1)', color: u.role === 'company' ? C.blue : C.gold }}>
                        {u.role === 'company' ? 'شركة' : 'باحث'}
                      </span>
                      <span style={{ fontSize:11, color:C.muted }}>{timeAgo(u.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CANDIDATES + COMPANIES */}
          {(tab === 'candidates' || tab === 'companies') && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div>
                  <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>
                    {tab === 'candidates' ? 'الباحثون عن عمل' : 'الشركات المسجلة'}
                  </h1>
                  <p style={{ fontSize:13, color:C.muted }}>
                    {tab === 'candidates' ? candidates_count : companies_count} {tab === 'candidates' ? 'مستخدم' : 'شركة'}
                  </p>
                </div>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو الإيميل..."
                  style={{ padding:'9px 16px', borderRadius:10, border:`1px solid ${C.border}`, background:C.surface, color:C.text, fontSize:13, fontFamily:"'Tajawal',sans-serif", outline:'none', width:220 }}/>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {filteredUsers.filter(u => u.role === (tab === 'candidates' ? 'candidate' : 'company')).map(u => (
                  <div key={u.id} style={{ background: u.is_banned ? 'rgba(201,74,74,.05)' : C.card, border:`1px solid ${u.is_banned ? C.error + '44' : C.border}`, borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:40, height:40, borderRadius: tab === 'companies' ? 10 : '50%', background: tab === 'companies' ? 'linear-gradient(135deg,#4a6fa5,#6a9fce)' : `linear-gradient(135deg,${C.goldDk},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800, color:'#fff', flexShrink:0 }}>
                        {tab === 'companies' ? '🏢' : (u.name || '؟')[0]}
                      </div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color: u.is_banned ? C.error : C.text, marginBottom:2 }}>
                          {u.name} {u.is_banned && <span style={{ fontSize:11 }}>🚫 موقوف</span>}
                        </div>
                        <div style={{ fontSize:12, color:C.muted }}>{u.email}</div>
                        {u.phone && <div style={{ fontSize:11, color:C.muted }}>📱 {u.phone}</div>}
                        {u.crn && <div style={{ fontSize:11, color:C.gold }}>س.ت: {u.crn}</div>}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', justifyContent:'flex-end' }}>
                      <span style={{ fontSize:11, color:C.muted }}>{timeAgo(u.created_at)}</span>
                      <button onClick={() => toggleBan(u.id, u.is_banned)} style={{ padding:'6px 12px', borderRadius:8, border:`1px solid ${u.is_banned ? C.success : C.warning}`, background:'transparent', color: u.is_banned ? C.success : C.warning, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                        {banning === u.id ? '⏳' : u.is_banned ? 'رفع الإيقاف' : 'إيقاف'}
                      </button>
                      <button onClick={() => deleteUser(u.id)} style={{ padding:'6px 12px', borderRadius:8, border:`1px solid ${C.error}`, background:'transparent', color:C.error, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                        {deleting === u.id ? '⏳' : 'حذف'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* JOBS */}
          {tab === 'jobs' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>الوظائف المنشورة</h1>
                <p style={{ fontSize:13, color:C.muted }}>{jobs.length} وظيفة</p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {jobs.map(j => (
                  <div key={j.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:3 }}>{j.title}</div>
                      <div style={{ fontSize:12, color:C.gold, marginBottom:3 }}>{j.company_name}</div>
                      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                        {j.location && <span style={{ fontSize:11, color:C.muted }}>📍 {j.location}</span>}
                        <span style={{ fontSize:11, color:C.muted }}>🎙️ {j.questions?.length || 0} أسئلة</span>
                        <span style={{ fontSize:11, padding:'1px 8px', borderRadius:20, background: j.status === 'active' ? 'rgba(74,156,110,.15)' : 'rgba(122,118,144,.1)', color: j.status === 'active' ? C.success : C.muted }}>
                          {j.status === 'active' ? 'نشطة' : 'مغلقة'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ fontSize:11, color:C.muted }}>{timeAgo(j.created_at)}</span>
                      <button onClick={() => deleteJob(j.id)} style={{ padding:'6px 14px', borderRadius:8, border:`1px solid ${C.error}`, background:'transparent', color:C.error, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                        {deleting === j.id ? '⏳' : 'حذف'}
                      </button>
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && !loading && (
                  <div style={{ textAlign:'center', padding:60, color:C.muted }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
                    لا توجد وظائف منشورة
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PROFILES */}
          {tab === 'profiles' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>ملفات المرشحين</h1>
                <p style={{ fontSize:13, color:C.muted }}>{candidates.length} ملف · {paid_count} مدفوع</p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {candidates.map(c => {
                  const p    = c.profile_json || {}
                  const sc   = scoreColor(c.score)
                  const circ = 2 * Math.PI * 18
                  const dash = circ - (c.score / 100) * circ
                  return (
                    <div key={c.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <div style={{ width:44, height:44, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <svg width="44" height="44" viewBox="0 0 40 40" style={{ position:'absolute', transform:'rotate(-90deg)' }}>
                            <circle cx="20" cy="20" r="18" fill="none" stroke={C.border} strokeWidth="3"/>
                            <circle cx="20" cy="20" r="18" fill="none" stroke={sc} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"/>
                          </svg>
                          <span style={{ fontSize:11, fontWeight:700, color:sc }}>{c.score || 0}</span>
                        </div>
                        <div>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                            <span style={{ fontSize:14, fontWeight:700, color:C.text }}>{p.name || c.name || '—'}</span>
                            {c.is_paid && <span style={{ fontSize:10, color:C.success, background:'rgba(74,156,110,.1)', padding:'1px 8px', borderRadius:20 }}>✓ مدفوع</span>}
                            {c.job_id && <span style={{ fontSize:10, color:C.blue, background:'rgba(74,111,165,.1)', padding:'1px 8px', borderRadius:20 }}>وظيفة</span>}
                          </div>
                          <div style={{ fontSize:12, color:C.gold }}>{p.specialization || c.specialization || '—'}</div>
                          <div style={{ fontSize:11, color:C.muted }}>📍 {p.location || c.location || '—'}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <span style={{ fontSize:11, color:C.muted }}>{timeAgo(c.created_at)}</span>
                        {c.transcript && (
                          <button onClick={() => setViewTranscript(c.transcript)} style={{ padding:'6px 12px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                            🎙️ المقابلة
                          </button>
                        )}
                        <button onClick={() => deleteCandidate(c.id)} style={{ padding:'6px 12px', borderRadius:8, border:`1px solid ${C.error}`, background:'transparent', color:C.error, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                          {deleting === c.id ? '⏳' : 'حذف'}
                        </button>
                      </div>
                    </div>
                  )
                })}
                {candidates.length === 0 && !loading && (
                  <div style={{ textAlign:'center', padding:60, color:C.muted }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>📁</div>
                    لا توجد ملفات بعد
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BANNED */}
          {tab === 'banned' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>الحسابات الموقوفة</h1>
                <p style={{ fontSize:13, color:C.muted }}>{banned_count} حساب موقوف</p>
              </div>
              {banned_count === 0 ? (
                <div style={{ textAlign:'center', padding:60, background:C.card, borderRadius:14, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
                  <div style={{ fontSize:16, color:C.text }}>لا توجد حسابات موقوفة</div>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {users.filter(u => u.is_banned).map(u => (
                    <div key={u.id} style={{ background:'rgba(201,74,74,.05)', border:`1px solid ${C.error}44`, borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(201,74,74,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🚫</div>
                        <div>
                          <div style={{ fontSize:14, fontWeight:700, color:C.error, marginBottom:2 }}>{u.name}</div>
                          <div style={{ fontSize:12, color:C.muted }}>{u.email}</div>
                          <div style={{ fontSize:11, color:C.muted }}>{u.role === 'company' ? 'شركة' : 'باحث'} · {timeAgo(u.created_at)}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={() => toggleBan(u.id, u.is_banned)} style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${C.success}`, background:'transparent', color:C.success, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                          {banning === u.id ? '⏳' : 'رفع الإيقاف'}
                        </button>
                        <button onClick={() => deleteUser(u.id)} style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${C.error}`, background:'transparent', color:C.error, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                          {deleting === u.id ? '⏳' : 'حذف نهائي'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}