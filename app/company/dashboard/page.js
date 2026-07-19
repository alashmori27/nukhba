'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NotificationBell from '@/components/NotificationBell'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a'
}

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
      const myJobs   = (jobsData.jobs || []).filter(j => j.company_id === u.id)
      setStats({ jobs: myJobs.length, applicants: (appData.candidates || []).length })
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  function logout() {
    localStorage.removeItem('nukhba_user')
    router.push('/auth/login')
  }

  if (!user) return null

  const isFreePlan = true // لاحقاً نربطه بالدفع
  const freeUsed   = stats.jobs
  const freeDone   = isFreePlan && freeUsed >= FREE_LIMIT
  const freeAlmost = isFreePlan && freeUsed === FREE_LIMIT - 1

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:20, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة · للشركات</div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <NotificationBell userId={user.id} />
          <span style={{ fontSize:14, color:C.muted }}>{user.name}</span>
          <button onClick={logout} style={{ padding:'7px 16px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:13, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>خروج</button>
        </div>
      </nav>

      {/* شريط تنبيه — استهلك الخطة كاملاً */}
      {!loading && freeDone && (
        <div style={{ background:'rgba(201,74,74,.08)', borderBottom:`1px solid rgba(201,74,74,.3)`, padding:'12px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:18 }}>🔒</span>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#f8c4c4' }}>استهلكت وظائفك المجانية الـ {FREE_LIMIT}</div>
              <div style={{ fontSize:12, color:C.muted }}>لنشر المزيد من الوظائف — اشترك الآن بـ 199 ريال/وظيفة</div>
            </div>
          </div>
          <button onClick={() => alert('Moyasar — الدفع قريباً!')} style={{ padding:'8px 20px', borderRadius:8, fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', border:'none', cursor:'pointer', fontFamily:"'Tajawal',sans-serif", whiteSpace:'nowrap' }}>
            اشترك الآن ←
          </button>
        </div>
      )}

      {/* شريط تنبيه — وظيفة واحدة متبقية */}
      {!loading && freeAlmost && (
        <div style={{ background:'rgba(200,160,74,.06)', borderBottom:`1px solid rgba(200,160,74,.2)`, padding:'10px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:16 }}>⚡</span>
            <span style={{ fontSize:13, color:C.gold }}>تبقّت لك وظيفة مجانية واحدة — استفد منها أو اشترك للمزيد</span>
          </div>
          <button onClick={() => alert('Moyasar — الدفع قريباً!')} style={{ padding:'6px 16px', borderRadius:8, fontSize:12, fontWeight:700, border:`1px solid ${C.gold}`, background:'transparent', color:C.gold, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
            عرض الخطط
          </button>
        </div>
      )}

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'40px 24px' }}>
        <h1 style={{ fontSize:28, fontWeight:800, color:C.text, marginBottom:4 }}>لوحة التحكم</h1>
        <p style={{ fontSize:14, color:C.muted, marginBottom:36 }}>أنشئ وظيفة أو تصفح المرشحين</p>

        {/* خطة الاستخدام */}
        {isFreePlan && !loading && (
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 20px', marginBottom:28, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>الخطة المجانية — وظائف منشورة</div>
              <div style={{ height:6, background:C.border, borderRadius:10, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${Math.min((freeUsed/FREE_LIMIT)*100,100)}%`, background: freeDone ? C.error : C.gold, borderRadius:10, transition:'width .3s' }}/>
              </div>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color: freeDone ? C.error : C.gold, flexShrink:0 }}>
              {freeUsed} / {FREE_LIMIT}
            </div>
            {freeDone && (
              <button onClick={() => alert('Moyasar — قريباً!')} style={{ padding:'7px 16px', borderRadius:8, fontSize:12, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', border:'none', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                ترقية الخطة
              </button>
            )}
          </div>
        )}

        {/* إحصائيتان */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:32 }}>
          <Link href="/company/jobs" style={{ textDecoration:'none' }}>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'28px 24px', textAlign:'center', cursor:'pointer', transition:'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none' }}
            >
              <div style={{ fontSize:28, marginBottom:10 }}>📋</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:600, color:C.gold, lineHeight:1 }}>{loading?'...':stats.jobs}</div>
              <div style={{ fontSize:13, color:C.muted, marginTop:8 }}>وظائفي المنشورة</div>
              <div style={{ fontSize:11, color:C.gold, marginTop:4 }}>اضغط للعرض →</div>
            </div>
          </Link>

          <Link href="/company/applicants" style={{ textDecoration:'none' }}>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'28px 24px', textAlign:'center', cursor:'pointer', transition:'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none' }}
            >
              <div style={{ fontSize:28, marginBottom:10 }}>🎯</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:600, color:C.gold, lineHeight:1 }}>{loading?'...':stats.applicants}</div>
              <div style={{ fontSize:13, color:C.muted, marginTop:8 }}>تقدموا على وظائفي</div>
              <div style={{ fontSize:11, color:C.gold, marginTop:4 }}>اضغط للعرض →</div>
            </div>
          </Link>
        </div>

        {/* الإجراءات */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

          {/* نشر وظيفة */}
          <div style={{ background:C.card, border:`1px solid ${freeDone?C.error+'44':C.border}`, borderRadius:16, padding:32, transition:'border-color .2s', position:'relative', overflow:'hidden' }}
            onMouseEnter={e => !freeDone && (e.currentTarget.style.borderColor=C.gold)}
            onMouseLeave={e => !freeDone && (e.currentTarget.style.borderColor=C.border)}
          >
            {freeDone && (
              <div style={{ position:'absolute', inset:0, background:'rgba(8,8,16,.7)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:2, backdropFilter:'blur(2px)', borderRadius:16 }}>
                <div style={{ fontSize:32, marginBottom:12 }}>🔒</div>
                <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:6 }}>الخطة المجانية منتهية</div>
                <div style={{ fontSize:12, color:C.muted, marginBottom:16, textAlign:'center' }}>اشترك لنشر المزيد من الوظائف</div>
                <button onClick={() => alert('Moyasar — قريباً!')} style={{ padding:'9px 22px', borderRadius:9, fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', border:'none', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                  اشترك — 199 ريال/وظيفة
                </button>
              </div>
            )}
            <div style={{ fontSize:36, marginBottom:16 }}>📢</div>
            <div style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:8 }}>انشر وظيفة جديدة</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.75, marginBottom:24 }}>اكتب أسئلتك بنفسك أو دع الذكاء الاصطناعي يولّدها</div>
            <Link href="/company/post-job" style={{ display:'inline-flex', padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', textDecoration:'none' }}>
              + إنشاء وظيفة
            </Link>
          </div>

          {/* تصفح المرشحين */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:32, transition:'border-color .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor=C.gold}
            onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
          >
            <div style={{ fontSize:36, marginBottom:16 }}>🔍</div>
            <div style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:8 }}>تصفح جميع المرشحين</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.75, marginBottom:24 }}>جميع المرشحين في المنصة — مرتبون حسب التقييم</div>
            <Link href="/company/candidates" style={{ display:'inline-flex', padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:700, border:`1px solid ${C.gold}`, color:C.gold, background:'transparent', textDecoration:'none' }}>
              تصفح المرشحين
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}