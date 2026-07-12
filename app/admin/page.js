'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ADMIN_PASSWORD = 'hAssAn202026@'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPass] = useState('')
  const [error, setError]   = useState('')

  function login() {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('nukhba_admin', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('كلمة المرور غير صحيحة')
    }
  }

  const onKey = e => { if (e.key === 'Enter') login() }

  return (
    <div style={{ minHeight:'100vh', background:'#080810', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Tajawal',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800&display=swap" rel="stylesheet"/>
      <div style={{ width:340, background:'#181828', border:'1px solid #252538', borderRadius:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:32, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:6 }}>نخبة</div>
        <div style={{ fontSize:12, color:'#7a7690', marginBottom:28, letterSpacing:2 }}>ADMIN PANEL</div>

        <input type="password" value={password} onChange={e => setPass(e.target.value)} onKeyDown={onKey}
          placeholder="كلمة المرور"
          style={{ width:'100%', background:'#13131f', border:'1px solid #252538', borderRadius:10, padding:'12px 16px', color:'#ede8df', fontFamily:"'Tajawal',sans-serif", fontSize:14, marginBottom:12, textAlign:'center' }}/>

        {error && <div style={{ fontSize:12, color:'#c94a4a', marginBottom:12 }}>{error}</div>}

        <button onClick={login} style={{ width:'100%', padding:'13px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
          دخول
        </button>
      </div>
    </div>
  )
}