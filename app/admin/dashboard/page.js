'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a', blue:'#4a6fa5', warning:'#c8844a'
}

function StatCard({ icon, num, label, color, loading }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:20, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:12, left:12, fontSize:28, opacity:.08 }}>{icon}</div>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, fontWeight:600, color, lineHeight:1, marginBottom:8 }}>
        {loading ? '—' : num}
      </div>
      <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{label}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab]          = useState('stats')
  const [users, setUsers]      = useState([])
  const [jobs, setJobs]        = useState([])
  const [candidates, setCands] = useState([])
  const [loading, setLoading]  = useState(true)
  const [search, setSearch]    = useState('')
  const [busy, setBusy]        = useState(null)
  const [transcript, setTranscript] = useState(null)

  useEffect(() => {
    if (!sessionStorage.getItem('nukhba_admin')) { router.push('/admin'); return }
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const [ur, jr, cr] = await Promise.all([
        fetch('/api/admin/users', { cache:'no-store' }),
        fetch('/api/jobs', { cache:'no-store' }),
        fetch('/api/candidates', { cache:'no-store', headers: { 'x-user-id':'admin', 'x-user-role':'admin' } }),
      ])
      setUsers((await ur.json()).users || [])
      setJobs((await jr.json()).jobs || [])
      setCands((await cr.json()).candidates || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  async function banUser(id, ban) {
    setBusy(id)
    try {
      const r = await fetch(`/api/admin/users/${id}`, {
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ is_banned: ban })
      })
      const d = await r.json()
      console.log('banUser debug', d.debug)
      if (r.ok && d.success) setUsers(p => p.map(u => u.id===id ? {...u, is_banned:ban} : u))
      else alert(d.error || 'فشل تحديث الحالة')
    } catch(e) { alert('خطأ') }
    setBusy(null)
  }

  async function removeUser(id) {
    if (!window.confirm('حذف المستخدم نهائياً؟')) return
    setBusy(id)
    try {
      const r = await fetch(`/api/admin/users/${id}`, { method:'DELETE' })
      const d = await r.json()
      if (d.success) setUsers(p => p.filter(u => u.id !== id))
      else alert(d.error)
    } catch(e) { alert('خطأ') }
    setBusy(null)
  }

  async function removeJob(id) {
    if (!window.confirm('حذف الوظيفة نهائياً؟')) return
    setBusy(id)
    try {
      await fetch(`/api/jobs/${id}`, { method:'DELETE' })
      setJobs(p => p.filter(j => j.id !== id))
    } catch(e) { alert('خطأ') }
    setBusy(null)
  }

  async function removeProfile(id) {
    if (!window.confirm('حذف الملف نهائياً؟')) return
    setBusy(id)
    try {
      await fetch(`/api/candidates/${id}`, { method:'DELETE' })
      setCands(p => p.filter(c => c.id !== id))
    } catch(e) { alert('خطأ') }
    setBusy(null)
  }

  const candidatesCount = users.filter(u => u.role==='candidate').length
  const companiesCount  = users.filter(u => u.role==='company').length
  const bannedCount     = users.filter(u => u.is_banned).length
  const paidCount       = candidates.filter(c => c.is_paid).length

  const filtered = users.filter(u =>
    (u.name||'').toLowerCase().includes(search.toLowerCase()) ||
    (u.email||'').toLowerCase().includes(search.toLowerCase())
  )

  const ago = d => {
    const diff = Date.now() - new Date(d)
    const h = Math.floor(diff/3600000)
    if (h < 1) return 'الآن'
    if (h < 24) return `${h}س`
    const days = Math.floor(h/24)
    if (days < 30) return `${days}ي`
    return `${Math.floor(days/30)}ش`
  }

  const sc = s => s >= 80 ? C.success : s >= 60 ? C.gold : s > 0 ? C.error : C.muted

  const TABS = [
    { id:'stats',      icon:'📊', label:'لوحة التحكم' },
    { id:'candidates', icon:'👤', label:'الباحثون',   badge: candidatesCount },
    { id:'companies',  icon:'🏢', label:'الشركات',    badge: companiesCount },
    { id:'jobs',       icon:'📋', label:'الوظائف',    badge: jobs.length },
    { id:'profiles',   icon:'📁', label:'الملفات',    badge: candidates.length },
    { id:'banned',     icon:'🚫', label:'الموقوفون',  badge: bannedCount, warn: true },
  ]

  const UserRow = ({ u }) => (
    <div style={{ background: u.is_banned ? 'rgba(201,74,74,.04)' : C.card, border:`1px solid ${u.is_banned ? C.error+'33' : C.border}`, borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, transition:'border-color .2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = u.is_banned ? C.error+'66' : 'rgba(200,160,74,.3)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = u.is_banned ? C.error+'33' : C.border}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:38, height:38, borderRadius: u.role==='company'?10:'50%', background: u.role==='company' ? 'linear-gradient(135deg,#4a6fa5,#6a9fce)' : `linear-gradient(135deg,${C.goldDk},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#fff', flexShrink:0 }}>
          {u.role==='company' ? '🏢' : (u.name||'؟')[0]}
        </div>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color: u.is_banned ? C.error : C.text, marginBottom:2, display:'flex', alignItems:'center', gap:6 }}>
            {u.name}
            {u.is_banned && <span style={{ fontSize:10, background:`${C.error}22`, color:C.error, padding:'1px 7px', borderRadius:20 }}>موقوف</span>}
          </div>
          <div style={{ fontSize:12, color:C.muted }}>{u.email}</div>
          {u.phone && <div style={{ fontSize:11, color:C.muted }}>📱 {u.phone}</div>}
          {u.crn && <div style={{ fontSize:11, color:C.gold }}>س.ت: {u.crn}</div>}
        </div>
      </div>
      <div style={{ display:'flex', gap:7, alignItems:'center', flexShrink:0 }}>
        <span style={{ fontSize:11, color:C.muted }}>{ago(u.created_at)}</span>
        <button
          onClick={() => banUser(u.id, !u.is_banned)}
          disabled={busy===u.id}
          style={{ padding:'5px 11px', borderRadius:7, border:`1px solid ${u.is_banned ? C.success : C.warning}`, background:'transparent', color: u.is_banned ? C.success : C.warning, fontSize:11, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", opacity: busy===u.id ? .5 : 1 }}>
          {busy===u.id ? '⏳' : u.is_banned ? 'رفع الإيقاف' : 'إيقاف'}
        </button>
        <button
          onClick={() => removeUser(u.id)}
          disabled={busy===u.id}
          style={{ padding:'5px 11px', borderRadius:7, border:`1px solid ${C.error}`, background:'transparent', color:C.error, fontSize:11, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", opacity: busy===u.id ? .5 : 1 }}>
          {busy===u.id ? '⏳' : 'حذف'}
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text, display:'flex', flexDirection:'column' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      {/* Transcript Modal */}
      {transcript && (
        <div onClick={() => setTranscript(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, width:'100%', maxWidth:680, maxHeight:'82vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:14, fontWeight:700, color:C.text }}>🎙️ نص المقابلة</span>
              <button onClick={() => setTranscript(null)} style={{ background:'transparent', border:'none', color:C.muted, fontSize:20, cursor:'pointer', lineHeight:1 }}>✕</button>
            </div>
            <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
              {transcript.split('\n\n').map((line, i) => {
                const isCand = line.startsWith('Candidate:')
                const isInt  = line.startsWith('Interviewer:')
                if (!isCand && !isInt) return null
                return (
                  <div key={i} style={{ display:'flex', gap:10, marginBottom:12, alignItems:'flex-start' }}>
                    <span style={{ fontSize:11, fontWeight:700, color: isCand ? C.gold : C.muted, flexShrink:0, minWidth:55 }}>
                      {isCand ? 'المتقدم' : 'نخبة'}:
                    </span>
                    <span style={{ fontSize:13, color:C.text, lineHeight:1.75 }}>
                      {line.replace(/^(Candidate|Interviewer): /, '')}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}`, position:'sticky', top:0, zIndex:100, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:20, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</span>
          <span style={{ fontSize:10, color:C.gold, background:'rgba(200,160,74,.08)', border:`1px solid ${C.gold}33`, padding:'3px 10px', borderRadius:20, letterSpacing:2, fontWeight:700 }}>ADMIN</span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={load} style={{ padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>🔄 تحديث</button>
          <button onClick={() => { sessionStorage.removeItem('nukhba_admin'); router.push('/admin') }} style={{ padding:'6px 14px', borderRadius:8, border:`1px solid ${C.error}44`, background:'transparent', color:C.error, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>خروج</button>
        </div>
      </nav>

      <div style={{ display:'flex', flex:1, minHeight:0 }}>

        {/* Sidebar */}
        <aside style={{ width:210, background:C.bg2, borderLeft:`1px solid ${C.border}`, display:'flex', flexDirection:'column', paddingTop:10, flexShrink:0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSearch('') }}
              style={{ width:'100%', padding:'12px 18px', border:'none', background: tab===t.id ? 'rgba(200,160,74,.07)' : 'transparent', color: tab===t.id ? C.gold : t.warn ? C.warning : C.muted, fontSize:13, fontWeight: tab===t.id ? 700 : 400, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", textAlign:'right', display:'flex', alignItems:'center', justifyContent:'space-between', borderRight: tab===t.id ? `3px solid ${C.gold}` : '3px solid transparent', transition:'all .15s', marginBottom:2 }}>
              <span style={{ display:'flex', alignItems:'center', gap:9 }}>
                <span>{t.icon}</span>{t.label}
              </span>
              {!!t.badge && (
                <span style={{ fontSize:10, padding:'1px 7px', borderRadius:20, fontWeight:700, background: tab===t.id ? C.gold : t.warn ? `${C.warning}22` : C.surface, color: tab===t.id ? C.bg : t.warn ? C.warning : C.muted }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
          <div style={{ marginTop:'auto', padding:'14px 18px', borderTop:`1px solid ${C.border}` }}>
            <div style={{ fontSize:11, color:C.muted }}>nukhbahr.com</div>
            <div style={{ fontSize:10, color:C.muted, opacity:.5, marginTop:2 }}>Admin v4</div>
          </div>
        </aside>

        {/* Content */}
        <main style={{ flex:1, overflowY:'auto', padding:'28px 32px' }}>

          {/* STATS */}
          {tab==='stats' && (
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>لوحة التحكم</h1>
              <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>نظرة عامة على نخبة</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:14, marginBottom:28 }}>
                <StatCard icon="👤" num={candidatesCount} label="باحثون عن عمل" color={C.gold}    loading={loading}/>
                <StatCard icon="🏢" num={companiesCount}  label="شركات مسجلة"   color={C.blue}    loading={loading}/>
                <StatCard icon="📋" num={jobs.length}      label="وظائف منشورة"  color={C.success} loading={loading}/>
                <StatCard icon="📁" num={candidates.length}label="ملفات مرشحين"  color="#8a4a9c"   loading={loading}/>
                <StatCard icon="💳" num={paidCount}        label="دفعوا للخدمة"  color={C.success} loading={loading}/>
                <StatCard icon="🚫" num={bannedCount}      label="حسابات موقوفة" color={C.error}   loading={loading}/>
              </div>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:22 }}>
                <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>آخر المسجلين</div>
                {users.slice(0,8).map(u => (
                  <div key={u.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:30, height:30, borderRadius:'50%', background: u.role==='company' ? 'linear-gradient(135deg,#4a6fa5,#6a9fce)' : `linear-gradient(135deg,${C.goldDk},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#06060e' }}>
                        {(u.name||'؟')[0]}
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color: u.is_banned ? C.error : C.text }}>{u.name} {u.is_banned && '🚫'}</div>
                        <div style={{ fontSize:11, color:C.muted }}>{u.email}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ fontSize:11, padding:'2px 9px', borderRadius:20, background: u.role==='company' ? 'rgba(74,111,165,.12)' : 'rgba(200,160,74,.1)', color: u.role==='company' ? C.blue : C.gold }}>
                        {u.role==='company' ? 'شركة' : 'باحث'}
                      </span>
                      <span style={{ fontSize:11, color:C.muted }}>{ago(u.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CANDIDATES */}
          {tab==='candidates' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div>
                  <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>الباحثون عن عمل</h1>
                  <p style={{ fontSize:13, color:C.muted }}>{candidatesCount} مستخدم</p>
                </div>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..."
                  style={{ padding:'8px 14px', borderRadius:9, border:`1px solid ${C.border}`, background:C.surface, color:C.text, fontSize:13, fontFamily:"'Tajawal',sans-serif", outline:'none', width:200 }}/>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {filtered.filter(u => u.role==='candidate').map(u => <UserRow key={u.id} u={u}/>)}
              </div>
            </div>
          )}

          {/* COMPANIES */}
          {tab==='companies' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div>
                  <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>الشركات المسجلة</h1>
                  <p style={{ fontSize:13, color:C.muted }}>{companiesCount} شركة</p>
                </div>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..."
                  style={{ padding:'8px 14px', borderRadius:9, border:`1px solid ${C.border}`, background:C.surface, color:C.text, fontSize:13, fontFamily:"'Tajawal',sans-serif", outline:'none', width:200 }}/>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {filtered.filter(u => u.role==='company').map(u => <UserRow key={u.id} u={u}/>)}
              </div>
            </div>
          )}

          {/* JOBS */}
          {tab==='jobs' && (
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>الوظائف المنشورة</h1>
              <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>{jobs.length} وظيفة</p>
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {jobs.map(j => (
                  <div key={j.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:3 }}>{j.title}</div>
                      <div style={{ fontSize:12, color:C.gold, marginBottom:4 }}>{j.company_name}</div>
                      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                        {j.location && <span style={{ fontSize:11, color:C.muted }}>📍 {j.location}</span>}
                        <span style={{ fontSize:11, color:C.muted }}>🎙️ {j.questions?.length||0} أسئلة</span>
                        <span style={{ fontSize:11, padding:'1px 8px', borderRadius:20, background: j.status==='active' ? 'rgba(74,156,110,.12)' : 'rgba(122,118,144,.1)', color: j.status==='active' ? C.success : C.muted }}>
                          {j.status==='active' ? 'نشطة' : 'مغلقة'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
                      <span style={{ fontSize:11, color:C.muted }}>{ago(j.created_at)}</span>
                      <button onClick={() => removeJob(j.id)} disabled={busy===j.id}
                        style={{ padding:'5px 12px', borderRadius:7, border:`1px solid ${C.error}`, background:'transparent', color:C.error, fontSize:11, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                        {busy===j.id ? '⏳' : 'حذف'}
                      </button>
                    </div>
                  </div>
                ))}
                {!jobs.length && <div style={{ textAlign:'center', padding:60, color:C.muted }}>لا توجد وظائف</div>}
              </div>
            </div>
          )}

          {/* PROFILES */}
          {tab==='profiles' && (
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>ملفات المرشحين</h1>
              <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>{candidates.length} ملف · {paidCount} مدفوع</p>
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {candidates.map(c => {
                  const p    = c.profile_json || {}
                  const col  = sc(c.score)
                  const circ = 2 * Math.PI * 18
                  const dash = circ - (c.score / 100) * circ
                  return (
                    <div key={c.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <div style={{ width:42, height:42, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <svg width="42" height="42" viewBox="0 0 40 40" style={{ position:'absolute', transform:'rotate(-90deg)' }}>
                            <circle cx="20" cy="20" r="18" fill="none" stroke={C.border} strokeWidth="3"/>
                            <circle cx="20" cy="20" r="18" fill="none" stroke={col} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"/>
                          </svg>
                          <span style={{ fontSize:11, fontWeight:700, color:col }}>{c.score||0}</span>
                        </div>
                        <div>
                          <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                            <span style={{ fontSize:14, fontWeight:700, color:C.text }}>{p.name||c.name||'—'}</span>
                            {c.is_paid && <span style={{ fontSize:10, color:C.success, background:'rgba(74,156,110,.1)', padding:'1px 7px', borderRadius:20 }}>✓ مدفوع</span>}
                            {c.job_id && <span style={{ fontSize:10, color:C.blue, background:'rgba(74,111,165,.1)', padding:'1px 7px', borderRadius:20 }}>وظيفة</span>}
                          </div>
                          <div style={{ fontSize:12, color:C.gold }}>{p.specialization||c.specialization||'—'}</div>
                          <div style={{ fontSize:11, color:C.muted }}>📍 {p.location||c.location||'—'}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:7, alignItems:'center', flexShrink:0 }}>
                        <span style={{ fontSize:11, color:C.muted }}>{ago(c.created_at)}</span>
                        {c.transcript && (
                          <button onClick={() => setTranscript(c.transcript)}
                            style={{ padding:'5px 11px', borderRadius:7, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:11, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                            🎙️ مقابلة
                          </button>
                        )}
                        <button onClick={() => removeProfile(c.id)} disabled={busy===c.id}
                          style={{ padding:'5px 11px', borderRadius:7, border:`1px solid ${C.error}`, background:'transparent', color:C.error, fontSize:11, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                          {busy===c.id ? '⏳' : 'حذف'}
                        </button>
                      </div>
                    </div>
                  )
                })}
                {!candidates.length && <div style={{ textAlign:'center', padding:60, color:C.muted }}>لا توجد ملفات</div>}
              </div>
            </div>
          )}

          {/* BANNED */}
          {tab==='banned' && (
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>الحسابات الموقوفة</h1>
              <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>{bannedCount} حساب موقوف</p>
              {!bannedCount ? (
                <div style={{ textAlign:'center', padding:60, background:C.card, borderRadius:14, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
                  <div style={{ fontSize:15, color:C.text }}>لا توجد حسابات موقوفة</div>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                  {users.filter(u => u.is_banned).map(u => <UserRow key={u.id} u={u}/>)}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}