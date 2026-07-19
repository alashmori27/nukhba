'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardNav({ user, children }) {
  const router = useRouter()

  function logout() {
    localStorage.removeItem('nukhba_user')
    router.push('/auth/login')
  }

  const isCompany = user?.role === 'company'

  return (
    <>
      <style>{`
        .dash-nav { padding: 0 32px; }
        .dash-nav-logo { font-size: 20px; }
        .dash-nav-name { display: block; }
        @media(max-width: 600px) {
          .dash-nav { padding: 0 16px !important; height: 52px !important; }
          .dash-nav-logo { font-size: 17px !important; }
          .dash-nav-name { display: none !important; }
          .dash-nav-logout { padding: 5px 10px !important; font-size: 11px !important; }
        }
      `}</style>

      <nav className="dash-nav" style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        height:60, background:'rgba(8,8,16,.97)', backdropFilter:'blur(16px)',
        borderBottom:'1px solid var(--border)', position:'sticky', top:0, zIndex:100
      }}>
        {/* Logo */}
        <Link href="/" style={{ display:'flex', alignItems:'baseline', gap:6, textDecoration:'none' }}>
          <span className="dash-nav-logo" style={{ fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</span>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:4, color:'var(--muted)', textTransform:'uppercase' }}>
            {isCompany ? 'للشركات' : 'Nukhba'}
          </span>
        </Link>

        {/* Right side */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {/* Extra items (جرس الإشعارات مثلاً) */}
          {children}

          {/* اسم المستخدم */}
          <Link href={isCompany ? '/company/dashboard' : '/candidate/account'} style={{ display:'flex', alignItems:'center', gap:6, textDecoration:'none' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#7a5e28,#c8a04a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#06060e', flexShrink:0 }}>
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