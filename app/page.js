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

        .hero-title  { font-size: clamp(38px, 6.5vw, 76px); }
        .steps-grid  { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; border-radius: 16px; overflow: hidden; }
        .tools-grid  { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .comp-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .value-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .section-pad { padding: 88px 40px; }
        .stat-num    { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:600; color:var(--gold); line-height:1; }

        @media(max-width:768px){
          .steps-grid  { grid-template-columns: 1fr; gap: 2px; }
          .tools-grid  { grid-template-columns: 1fr; gap: 12px; }
          .comp-grid   { grid-template-columns: 1fr; }
          .value-grid  { grid-template-columns: 1fr; }
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
            مقابلة واحدة<br/>
            <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              CV + وظيفة معاً
            </span>
          </h1>

          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(15px,2vw,20px)', fontWeight:300, fontStyle:'italic', color:'var(--muted)', marginBottom:20, animation:'fadeUp .6s ease both .2s' }}>
            لا CV جامد — بل محادثة ذكية تُظهر من أنت حقاً
          </p>

          {/* القيمة المزدوجة */}
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginBottom:36, animation:'fadeUp .6s ease both .25s' }}>
            {[
              { icon:'📄', text:'CV احترافي عربي وإنجليزي', color:'var(--gold)' },
              { icon:'🏢', text:'تقديم وظيفتك للشركات', color:'var(--success)' },
            ].map(v => (
              <div key={v.text} style={{ display:'flex', alignItems:'center', gap:7, background:`${v.color}0f`, border:`1px solid ${v.color}33`, padding:'8px 16px', borderRadius:10 }}>
                <span style={{ fontSize:16 }}>{v.icon}</span>
                <span style={{ fontSize:13, fontWeight:600, color:v.color }}>{v.text}</span>
              </div>
            ))}
          </div>

          <p style={{ maxWidth:480, fontSize:14, color:'var(--muted)', lineHeight:1.85, marginBottom:16, animation:'fadeUp .6s ease both .3s' }}>
            أجرِ مقابلة ذكية مجانية — وبدفعة واحدة فقط <strong style={{ color:'var(--gold)' }}>39 ريال</strong> تحصل على سيرتك الذاتية الاحترافية ويُنشر ملفك للشركات المناسبة تلقائياً.
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
            ✓ المقابلة مجانية تماماً · لا بطاقة ائتمان
          </p>

          {/* Stats */}
          <div className="stats-row" style={{ display:'flex', gap:44, justifyContent:'center', marginTop:52, flexWrap:'wrap', animation:'fadeUp .6s ease both .45s' }}>
            {[['6','محاور تقييم'],['100%','مقابلات مكتملة'],['2','لغة عربي وإنجليزي'],['39','ريال فقط']].map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div className="stat-num">{s[0]}</div>
                <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>{s[1]}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ القيمة المزدوجة ══ */}
        <section className="section-pad" style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
          <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center' }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:10 }}>بدفعة واحدة فقط</p>
            <h2 style={{ fontSize:'clamp(20px,3.5vw,36px)', fontWeight:800, color:'#f8f5ef', marginBottom:12 }}>39 ريال = CV + وظيفة</h2>
            <p style={{ fontSize:14, color:'var(--muted)', marginBottom:36, maxWidth:500, margin:'0 auto 36px' }}>
              بعد انتهاء مقابلتك المجانية — ادفع مرة واحدة واحصل على الاثنين معاً
            </p>
            <div className="value-grid" style={{ maxWidth:660, margin:'0 auto' }}>
              <div style={{ background:'var(--card)', border:'2px solid var(--gold)', borderRadius:16, padding:'28px 22px', textAlign:'right' }}>
                <div style={{ fontSize:32, marginBottom:12 }}>📄</div>
                <div style={{ fontSize:16, fontWeight:800, color:'#f8f5ef', marginBottom:8 }}>CV احترافي</div>
                <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.75 }}>
                  سيرة ذاتية عربية وإنجليزية بتصميم احترافي — PDF و Word جاهزين للتحميل والتقديم الفوري.
                </div>
              </div>
              <div style={{ background:'var(--card)', border:'2px solid var(--success)', borderRadius:16, padding:'28px 22px', textAlign:'right' }}>
                <div style={{ fontSize:32, marginBottom:12 }}>🏢</div>
                <div style={{ fontSize:16, fontWeight:800, color:'#f8f5ef', marginBottom:8 }}>نشر للشركات</div>
                <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.75 }}>
                  ملفك يُنشر تلقائياً للشركات المناسبة في المنصة — تواصل مباشر بدون وسيط.
                </div>
              </div>
            </div>
            <div style={{ marginTop:28 }}>
              <Link href="/auth/login" style={{ display:'inline-flex', padding:'13px 32px', borderRadius:10, fontSize:15, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>
                ابدأ مجاناً — ادفع بعد المقابلة ←
              </Link>
              <p style={{ fontSize:12, color:'var(--muted)', marginTop:10 }}>المقابلة مجانية · الدفع بعد انتهائها فقط</p>
            </div>
          </div>
        </section>

        {/* ══ كيف تعمل ══ */}
        <section className="section-pad">
          <div style={{ maxWidth:1060, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:10 }}>كيف تعمل</p>
              <h2 style={{ fontSize:'clamp(20px,3.5vw,36px)', fontWeight:800, color:'#f8f5ef' }}>3 خطوات — CV ووظيفة</h2>
            </div>
            <div className="steps-grid" style={{ background:'var(--border)' }}>
              {[
                { num:'01', icon:'🎙️', title:'مقابلة ذكية مجانية', desc:'الذكاء الاصطناعي يسألك في 6 محاور — خبرة، إنجازات، شخصية، مهارات، توقعات، ملاءمة.' },
                { num:'02', icon:'💳', title:'دفعة واحدة 39 ريال', desc:'بعد المقابلة ادفع مرة واحدة فقط وتحصل على CV احترافي + نشر ملفك للشركات.' },
                { num:'03', icon:'🚀', title:'CV + تواصل الشركات', desc:'حمّل سيرتك الذاتية وانتظر تواصل الشركات مباشرة — بدون وسيط.' },
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

        {/* ══ خدمات إضافية ══ */}
        <section className="section-pad" style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
          <div style={{ maxWidth:1060, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:44 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:10 }}>خدمات إضافية</p>
              <h2 style={{ fontSize:'clamp(20px,3.5vw,36px)', fontWeight:800, color:'#f8f5ef' }}>تحسين سيرتك الذاتية الحالية</h2>
            </div>
            <div style={{ maxWidth:520, margin:'0 auto', background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:32, textAlign:'center' }}>
              <div style={{ fontSize:36, marginBottom:14 }}>📊</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(200,160,74,.1)', border:'1px solid rgba(200,160,74,.25)', padding:'4px 12px', borderRadius:20, fontSize:11, color:'var(--gold)', fontWeight:700, marginBottom:14 }}>19 ريال</div>
              <div style={{ fontSize:17, fontWeight:800, color:'#f8f5ef', marginBottom:10 }}>تحليل السيرة الذاتية</div>
              <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.8, marginBottom:22 }}>
                ارفع سيرتك الحالية وسيحللها الذكاء الاصطناعي — نقاط القوة والضعف + توصيات + نسخة محسّنة جاهزة.
              </div>
              <Link href="/analyze-cv" style={{ display:'inline-flex', padding:'11px 26px', borderRadius:10, fontSize:14, fontWeight:700, border:'1px solid var(--gold)', color:'var(--gold)', background:'transparent', textDecoration:'none' }}>
                حلّل سيرتي الذاتية ←
              </Link>
            </div>
          </div>
        </section>

        {/* ══ مقارنة ══ */}
        <section className="section-pad">
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
                {['مقابلة تكشف قيمتك الحقيقية','تقييم موضوعي من 100','CV + نشر وظيفتك بدفعة واحدة','تواصل مباشر من الشركات','ملف مهني عربي وإنجليزي'].map(i => (
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
          <h2 style={{ fontSize:'clamp(24px,4.5vw,46px)', fontWeight:800, color:'#f8f5ef', marginBottom:14, lineHeight:1.1 }}>
            المقابلة مجانية.<br/>
            <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              CV + وظيفة بـ 39 ريال.
            </span>
          </h2>
          <p style={{ fontSize:14, color:'var(--muted)', maxWidth:420, margin:'0 auto 36px', lineHeight:1.85 }}>
            ابدأ مقابلتك مجاناً — وبعد انتهائها قرر إذا تبي CV + نشر وظيفتك.
          </p>
          <Link href="/auth/login" style={{ display:'inline-flex', padding:'14px 36px', borderRadius:10, fontSize:15, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>
            ابدأ مقابلتك المجانية ←
          </Link>
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