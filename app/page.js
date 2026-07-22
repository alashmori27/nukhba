'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [activeJourney, setActiveJourney] = useState('candidate')
  const [step, setStep] = useState(0)

  // تقدم تلقائي للخطوات
  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % 3)
    }, 2500)
    return () => clearInterval(interval)
  }, [activeJourney])

  const journeys = {
    candidate: {
      color: '#c8a04a',
      colorDim: 'rgba(200,160,74,.12)',
      label: 'رحلة الباحث',
      steps: [
        { icon: '🎙️', title: 'مقابلة ذكية', desc: 'أجرِ مقابلة مع الذكاء الاصطناعي في أي وقت' },
        { icon: '📊', title: 'ملف احترافي', desc: 'تقييم موضوعي وملف مهني عربي وإنجليزي' },
        { icon: '🚀', title: 'انطلق للشركات', desc: 'ملفك يصل للشركات المناسبة تلقائياً' },
      ],
      cta: 'ابدأ مقابلتك المجانية',
      link: '/auth/login',
      sub: '✓ مجاني · لا بطاقة ائتمان',
    },
    company: {
      color: '#4a9c6e',
      colorDim: 'rgba(74,156,110,.1)',
      label: 'رحلة الشركة',
      steps: [
        { icon: '📢', title: 'انشر وظيفتك', desc: 'حدد متطلباتك والذكاء الاصطناعي يولّد الأسئلة' },
        { icon: '🤖', title: 'AI يقابل بدلاً عنك', desc: 'المرشحون يُقابَلون تلقائياً بأسئلتك' },
        { icon: '✅', title: 'اختر الأفضل', desc: 'ملفات مرتبة بالتقييم — تواصل فوري' },
      ],
      cta: 'انشر وظيفتك مجاناً',
      link: '/auth/login?role=company',
      sub: '✓ 3 وظائف مجانية · لا بطاقة ائتمان',
    }
  }

  const j = journeys[activeJourney]

  return (
    <>
      <style>{`
        @keyframes glow   { 0%,100%{opacity:.05} 50%{opacity:.12} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes stepIn { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }

        .tab-btn { transition: all .25s; border: none; cursor: pointer; font-family: 'Tajawal', sans-serif; }
        .step-card { transition: all .3s; }
        .step-active { animation: stepIn .4s ease both; }

        @media(max-width: 640px) {
          .hero-title  { font-size: 34px !important; }
          .hero-sub    { font-size: 14px !important; }
          .journey-box { padding: 28px 18px !important; }
          .step-grid   { grid-template-columns: 1fr !important; gap: 10px !important; }
          .footer-row  { flex-direction: column; align-items: center; text-align: center; gap: 10px !important; }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap" rel="stylesheet"/>

      <div style={{ minHeight:'100vh', background:'#080810', fontFamily:"'Tajawal',sans-serif", color:'#ede8df', display:'flex', flexDirection:'column' }}>

        {/* ── Nav ── */}
        <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:62, background:'rgba(8,8,16,.95)', backdropFilter:'blur(16px)', borderBottom:'1px solid #252538', position:'sticky', top:0, zIndex:100 }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:7 }}>
            <span style={{ fontSize:20, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</span>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'#7a7690', textTransform:'uppercase' }}>Nukhba</span>
          </div>
          <Link href="/auth/login" style={{ padding:'7px 18px', borderRadius:8, fontSize:13, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>
            تسجيل الدخول
          </Link>
        </nav>

        {/* ── Hero ── */}
        <section style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'60px 20px 40px', position:'relative', overflow:'hidden' }}>

          {/* Glow */}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:700, background:`radial-gradient(ellipse,${j.colorDim} 0%,transparent 65%)`, pointerEvents:'none', animation:'glow 4s ease-in-out infinite', transition:'background .6s' }}/>

          {/* Badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(200,160,74,.06)', border:'1px solid rgba(200,160,74,.18)', padding:'6px 18px', borderRadius:22, fontSize:10, color:'#c8a04a', marginBottom:24, fontFamily:"'Cormorant Garamond',serif", letterSpacing:5, textTransform:'uppercase', animation:'fadeUp .6s ease both' }}>
            ✦ منصة التوظيف الذكي · السعودية
          </div>

          {/* Headline */}
          <h1 className="hero-title" style={{ fontSize:'clamp(36px,6vw,72px)', fontWeight:800, lineHeight:1.08, color:'#f8f5ef', marginBottom:14, animation:'fadeUp .6s ease both .1s both' }}>
            التوظيف الذكي<br/>
            <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              يبدأ من هنا
            </span>
          </h1>

          <p className="hero-sub" style={{ fontSize:'clamp(14px,1.8vw,18px)', fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontStyle:'italic', color:'#7a7690', marginBottom:48, animation:'fadeUp .6s ease both .2s both' }}>
            Where talent meets opportunity
          </p>

          {/* ── Tabs ── */}
          <div style={{ display:'flex', gap:8, marginBottom:28, background:'#0e0e1a', border:'1px solid #252538', borderRadius:14, padding:6, animation:'fadeUp .6s ease both .3s both' }}>
            {[['candidate','👤 أنا باحث عن عمل'],['company','🏢 أنا شركة']].map(([key, label]) => (
              <button key={key} className="tab-btn"
                onClick={() => { setActiveJourney(key); setStep(0) }}
                style={{
                  padding:'11px 24px', borderRadius:10, fontSize:14, fontWeight:700,
                  background: activeJourney===key ? `linear-gradient(135deg,${journeys[key].color}33,${journeys[key].color}22)` : 'transparent',
                  color: activeJourney===key ? journeys[key].color : '#7a7690',
                  border: activeJourney===key ? `1px solid ${journeys[key].color}44` : '1px solid transparent',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── Journey Box ── */}
          <div className="journey-box" style={{ width:'100%', maxWidth:680, background:'#0e0e1a', border:`1px solid ${j.color}33`, borderRadius:20, padding:'36px 32px', transition:'border-color .4s', animation:'fadeUp .6s ease both .35s both' }}>

            <p style={{ fontSize:11, letterSpacing:4, color:j.color, textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", marginBottom:24 }}>{j.label}</p>

            {/* خطوات الرحلة */}
            <div className="step-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:32 }}>
              {j.steps.map((s, i) => (
                <div key={i} className={`step-card ${i === step ? 'step-active' : ''}`} style={{
                  background: i === step ? `${j.color}0f` : '#13131f',
                  border: `1px solid ${i === step ? j.color+'44' : '#252538'}`,
                  borderRadius:12, padding:'18px 14px', textAlign:'center', position:'relative',
                  transition:'all .3s',
                }}>
                  {/* رقم الخطوة */}
                  <div style={{ position:'absolute', top:8, right:10, fontSize:10, color: i===step?j.color:'#7a7690', fontWeight:700, fontFamily:"'Cormorant Garamond',serif", opacity:.6 }}>0{i+1}</div>
                  <div style={{ fontSize:26, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:13, fontWeight:700, color: i===step?'#f8f5ef':'#7a7690', marginBottom:5 }}>{s.title}</div>
                  <div style={{ fontSize:11, color:'#7a7690', lineHeight:1.6 }}>{s.desc}</div>

                  {/* Progress bar للخطوة النشطة */}
                  {i === step && (
                    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:'#252538', borderRadius:'0 0 12px 12px', overflow:'hidden' }}>
                      <div style={{ height:'100%', background:j.color, animation:'progress 2.5s linear forwards', borderRadius:'0 0 12px 12px' }}/>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Progress dots */}
            <div style={{ display:'flex', gap:6, justifyContent:'center', marginBottom:28 }}>
              {[0,1,2].map(i => (
                <div key={i} onClick={() => setStep(i)} style={{ width: i===step?20:6, height:6, borderRadius:3, background: i===step?j.color:'#252538', transition:'all .3s', cursor:'pointer' }}/>
              ))}
            </div>

            {/* CTA */}
            <Link href={j.link} style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'14px', borderRadius:12, fontSize:15, fontWeight:800, background:`linear-gradient(135deg,${j.color}cc,${j.color})`, color: activeJourney==='candidate'?'#06060e':'#fff', textDecoration:'none', marginBottom:10, transition:'filter .2s', filter:'brightness(1)', animation:'pulse 3s ease-in-out infinite' }}>
              {j.cta} ←
            </Link>
            <p style={{ fontSize:11, color:'#7a7690', textAlign:'center' }}>{j.sub}</p>
          </div>

          {/* إحصائيات بسيطة */}
          <div style={{ display:'flex', gap:40, justifyContent:'center', marginTop:44, flexWrap:'wrap', animation:'fadeUp .6s ease both .5s both' }}>
            {[['6','محاور تقييم'],['100%','مقابلات مكتملة'],['39 ريال','CV احترافي']].map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:600, color:'#c8a04a', lineHeight:1 }}>{s[0]}</div>
                <div style={{ fontSize:11, color:'#7a7690', marginTop:4 }}>{s[1]}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="footer-row" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 32px', borderTop:'1px solid #252538', gap:16, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
            <span style={{ fontSize:15, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</span>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:9, letterSpacing:4, color:'#7a7690', textTransform:'uppercase' }}>Nukhba</span>
          </div>
          <p style={{ fontSize:11, color:'#7a7690' }}>© {new Date().getFullYear()} نخبة. جميع الحقوق محفوظة.</p>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            {[['للشركات','/for-companies'],['سياسة الخصوصية','/privacy'],['تواصل معنا','/contact']].map(([l,h]) => (
              <Link key={h} href={h} style={{ fontSize:11, color:'#7a7690', textDecoration:'none' }}>{l}</Link>
            ))}
          </div>
        </footer>

      </div>

      <style>{`
        @keyframes progress { from{width:0%} to{width:100%} }
      `}</style>
    </>
  )
}