'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [user, setUser]         = useState(null)
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
    <>
      <style>{`
        .nav-logo-en { opacity: .6; transition: opacity .2s; }
        .nav-logo-en:hover { opacity: 1; }
        .nav-divider { width:1px; height:16px; background:var(--border); margin:0 4px; }
        @media(max-width:600px){
          .nukhba-nav { padding:0 16px !important; height:54px !important; }
          .nav-hide-sm { display:none !important; }
          .nav-logo-en { display:none !important; }
        }
      `}</style>

      <nav className="nukhba-nav" style={{
        background: scrolled ? 'rgba(8,8,16,.98)' : 'rgba(8,8,16,.85)',
        boxShadow: scrolled ? '0 1px 0 var(--border), 0 8px 32px rgba(0,0,0,.3)' : '0 1px 0 var(--border)',
        transition: 'background .3s, box-shadow .3s',
      }}>

        {/* Logo */}
        <Link href="/" style={{ display:'flex', alignItems:'baseline', gap:7, textDecoration:'none', flexShrink:0 }}>
          <span style={{ fontSize:21, fontWeight:800, letterSpacing:'-0.5px', background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            نخبة
          </span>
          <span className="nav-logo-en" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'var(--muted)', textTransform:'uppercase', marginBottom:1 }}>
            Nukhba
          </span>
        </Link>

        {/* Right */}
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {user ? (
            <Link href={user.role==='company'?'/company/dashboard':'/candidate/dashboard'}
              style={{ padding:'7px 16px', borderRadius:8, fontSize:13, fontWeight:600, border:'1px solid var(--border)', color:'var(--muted)', background:'transparent', textDecoration:'none', transition:'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.color='var(--gold)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--muted)' }}
            >
              لوحة التحكم
            </Link>
          ) : (
            <>
              {/* رابط ثانوي */}
              {isCompaniesPage ? (
                <Link href="/"
                  className="nav-hide-sm"
                  style={{ padding:'7px 14px', borderRadius:8, fontSize:12, fontWeight:500, color:'var(--muted)', background:'transparent', textDecoration:'none', transition:'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color='var(--text)'}
                  onMouseLeave={e => e.currentTarget.style.color='var(--muted)'}
                >
                  للباحثين
                </Link>
              ) : (
                <Link href="/for-companies"
                  className="nav-hide-sm"
                  style={{ padding:'7px 14px', borderRadius:8, fontSize:12, fontWeight:500, color:'var(--muted)', background:'transparent', textDecoration:'none', transition:'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color='var(--text)'}
                  onMouseLeave={e => e.currentTarget.style.color='var(--muted)'}
                >
                  للشركات
                </Link>
              )}

              <div className="nav-divider nav-hide-sm"/>

              {/* زر تسجيل دخول — يمرر الدور */}
              <Link
                href={isCompaniesPage ? '/auth/login?role=company' : '/auth/login'}
                style={{
                  padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:700,
                  background:'linear-gradient(135deg,#7a5e28,#c8a04a)',
                  color:'#06060e', textDecoration:'none',
                  transition:'filter .2s, transform .2s',
                  whiteSpace:'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.filter='brightness(1.1)'; e.currentTarget.style.transform='translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.filter='none'; e.currentTarget.style.transform='none' }}
              >
                {isCompaniesPage ? 'دخول الشركات' : 'ابدأ مجاناً'}
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  )
}