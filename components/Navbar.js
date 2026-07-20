'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [user, setUser]       = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (u) setUser(JSON.parse(u))

    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isCompaniesPage = pathname === '/for-companies'

  return (
    <nav className="nukhba-nav" style={{
      background: scrolled ? 'rgba(8,8,16,.98)' : 'rgba(8,8,16,.85)',
      boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,.3)' : 'none',
      transition: 'background .3s, box-shadow .3s',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display:'flex', alignItems:'baseline', gap:6, textDecoration:'none', flexShrink:0 }}>
        <span style={{ fontSize:20, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          نخبة
        </span>
        <span className="hide-mobile" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, letterSpacing:4, color:'var(--muted)', textTransform:'uppercase' }}>
          Nukhba
        </span>
      </Link>

      {/* Right */}
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {user ? (
          // مسجّل دخول
          <Link href={user.role==='company'?'/company/dashboard':'/candidate/dashboard'}
            className="btn-ghost"
            style={{ padding:'7px 16px', fontSize:13 }}>
            لوحة التحكم
          </Link>
        ) : (
          <>
            {/* زر عكسي حسب الصفحة */}
            {isCompaniesPage ? (
              <Link href="/" className="btn-ghost" style={{ padding:'7px 14px', fontSize:13 }}>
                للباحثين
              </Link>
            ) : (
              <Link href="/for-companies" className="btn-ghost" style={{ padding:'7px 14px', fontSize:13 }}>
                <span className="hide-mobile">للشركات</span>
                <span className="hide-desktop">شركات</span>
              </Link>
            )}

            <Link href="/auth/login" className="btn-gold" style={{ padding:'7px 16px', fontSize:13 }}>
              {isCompaniesPage ? 'دخول الشركات' : 'ابدأ مجاناً'}
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}