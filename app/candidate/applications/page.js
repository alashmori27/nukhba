'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a'
}

export default function CandidateApplications() {
  const router = useRouter()
  const [user, setUser]   = useState(null)
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'candidate') { router.push('/company/dashboard'); return }
    setUser(parsed)
    fetchNotifs(parsed.id)
  }, [])

  async function fetchNotifs(userId) {
    try {
      const res  = await fetch(`/api/notifications?user_id=${userId}`)
      const data = await res.json()
      setNotifs(data.notifications || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  const typeIcon = (type) => {
    if (type === 'application_sent')     return '📤'
    if (type === 'profile_viewed')       return '👁️'
    if (type === 'company_contacted')    return '📞'
    if (type === 'job_match')            return '✨'
    return '🔔'
  }

  const typeColor = (type) => {
    if (type === 'application_sent')  return C.gold
    if (type === 'profile_viewed')    return '#4a6fa5'
    if (type === 'company_contacted') return C.success
    if (type === 'job_match')         return C.gold
    return C.muted
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
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet"/>

      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</div>
        <Link href="/candidate/dashboard" style={{ fontSize:13, color:C.muted, padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}`, textDecoration:'none' }}>← لوحة التحكم</Link>
      </nav>

      <div style={{ maxWidth:680, margin:'0 auto', padding:'40px 20px' }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:4 }}>تتبع طلباتي</h1>
        <p style={{ fontSize:13, color:C.muted, marginBottom:32 }}>آخر التحديثات على ملفاتك وطلباتك</p>

        {loading && <div style={{ textAlign:'center', padding:60, color:C.muted }}>⏳ جاري التحميل...</div>}

        {!loading && notifs.length === 0 && (
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:'60px 32px', textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:14 }}>📭</div>
            <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:8 }}>لا يوجد تحديثات بعد</div>
            <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>ستظهر هنا التحديثات عند تقدمك على وظائف أو عند اهتمام الشركات بملفك</p>
            <Link href="/candidate/jobs" style={{ padding:'11px 24px', borderRadius:10, fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', textDecoration:'none' }}>
              تصفح الوظائف
            </Link>
          </div>
        )}

        {!loading && notifs.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {notifs.map(n => (
              <div key={n.id} style={{ background:C.card, border:`1px solid ${n.is_read?C.border:C.gold+'44'}`, borderRadius:13, padding:18, display:'flex', gap:14, alignItems:'flex-start' }}>
                {/* Icon */}
                <div style={{ width:42, height:42, borderRadius:12, background:C.surface, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                  {typeIcon(n.type)}
                </div>

                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8, marginBottom:4 }}>
                    <div style={{ fontSize:14, fontWeight:n.is_read?500:700, color:C.text }}>{n.title}</div>
                    <div style={{ fontSize:11, color:C.muted, flexShrink:0 }}>{timeAgo(n.created_at)}</div>
                  </div>
                  {n.body && <div style={{ fontSize:12, color:C.muted, lineHeight:1.7 }}>{n.body}</div>}
                  {!n.is_read && (
                    <div style={{ display:'inline-flex', alignItems:'center', gap:4, marginTop:6, fontSize:10, color:typeColor(n.type), background:'rgba(200,160,74,.1)', padding:'2px 8px', borderRadius:10 }}>
                      <div style={{ width:5, height:5, borderRadius:'50%', background:typeColor(n.type) }}/>
                      جديد
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}