'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DashboardNav from '@/components/DashboardNav'
import NotificationBell from '@/components/NotificationBell'

const FREE_LIMIT = 3

export default function CompanyDashboard() {
  const router = useRouter()
  const [user, setUser]   = useState(null)
  const [stats, setStats] = useState({ jobs:0, applicants:0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'company') { router.push('/candidate/dashboard'); return }
    setUser(parsed)
    fetchStats(parsed)
  }, [])

  async function fetchStats(u) {
    try {
      const headers = { 'Content-Type':'application/json', 'x-user-id':u.id, 'x-user-role':u.role }
      const [jobsRes, appRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch(`/api/candidates?company_id=${u.id}`, { headers })
      ])
      const jobsData = await jobsRes.json()
      const appData  = await appRes.json()
      const myJobs   = (jobsData.jobs||[]).filter(j => j.company_id === u.id)
      setStats({ jobs:myJobs.length, applicants:(appData.candidates||[]).length })
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  if (!user) return null

  const freeDone   = stats.jobs >= FREE_LIMIT
  const freeAlmost = stats.jobs === FREE_LIMIT - 1

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', fontFamily:"'Tajawal',sans-serif", color:'var(--text)' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      <style>{`
        .co-grid  { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .co-pad   { padding:32px 24px; }
        .co-card  { padding:28px 24px; }
        .co-stat  { font-size:42px; }
        @media(max-width:600px){
          .co-grid  { gap:10px; }
          .co-pad   { padding:20px 14px; }
          .co-card  { padding:20px 16px !important; }
          .co-stat  { font-size:32px !important; }
          .co-card-desc { display:none !important; }
          .co-card-btn  { font-size:12px !important; padding:8px 14px !important; }
        }
      `}</style>

      <DashboardNav user={user}>
        <NotificationBell userId={user.id} />
      </DashboardNav>

      {/* تنبيه استهلاك الخطة */}
      {!loading && freeDone && (
        <div style={{ background:'rgba(201,74,74,.08)', borderBottom:'1px solid rgba(201,74,74,.3)', padding:'10px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span>🔒</span>
            <span style={{ fontSize:13, color:'#f8c4c4', fontWeight:600 }}>استهلكت الوظائف المجانية — اشترك للمزيد</span>
          </div>
          <button onClick={() => alert('Moyasar — قريباً!')} style={{ padding:'6px 16px', borderRadius:8, fontSize:12, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', border:'none', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
            اشترك الآن
          </button>
        </div>
      )}

      {!loading && freeAlmost && (
        <div style={{ background:'rgba(200,160,74,.06)', borderBottom:'1px solid rgba(200,160,74,.2)', padding:'8px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
          <span style={{ fontSize:13, color:'var(--gold)' }}>⚡ تبقّت وظيفة مجانية واحدة</span>
          <button onClick={() => alert('Moyasar — قريباً!')} style={{ padding:'5px 14px', borderRadius:8, fontSize:12, fontWeight:700, border:'1px solid var(--gold)', background:'transparent', color:'var(--gold)', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
            عرض الخطط
          </button>
        </div>
      )}

      <div className="co-pad" style={{ maxWidth:1000, margin:'0 auto' }}>
        <h1 style={{ fontSize:20, fontWeight:800, color:'var(--text)', marginBottom:4 }}>لوحة التحكم</h1>
        <p style={{ fontSize:13, color:'var(--muted)', marginBottom:24 }}>أنشئ وظيفة أو تصفح المرشحين</p>

        {/* شريط الخطة المجانية */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:140 }}>
            <div style={{ fontSize:11, color:'var(--muted)', marginBottom:5 }}>الخطة المجانية — وظائف منشورة</div>
            <div style={{ height:5, background:'var(--border)', borderRadius:10, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${Math.min((stats.jobs/FREE_LIMIT)*100,100)}%`, background:freeDone?'var(--error)':'var(--gold)', borderRadius:10, transition:'width .3s' }}/>
            </div>
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:freeDone?'var(--error)':'var(--gold)', flexShrink:0 }}>{stats.jobs} / {FREE_LIMIT}</div>
        </div>

        {/* إحصائيتان */}
        <div className="co-grid" style={{ marginBottom:20 }}>
          {[
            { href:'/company/jobs',       icon:'📋', num:stats.jobs,       label:'وظائفي المنشورة' },
            { href:'/company/applicants', icon:'🎯', num:stats.applicants, label:'تقدموا على وظائفي' },
          ].map(s => (
            <Link key={s.label} href={s.href} style={{ textDecoration:'none' }}>
              <div className="co-card" style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, textAlign:'center', cursor:'pointer', transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='none' }}
              >
                <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
                <div className="co-stat" style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:'var(--gold)', lineHeight:1 }}>{loading?'...':s.num}</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:6 }}>{s.label}</div>
                <div style={{ fontSize:11, color:'var(--gold)', marginTop:4 }}>اضغط للعرض →</div>
              </div>
            </Link>
          ))}
        </div>

        {/* الإجراءات */}
        <div className="co-grid">

          {/* نشر وظيفة */}
          <div className="co-card" style={{ background:'var(--card)', border:`1px solid ${freeDone?'rgba(201,74,74,.3)':'var(--border)'}`, borderRadius:14, position:'relative', overflow:'hidden', transition:'border-color .2s' }}
            onMouseEnter={e => !freeDone && (e.currentTarget.style.borderColor='var(--gold)')}
            onMouseLeave={e => !freeDone && (e.currentTarget.style.borderColor='var(--border)')}
          >
            {freeDone && (
              <div style={{ position:'absolute', inset:0, background:'rgba(8,8,16,.8)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:2, borderRadius:14, padding:16, textAlign:'center' }}>
                <div style={{ fontSize:28, marginBottom:8 }}>🔒</div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--text)', marginBottom:4 }}>الخطة المجانية منتهية</div>
                <button onClick={() => alert('Moyasar — قريباً!')} style={{ padding:'8px 18px', borderRadius:9, fontSize:12, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', border:'none', cursor:'pointer', fontFamily:"'Tajawal',sans-serif", marginTop:8 }}>
                  اشترك — 199 ريال
                </button>
              </div>
            )}
            <div style={{ fontSize:28, marginBottom:12 }}>📢</div>
            <div style={{ fontSize:15, fontWeight:800, color:'var(--text)', marginBottom:6 }}>انشر وظيفة</div>
            <div className="co-card-desc" style={{ fontSize:12, color:'var(--muted)', lineHeight:1.7, marginBottom:18 }}>اكتب أسئلتك أو دع AI يولّدها</div>
            <Link href="/company/post-job" className="co-card-btn" style={{ display:'inline-flex', padding:'9px 18px', borderRadius:9, fontSize:13, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>
              + إنشاء
            </Link>
          </div>

          {/* تصفح المرشحين */}
          <div className="co-card" style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, transition:'border-color .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
          >
            <div style={{ fontSize:28, marginBottom:12 }}>🔍</div>
            <div style={{ fontSize:15, fontWeight:800, color:'var(--text)', marginBottom:6 }}>تصفح المرشحين</div>
            <div className="co-card-desc" style={{ fontSize:12, color:'var(--muted)', lineHeight:1.7, marginBottom:18 }}>مرتبون حسب التقييم الذكي</div>
            <Link href="/company/candidates" className="co-card-btn" style={{ display:'inline-flex', padding:'9px 18px', borderRadius:9, fontSize:13, fontWeight:700, border:'1px solid var(--gold)', color:'var(--gold)', background:'transparent', textDecoration:'none' }}>
              تصفح
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}