import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes rotate{to{transform:translate(-50%,-50%) rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .cv-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .how-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2px}
        .hero-sec{padding:100px 24px 80px}
        .section-pad{padding:100px 40px}
        .footer-wrap{padding:36px 40px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
        @media(max-width:700px){
          .cv-grid{grid-template-columns:1fr!important;gap:32px!important}
          .cv-mock{display:none!important}
          .hero-sec{padding:80px 20px 60px!important}
          .section-pad{padding:60px 20px!important}
          .footer-wrap{flex-direction:column;align-items:center;text-align:center;padding:28px 20px!important;gap:12px!important}
          .footer-links{flex-wrap:wrap;justify-content:center;gap:16px!important}
          .stats-row{gap:28px!important}
          .hero-desc{font-size:15px!important}
        }
      `}</style>
      <Navbar />
      <main>

        {/* HERO */}
        <section className="hero-sec" style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-60%)', width:700, height:700, background:'radial-gradient(ellipse,rgba(200,160,74,.07) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:560, height:560, border:'1px solid rgba(200,160,74,.07)', borderRadius:'50%', animation:'rotate 40s linear infinite' }}/>

          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:6, color:'var(--gold)', textTransform:'uppercase', marginBottom:28, animation:'fadeUp .8s ease .1s both' }}>AI · Talent · Platform</p>

          <h1 style={{ fontSize:'clamp(40px,8vw,88px)', fontWeight:800, lineHeight:1.05, color:'#f8f5ef', marginBottom:12, animation:'fadeUp .8s ease .25s both' }}>
            التوظيف<br/>
            <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>بذكاء حقيقي</span>
          </h1>

          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(15px,2.5vw,24px)', fontWeight:300, fontStyle:'italic', color:'var(--muted)', marginBottom:28, animation:'fadeUp .8s ease .35s both' }}>Where talent meets opportunity</p>

          <p className="hero-desc" style={{ maxWidth:500, fontSize:16, color:'var(--muted)', lineHeight:1.8, marginBottom:44, animation:'fadeUp .8s ease .45s both' }}>
            لا CV جامد — بل محادثة ذكية تكشف قيمتك الحقيقية.<br/>
            نخبة تربط أفضل المرشحين بأفضل الشركات.
          </p>

          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', animation:'fadeUp .8s ease .55s both' }}>
            <Link href="/auth/login" style={{ padding:'13px 32px', borderRadius:10, fontSize:15, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>ابدأ مقابلتك الذكية</Link>
            <Link href="/for-companies" style={{ padding:'13px 32px', borderRadius:10, fontSize:15, fontWeight:700, border:'1px solid var(--border)', color:'var(--muted)', background:'transparent', textDecoration:'none' }}>للشركات</Link>
          </div>

          <div className="stats-row" style={{ display:'flex', gap:48, justifyContent:'center', marginTop:64, flexWrap:'wrap', animation:'fadeUp .8s ease .7s both' }}>
            {[{ num:'٦', label:'محاور تقييم عميقة' }, { num:'٢', label:'لغة · عربي وإنجليزي' }, { num:'٣٩', label:'ريال · CV احترافي' }].map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:600, color:'var(--gold)' }}>{s.num}</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section-pad" style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:12 }}>كيف يعمل · How it works</p>
            <h2 style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:800, color:'#f8f5ef' }}>ثلاث خطوات — ملف احترافي كامل</h2>
          </div>
          <div className="how-grid" style={{ background:'var(--border)', borderRadius:16, overflow:'hidden' }}>
            {[
              { num:'01', icon:'🎙️', title:'المقابلة الذكية', desc:'الذكاء الاصطناعي يسألك بعمق عن خبراتك وإنجازاتك — مثل مقابلة حقيقية مع متخصص HR.' },
              { num:'02', icon:'✨', title:'الملف الذكي', desc:'يحوّل إجاباتك إلى ملف مرشح احترافي شامل يُرسل للشركات المناسبة تلقائياً.' },
              { num:'03', icon:'📄', title:'CV جاهز', desc:'احصل على سيرتك بصيغة PDF و Word بتصميم احترافي جاهز للتقديم الفوري.' },
            ].map(c => (
              <div key={c.num} style={{ background:'var(--surface)', padding:'32px 24px' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:44, fontWeight:300, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', opacity:.4, lineHeight:1, marginBottom:18 }}>{c.num}</div>
                <div style={{ fontSize:24, marginBottom:12 }}>{c.icon}</div>
                <div style={{ fontSize:16, fontWeight:700, color:'#f8f5ef', marginBottom:8 }}>{c.title}</div>
                <div style={{ fontSize:14, color:'var(--muted)', lineHeight:1.8 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CV FEATURE */}
        <section className="section-pad" style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
          <div className="cv-grid" style={{ maxWidth:1100, margin:'0 auto' }}>
            {/* Left — text */}
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(200,160,74,.1)', border:'1px solid rgba(200,160,74,.3)', padding:'5px 14px', borderRadius:20, fontSize:12, color:'var(--gold)', marginBottom:24 }}>⭐ ميزة حصرية</div>
              <h2 style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:800, color:'#f8f5ef', lineHeight:1.2 }}>سيرتك الذاتية<br/>بلمسة احترافية</h2>
              <p style={{ fontSize:15, color:'var(--muted)', marginTop:16, lineHeight:1.8 }}>
                بعد انتهاء مقابلتك، احصل على CV مكتوب باحترافية بتصميم أنيق — جاهز للتقديم الفوري بدون أي جهد إضافي.
              </p>
              <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:28, marginTop:24 }}>
                <div style={{ fontSize:13, color:'var(--muted)', marginBottom:8 }}>دفعة واحدة · One-time</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:48, fontWeight:600, color:'var(--gold)', lineHeight:1 }}>
                  <sup style={{ fontSize:20, verticalAlign:'super' }}>ر.س</sup>39
                </div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:6 }}>PDF + Word · عربي + English</div>
                <Link href="/auth/login" style={{ display:'flex', alignItems:'center', justifyContent:'center', marginTop:18, padding:'13px 24px', borderRadius:10, fontSize:15, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>
                  ابدأ واحصل على CV
                </Link>
              </div>
            </div>

            {/* Right — mock CV */}
            <div className="cv-mock" style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:28, boxShadow:'0 40px 80px rgba(0,0,0,.4)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20, paddingBottom:18, borderBottom:'1px solid var(--border)' }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#7a5e28,#c8a04a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, color:'#06060e' }}>م</div>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:'var(--text)' }}>محمد العتيبي</div>
                  <div style={{ fontSize:12, color:'var(--gold)', marginTop:2 }}>مدير مستودعات · Warehouse Manager</div>
                </div>
              </div>
              {['الملخص المهني','الخبرات','الإنجازات'].map(sec => (
                <div key={sec}>
                  <div style={{ fontSize:9, letterSpacing:3, color:'var(--gold)', textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", margin:'16px 0 8px' }}>{sec}</div>
                  {[90,75,60].map((w,i) => <div key={i} style={{ height:7, borderRadius:4, background:'var(--surface)', width:`${w}%`, marginBottom:7 }}/>)}
                </div>
              ))}
              <div style={{ display:'flex', gap:7, marginTop:14, flexWrap:'wrap' }}>
                {['إدارة المخزون','Odoo','لوجستيك'].map(s => (
                  <span key={s} style={{ padding:'4px 12px', borderRadius:20, fontSize:11, background:'var(--surface)', border:'1px solid var(--border)', color:'var(--muted)' }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-pad" style={{ textAlign:'center' }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:14 }}>ابدأ الآن</p>
          <h2 style={{ fontSize:'clamp(26px,4vw,44px)', fontWeight:800, color:'#f8f5ef', marginBottom:14 }}>وظيفتك المثالية<br/>تبدأ بمحادثة</h2>
          <p style={{ fontSize:15, color:'var(--muted)', maxWidth:400, margin:'0 auto 36px', lineHeight:1.8 }}>انضم إلى نخبة — المنصة التي تُقدّمك كما أنت، لا كما تبدو على ورقة.</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/auth/login" style={{ padding:'13px 32px', borderRadius:10, fontSize:15, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>ابدأ مقابلتك المجانية</Link>
            <Link href="/for-companies" style={{ padding:'13px 32px', borderRadius:10, fontSize:15, fontWeight:700, border:'1px solid var(--border)', color:'var(--muted)', background:'transparent', textDecoration:'none' }}>للشركات</Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer-wrap" style={{ borderTop:'1px solid var(--border)' }}>
          <div style={{ fontSize:18, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة · Nukhba</div>
          <p style={{ fontSize:12, color:'var(--muted)' }}>© 2025 نخبة. جميع الحقوق محفوظة.</p>
          <div className="footer-links" style={{ display:'flex', gap:24 }}>
            {[['سياسة الخصوصية','/privacy'],['الشروط','/terms'],['تواصل معنا','/contact']].map(([l,href]) => (
              <Link key={l} href={href} style={{ fontSize:13, color:'var(--muted)', textDecoration:'none' }}>{l}</Link>
            ))}
          </div>
        </footer>
      </main>
    </>
  )
}