'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow   { 0%,100%{opacity:.06} 50%{opacity:.13} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        .hero-title  { font-size: clamp(38px, 6.5vw, 78px); }
        .steps-grid  { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; border-radius: 16px; overflow: hidden; }
        .tools-grid  { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .comp-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .section-pad { padding: 88px 40px; }
        .stat-num    { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:600; color:var(--gold); line-height:1; }

        @media(max-width:768px){
          .steps-grid  { grid-template-columns: 1fr; gap: 2px; }
          .tools-grid  { grid-template-columns: 1fr; gap: 12px; }
          .comp-grid   { grid-template-columns: 1fr; }
          .section-pad { padding: 56px 18px !important; }
          .stats-row   { gap: 28px !important; }
          .hide-sm     { display: none !important; }
          .hero-title  { font-size: 36px !important; }
        }
      `}</style>

      <Navbar />

      <main>

        {/* ══ HERO ══ */}
        <section style={{ minHeight:'94vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'80px 20px 56px', position:'relative', overflow:'hidden' }}>

          <div style={{ position:'absolute', top:'42%', left:'50%', transform:'translate(-50%,-50%)', width:720, height:720, background:'radial-gradient(ellipse,rgba(200,160,74,.07) 0%,transparent 65%)', pointerEvents:'none', animation:'glow 5s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', top:'42%', left:'50%', transform:'translate(-50%,-50%)', width:460, height:460, border:'1px solid rgba(200,160,74,.05)', borderRadius:'50%', animation:'float 9s ease-in-out infinite', pointerEvents:'none' }}/>

          {/* Badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(200,160,74,.06)', border:'1px solid rgba(200,160,74,.18)', padding:'6px 18px', borderRadius:22, fontSize:10, color:'var(--gold)', marginBottom:26, fontFamily:"'Cormorant Garamond',serif", letterSpacing:5, textTransform:'uppercase', animation:'fadeUp .6s ease both' }}>
            ✦ للباحثين عن عمل · Saudi Arabia
          </div>

          <h1 className="hero-title" style={{ fontWeight:800, lineHeight:1.07, color:'#f8f5ef', marginBottom:16, animation:'fadeUp .6s ease both .1s' }}>
            اكشف قيمتك الحقيقية<br/>
            <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              وانطلق للشركات
            </span>
          </h1>

          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(15px,2vw,20px)', fontWeight:300, fontStyle:'italic', color:'var(--muted)', marginBottom:16, animation:'fadeUp .6s ease both .2s' }}>
            لا CV جامد — بل محادثة ذكية تُظهر من أنت حقاً
          </p>

          <p style={{ maxWidth:500, fontSize:15, color:'var(--muted)', lineHeight:1.85, marginBottom:44, animation:'fadeUp .6s ease both .25s' }}>
            مقابلة ذكية مع الذكاء الاصطناعي تبني ملفك المهني تلقائياً —<br className="hide-sm"/>
            عربي وإنجليزي، جاهز للتقديم الفوري.
          </p>

          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', animation:'fadeUp .6s ease both .35s' }}>
            <Link href="/auth/login" style={{ padding:'14px 36px', borderRadius:10, fontSize:15, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>
              ابدأ مقابلتك المجانية ←
            </Link>
            <Link href="/analyze-cv" style={{ padding:'14px 36px', borderRadius:10, fontSize:15, fontWeight:700, border:'1px solid var(--border)', color:'var(--muted)', background:'transparent', textDecoration:'none' }}>
              حلّل سيرتي الذاتية
            </Link>
          </div>

          <p style={{ fontSize:12, color:'var(--muted)', marginTop:14, animation:'fadeUp .6s ease both .4s' }}>
            ✓ مقابلة مجانية · لا بطاقة ائتمان
          </p>

          {/* Stats */}
          <div className="stats-row" style={{ display:'flex', gap:44, justifyContent:'center', marginTop:52, flexWrap:'wrap', animation:'fadeUp .6s ease both .45s' }}>
            {[['6','محاور تقييم'],['100%','مقابلات مكتملة'],['2','لغة · عربي وإنجليزي'],['39 ريال','CV احترافي']].map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div className="stat-num">{s[0]}</div>
                <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>{s[1]}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ كيف تعمل ══ */}
        <section className="section-pad" style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
          <div style={{ maxWidth:1060, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:10 }}>كيف تعمل</p>
              <h2 style={{ fontSize:'clamp(20px,3.5vw,36px)', fontWeight:800, color:'#f8f5ef' }}>3 خطوات — ملف احترافي جاهز</h2>
            </div>
            <div className="steps-grid" style={{ background:'var(--border)' }}>
              {[
                { num:'01', icon:'🎙️', title:'مقابلة ذكية', desc:'الذكاء الاصطناعي يسألك عن خبراتك وإنجازاتك في 6 محاور — مثل مقابلة حقيقية مع متخصص HR.' },
                { num:'02', icon:'✨', title:'ملف احترافي', desc:'يحوّل إجاباتك لملف مرشح شامل بالعربي والإنجليزي — مع تقييم موضوعي من 100.' },
                { num:'03', icon:'📄', title:'CV جاهز للتقديم', desc:'احصل على سيرتك بصيغة PDF و Word بتصميم احترافي — قابل للتحميل فوراً.' },
              ].map(c => (
                <div key={c.num} style={{ background:'var(--surface)', padding:'34px 26px' }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:46, fontWeight:300, color:'var(--gold)', opacity:.18, lineHeight:1, marginBottom:18 }}>{c.num}</div>
                  <div style={{ fontSize:26, marginBottom:12 }}>{c.icon}</div>
                  <div style={{ fontSize:15, fontWeight:700, color:'#f8f5ef', marginBottom:8 }}>{c.title}</div>
                  <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.8 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ الأدوات ══ */}
        <section className="section-pad">
          <div style={{ maxWidth:1060, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:44 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:10 }}>خدماتنا</p>
              <h2 style={{ fontSize:'clamp(20px,3.5vw,36px)', fontWeight:800, color:'#f8f5ef' }}>كل ما تحتاجه في مكان واحد</h2>
            </div>
            <div className="tools-grid">
              {[
                {
                  icon:'🎙️',
                  tag:'مجاني',
                  tagColor:'var(--success)',
                  title:'مقابلة ذكية',
                  desc:'6 محاور تقييم — خبرة، إنجازات، شخصية، مهارات، توقعات، ملاءمة. نتيجة فورية وملف جاهز.',
                  link:'/auth/login',
                  btn:'ابدأ المقابلة'
                },
                {
                  icon:'📊',
                  tag:'19 ريال',
                  tagColor:'var(--gold)',
                  title:'تحليل السيرة الذاتية',
                  desc:'ارفع سيرتك الذاتية والذكاء الاصطناعي يحللها — نقاط قوة وضعف + نسخة محسّنة جاهزة.',
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

        {/* ══ مقارنة ══ */}
        <section className="section-pad" style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
          <div style={{ maxWidth:800, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:40 }}>
              <h2 style={{ fontSize:'clamp(20px,3.5vw,34px)', fontWeight:800, color:'#f8f5ef' }}>نخبة مقابل الطريقة التقليدية</h2>
            </div>
            <div className="comp-grid">
              <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'26px 22px' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--muted)', marginBottom:16, textAlign:'center' }}>الطريقة التقليدية 😓</div>
                {['CV جامد لا يكشف شخصيتك','لا تعرف نقاط قوتك وضعفك','تقديم أعمى بدون تقييم','انتظار طويل بدون رد','فرص تضيع بسبب CV ضعيف'].map(i => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:10, fontSize:13, color:'var(--muted)' }}>
                    <span style={{ color:'var(--error)', flexShrink:0 }}>✗</span>{i}
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(200,160,74,.04)', border:'1px solid rgba(200,160,74,.22)', borderRadius:14, padding:'26px 22px' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--gold)', marginBottom:16, textAlign:'center' }}>مع نخبة ✨</div>
                {['مقابلة تكشف قيمتك الحقيقية','تقييم موضوعي من 100','ملف مهني عربي وإنجليزي','تواصل مباشر من الشركات','CV احترافي جاهز للتقديم'].map(i => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:10, fontSize:13, color:'var(--text)' }}>
                    <span style={{ color:'var(--success)', flexShrink:0 }}>✓</span>{i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="section-pad" style={{ textAlign:'center' }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:14 }}>ابدأ الآن</p>
          <h2 style={{ fontSize:'clamp(24px,4.5vw,46px)', fontWeight:800, color:'#f8f5ef', marginBottom:14, lineHeight:1.1 }}>
            جاهز تنطلق؟<br/>
            <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              المقابلة مجانية — ابدأ الآن.
            </span>
          </h2>
          <p style={{ fontSize:14, color:'var(--muted)', maxWidth:400, margin:'0 auto 36px', lineHeight:1.85 }}>
            مقابلة واحدة تكشف قيمتك وتبني ملفك — مجاناً وبدون أي التزام.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/auth/login" style={{ padding:'13px 32px', borderRadius:10, fontSize:14, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>
              ابدأ مقابلتك المجانية
            </Link>
            <Link href="/analyze-cv" style={{ padding:'13px 32px', borderRadius:10, fontSize:14, fontWeight:700, border:'1px solid var(--border)', color:'var(--muted)', background:'transparent', textDecoration:'none' }}>
              حلّل سيرتي الذاتية
            </Link>
          </div>
        </section>

      </main>

      {/* ══ FOOTER ══ */}
      <footer style={{ padding:'28px 36px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
          <span style={{ fontSize:16, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</span>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:9, letterSpacing:4, color:'var(--muted)', textTransform:'uppercase' }}>Nukhba</span>
        </div>
        <p style={{ fontSize:11, color:'var(--muted)' }}>© {new Date().getFullYear()} نخبة. جميع الحقوق محفوظة.</p>
        <div style={{ display:'flex', gap:18, flexWrap:'wrap' }}>
          {[['للشركات','/for-companies'],['سياسة الخصوصية','/privacy'],['الشروط','/terms'],['تواصل معنا','/contact']].map(([l,h]) => (
            <Link key={h} href={h} style={{ fontSize:11, color:'var(--muted)', textDecoration:'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </>
  )
}