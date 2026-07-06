'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [lang, setLang]       = useState('ar')

  useEffect(() => {
    const stored = sessionStorage.getItem('nukhba_profile')
    if (stored) setProfile(JSON.parse(stored))
  }, [])

  if (!profile) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20 }}>
      <div style={{ fontSize:48 }}>🔍</div>
      <p style={{ color:'var(--muted)', fontSize:16 }}>لا يوجد ملف — ابدأ مقابلة أولاً</p>
      <Link href="/interview" style={{ padding:'12px 28px', borderRadius:10, fontSize:14, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e' }}>ابدأ المقابلة</Link>
    </div>
  )

  const sc = profile.overall_score >= 80 ? '#4a9c6e' : profile.overall_score >= 60 ? '#c8a04a' : '#c94a4a'
  const circ = 2 * Math.PI * 28
  const dash  = circ - (profile.overall_score / 100) * circ
  const initial = (profile.name || '؟')[0]
  const isAr = lang === 'ar'

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', fontFamily:"'Tajawal',sans-serif" }}>

      {/* Top bar */}
      <div style={{ position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:'rgba(8,8,16,.92)', backdropFilter:'blur(16px)', borderBottom:'1px solid var(--border)' }}>
        <Link href="/" style={{ display:'flex', alignItems:'baseline', gap:8 }}>
          <span style={{ fontSize:18, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</span>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, letterSpacing:4, color:'var(--muted)', textTransform:'uppercase' }}>Nukhba</span>
        </Link>
        <div style={{ display:'flex', gap:10 }}>
          <Link href="/interview" style={{ padding:'7px 16px', borderRadius:8, fontSize:13, fontWeight:700, border:'1px solid var(--border)', color:'var(--muted)', background:'transparent' }}>مقابلة جديدة</Link>
          <Link href="/" style={{ padding:'7px 16px', borderRadius:8, fontSize:13, fontWeight:700, border:'1px solid var(--border)', color:'var(--muted)', background:'transparent' }}>الرئيسية</Link>
        </div>
      </div>

      <div style={{ maxWidth:720, margin:'0 auto', padding:'36px 24px 60px' }}>

        {/* Lang toggle */}
        <div style={{ display:'flex', gap:8, marginBottom:24 }}>
          {['ar','en'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding:'5px 18px', borderRadius:20, fontSize:13, cursor:'pointer',
              fontFamily:"'Tajawal',sans-serif",
              border:`1px solid ${lang===l?'var(--gold)':'var(--border)'}`,
              background: lang===l ? 'rgba(200,160,74,.1)' : 'transparent',
              color: lang===l ? 'var(--gold)' : 'var(--muted)',
            }}>{l==='ar'?'العربية':'English'}</button>
          ))}
        </div>

        <div style={{ background:'var(--card)', border:'1px solid var(--gold)', borderRadius:20, overflow:'hidden', direction:isAr?'rtl':'ltr' }}>

          {/* Header */}
          <div style={{ background:'linear-gradient(135deg,rgba(122,94,40,.25),rgba(200,160,74,.06))', borderBottom:'1px solid var(--border)', padding:'28px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#7a5e28,#c8a04a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:800, color:'#06060e', flexShrink:0 }}>{initial}</div>
              <div>
                <div style={{ fontSize:20, fontWeight:800, color:'var(--text)' }}>{profile.name}</div>
                <div style={{ fontSize:14, color:'var(--gold)', marginTop:4 }}>{profile.specialization}</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>📍 {profile.location}</div>
              </div>
            </div>
            <div style={{ textAlign:'center', flexShrink:0 }}>
              <div style={{ width:60, height:60, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="60" height="60" viewBox="0 0 60 60" style={{ position:'absolute', transform:'rotate(-90deg)' }}>
                  <circle cx="30" cy="30" r="28" fill="none" stroke="var(--border)" strokeWidth="4"/>
                  <circle cx="30" cy="30" r="28" fill="none" stroke={sc} strokeWidth="4" strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"/>
                </svg>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:sc }}>{profile.overall_score}</span>
              </div>
              <div style={{ fontSize:10, color:'var(--muted)', marginTop:4 }}>تقييم نخبة</div>
            </div>
          </div>

          {/* Summary */}
          <div style={{ padding:'22px 32px', borderBottom:'1px solid var(--border)' }}>
            <div style={{ fontSize:10, letterSpacing:4, color:'var(--gold)', textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", marginBottom:12 }}>{isAr?'الملخص المهني':'Professional Summary'}</div>
            <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.8 }}>{isAr ? profile.summary_ar : profile.summary_en}</p>
          </div>

          {/* Info grid */}
          <div style={{ padding:'22px 32px', borderBottom:'1px solid var(--border)' }}>
            <div style={{ fontSize:10, letterSpacing:4, color:'var(--gold)', textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", marginBottom:14 }}>{isAr?'معلومات أساسية':'Key Info'}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                [isAr?'سنوات الخبرة':'Experience', profile.experience_years],
                [isAr?'آخر وظيفة':'Last Role',     profile.last_role],
                [isAr?'المؤهل':'Qualification',    profile.qualification],
                [isAr?'الراتب المتوقع':'Salary',   profile.salary_expectation],
                [isAr?'الإتاحة':'Availability',    profile.availability],
                [isAr?'التنقل':'Relocation',       profile.open_to_relocation],
              ].map(([l,v]) => (
                <div key={l} style={{ background:'var(--surface)', borderRadius:8, padding:'10px 14px' }}>
                  <div style={{ fontSize:11, color:'var(--muted)', marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:14, color:'var(--text)', fontWeight:600 }}>{v || '—'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          {profile.achievements?.length > 0 && (
            <div style={{ padding:'22px 32px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ fontSize:10, letterSpacing:4, color:'var(--gold)', textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", marginBottom:12 }}>🏆 {isAr?'الإنجازات':'Achievements'}</div>
              {profile.achievements.map((a,i) => <p key={i} style={{ fontSize:14, color:'var(--text)', lineHeight:1.75, marginBottom:8 }}>· {a}</p>)}
            </div>
          )}

          {/* Strengths + Flags */}
          <div style={{ padding:'22px 32px', borderBottom:'1px solid var(--border)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
            {profile.strengths?.length > 0 && (
              <div>
                <div style={{ fontSize:10, letterSpacing:3, color:'#4a9c6e', textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", marginBottom:10 }}>✅ {isAr?'نقاط القوة':'Strengths'}</div>
                {profile.strengths.map((s,i) => <p key={i} style={{ fontSize:13, color:'var(--text)', marginBottom:6 }}>· {s}</p>)}
              </div>
            )}
            {profile.flags?.length > 0 && (
              <div>
                <div style={{ fontSize:10, letterSpacing:3, color:'#c94a4a', textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", marginBottom:10 }}>⚠️ {isAr?'ملاحظات':'Flags'}</div>
                {profile.flags.map((f,i) => <p key={i} style={{ fontSize:13, color:'var(--text)', marginBottom:6 }}>· {f}</p>)}
              </div>
            )}
          </div>

          {/* Skills */}
          {profile.soft_skills?.length > 0 && (
            <div style={{ padding:'22px 32px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ fontSize:10, letterSpacing:4, color:'var(--gold)', textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", marginBottom:12 }}>{isAr?'المهارات الشخصية':'Soft Skills'}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {profile.soft_skills.map((s,i) => <span key={i} style={{ padding:'5px 14px', borderRadius:20, fontSize:12, background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text)' }}>{s}</span>)}
              </div>
            </div>
          )}

          {/* CV Download */}
          <div style={{ padding:'24px 32px', background:'rgba(200,160,74,.04)', display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:3 }}>احصل على CV احترافي</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>PDF + Word · تصميم احترافي · دفعة واحدة ٣٩ ر.س</div>
            </div>
            <button
              onClick={() => alert('بوابة الدفع قادمة قريباً! ستتمكن من تحميل CV احترافي بعد الدفع.')}
              style={{ padding:'11px 24px', borderRadius:10, fontSize:14, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', border:'none', cursor:'pointer' }}
            >📄 تحميل CV — 39 ر.س</button>
            <button
              onClick={() => alert('بوابة الدفع قادمة قريباً!')}
              style={{ padding:'11px 20px', borderRadius:10, fontSize:14, fontWeight:700, background:'transparent', border:'1px solid var(--border)', color:'var(--muted)', cursor:'pointer' }}
            >📝 Word</button>
          </div>
        </div>
      </div>
    </div>
  )
}
