'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (u) setUser(JSON.parse(u))
  }, [])

  return (
    <nav style={{
      position:'sticky', top:0, zIndex:100,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 40px', height:64,
      background:'rgba(8,8,16,.92)', backdropFilter:'blur(16px)',
      borderBottom:'1px solid #252538',
    }}>
      <Link href="/" style={{ display:'flex', alignItems:'baseline', gap:8 }}>
        <span style={{ fontSize:20, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</span>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, letterSpacing:4, color:'#7a7690', textTransform:'uppercase' }}>Nukhba</span>
      </Link>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {user ? (
          <Link href={user.role==='company'?'/company/dashboard':'/candidate/dashboard'}
            style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:700, border:'1px solid #252538', color:'#7a7690', background:'transparent' }}>
            لوحة التحكم
          </Link>
        ) : (
          <>
            <Link href="/for-companies" style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:700, border:'1px solid #252538', color:'#7a7690', background:'transparent' }}>للشركات</Link>
            <Link href="/auth/login" style={{ padding:'8px 20px', borderRadius:8, fontSize:13, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', border:'none' }}>تسجيل الدخول</Link>
          </>
        )}
      </div>
    </nav>
  )
}