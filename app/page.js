'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'

export default function Home() {
  const [stats, setStats] = useState({ candidates: 0, jobs: 0 })

  useEffect(() => {
    async function fetchStats() {
      try {
        const [canRes, jobsRes] = await Promise.all([
          fetch('/api/candidates/stats'),
          fetch('/api/jobs/stats'),
        ])
        const canData  = await canRes.json()
        const jobsData = await jobsRes.json()
        setStats({ candidates: canData.total || 0, jobs: jobsData.total || 0 })
      } catch(e) {
        setStats({ candidates: 24, jobs: 12 })
      }
    }
    fetchStats()
  }, [])

  return (
    <>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes glow  { 0%,100%{opacity:.06} 50%{opacity:.12} }

        .hero-title  { font-size: clamp(40px, 6.5vw, 80px); }
        .split-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 740px; width: 100%; }
        .split-card  { border-radius: 18px; padding: 36px 28px; transition: transform .3s, border-color .3s; position: relative; overflow: hidden; }
        .split-card:hover { transform: translateY(-5px); }
        .split-card::before { content:''; position:absolute; inset:0; opacity:0; transition:opacity .3s; border-radius:18px; }
        .split-card.cand::before { background: radial-gradient(ellipse at 80% 0%, rgba(200,160,74,.1), transparent 70%); }
        .split-card.comp::before { background: radial-gradient(ellipse at 20% 0%, rgba(74,156,110,.08), transparent 70%); }
        .split-card:hover::before { opacity: 1; }
        .stats-row   { display: flex; gap: 44px; justify-content: center; flex-wrap: wrap; }
        .stat-num    { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:600; color:var(--gold); line-height:1; }
        .tools-grid  { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
        .compare-grid{ display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .section-pad { padding: 80px 40px; }

        @media(max-width:720px){
          .split-grid   { grid-template-columns: 1fr; }
          .split-card   { padding: 28px 22px; }
          .tools-grid   { grid-template-columns: 1fr; }
          .compare-grid { grid-template-columns: 1fr; }
          .stats-row    { gap: 28px; }
          .section-pad  { padding: 56px 18px !important; }
          .hide-sm      { display: none !important; }
          .hero-title   { font-size: 36px !important; }
        }
      `}</style>

      <Navbar />

      <main>

        {/* ══ HERO ══ */}
        <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'80px 20px 56px', position:'relative', overflow:'hidden' }}>

          {/* Glow bg */}
          <div style={{ position:'absolute', top:'38%', left:'50%', transform:'translate(-50%,-50%)', width:760, height:760, background:'radial-gradient(ellipse,rgba(200,160,74,.07) 0%,transparent 65%)', pointerEvents:'none', animation:'glow 5s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', top:'38%', left:'50%', transform:'translate(-50%,-50%)', width:480, height:480, border:'1px solid rgba(200,160,74,.05)', borderRadius:'50%', animation:'float 9s ease-in-out infinite', pointerEvents:'none' }}/>

          {/* Badge */}
          <div className="fade-up" style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(200,160,74,.06)', border:'1px solid rgba(200,160,74,.18)', padding:'6px 18px', borderRadius:22, fontSize:10, color:'var(--gold)', marginBottom:28, fontFamily:"'Cormorant Garamond',serif", letterSpacing:5, textTransform:'uppercase' }}>
            ✦ AI Talent Platform · Saudi Arabia
          </div>

          {/* Headline */}
          <h1 className="fade-up hero-title" style={{ fontWeight:800, lineHeight:1.08, color:'#f8f5ef', marginBottom:14, animationDelay:'.1s' }}>
            التوظيف الذكي<br/>
            <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>يبدأ من هنا</span>
          </h1>

          <p className="fade-up" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(15px,2vw,19px)', fontWeight:300, fontStyle:'italic', color:'var(--muted)', marginBottom:44, animationDelay:'.2s' }}>
            Where talent meets opportunity
          </p>

          {/* البطاقتان */}
          <div className="fade-up split-grid" style={{ animationDelay:'.3s' }}>

            <div className="split-card cand" style={{ background:'var(--card)', border:'1px solid var(--border)', textAlign:'right' }}>
              <div style={{ fontSize:32, marginBottom:14 }}>🎙️</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:4, color:'var(--gold)', textTransform:'uppercase', marginBottom:8 }}>باحث عن عمل</div>
              <h3 style={{ fontSize:17, fontWeight:800, color:'#f8f5ef', marginBottom:8 }}>ابنِ ملفك المهني</h3>
              <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.75, marginBottom:20 }}>مقابلة ذكية مجانية تكشف قيمتك وتبني CV احترافي</p>
              <Link href="/auth/login" style={{ display:'inline-flex', padding:'10px 20px', borderRadius:9, fontSize:13, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>
                ابدأ مجاناً ←
              </Link>
              <p style={{ fontSize:11, color:'var(--muted)', marginTop:10 }}>✓ مقابلة مجانية · لا بطاقة ائتمان</p>
            </div>

            <div className="split-card comp" style={{ background:'var(--card)', border:'1px solid var(--border)', textAlign:'right' }}>
              <div style={{ fontSize:32, marginBottom:14 }}>🏢</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:4, color:'var(--success)', textTransform:'uppercase', marginBottom:8 }}>شركة توظيف</div>
              <h3 style={{ fontSize:17, fontWeight:800, color:'#f8f5ef', marginBottom:8 }}>جد أفضل المرشحين</h3>
              <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.75, marginBottom:20 }}>ملفات مرشحين مرتبة بالذكاء الاصطناعي — تواصل فوري</p>
              <Link href="/auth/login?role=company" style={{ display:'inline-flex', padding:'10px 20px', borderRadius:9, fontSize:13, fontWeight:700, border:'1px solid var(--success)', color:'var(--success)', background:'transparent', textDecoration:'none' }}>
                انشر وظيفة ←
              </Link>
              <p style={{ fontSize:11, color:'var(--muted)', marginTop:10 }}>✓ 3 وظائف مجانية · لا بطاقة ائتمان</p>
            </div>
          </div>

          {/* إحصائيات */}
          <div className="fade-up stats-row" style={{ marginTop:48, animationDelay:'.45s' }}>
            {[
              ['6',   'محاور تقييم'],
              [stats.candidates > 0 ? stats.candidates : '20+', 'مرشح مسجّل'],
              [stats.jobs > 0 ? stats.jobs : '10+', 'وظيفة منشورة'],
              ['39',  'ريال · CV احترافي'],
            ].map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div className="stat-num">{s[0]}</div>
                <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>{s[1]}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ الأدوات الثلاث ══ */}
        <section className="section-pad" style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
          <div style={{ maxWidth:1000, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:44 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:10 }}>ما تقدر تفعله</p>
              <h2 style={{ fontSize:'clamp(20px,3.5vw,34px)', fontWeight:800, color:'#f8f5ef' }}>منصة كاملة في مكان واحد</h2>
            </div>
            <div className="tools-grid">
              {[
                {
                  icon:'🎙️',
                  tag:'مجاني',
                  tagColor:'var(--success)',
                  title:'مقابلة ذكية',
                  desc:'6 محاور تقييم — خبرة، إنجازات، شخصية، مهارات، توقعات، ملاءمة. تُجرى في أي وقت بدون جدولة.',
                  link:'/auth/login',
                  btn:'ابدأ المقابلة'
                },
                {
                  icon:'📊',
                  tag:'19 ريال',
                  tagColor:'var(--gold)',
                  title:'تحليل سيرتك الذاتية',
                  desc:'ارفع سيرتك الذاتية والذكاء الاصطناعي يحللها — نقاط قوة وضعف وتوصيات + نسخة محسّنة.',
                  link:'/analyze-cv',
                  btn:'حلّل سيرتي'
                },
                {
                  icon:'📄',
                  tag:'39 ريال',
                  tagColor:'var(--gold)',
                  title:'CV احترافي',
                  desc:'بعد المقابلة احصل على سيرتك بالعربي والإنجليزي بصيغة PDF و Word جاهزة للتقديم.',
                  link:'/auth/login',
                  btn:'أنشئ CV'
                },
              ].map(t => (
                <div key={t.title} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:26, transition:'border-color .2s, transform .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(200,160,74,.4)'; e.currentTarget.style.transform='translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='none' }}
                >
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                    <div style={{ fontSize:28 }}>{t.icon}</div>
                    <span style={{ fontSize:11, fontWeight:700, color:t.tagColor, background:`${t.tagColor}18`, padding:'3px 10px', borderRadius:20 }}>{t.tag}</span>
                  </div>
                  <div style={{ fontSize:15, fontWeight:700, color:'#f8f5ef', marginBottom:8 }}>{t.title}</div>
                  <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.75, marginBottom:18 }}>{t.desc}</div>
                  <Link href={t.link} style={{ fontSize:13, fontWeight:700, color:'var(--gold)', textDecoration:'none' }}>{t.btn} ←</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ المقارنة ══ */}
        <section className="section-pad">
          <div style={{ maxWidth:800, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:40 }}>
              <h2 style={{ fontSize:'clamp(20px,3.5vw,34px)', fontWeight:800, color:'#f8f5ef' }}>نخبة مقابل الطريقة التقليدية</h2>
            </div>
            <div className="compare-grid">
              <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'26px 22px' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--muted)', marginBottom:16, textAlign:'center' }}>الطريقة التقليدية 😓</div>
                {['مئات السير الذاتية العشوائية','أيام في المقارنة والقراءة','مقابلات مجدولة تستهلك الوقت','تقييم ذاتي متحيز','مواهب تضيع في الكومة'].map(i => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:10, fontSize:13, color:'var(--muted)' }}>
                    <span style={{ color:'var(--error)', flexShrink:0 }}>✗</span>{i}
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(200,160,74,.04)', border:'1px solid rgba(200,160,74,.22)', borderRadius:14, padding:'26px 22px' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--gold)', marginBottom:16, textAlign:'center' }}>نخبة ✨</div>
                {['ملفات مرشحين عميقة ودقيقة','تقييم فوري بالذكاء الاصطناعي','مقابلات في أي وقت بدون جدولة','تقييم موضوعي 100%','اكتشاف المواهب الخفية'].map(i => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:10, fontSize:13, color:'var(--text)' }}>
                    <span style={{ color:'var(--success)', flexShrink:0 }}>✓</span>{i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="section-pad" style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', textAlign:'center' }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:14 }}>ابدأ الآن</p>
          <h2 style={{ fontSize:'clamp(26px,5vw,48px)', fontWeight:800, color:'#f8f5ef', marginBottom:14, lineHeight:1.1 }}>
            وظّف بثقة.<br/>
            <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              أو انطلق في مسيرتك.
            </span>
          </h2>
          <p style={{ fontSize:14, color:'var(--muted)', maxWidth:400, margin:'0 auto 36px', lineHeight:1.85 }}>
            سواء كنت باحثاً عن عمل أو شركة — نخبة تبدأ معك مجاناً.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/auth/login" style={{ padding:'13px 32px', borderRadius:10, fontSize:14, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>
              ابدأ مقابلتك المجانية
            </Link>
            <Link href="/auth/login?role=company" style={{ padding:'13px 32px', borderRadius:10, fontSize:14, fontWeight:700, border:'1px solid var(--border)', color:'var(--muted)', background:'transparent', textDecoration:'none' }}>
              للشركات — انشر وظيفة
            </Link>
          </div>
        </section>

      </main>

      {/* ══ FOOTER ══ */}
      <footer style={{ padding:'28px 36px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
          <span style={{ fontSize:16, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</span>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:4, color:'var(--muted)', textTransform:'uppercase' }}>Nukhba</span>
        </div>
        <p style={{ fontSize:12, color:'var(--muted)' }}>© {new Date().getFullYear()} نخبة. جميع الحقوق محفوظة.</p>
        <div style={{ display:'flex', gap:18, flexWrap:'wrap' }}>
          {[['سياسة الخصوصية','/privacy'],['الشروط','/terms'],['تواصل معنا','/contact'],['للشركات','/for-companies']].map(([l,h]) => (
            <Link key={h} href={h} style={{ fontSize:12, color:'var(--muted)', textDecoration:'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </>
  )
}