'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a'
}

function authHeaders(user) {
  return {
    'Content-Type': 'application/json',
    'x-user-id':   user.id,
    'x-user-role': user.role,
  }
}

export default function CandidateDashboard() {
  const router = useRouter()
  const [user, setUser]         = useState(null)
  const [profileCount, setCount] = useState(0)
  const [unreadCount, setUnread] = useState(0)
  const [loading, setLoading]   = useState(true)

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
      setCount((profData.candidates || []).length)
      setUnread((notifData.notifications || []).filter(n => !n.is_read).length)
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  function logout() {
    localStorage.removeItem('nukhba_user')
    router.push('/auth/login')
  }

  if (!user) return null

  const hasProfile = profileCount > 0

  const cards = [
    {
      icon: '🎙️',
      title: 'مقابلة جديدة',
      desc: 'أجرِ مقابلة ذكية وابنِ ملفاً مهنياً جديداً',
      link: '/candidate/interview',
      btn: 'ابدأ المقابلة',
      gold: true,
    },
    {
      icon: '📁',
      title: 'ملفاتي المهنية',
      desc: hasProfile ? `لديك ${profileCount} ملف — اعرض أو حمّل CV` : 'لا يوجد ملفات بعد',
      link: '/candidate/profiles',
      btn: hasProfile ? 'عرض الملفات' : 'ابدأ الآن',
      gold: false,
      badge: hasProfile ? profileCount : null,
    },
    {
      icon: '📊',
      title: 'تتبع طلباتي',
      desc: unreadCount > 0 ? `لديك ${unreadCount} تحديث جديد` : 'تابع حالة طلباتك ووظائفك',
      link: '/candidate/applications',
      btn: 'عرض التحديثات',
      gold: false,
      badge: unreadCount > 0 ? unreadCount : null,
      badgeRed: true,
    },
    {
      icon: '🏢',
      title: 'تصفح الوظائف',
      desc: 'تقدّم على وظيفة بمقابلة مخصصة لمتطلباتها',
      link: '/candidate/jobs',
      btn: 'تصفح الوظائف',
      gold: false,
    },
    {
      icon: '👤',
      title: 'إعدادات الحساب',
      desc: 'تعديل الاسم والجوال وكلمة المرور',
      link: '/candidate/account',
      btn: 'إعدادات',
      gold: false,
    },
  ]

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:20, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Link href="/candidate/account" style={{ display:'flex', alignItems:'center', gap:7, textDecoration:'none' }}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#06060e' }}>
              {(user.name||'؟')[0]}
            </div>
            <span style={{ fontSize:13, color:C.muted }}>{user.name}</span>
          </Link>
          <button onClick={logout} style={{ padding:'5px 12px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>خروج</button>
        </div>
      </nav>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'40px 20px' }}>

        {!loading && !hasProfile && (
          <div style={{ background:`linear-gradient(135deg,rgba(122,94,40,.15),rgba(200,160,74,.05))`, border:`2px solid ${C.gold}`, borderRadius:20, padding:'48px 32px', textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:52, marginBottom:14 }}>🎙️</div>
            <h1 style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:10 }}>أهلاً {user.name}!</h1>
            <p style={{ fontSize:14, color:C.muted, lineHeight:1.85, marginBottom:28, maxWidth:440, margin:'0 auto 28px' }}>
              ابدأ مقابلتك الذكية المجانية — الذكاء الاصطناعي يسألك ويبني ملفك المهني تلقائياً
            </p>
            <Link href="/candidate/interview" style={{ padding:'13px 32px', borderRadius:10, fontSize:15, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', textDecoration:'none' }}>
              🎙️ ابدأ المقابلة المجانية
            </Link>
          </div>
        )}

        {!loading && hasProfile && (
          <div style={{ marginBottom:28 }}>
            <h1 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>أهلاً {user.name} 👋</h1>
            <p style={{ fontSize:13, color:C.muted }}>لديك {profileCount} ملف مهني جاهز</p>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14 }}>
          {cards.map(card => (
            <Link key={card.title} href={card.link} style={{ textDecoration:'none' }}>
              <div style={{ background:C.card, border:`1px solid ${card.gold?C.gold:C.border}`, borderRadius:14, padding:22, height:'100%', transition:'all .2s', cursor:'pointer', position:'relative' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.transform='translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=card.gold?C.gold:C.border; e.currentTarget.style.transform='none' }}
              >
                {card.badge && (
                  <div style={{ position:'absolute', top:12, left:12, minWidth:20, height:20, borderRadius:10, background:card.badgeRed?C.error:C.gold, color:'#fff', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px' }}>
                    {card.badge}
                  </div>
                )}
                <div style={{ fontSize:30, marginBottom:12 }}>{card.icon}</div>
                <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:6 }}>{card.title}</div>
                <div style={{ fontSize:12, color:C.muted, lineHeight:1.7, marginBottom:16 }}>{card.desc}</div>
                <div style={{ fontSize:12, fontWeight:700, color:card.gold?'#06060e':C.gold, background:card.gold?`linear-gradient(135deg,${C.goldDk},${C.gold})`:'transparent', border:card.gold?'none':`1px solid ${C.gold}`, padding:'7px 14px', borderRadius:8, display:'inline-block' }}>
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