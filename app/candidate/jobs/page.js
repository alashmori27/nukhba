'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690'
}

export default function CandidateJobs() {
  const router = useRouter()
  const [user, setUser]     = useState(null)
  const [jobs, setJobs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    setUser(JSON.parse(u))
    fetchJobs()
  }, [])

  async function fetchJobs() {
    try {
      const res  = await fetch('/api/jobs')
      const data = await res.json()
      setJobs(data.jobs || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  function applyToJob(job) {
    // حفظ بيانات الوظيفة في sessionStorage
    sessionStorage.setItem('nukhba_job', JSON.stringify(job))
    // التوجيه لصفحة المقابلة مع ID الوظيفة
    router.push(`/candidate/interview?jobId=${job.id}`)
  }

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet"/>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</div>
        <Link href="/candidate/dashboard" style={{ fontSize:13, color:C.muted, padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}` }}>← لوحة التحكم</Link>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'36px 24px' }}>
        <h1 style={{ fontSize:26, fontWeight:800, marginBottom:6 }}>الوظائف المتاحة</h1>
        <p style={{ fontSize:14, color:C.muted, marginBottom:32 }}>تقدّم على وظيفة محددة وأجرِ مقابلة ذكية مخصصة لمتطلباتها</p>

        {loading && (
          <div style={{ textAlign:'center', padding:60, color:C.muted }}>
            <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
            جاري تحميل الوظائف...
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div style={{ textAlign:'center', padding:60, color:C.muted, background:C.card, borderRadius:14, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📭</div>
            <div style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:8 }}>لا توجد وظائف حالياً</div>
            <div style={{ fontSize:14 }}>ستظهر هنا الوظائف التي تنشرها الشركات</div>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {jobs.map(job => (
            <div key={job.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24, transition:'border-color .2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='rgba(200,160,74,.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:6 }}>{job.title}</div>
                  <div style={{ fontSize:13, color:C.gold, marginBottom:10 }}>{job.company_name}</div>
                  <div style={{ fontSize:13, color:C.muted, lineHeight:1.75, marginBottom:14, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{job.description}</div>
                  <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                    {job.location && <span style={{ padding:'4px 12px', borderRadius:20, fontSize:12, background:C.surface, border:`1px solid ${C.border}`, color:C.muted }}>📍 {job.location}</span>}
                    {job.salary_range && <span style={{ padding:'4px 12px', borderRadius:20, fontSize:12, background:C.surface, border:`1px solid ${C.border}`, color:C.muted }}>💰 {job.salary_range}</span>}
                    {job.questions?.length > 0 && <span style={{ padding:'4px 12px', borderRadius:20, fontSize:12, background:'rgba(200,160,74,.1)', border:`1px solid rgba(200,160,74,.3)`, color:C.gold }}>🎙️ {job.questions.length} أسئلة مقابلة</span>}
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8, flexShrink:0 }}>
                  <button onClick={() => setSelected(selected?.id===job.id?null:job)} style={{ padding:'8px 18px', borderRadius:9, fontSize:13, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                    {selected?.id===job.id ? 'إخفاء ▲' : 'التفاصيل ▼'}
                  </button>
                  <button onClick={() => applyToJob(job)} style={{ padding:'8px 18px', borderRadius:9, fontSize:13, fontWeight:700, border:'none', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                    تقدّم الآن
                  </button>
                </div>
              </div>

              {selected?.id===job.id && (
                <div style={{ marginTop:20, paddingTop:20, borderTop:`1px solid ${C.border}` }}>
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:11, letterSpacing:3, color:C.gold, textTransform:'uppercase', marginBottom:8 }}>المتطلبات</div>
                    <div style={{ fontSize:13, color:C.text, lineHeight:1.8 }}>{job.requirements}</div>
                  </div>
                  {job.questions?.length > 0 && (
                    <div>
                      <div style={{ fontSize:11, letterSpacing:3, color:C.gold, textTransform:'uppercase', marginBottom:10 }}>أسئلة المقابلة</div>
                      {job.questions.map((q,i) => (
                        <div key={i} style={{ display:'flex', gap:10, marginBottom:8, alignItems:'flex-start' }}>
                          <div style={{ width:22, height:22, borderRadius:'50%', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#06060e', flexShrink:0 }}>{i+1}</div>
                          <div style={{ fontSize:13, color:C.muted, lineHeight:1.7 }}>{q}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => applyToJob(job)} style={{ marginTop:16, width:'100%', padding:'12px', borderRadius:10, border:'none', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                    🎙️ ابدأ مقابلة هذه الوظيفة
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}