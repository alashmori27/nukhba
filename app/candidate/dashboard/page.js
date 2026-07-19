'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DashboardNav from '@/components/DashboardNav'

function authHeaders(user) {
  return { 'Content-Type':'application/json', 'x-user-id':user.id, 'x-user-role':user.role }
}

export default function CandidateDashboard() {
  const router = useRouter()
  const [user, setUser]          = useState(null)
  const [profileCount, setCount] = useState(0)
  const [unreadCount, setUnread] = useState(0)
  const [loading, setLoading]    = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'candidate') { router.push('/company/dashboard'); return }
    setUser(parsed)
    fetchData(parsed)
  }, [])

  async function fetchData(u) {
    try {
      const [profRes, notifRes] = await Promise.all([
        fetch(`/api/candidates?user_id=${u.id}`, { headers: authHeaders(u) }),
        fetch(`/api/notifications?user_id=${u.id}`)
      ])
      const profData  = await profRes.json()
      const notifData = await notifRes.json()
      setCount((profData.candidates||[]).length)
      setUnread((notifData.notifications||[]).filter(n=>!n.is_read).length)
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  if (!user) return null

  const hasProfile = profileCount > 0

  const cards = [
    { icon:'🎙️', title:'مقابلة جديدة',   desc:'ابنِ ملفاً جديداً بمقابلة ذكية',              link:'/candidate/interview',    btn:'ابدأ',         gold:true },
    { icon:'📁', title:'ملفاتي المهنية', desc: hasProfile?`${profileCount} ملف جاهز`:'لا يوجد ملفات', link:'/candidate/profiles', btn:'عرض',    gold:false, badge:hasProfile?profileCount:null },
    { icon:'📊', title:'تتبع طلباتي',   desc: unreadCount>0?`${unreadCount} تحديث جديد`:'لا توجد تحديثات', link:'/candidate/applications', btn:'عرض', gold:false, badge:unreadCount>0?unreadCount:null, badgeRed:true },
    { icon:'🏢', title:'تصفح الوظائف', desc:'تقدّم على وظيفة مناسبة',                       link:'/candidate/jobs',         btn:'تصفح',         gold:false },
    { icon:'👤', title:'حسابي',         desc:'إعدادات وكلمة المرور',                         link:'/candidate/account',      btn:'إعدادات',      gold:false },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', fontFamily:"'Tajawal',sans-serif", color:'var(--text)' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      <style>{`
        .dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .dash-pad  { padding: 28px 20px; }
        .dash-hero { padding: 32px 20px; }
        @media(max-width:600px){
          .dash-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .dash-pad  { padding: 20px 14px; }
          .dash-hero { padding: 24px 14px; }
          .dash-card { padding: 14px 12px !important; }
          .dash-card-icon { font-size: 22px !important; margin-bottom: 6px !important; }
          .dash-card-title { font-size: 12px !important; }
          .dash-card-desc  { display: none !important; }
          .dash-card-btn   { font-size: 10px !important; padding: 4px 8px !important; }
        }
      `}</style>

      <DashboardNav user={user} />

      <div className="dash-pad" style={{ maxWidth:860, margin:'0 auto' }}>

        {/* Hero إذا ما عنده ملف */}
        {!loading && !hasProfile && (
          <div className="dash-hero" style={{ background:'linear-gradient(135deg,rgba(122,94,40,.15),rgba(200,160,74,.05))', border:'2px solid var(--gold)', borderRadius:16, textAlign:'center', marginBottom:20 }}>
            <div style={{ fontSize:40, marginBottom:10 }}>🎙️</div>
            <h1 style={{ fontSize:18, fontWeight:800, color:'var(--text)', marginBottom:8 }}>أهلاً {user.name}!</h1>
            <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.8, marginBottom:20, maxWidth:380, margin:'0 auto 20px' }}>
              ابدأ مقابلتك الذكية المجانية الآن
            </p>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/candidate/interview" style={{ padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>🎙️ ابدأ المقابلة</Link>
              <Link href="/candidate/jobs" style={{ padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:700, border:'1px solid var(--border)', color:'var(--muted)', background:'transparent', textDecoration:'none' }}>🏢 الوظائف</Link>
            </div>
          </div>
        )}

        {/* Greeting */}
        {!loading && hasProfile && (
          <div style={{ marginBottom:18 }}>
            <h1 style={{ fontSize:18, fontWeight:800, color:'var(--text)', marginBottom:2 }}>أهلاً {user.name} 👋</h1>
            <p style={{ fontSize:12, color:'var(--muted)' }}>لديك {profileCount} ملف مهني جاهز</p>
          </div>
        )}

        {/* البطاقات */}
        <div className="dash-grid">
          {cards.map(card => (
            <Link key={card.title} href={card.link} style={{ textDecoration:'none' }}>
              <div className="dash-card" style={{ background:'var(--card)', border:`1px solid ${card.gold?'var(--gold)':'var(--border)'}`, borderRadius:12, padding:'18px 14px', height:'100%', position:'relative', transition:'border-color .2s, transform .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=card.gold?'var(--gold)':'var(--border)'; e.currentTarget.style.transform='none' }}
              >
                {card.badge && (
                  <div style={{ position:'absolute', top:8, left:8, minWidth:18, height:18, borderRadius:9, background:card.badgeRed?'var(--error)':'var(--gold)', color:'#fff', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 4px' }}>
                    {card.badge}
                  </div>
                )}
                <div className="dash-card-icon" style={{ fontSize:26, marginBottom:8 }}>{card.icon}</div>
                <div className="dash-card-title" style={{ fontSize:13, fontWeight:700, color:'var(--text)', marginBottom:4 }}>{card.title}</div>
                <div className="dash-card-desc" style={{ fontSize:11, color:'var(--muted)', lineHeight:1.6, marginBottom:12 }}>{card.desc}</div>
                <div className="dash-card-btn" style={{ fontSize:11, fontWeight:700, color:card.gold?'#06060e':'var(--gold)', background:card.gold?'linear-gradient(135deg,#7a5e28,#c8a04a)':'transparent', border:card.gold?'none':'1px solid var(--gold)', padding:'5px 10px', borderRadius:7, display:'inline-block' }}>
                  {card.btn} ←
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}