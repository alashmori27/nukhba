'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab]             = useState('stats')
  const [users, setUsers]         = useState([])
  const [jobs, setJobs]           = useState([])
  const [candidates, setCands]    = useState([])
  const [loading, setLoading]     = useState(true)
  const [stats, setStats]         = useState({ users:0, companies:0, jobs:0, candidates:0 })

  useEffect(() => {
    const admin = sessionStorage.getItem('nukhba_admin')
    if (!admin) { router.push('/admin'); return }
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const [usersRes, jobsRes, candsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/jobs'),
        fetch('/api/candidates'),
      ])
      const ud = await usersRes.json()
      const jd = await jobsRes.json()
      const cd = await candsRes.json()

      const allUsers = ud.users || []
      const allJobs  = jd.jobs  || []
      const allCands = cd.candidates || []

      setUsers(allUsers)
      setJobs(allJobs)
      setCands(allCands)
      setStats({
        users:      allUsers.filter(u => u.role==='candidate').length,
        companies:  allUsers.filter(u => u.role==='company').length,
        jobs:       allJobs.length,
        candidates: allCands.length,
      })
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  async function deleteUser(id) {
    if (!confirm('هل أنت متأكد من الحذف؟')) return
    try {
      await fetch(`/api/admin/users/${id}`, { method:'DELETE' })
      setUsers(p => p.filter(u => u.id !== id))
      setStats(p => ({ ...p, users: p.users - 1 }))
    } catch(e) { alert('خطأ في الحذف') }
  }

  async function deleteJob(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الوظيفة؟')) return
    try {
      await fetch(`/api/jobs/${id}`, { method:'DELETE' })
      setJobs(p => p.filter(j => j.id !== id))
      setStats(p => ({ ...p, jobs: p.jobs - 1 }))
    } catch(e) { alert('خطأ في الحذف') }
  }

  async function deleteCandidate(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return
    try {
      await fetch(`/api/candidates/${id}`, { method:'DELETE' })
      setCands(p => p.filter(c => c.id !== id))
      setStats(p => ({ ...p, candidates: p.candidates - 1 }))
    } catch(e) { alert('خطأ في الحذف') }
  }

  function logout() {
    sessionStorage.removeItem('nukhba_admin')
    router.push('/admin')
  }

  const tabs = [
    { id:'stats',      label:'الإحصائيات', icon:'📊' },
    { id:'users',      label:'الباحثون',    icon:'👤' },
    { id:'companies',  label:'الشركات',     icon:'🏢' },
    { id:'jobs',       label:'الوظائف',     icon:'📋' },
    { id:'candidates', label:'الملفات',     icon:'📁' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet"/>

      {/* Nav */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</div>
          <span style={{ fontSize:11, color:C.muted, background:C.surface, padding:'3px 10px', borderRadius:10, border:`1px solid ${C.border}` }}>ADMIN</span>
        </div>
        <button onClick={logout} style={{ padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>خروج</button>
      </div>

      <div style={{ display:'flex', minHeight:'calc(100vh - 60px)' }}>

        {/* Sidebar */}
        <div style={{ width:200, background:C.bg2, borderLeft:`1px solid ${C.border}`, padding:'20px 0', flexShrink:0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              width:'100%', padding:'12px 20px', border:'none', background: tab===t.id ? C.surface : 'transparent',
              color: tab===t.id ? C.gold : C.muted,
              fontSize:14, fontWeight: tab===t.id ? 700 : 400,
              cursor:'pointer', fontFamily:"'Tajawal',sans-serif",
              textAlign:'right', display:'flex', alignItems:'center', gap:10,
              borderRight: tab===t.id ? `3px solid ${C.gold}` : '3px solid transparent',
              transition:'all .15s'
            }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex:1, padding:28, overflowY:'auto' }}>

          {/* STATS */}
          {tab==='stats' && (
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, marginBottom:24 }}>الإحصائيات العامة</h1>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:32 }}>
                {[
                  { icon:'👤', num:stats.users,      label:'باحثون عن عمل', color:C.gold },
                  { icon:'🏢', num:stats.companies,   label:'شركات مسجلة',   color:'#4a6fa5' },
                  { icon:'📋', num:stats.jobs,        label:'وظائف منشورة',  color:C.success },
                  { icon:'📁', num:stats.candidates,  label:'ملفات مرشحين',  color:'#8a4a9c' },
                ].map(s => (
                  <div key={s.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24, textAlign:'center' }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:600, color:s.color, lineHeight:1 }}>{loading?'...':s.num}</div>
                    <div style={{ fontSize:12, color:C.muted, marginTop:6 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS — باحثون */}
          {tab==='users' && (
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, marginBottom:20 }}>الباحثون عن عمل ({users.filter(u=>u.role==='candidate').length})</h1>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {users.filter(u=>u.role==='candidate').map(u => (
                  <div key={u.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#06060e', flexShrink:0 }}>
                        {(u.name||'؟')[0]}
                      </div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{u.name}</div>
                        <div style={{ fontSize:12, color:C.muted }}>{u.email}</div>
                        {u.phone && <div style={{ fontSize:11, color:C.muted }}>{u.phone}</div>}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ fontSize:11, color:C.muted }}>{new Date(u.created_at).toLocaleDateString('ar-SA')}</span>
                      <button onClick={() => deleteUser(u.id)} style={{ padding:'6px 12px', borderRadius:7, border:`1px solid ${C.error}`, background:'transparent', color:C.error, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>حذف</button>
                    </div>
                  </div>
                ))}
                {users.filter(u=>u.role==='candidate').length===0 && !loading && (
                  <div style={{ textAlign:'center', padding:40, color:C.muted }}>لا يوجد باحثون مسجلون بعد</div>
                )}
              </div>
            </div>
          )}

          {/* COMPANIES */}
          {tab==='companies' && (
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, marginBottom:20 }}>الشركات المسجلة ({users.filter(u=>u.role==='company').length})</h1>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {users.filter(u=>u.role==='company').map(u => (
                  <div key={u.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#4a6fa5,#6a9fce)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#fff', flexShrink:0 }}>
                        {(u.name||'؟')[0]}
                      </div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{u.name}</div>
                        <div style={{ fontSize:12, color:C.muted }}>{u.email}</div>
                        {u.crn && <div style={{ fontSize:11, color:C.gold }}>س.ت: {u.crn}</div>}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ fontSize:11, color:C.muted }}>{new Date(u.created_at).toLocaleDateString('ar-SA')}</span>
                      <button onClick={() => deleteUser(u.id)} style={{ padding:'6px 12px', borderRadius:7, border:`1px solid ${C.error}`, background:'transparent', color:C.error, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>حذف</button>
                    </div>
                  </div>
                ))}
                {users.filter(u=>u.role==='company').length===0 && !loading && (
                  <div style={{ textAlign:'center', padding:40, color:C.muted }}>لا توجد شركات مسجلة بعد</div>
                )}
              </div>
            </div>
          )}

          {/* JOBS */}
          {tab==='jobs' && (
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, marginBottom:20 }}>الوظائف المنشورة ({jobs.length})</h1>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {jobs.map(j => (
                  <div key={j.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{j.title}</div>
                      <div style={{ fontSize:12, color:C.gold, marginTop:2 }}>{j.company_name}</div>
                      <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>
                        {j.location && `📍 ${j.location}`} · {j.questions?.length || 0} أسئلة
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ fontSize:11, color:C.muted }}>{new Date(j.created_at).toLocaleDateString('ar-SA')}</span>
                      <button onClick={() => deleteJob(j.id)} style={{ padding:'6px 12px', borderRadius:7, border:`1px solid ${C.error}`, background:'transparent', color:C.error, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>حذف</button>
                    </div>
                  </div>
                ))}
                {jobs.length===0 && !loading && (
                  <div style={{ textAlign:'center', padding:40, color:C.muted }}>لا توجد وظائف منشورة بعد</div>
                )}
              </div>
            </div>
          )}

          {/* CANDIDATES */}
          {tab==='candidates' && (
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, marginBottom:20 }}>ملفات المرشحين ({candidates.length})</h1>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {candidates.map(c => {
                  const p = c.profile_json || {}
                  const sc = c.score >= 80 ? C.success : c.score >= 60 ? C.gold : C.error
                  return (
                    <div key={c.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#06060e', flexShrink:0 }}>
                          {(p.name||c.name||'؟')[0]}
                        </div>
                        <div>
                          <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{p.name || c.name}</div>
                          <div style={{ fontSize:12, color:C.gold }}>{p.specialization || c.specialization}</div>
                          <div style={{ fontSize:11, color:C.muted }}>📍 {p.location || c.location}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                        <div style={{ textAlign:'center' }}>
                          <div style={{ fontSize:18, fontWeight:700, color:sc }}>{c.score}</div>
                          <div style={{ fontSize:9, color:C.muted }}>تقييم</div>
                        </div>
                        <button onClick={() => deleteCandidate(c.id)} style={{ padding:'6px 12px', borderRadius:7, border:`1px solid ${C.error}`, background:'transparent', color:C.error, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>حذف</button>
                      </div>
                    </div>
                  )
                })}
                {candidates.length===0 && !loading && (
                  <div style={{ textAlign:'center', padding:40, color:C.muted }}>لا توجد ملفات مرشحين بعد</div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}