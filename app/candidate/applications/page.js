'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a'
}

const STATUS = {
  pending:   { label:'قيد المراجعة', icon:'⏳', color:'#7a7690' },
  viewed:    { label:'اطلعت الشركة على ملفك', icon:'👁️', color:'#4a6fa5' },
  contacted: { label:'الشركة تواصلت معك', icon:'📞', color:'#4a9c6e' },
  accepted:  { label:'تم القبول 🎉', icon:'✅', color:'#4a9c6e' },
  rejected:  { label:'لم يتم القبول', icon:'❌', color:'#c94a4a' },
}

export default function CandidateApplications() {
  const router = useRouter()
  const [user, setUser]           = useState(null)
  const [applications, setApps]   = useState([])
  const [jobs, setJobs]           = useState({})
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'candidate') { router.push('/company/dashboard'); return }
    setUser(parsed)
    fetchApplications(parsed.id)
  }, [])

  async function fetchApplications(userId) {
    try {
      const res  = await fetch(`/api/applications?user_id=${userId}`)
      const data = await res.json()
      const apps = data.applications || []
      setApps(apps)

      // جلب بيانات الوظائف
      const jobIds = [...new Set(apps.map(a => a.job_id).filter(Boolean))]
      if (jobIds.length > 0) {
        const jobsRes  = await fetch('/api/jobs')
        const jobsData = await jobsRes.json()
        const jobsMap  = {}
        ;(jobsData.jobs || []).forEach(j => { jobsMap[j.id] = j })
        setJobs(jobsMap)
      }
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date)
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'الآن'
    if (mins < 60) return `منذ ${mins} دقيقة`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `منذ ${hrs} ساعة`
    return `منذ ${Math.floor(hrs/24)} يوم`
  }

  if (!user) return null

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</div>
        <Link href="/candidate/dashboard" style={{ fontSize:13, color:C.muted, padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}`, textDecoration:'none' }}>← لوحة التحكم</Link>
      </nav>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'40px 20px' }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:4 }}>تتبع طلباتي</h1>
        <p style={{ fontSize:13, color:C.muted, marginBottom:32 }}>
          الوظائف التي تقدمت عليها — <span style={{ color:C.gold }}>{applications.length} طلب</span>
        </p>

        {loading && <div style={{ textAlign:'center', padding:60, color:C.muted }}>⏳ جاري التحميل...</div>}

        {!loading && applications.length === 0 && (
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:'60px 32px', textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:14 }}>📭</div>
            <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:8 }}>لم تتقدم على أي وظيفة بعد</div>
            <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>تصفح الوظائف المتاحة وتقدم الآن</p>
            <Link href="/candidate/jobs" style={{ padding:'11px 24px', borderRadius:10, fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', textDecoration:'none' }}>
              تصفح الوظائف ←
            </Link>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {applications.map(app => {
            const job    = jobs[app.job_id]
            const status = STATUS[app.status] || STATUS.pending

            return (
              <div key={app.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden', transition:'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(200,160,74,.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
              >
                {/* Header */}
                <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                    <div>
                      <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:4 }}>
                        {job?.title || 'وظيفة'}
                      </div>
                      <div style={{ fontSize:13, color:C.gold }}>
                        {job?.company_name || ''} {job?.location ? `· ${job.location}` : ''}
                      </div>
                    </div>
                    <div style={{ fontSize:11, color:C.muted, flexShrink:0 }}>
                      {timeAgo(app.created_at)}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div style={{ padding:'16px 20px' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>

                    {/* تم التقديم — دائماً */}
                    <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(74,156,110,.15)', border:'1px solid rgba(74,156,110,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>✅</div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:C.text }}>تم إرسال طلبك</div>
                        <div style={{ fontSize:11, color:C.muted }}>{timeAgo(app.created_at)}</div>
                      </div>
                    </div>

                    {/* الحالة الحالية */}
                    <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', background:`${status.color}15`, border:`1px solid ${status.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>
                        {status.icon}
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:status.color }}>{status.label}</div>
                        {app.status === 'pending' && (
                          <div style={{ fontSize:11, color:C.muted }}>ستتواصل الشركة معك إذا كنت مناسباً</div>
                        )}
                        {app.status === 'contacted' && (
                          <div style={{ fontSize:11, color:C.muted }}>تحقق من جوالك وإيميلك</div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer */}
                {job && (
                  <div style={{ padding:'12px 20px', background:C.surface, borderTop:`1px solid ${C.border}`, display:'flex', gap:8 }}>
                    <Link href="/candidate/jobs" style={{ fontSize:12, color:C.muted, textDecoration:'none' }}>
                      تصفح وظائف مشابهة ←
                    </Link>
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