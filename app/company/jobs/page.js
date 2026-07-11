'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a'
}

export default function CompanyJobs() {
  const router = useRouter()
  const [user, setUser]   = useState(null)
  const [jobs, setJobs]   = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'company') { router.push('/candidate/dashboard'); return }
    setUser(parsed)
    fetchJobs(parsed.id)
  }, [])

  async function fetchJobs(companyId) {
    try {
      const res  = await fetch('/api/jobs')
      const data = await res.json()
      const myJobs = (data.jobs || []).filter(j => j.company_id === companyId)
      setJobs(myJobs)
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  async function deleteJob(jobId) {
    if (!confirm('هل أنت متأكد من حذف هذه الوظيفة؟')) return
    try {
      await fetch(`/api/jobs/${jobId}`, { method:'DELETE' })
      setJobs(p => p.filter(j => j.id !== jobId))
    } catch(e) { alert('خطأ في الحذف') }
  }

  if (!user) return null

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet"/>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة · للشركات</div>
        <div style={{ display:'flex', gap:10 }}>
          <Link href="/company/post-job" style={{ padding:'7px 16px', borderRadius:8, fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', border:'none' }}>+ نشر وظيفة جديدة</Link>
          <Link href="/company/dashboard" style={{ padding:'7px 16px', borderRadius:8, fontSize:13, color:C.muted, border:`1px solid ${C.border}` }}>← لوحة التحكم</Link>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'36px 24px' }}>
        <h1 style={{ fontSize:26, fontWeight:800, marginBottom:6 }}>وظائفي المنشورة</h1>
        <p style={{ fontSize:14, color:C.muted, marginBottom:32 }}>
          {loading ? '...' : `${jobs.length} وظيفة منشورة`}
        </p>

        {loading && (
          <div style={{ textAlign:'center', padding:60, color:C.muted }}>
            <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
            جاري التحميل...
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div style={{ textAlign:'center', padding:60, background:C.card, borderRadius:14, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📭</div>
            <div style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:8 }}>لا توجد وظائف منشورة بعد</div>
            <Link href="/company/post-job" style={{ display:'inline-flex', marginTop:16, padding:'11px 24px', borderRadius:10, fontSize:14, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e' }}>+ انشر أول وظيفة</Link>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {jobs.map(job => (
            <div key={job.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24, transition:'border-color .2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='rgba(200,160,74,.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16, marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:4 }}>{job.title}</div>
                  <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                    {job.location && <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, background:C.surface, border:`1px solid ${C.border}`, color:C.muted }}>📍 {job.location}</span>}
                    {job.work_type && <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, background:C.surface, border:`1px solid ${C.border}`, color:C.muted }}>{job.work_type==='full-time'?'دوام كامل':job.work_type==='part-time'?'دوام جزئي':'عن بُعد'}</span>}
                    <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, background:'rgba(200,160,74,.1)', border:`1px solid rgba(200,160,74,.3)`, color:C.gold }}>🎙️ {job.questions?.length || 0} أسئلة</span>
                    <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, background:C.surface, border:`1px solid ${C.border}`, color:C.muted }}>
                      {new Date(job.created_at).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  <button onClick={() => setSelected(selected?.id===job.id?null:job)} style={{ padding:'7px 14px', borderRadius:8, fontSize:12, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                    {selected?.id===job.id?'إخفاء ▲':'التفاصيل ▼'}
                  </button>
                  <button onClick={() => deleteJob(job.id)} style={{ padding:'7px 14px', borderRadius:8, fontSize:12, border:`1px solid ${C.error}`, background:'transparent', color:C.error, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                    حذف
                  </button>
                </div>
              </div>

              <p style={{ fontSize:13, color:C.muted, lineHeight:1.7, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{job.description}</p>

              {selected?.id===job.id && (
                <div style={{ marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:10, letterSpacing:3, color:C.gold, textTransform:'uppercase', marginBottom:8 }}>المتطلبات</div>
                    <div style={{ fontSize:13, color:C.text, lineHeight:1.8 }}>{job.requirements}</div>
                  </div>
                  {job.questions?.length > 0 && (
                    <div>
                      <div style={{ fontSize:10, letterSpacing:3, color:C.gold, textTransform:'uppercase', marginBottom:10 }}>أسئلة المقابلة</div>
                      {job.questions.map((q,i) => (
                        <div key={i} style={{ display:'flex', gap:10, marginBottom:8 }}>
                          <div style={{ width:22, height:22, borderRadius:'50%', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#06060e', flexShrink:0 }}>{i+1}</div>
                          <div style={{ fontSize:13, color:C.muted, lineHeight:1.7 }}>{q}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}