'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

function NukhbaLogo({ size = 'md' }) {
  const s = size === 'sm' ? 0.55 : 1
  const w = Math.round(260 * s)
  const h = Math.round(80 * s)

  return (
    <svg width={w} height={h} viewBox="0 0 260 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ng" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#5a4218"/>
          <stop offset="25%"  stopColor="#c8a04a"/>
          <stop offset="50%"  stopColor="#f0d080"/>
          <stop offset="75%"  stopColor="#c8a04a"/>
          <stop offset="100%" stopColor="#7a5e28"/>
        </linearGradient>
        <linearGradient id="sh" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#fff8e0" stopOpacity="0"/>
          <stop offset="40%"  stopColor="#fff8e0" stopOpacity="0.35"/>
          <stop offset="60%"  stopColor="#fff8e0" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#fff8e0" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#e4c87a"/>
          <stop offset="50%"  stopColor="#c8a04a"/>
          <stop offset="100%" stopColor="#7a5e28"/>
        </linearGradient>
        <linearGradient id="tg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#f0d080"/>
          <stop offset="50%"  stopColor="#c8a04a"/>
          <stop offset="100%" stopColor="#9a7a32"/>
        </linearGradient>
      </defs>

      {/* إطار مربع */}
      <rect x="0" y="2" width="76" height="76" rx="12" fill="#0d0d1a" stroke="url(#fg)" strokeWidth="1.5"/>

      {/* حرف N */}
      <g transform="translate(13, 13)">
        <polygon points="0,0 10,0 10,52 0,52" fill="url(#ng)"/>
        <polygon points="0,0 10,0 10,7 0,0" fill="#7a5e28" fillOpacity="0.4"/>
        <polygon points="0,52 10,52 10,45 0,52" fill="#e4c87a" fillOpacity="0.3"/>
        <polygon points="10,0 18,0 48,52 40,52" fill="url(#ng)"/>
        <polygon points="10,0 18,0 22,10 14,10" fill="#f0d080" fillOpacity="0.25"/>
        <polygon points="40,0 50,0 50,52 40,52" fill="url(#ng)"/>
        <polygon points="40,0 50,0 50,7 40,0" fill="#7a5e28" fillOpacity="0.4"/>
        <polygon points="40,52 50,52 50,45 40,52" fill="#e4c87a" fillOpacity="0.3"/>
        <rect x="40" y="0" width="10" height="52" fill="url(#sh)"/>
      </g>

      {/* خط فاصل I */}
      <g transform="translate(88, 8)">
        <rect x="-4" y="0" width="8" height="1.5" rx="0.75" fill="#c8a04a" fillOpacity="0.55"/>
        <rect x="-0.75" y="0" width="1.5" height="64" rx="0.75" fill="#c8a04a" fillOpacity="0.4"/>
        <rect x="-4" y="62.5" width="8" height="1.5" rx="0.75" fill="#c8a04a" fillOpacity="0.55"/>
      </g>

      {/* نخبة */}
      <text x="102" y="46"
        fill="url(#tg)"
        fontSize="34"
        fontFamily="'Tajawal', Arial, sans-serif"
        fontWeight="800"
        letterSpacing="1">نخبة</text>

      {/* NUKHBA */}
      <text x="104" y="64"
        fill="#7a6840"
        fontSize="9.5"
        fontFamily="'Montserrat', Arial, sans-serif"
        fontWeight="300"
        letterSpacing="6">NUKHBA</text>
    </svg>
  )
}

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
        .nav-divider { width:1px; height:16px; background:var(--border); margin:0 4px; }
        @media(max-width:600px){
          .nukhba-nav { padding:0 16px !important; height:54px !important; }
          .nav-hide-sm { display:none !important; }
          .nav-logo-sm { transform: scale(0.85); transform-origin: left center; }
        }
      `}</style>

      <nav className="nukhba-nav" style={{
        background: scrolled ? 'rgba(8,8,16,.98)' : 'rgba(8,8,16,.85)',
        boxShadow: scrolled ? '0 1px 0 var(--border), 0 8px 32px rgba(0,0,0,.3)' : '0 1px 0 var(--border)',
        transition: 'background .3s, box-shadow .3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        height: 64,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration:'none', flexShrink:0, display:'flex', alignItems:'center' }} className="nav-logo-sm">
          <NukhbaLogo size="sm"/>
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