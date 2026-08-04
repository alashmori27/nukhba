'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogoIcon, LogoText } from './brand'

export default function DashboardNav({ user, children }) {
  const router = useRouter()

  function logout() {
    localStorage.removeItem('nukhba_user')
    localStorage.removeItem('nukhba_profile_edited')
    sessionStorage.clear()
    router.push('/auth/login')
  }

  const isCompany = user?.role === 'company'

  return (
    <>
      <style>{`
        .dash-nav { padding: 0 28px; }
        .dash-nav-name { display: block; }
        @media(max-width: 600px) {
          .dash-nav { padding: 0 16px !important; height: 52px !important; }
          .dash-nav-name { display: none !important; }
          .dash-nav-logout { padding: 5px 10px !important; font-size: 11px !important; }
          .dash-nav-logo { transform: scale(0.8); transform-origin: left center; }
        }
      `}</style>

      <nav className="dash-nav" style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        height:62, background:'rgba(8,8,16,.97)', backdropFilter:'blur(16px)',
        borderBottom:'1px solid var(--border)', position:'sticky', top:0, zIndex:100
      }}>

        {/* Logo */}
        <Link href="/" className="dash-nav-logo" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
          <LogoIcon size={38}/>
          <div style={{ width:1, height:36, background:'rgba(200,160,74,0.3)', flexShrink:0 }}/>
          <div>
            <LogoText size="sm"/>
            {isCompany && (
              <div style={{ fontSize:9, color:'var(--muted)', letterSpacing:3, textTransform:'uppercase', marginTop:1 }}>للشركات</div>
            )}
          </div>
        </Link>

        {/* Right side */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {children}

          {/* اسم المستخدم */}
          <Link href={isCompany ? '/company/dashboard' : '/candidate/account'} style={{ display:'flex', alignItems:'center', gap:6, textDecoration:'none' }}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#7a5e28,#c8a04a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#06060e', flexShrink:0 }}>
              {(user?.name||'؟')[0]}
            </div>
            <span className="dash-nav-name" style={{ fontSize:13, color:'var(--muted)', maxWidth:120, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</span>
          </Link>

          {/* خروج */}
          <button className="dash-nav-logout" onClick={logout} style={{ padding:'5px 12px', borderRadius:8, border:'1px solid var(--border)', background:'transparent', color:'var(--muted)', fontSize:12, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", whiteSpace:'nowrap' }}>
            خروج
          </button>
        </div>
      </nav>
    </>
  )
}