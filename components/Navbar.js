'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (u) setUser(JSON.parse(u))
  }, [])

  return (
    <>
      <style>{`
        @media(max-width:600px){
          .nav-wrap{padding:0 16px!important;height:54px!important}
          .nav-logo-en{display:none!important}
          .nav-logo-ar{font-size:18px!important}
          .nav-btn-text{display:none!important}
          .nav-btn-sm{padding:7px 14px!important;font-size:12px!important}
        }
      `}</style>
      <nav className="nav-wrap" style={{
        position:'sticky', top:0, zIndex:100,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 40px', height:64,
        background:'rgba(8,8,16,.95)', backdropFilter:'blur(16px)',
        borderBottom:'1px solid #252538',
      }}>
        <Link href="/" style={{ display:'flex', alignItems:'baseline', gap:6, textDecoration:'none' }}>
          <span className="nav-logo-ar" style={{ fontSize:20, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</span>
          <span className="nav-logo-en" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, letterSpacing:4, color:'#7a7690', textTransform:'uppercase' }}>Nukhba</span>
        </Link>

        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {user ? (
            <Link href={user.role==='company'?'/company/dashboard':'/candidate/dashboard'}
              className="nav-btn-sm"
              style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:700, border:'1px solid #252538', color:'#7a7690', background:'transparent', textDecoration:'none' }}>
              لوحة التحكم
            </Link>
          ) : (
            <>
              <Link href="/for-companies"
                className="nav-btn-sm"
                style={{ padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:700, border:'1px solid #252538', color:'#7a7690', background:'transparent', textDecoration:'none', whiteSpace:'nowrap' }}>
                للشركات
              </Link>
              <Link href="/auth/login"
                className="nav-btn-sm"
                style={{ padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', border:'none', textDecoration:'none', whiteSpace:'nowrap' }}>
                تسجيل الدخول
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  )
}