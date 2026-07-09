'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CompanyDashboard() {
  const router = useRouter()
  const [user, setUser]   = useState(null)
  const [stats, setStats] = useState({ jobs:0, candidates:0, interviews:0 })
  const [loading, setLoading] = useState(true)

  const C = {
    bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
    border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690'
  }

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'company') { router.push('/candidate/dashboard'); return }
    setUser(parsed)
    fetchStats(parsed.id)
  }, [])

  async function fetchStats(companyId) {
    try {
      // جلب الوظائف
      const jobsRes = await fetch('/api/jobs')
      const jobsData = await jobsRes.json()
      const myJobs = (jobsData.jobs || []).filter(j => j.company_id === companyId)

      // جلب المرشحين
      const candsRes = await fetch('/api/candidates')
      const candsData = await candsRes.json()
      const candidates = candsData.candidates || []

      setStats({
        jobs: myJobs.length,
        candidates: candidates.length,
        interviews: candidates.length,
      })
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  function logout() {
    localStorage.removeItem('nukhba_user')
    router.push('/auth/login')
  }

  if (!user) return null

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:20, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة · للشركات</div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ fontSize:14, color:C.muted }}>{user.name}</span>
          <button onClick={logout} style={{ padding:'7px 16px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:13, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>خروج</button>
        </div>
      </nav>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'40px 24px' }}>
        <h1 style={{ fontSize:28, fontWeight:800, color:C.text, marginBottom:4 }}>لوحة التحكم</h1>
        <p style={{ fontSize:14, color:C.muted, marginBottom:36 }}>أنشئ وظيفة أو تصفح المرشحين</p>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:32 }}>
          {[
            { icon:'📋', num: loading ? '...' : stats.jobs,        label:'وظائف منشورة' },
            { icon:'👥', num: loading ? '...' : stats.candidates,  label:'متقدمون' },
            { icon:'🎙️', num: loading ? '...' : stats.interviews,  label:'مقابلات مكتملة' },
          ].map(s => (
            <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'24px 20px', textAlign:'center' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:600, color:C.gold, lineHeight:1 }}>{s.num}</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:32, transition:'border-color .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(200,160,74,.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
          >
            <div style={{ fontSize:36, marginBottom:16 }}>📢</div>
            <div style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:8 }}>انشر وظيفة</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.75, marginBottom:24 }}>
              أنشئ إعلان وظيفة — الذكاء الاصطناعي يبني أسئلة مقابلة مخصصة لمتطلباتك تلقائياً
            </div>
            <Link href="/company/post-job" style={{ display:'inline-flex', padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e' }}>
              إنشاء وظيفة
            </Link>
          </div>

          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:32, transition:'border-color .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(200,160,74,.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
          >
            <div style={{ fontSize:36, marginBottom:16 }}>🔍</div>
            <div style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:8 }}>تصفح المرشحين</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.75, marginBottom:24 }}>
              تصفح ملفات المرشحين العامة — مرتبة حسب التقييم ومصفّاة حسب تخصصك
            </div>
            <Link href="/company/candidates" style={{ display:'inline-flex', padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:700, border:`1px solid ${C.gold}`, color:C.gold, background:'transparent' }}>
              تصفح المرشحين
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}