'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CandidateDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  const C = {
    bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
    border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690'
  }

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'candidate') { router.push('/company/dashboard'); return }
    setUser(parsed)
  }, [])

  function logout() {
    localStorage.removeItem('nukhba_user')
    router.push('/auth/login')
  }

  if (!user) return null

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif" }}>
      <style>{`
        @media(max-width:600px){
          .dash-grid{grid-template-columns:1fr!important}
          .dash-pad{padding:20px 16px!important}
          .dash-nav{padding:0 16px!important;height:54px!important}
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet"/>

      <nav className="dash-nav" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:18, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:13, color:C.muted }}>{user.name}</span>
          <button onClick={logout} style={{ padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>خروج</button>
        </div>
      </nav>

      <div className="dash-pad" style={{ maxWidth:900, margin:'0 auto', padding:'36px 24px' }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:C.text, marginBottom:4 }}>لوحة التحكم</h1>
        <p style={{ fontSize:13, color:C.muted, marginBottom:32 }}>ابدأ مقابلتك أو تصفح الوظائف المتاحة</p>

        <div className="dash-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>

          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:28, transition:'border-color .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(200,160,74,.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
          >
            <div style={{ fontSize:32, marginBottom:14 }}>🎙️</div>
            <div style={{ fontSize:17, fontWeight:800, color:C.text, marginBottom:8 }}>مقابلة عامة</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.75, marginBottom:20 }}>
              أجرِ مقابلة شاملة تُبنى ملفك الكامل وتُرسل تلقائياً للشركات المناسبة
            </div>
            <Link href="/candidate/interview" style={{ display:'inline-flex', padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>
              ابدأ المقابلة
            </Link>
          </div>

          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:28, transition:'border-color .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(200,160,74,.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
          >
            <div style={{ fontSize:32, marginBottom:14 }}>🏢</div>
            <div style={{ fontSize:17, fontWeight:800, color:C.text, marginBottom:8 }}>تصفح الوظائف</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.75, marginBottom:20 }}>
              تصفح الوظائف المعلنة وتقدّم على وظيفة محددة بمقابلة مخصصة
            </div>
            <Link href="/candidate/jobs" style={{ display:'inline-flex', padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:700, border:`1px solid ${C.gold}`, color:C.gold, background:'transparent', textDecoration:'none' }}>
              تصفح الوظائف
            </Link>
          </div>
        </div>

        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:20, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#7a5e28,#c8a04a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, color:'#06060e', flexShrink:0 }}>
              {user.name?.[0] || '؟'}
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{user.name}</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{user.email}</div>
            </div>
          </div>
          <Link href="/candidate/profile" style={{ padding:'8px 18px', borderRadius:9, fontSize:13, fontWeight:700, border:`1px solid ${C.border}`, color:C.muted, background:'transparent', textDecoration:'none', whiteSpace:'nowrap' }}>
            ملفي الشخصي
          </Link>
        </div>
      </div>
    </div>
  )
}