// مكوّن جرس الإشعارات — أضفه في nav الشركة
// استخدامه: <NotificationBell userId={user.id} />

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const C = {
  bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', text:'#ede8df', muted:'#7a7690',
  error:'#c94a4a'
}

export default function NotificationBell({ userId }) {
  const router = useRouter()
  const [notifs, setNotifs]   = useState([])
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)

  const unread = notifs.filter(n => !n.is_read).length

  useEffect(() => {
    if (userId) fetchNotifs()
  }, [userId])

  async function fetchNotifs() {
    setLoading(true)
    try {
      const res  = await fetch(`/api/notifications?user_id=${userId}`)
      const data = await res.json()
      setNotifs(data.notifications || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  async function markAllRead() {
    try {
      await fetch('/api/notifications', {
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ user_id: userId })
      })
      setNotifs(p => p.map(n => ({...n, is_read:true})))
    } catch(e) { console.error(e) }
  }

  function handleOpen() {
    setOpen(!open)
    if (!open && unread > 0) markAllRead()
  }

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date)
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'الآن'
    if (mins < 60) return `${mins} دقيقة`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} ساعة`
    return `${Math.floor(hrs/24)} يوم`
  }

  return (
    <div style={{ position:'relative' }}>
      {/* زر الجرس */}
      <button onClick={handleOpen} style={{ position:'relative', width:36, height:36, borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>
        🔔
        {unread > 0 && (
          <span style={{ position:'absolute', top:-4, right:-4, width:16, height:16, borderRadius:'50%', background:C.error, color:'#fff', fontSize:9, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* القائمة المنسدلة */}
      {open && (
        <div style={{ position:'absolute', top:44, left:0, width:320, background:C.card, border:`1px solid ${C.border}`, borderRadius:14, boxShadow:'0 20px 60px rgba(0,0,0,.5)', zIndex:200, overflow:'hidden', fontFamily:"'Tajawal',sans-serif" }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.text }}>الإشعارات</div>
            {unread > 0 && <span style={{ fontSize:11, color:C.muted }}>{unread} غير مقروء</span>}
          </div>

          <div style={{ maxHeight:320, overflowY:'auto' }}>
            {loading && <div style={{ padding:24, textAlign:'center', color:C.muted, fontSize:13 }}>⏳ جاري التحميل...</div>}

            {!loading && notifs.length === 0 && (
              <div style={{ padding:32, textAlign:'center', color:C.muted, fontSize:13 }}>
                <div style={{ fontSize:28, marginBottom:8 }}>🔔</div>
                لا يوجد إشعارات
              </div>
            )}

            {notifs.map(n => (
              <div key={n.id} style={{ padding:'12px 16px', borderBottom:`1px solid ${C.border}`, background:n.is_read?'transparent':'rgba(200,160,74,.04)', transition:'background .2s' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:n.is_read?400:700, color:C.text, marginBottom:3 }}>{n.title}</div>
                    {n.body && <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>{n.body}</div>}
                  </div>
                  <div style={{ fontSize:10, color:C.muted, flexShrink:0, marginTop:2 }}>{timeAgo(n.created_at)}</div>
                </div>
                {!n.is_read && <div style={{ width:6, height:6, borderRadius:'50%', background:C.gold, marginTop:6 }}/>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* إغلاق عند الضغط خارج */}
      {open && <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, zIndex:199 }}/>}
    </div>
  )
}