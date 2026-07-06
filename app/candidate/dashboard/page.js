'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CandidateDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'candidate') { router.push('/company/dashboard'); return }
    setUser(parsed)
  }, [])

  const C = {
    bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
    border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690'
  }

  function logout() {
    localStorage.removeItem('nukhba_user')
    router.push('/auth/login')
  }

  if (!user) return null

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet"/>

      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:20, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ fontSize:14, color:C.muted }}>أهلاً، {user.name}</span>
          <button onClick={logout} style={{ padding:'7px 16px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:13, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>خروج</button>
        </div>
      </nav>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'40px 24px' }}>
        <h1 style={{ fontSize:28, fontWeight:800, color:C.text, marginBottom:8 }}>لوحة التحكم</h1>
        <p style={{ fontSize:14, color:C.muted, marginBottom:40 }}>ابدأ مقابلتك أو تصفح الوظائف المتاحة</p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:32 }}>

          {/* Option 1 - General Interview */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:32, position:'relative', overflow:'hidden', transition:'border-color .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(200,160,74,.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
          >
            <div style={{ fontSize:36, marginBottom:16 }}>🎙️</div>
            <div style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:8 }}>مقابلة عامة</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.75, marginBottom:24 }}>
              أجرِ مقابلة شاملة تُبنى ملفك الكامل — يُرسَل تلقائياً للشركات المناسبة
            </div>
            <Link href="/candidate/interview" style={{ display:'inline-flex', padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e' }}>
              ابدأ المقابلة
            </Link>
          </div>

          {/* Option 2 - Browse Jobs */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:32, transition:'border-color .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(200,160,74,.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
          >
            <div style={{ fontSize:36, marginBottom:16 }}>🏢</div>
            <div style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:8 }}>تصفح الوظائف</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.75, marginBottom:24 }}>
              تصفح الوظائف المعلنة وتقدّم على وظيفة محددة بمقابلة مخصصة لمتطلباتها
            </div>
            <Link href="/candidate/jobs" style={{ display:'inline-flex', padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:700, border:`1px solid ${C.gold}`, color:C.gold, background:'transparent' }}>
              تصفح الوظائف
            </Link>
          </div>
        </div>

        {/* My Profile */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:24, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#7a5e28,#c8a04a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:800, color:'#06060e' }}>
              {user.name?.[0] || '؟'}
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:C.text }}>{user.name}</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{user.email}</div>
            </div>
          </div>
          <Link href="/candidate/profile" style={{ padding:'9px 20px', borderRadius:9, fontSize:13, fontWeight:700, border:`1px solid ${C.border}`, color:C.muted, background:'transparent' }}>
            ملفي الشخصي
          </Link>
        </div>
      </div>
    </div>
  )
}