'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'

export default function Home() {
  const [stats, setStats] = useState({ candidates: 0, interviews: 0, jobs: 0 })

  useEffect(() => {
    // جلب الإحصائيات الحقيقية
    async function fetchStats() {
      try {
        const [canRes, jobsRes] = await Promise.all([
          fetch('/api/candidates/stats'),
          fetch('/api/jobs/stats'),
        ])
        const canData  = await canRes.json()
        const jobsData = await jobsRes.json()
        setStats({
          candidates: canData.total || 0,
          interviews: canData.total || 0,
          jobs: jobsData.total || 0,
        })
      } catch(e) {
        // fallback to placeholder
        setStats({ candidates: 24, interviews: 38, jobs: 12 })
      }
    }
    fetchStats()
  }, [])

  return (
    <>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes glow  { 0%,100%{opacity:.07} 50%{opacity:.13} }
        @keyframes countUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        .hero-title   { font-size: clamp(42px, 7vw, 84px); }
        .hero-sub     { font-size: clamp(15px, 2vw, 20px); }
        .split-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .split-card   { border-radius: 20px; padding: 44px 36px; transition: all .3s; position: relative; overflow: hidden; }
        .split-card:hover { transform: translateY(-6px); }
        .split-card::before { content:''; position:absolute; inset:0; opacity:0; transition:opacity .3s; }
        .split-card.candidate::before { background: radial-gradient(ellipse at top right, rgba(200,160,74,.08), transparent 70%); }
        .split-card.company::before   { background: radial-gradient(ellipse at top left, rgba(74,156,110,.06), transparent 70%); }
        .split-card:hover::before { opacity: 1; }
        .stat-num     { font-family:'Cormorant Garamond',serif; font-size:38px; font-weight:600; color:var(--gold); line-height:1; }
        .how-grid     { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; border-radius:16px; overflow:hidden; }
        .feature-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .cta-grid     { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .steps-grid   { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        .social-grid  { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .section-pad  { padding: 90px 40px; }

        @media(max-width:768px){
          .split-grid   { grid-template-columns:1fr; gap:14px; }
          .split-card   { padding:32px 24px; }
          .how-grid     { grid-template-columns:1fr; gap:2px; }
          .feature-grid { grid-template-columns:1fr 1fr; gap:12px; }
          .cta-grid     { grid-template-columns:1fr; }
          .steps-grid   { grid-template-columns:1fr; gap:10px; }
          .social-grid  { grid-template-columns:1fr; gap:12px; }
          .stats-row    { gap:28px !important; }
          .hide-sm      { display:none !important; }
          .section-pad  { padding:60px 20px !important; }
        }
        @media(max-width:480px){
          .feature-grid { grid-template-columns:1fr; }
          .hero-title   { font-size:38px !important; }
        }
      `}</style>

      <Navbar />

      <main>

        {/* ══ HERO ══ */}
        <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'80px 20px 60px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'40%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:800, background:'radial-gradient(ellipse,rgba(200,160,74,.07) 0%,transparent 65%)', pointerEvents:'none', animation:'glow 4s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', top:'40%', left:'50%', transform:'translate(-50%,-50%)', width:500, height:500, border:'1px solid rgba(200,160,74,.06)', borderRadius:'50%', animation:'float 8s ease-in-out infinite', pointerEvents:'none' }}/>

          <div className="fade-up" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(200,160,74,.06)', border:'1px solid rgba(200,160,74,.2)', padding:'7px 20px', borderRadius:24, fontSize:11, color:'var(--gold)', marginBottom:32, fontFamily:"'Cormorant Garamond',serif", letterSpacing:5, textTransform:'uppercase', animationDelay:'.05s' }}>
            ✦ AI · Talent · Platform · السعودية
          </div>

          <h1 className="fade-up hero-title" style={{ fontWeight:800, lineHeight:1.05, color:'#f8f5ef', marginBottom:16, animationDelay:'.15s' }}>
            التوظيف الذكي<br/>
            <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              يبدأ من هنا
            </span>
          </h1>

          <p className="fade-up hero-sub" style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontStyle:'italic', color:'var(--muted)', marginBottom:20, animationDelay:'.25s' }}>
            Where talent meets opportunity
          </p>

          <p className="fade-up" style={{ maxWidth:520, fontSize:15, color:'var(--muted)', lineHeight:1.85, marginBottom:52, animationDelay:'.35s' }}>
            نخبة تربط أفضل المرشحين بأفضل الشركات —<br className="hide-sm"/>
            مقابلات ذكية، ملفات احترافية، توظيف بثقة.
          </p>

          {/* Split CTA */}
          <div className="fade-up split-grid" style={{ width:'100%', maxWidth:760, animationDelay:'.45s' }}>

            {/* للباحث */}
            <div className="split-card candidate" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
              <div style={{ fontSize:36, marginBottom:16 }}>🎙️</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, letterSpacing:4, color:'var(--gold)', textTransform:'uppercase', marginBottom:10 }}>باحث عن عمل</div>
              <h3 style={{ fontSize:18, fontWeight:800, color:'#f8f5ef', marginBottom:8 }}>ابنِ ملفك المهني</h3>
              <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.75, marginBottom:20 }}>
                مقابلة ذكية مجانية تكشف قيمتك الحقيقية وتبني CV احترافي
              </p>
              <Link href="/auth/login" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'11px 22px', borderRadius:10, fontSize:13, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none', marginBottom:10 }}>
                ابدأ مجاناً ←
              </Link>
              {/* ٤. توضيح مجاناً */}
              <p style={{ fontSize:11, color:'var(--muted)', marginTop:8 }}>
                ✓ مقابلة مجانية · لا بطاقة ائتمان
              </p>
            </div>

            {/* للشركة */}
            <div className="split-card company" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
              <div style={{ fontSize:36, marginBottom:16 }}>🏢</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, letterSpacing:4, color:'var(--success)', textTransform:'uppercase', marginBottom:10 }}>شركة توظيف</div>
              <h3 style={{ fontSize:18, fontWeight:800, color:'#f8f5ef', marginBottom:8 }}>جد أفضل المرشحين</h3>
              <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.75, marginBottom:20 }}>
                ملفات مرشحين عميقة مرتبة بالذكاء الاصطناعي — تواصل فوري
              </p>
              <Link href="/auth/login?role=company" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'11px 22px', borderRadius:10, fontSize:13, fontWeight:700, border:'1px solid var(--success)', color:'var(--success)', background:'transparent', textDecoration:'none', marginBottom:10 }}>
                انشر وظيفة ←
              </Link>
              {/* ٤. توضيح مجاناً للشركات */}
              <p style={{ fontSize:11, color:'var(--muted)', marginTop:8 }}>
                ✓ ٣ وظائف مجانية · لا بطاقة ائتمان
              </p>
            </div>
          </div>

          {/* ٢. إحصائيات حقيقية */}
          <div className="fade-up stats-row" style={{ display:'flex', gap:48, justifyContent:'center', marginTop:56, flexWrap:'wrap', animationDelay:'.6s' }}>
            {[
              ['٦','محاور تقييم عميقة'],
              [stats.candidates > 0 ? stats.candidates : '٢٠+', 'مرشح في المنصة'],
              [stats.jobs > 0 ? stats.jobs : '١٠+', 'وظيفة منشورة'],
              ['٣٩','ريال · CV احترافي'],
            ].map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div className="stat-num">{s[0]}</div>
                <div style={{ fontSize:11, color:'var(--muted)', marginTop:5 }}>{s[1]}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ١. مسار الشركة — خطوات واضحة */}
        <section className="section-pad" style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
          <div style={{ maxWidth:900, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:44 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, letterSpacing:5, color:'var(--success)', textTransform:'uppercase', marginBottom:12 }}>للشركات</p>
              <h2 style={{ fontSize:'clamp(22px,4vw,36px)', fontWeight:800, color:'#f8f5ef', marginBottom:10 }}>وظّف في ٣ خطوات</h2>
              <p style={{ fontSize:14, color:'var(--muted)' }}>بدون جدولة مقابلات · بدون قراءة مئات السير الذاتية</p>
            </div>
            <div className="steps-grid">
              {[
                { num:'١', icon:'📝', title:'سجّل حساب شركة', desc:'أنشئ حسابك بالسجل التجاري في دقيقتين', color:'var(--gold)' },
                { num:'٢', icon:'📢', title:'انشر وظيفتك', desc:'اكتب متطلباتك أو دع الذكاء الاصطناعي يولّد أسئلة المقابلة', color:'var(--gold)' },
                { num:'٣', icon:'✅', title:'اختر الأفضل', desc:'راجع ملفات مرشحين مرتبة بالتقييم وتواصل فوراً', color:'var(--success)' },
              ].map(s => (
                <div key={s.num} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'28px 24px', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:16, right:16, fontFamily:"'Cormorant Garamond',serif", fontSize:48, fontWeight:300, color:s.color, opacity:.1, lineHeight:1 }}>{s.num}</div>
                  <div style={{ fontSize:28, marginBottom:14 }}>{s.icon}</div>
                  <div style={{ fontSize:15, fontWeight:700, color:'#f8f5ef', marginBottom:8 }}>{s.title}</div>
                  <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.75 }}>{s.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:32 }}>
              <Link href="/auth/login?role=company" style={{ display:'inline-flex', padding:'12px 28px', borderRadius:10, fontSize:14, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>
                ابدأ مجاناً — ٣ وظائف بدون رسوم ←
              </Link>
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section className="section-pad">
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:52 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:12 }}>كيف يعمل</p>
              <h2 style={{ fontSize:'clamp(22px,4vw,38px)', fontWeight:800, color:'#f8f5ef' }}>ثلاث خطوات — نتيجة حقيقية</h2>
            </div>
            <div className="how-grid" style={{ background:'var(--border)', borderRadius:16, overflow:'hidden' }}>
              {[
                { num:'01', icon:'🎙️', title:'مقابلة ذكية', desc:'الذكاء الاصطناعي يسألك بعمق عن خبراتك وإنجازاتك — مثل مقابلة حقيقية مع متخصص HR، في أي وقت.' },
                { num:'02', icon:'✨', title:'ملف احترافي', desc:'يحوّل إجاباتك لملف مرشح شامل — عربي وإنجليزي — يُعرض للشركات المناسبة تلقائياً.' },
                { num:'03', icon:'📄', title:'CV جاهز', desc:'احصل على سيرتك بصيغة PDF و Word بتصميم احترافي جاهز للتقديم الفوري.' },
              ].map(c => (
                <div key={c.num} style={{ background:'var(--surface)', padding:'36px 28px' }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:48, fontWeight:300, color:'var(--gold)', opacity:.2, lineHeight:1, marginBottom:20 }}>{c.num}</div>
                  <div style={{ fontSize:28, marginBottom:14 }}>{c.icon}</div>
                  <div style={{ fontSize:16, fontWeight:700, color:'#f8f5ef', marginBottom:10 }}>{c.title}</div>
                  <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.8 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section className="section-pad" style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:52 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:12 }}>المميزات</p>
              <h2 style={{ fontSize:'clamp(22px,4vw,38px)', fontWeight:800, color:'#f8f5ef' }}>لماذا نخبة؟</h2>
            </div>
            <div className="feature-grid">
              {[
                { icon:'🤖', title:'ذكاء اصطناعي عميق', desc:'٦ محاور تقييم — خبرة، إنجازات، شخصية، مهارات، توقعات، ملاءمة.' },
                { icon:'🎯', title:'تقييم موضوعي', desc:'تقييم من 100 لكل مرشح — بدون تحيز، بدون تأثير شخصي.' },
                { icon:'🌐', title:'ثنائي اللغة', desc:'ملف مهني عربي وإنجليزي — ترجمة احترافية تلقائية.' },
                { icon:'⚡', title:'توفير الوقت', desc:'بدل مئات السير الذاتية — ملفات مرتبة جاهزة في دقائق.' },
                { icon:'🔒', title:'خصوصية تامة', desc:'بياناتك محمية — لا تُشارك بدون إذنك الصريح.' },
                { icon:'📱', title:'من أي جهاز', desc:'جوال أو كمبيوتر — المقابلة في أي وقت ومن أي مكان.' },
              ].map(f => (
                <div key={f.title} className="card-hover" style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'24px 20px' }}>
                  <div style={{ fontSize:26, marginBottom:12 }}>{f.icon}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#f8f5ef', marginBottom:8 }}>{f.title}</div>
                  <div style={{ fontSize:12, color:'var(--muted)', lineHeight:1.75 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ COMPARISON ══ */}
        <section className="section-pad">
          <div style={{ maxWidth:800, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <h2 style={{ fontSize:'clamp(22px,4vw,36px)', fontWeight:800, color:'#f8f5ef' }}>نخبة مقابل الطريقة التقليدية</h2>
            </div>
            <div className="cta-grid">
              <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'28px 24px' }}>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--muted)', marginBottom:18, textAlign:'center' }}>الطريقة التقليدية 😓</div>
                {['مئات السير الذاتية العشوائية','أيام في القراءة والمقارنة','مقابلات مجدولة تستهلك الوقت','تقييم ذاتي متحيز','مواهب تضيع في الكومة'].map(i => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:11, fontSize:13, color:'var(--muted)' }}>
                    <span style={{ color:'var(--error)', fontSize:14, flexShrink:0 }}>✗</span>{i}
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(200,160,74,.04)', border:'1px solid rgba(200,160,74,.25)', borderRadius:14, padding:'28px 24px' }}>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--gold)', marginBottom:18, textAlign:'center' }}>نخبة ✨</div>
                {['ملفات مرشحين عميقة ودقيقة','تقييم فوري بالذكاء الاصطناعي','مقابلات في أي وقت بدون جدولة','تقييم موضوعي 100%','اكتشاف المواهب الخفية'].map(i => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:11, fontSize:13, color:'var(--text)' }}>
                    <span style={{ color:'var(--success)', fontSize:14, flexShrink:0 }}>✓</span>{i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA FINAL ══ */}
        <section className="section-pad" style={{ textAlign:'center' }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:16 }}>ابدأ الآن</p>
          <h2 style={{ fontSize:'clamp(28px,5vw,52px)', fontWeight:800, color:'#f8f5ef', marginBottom:16, lineHeight:1.1 }}>
            وظّف بثقة.<br/>
            <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              أو انطلق في مسيرتك.
            </span>
          </h2>
          <p style={{ fontSize:15, color:'var(--muted)', maxWidth:440, margin:'0 auto 44px', lineHeight:1.85 }}>
            سواء كنت باحثاً عن عمل أو شركة توظيف — نخبة تبدأ معك مجاناً.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/auth/login" style={{ padding:'14px 36px', borderRadius:10, fontSize:15, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>
              ابدأ مقابلتك المجانية
            </Link>
            <Link href="/auth/login?role=company" style={{ padding:'14px 36px', borderRadius:10, fontSize:15, fontWeight:700, border:'1px solid var(--border)', color:'var(--muted)', background:'transparent', textDecoration:'none' }}>
              للشركات — انشر وظيفة
            </Link>
          </div>
        </section>

      </main>

      {/* ══ FOOTER ══ */}
      <footer style={{ padding:'32px 40px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
          <span style={{ fontSize:17, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</span>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:4, color:'var(--muted)', textTransform:'uppercase' }}>Nukhba</span>
        </div>
        <p style={{ fontSize:12, color:'var(--muted)' }}>© {new Date().getFullYear()} نخبة. جميع الحقوق محفوظة.</p>
        <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
          {[['سياسة الخصوصية','/privacy'],['الشروط','/terms'],['تواصل معنا','/contact'],['للشركات','/for-companies']].map(([label,href]) => (
            <Link key={href} href={href} style={{ fontSize:12, color:'var(--muted)', textDecoration:'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </>
  )
}