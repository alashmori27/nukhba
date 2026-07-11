import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>

        {/* ── HERO ── */}
        <section style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '100px 24px 80px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Glow */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-60%)',
            width: 700, height: 700,
            background: 'radial-gradient(ellipse,rgba(200,160,74,.07) 0%,transparent 70%)',
            pointerEvents: 'none',
          }}/>

          {/* Ring */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 560, height: 560,
            border: '1px solid rgba(200,160,74,.07)',
            borderRadius: '50%',
            animation: 'rotate 40s linear infinite',
          }}/>

          <p style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 12, letterSpacing: 6, color: 'var(--gold)',
            textTransform: 'uppercase', marginBottom: 28,
            animation: 'fadeUp .8s ease .1s both',
          }}>AI · Talent · Platform</p>

          <h1 style={{
            fontSize: 'clamp(44px,8vw,88px)', fontWeight: 800,
            lineHeight: 1.05, color: '#f8f5ef', marginBottom: 12,
            animation: 'fadeUp .8s ease .25s both',
          }}>
            التوظيف<br/>
            <span style={{
              background: 'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>بذكاء حقيقي</span>
          </h1>

          <p style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(16px,2.5vw,24px)', fontWeight: 300, fontStyle: 'italic',
            color: 'var(--muted)', marginBottom: 32,
            animation: 'fadeUp .8s ease .35s both',
          }}>Where talent meets opportunity</p>

          <p style={{
            maxWidth: 520, fontSize: 17, color: 'var(--muted)', lineHeight: 1.8,
            marginBottom: 48, animation: 'fadeUp .8s ease .45s both',
          }}>
            لا CV جامد — بل محادثة ذكية تكشف قيمتك الحقيقية.<br/>
            نخبة تربط أفضل المرشحين بأفضل الشركات.
          </p>

          <div style={{
            display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap',
            animation: 'fadeUp .8s ease .55s both',
          }}>
            <Link href="/interview" style={{
              padding: '14px 36px', borderRadius: 10, fontSize: 16, fontWeight: 700,
              background: 'linear-gradient(135deg,#7a5e28,#c8a04a)', color: '#06060e',
            }}>ابدأ مقابلتك الذكية</Link>
            <Link href="/companies" style={{
              padding: '14px 36px', borderRadius: 10, fontSize: 16, fontWeight: 700,
              border: '1px solid var(--border)', color: 'var(--muted)', background: 'transparent',
            }}>للشركات</Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: 48, justifyContent: 'center', marginTop: 72, flexWrap: 'wrap',
            animation: 'fadeUp .8s ease .7s both',
          }}>
            {[
              { num: '٦', label: 'محاور تقييم عميقة' },
              { num: '٢', label: 'لغة · عربي وإنجليزي' },
              { num: '٣٩', label: 'ريال · CV احترافي' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 36, fontWeight: 600, color: 'var(--gold)',
                }}>{s.num}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: '100px 40px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:12 }}>كيف يعمل · How it works</p>
            <h2 style={{ fontSize:'clamp(26px,4vw,40px)', fontWeight:800, color:'#f8f5ef' }}>ثلاث خطوات — ملف احترافي كامل</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:2, background:'var(--border)', borderRadius:16, overflow:'hidden' }}>
            {[
              { num:'01', icon:'🎙️', title:'المقابلة الذكية', desc:'الذكاء الاصطناعي يسألك بعمق عن خبراتك وإنجازاتك — مثل مقابلة حقيقية مع متخصص HR.' },
              { num:'02', icon:'✨', title:'الملف الذكي',    desc:'يحوّل إجاباتك إلى ملف مرشح احترافي شامل يُرسل للشركات المناسبة تلقائياً.' },
              { num:'03', icon:'📄', title:'CV جاهز',        desc:'احصل على سيرتك بصيغة PDF و Word بتصميم احترافي جاهز للتقديم الفوري.' },
            ].map(c => (
              <div key={c.num} style={{ background:'var(--surface)', padding:'36px 28px' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:48, fontWeight:300, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', opacity:.4, lineHeight:1, marginBottom:20 }}>{c.num}</div>
                <div style={{ fontSize:26, marginBottom:14 }}>{c.icon}</div>
                <div style={{ fontSize:17, fontWeight:700, color:'#f8f5ef', marginBottom:10 }}>{c.title}</div>
                <div style={{ fontSize:14, color:'var(--muted)', lineHeight:1.8 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CV FEATURE ── */}
        <section style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', padding:'100px 40px' }}>
          <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(200,160,74,.1)', border:'1px solid rgba(200,160,74,.3)', padding:'5px 14px', borderRadius:20, fontSize:12, color:'var(--gold)', marginBottom:24 }}>
                ⭐ ميزة حصرية
              </div>
              <h2 style={{ fontSize:'clamp(26px,4vw,40px)', fontWeight:800, color:'#f8f5ef', lineHeight:1.2 }}>سيرتك الذاتية<br/>بلمسة احترافية</h2>
              <p style={{ fontSize:15, color:'var(--muted)', marginTop:16, lineHeight:1.8 }}>
                بعد انتهاء مقابلتك، احصل على CV مكتوب باحترافية بتصميم أنيق — جاهز للتقديم الفوري بدون أي جهد إضافي.
              </p>
              <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:28, marginTop:28 }}>
                <div style={{ fontSize:13, color:'var(--muted)', marginBottom:8 }}>دفعة واحدة · One-time</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:48, fontWeight:600, color:'var(--gold)', lineHeight:1 }}>
                  <sup style={{ fontSize:20, verticalAlign:'super' }}>ر.س</sup>39
                </div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:6 }}>PDF + Word · عربي + English</div>
                <Link href="/interview" style={{
                  display:'flex', alignItems:'center', justifyContent:'center',
                  marginTop:20, padding:'13px 24px', borderRadius:10, fontSize:15, fontWeight:700,
                  background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e',
                }}>ابدأ واحصل على CV</Link>
              </div>
            </div>

            {/* Mock CV */}
            <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:28, boxShadow:'0 40px 80px rgba(0,0,0,.4)' }}>
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

        {/* ── CTA ── */}
        <section style={{ padding:'100px 40px', textAlign:'center' }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:14 }}>ابدأ الآن</p>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:800, color:'#f8f5ef', marginBottom:14 }}>وظيفتك المثالية<br/>تبدأ بمحادثة</h2>
          <p style={{ fontSize:16, color:'var(--muted)', maxWidth:400, margin:'0 auto 40px', lineHeight:1.8 }}>انضم إلى نخبة — المنصة التي تُقدّمك كما أنت، لا كما تبدو على ورقة.</p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/interview" style={{ padding:'14px 36px', borderRadius:10, fontSize:16, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e' }}>ابدأ مقابلتك المجانية</Link>
            <Link href="/companies" style={{ padding:'14px 36px', borderRadius:10, fontSize:16, fontWeight:700, border:'1px solid var(--border)', color:'var(--muted)', background:'transparent' }}>للشركات</Link>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ padding:'36px 40px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div style={{ fontSize:18, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة · Nukhba</div>
          <p style={{ fontSize:12, color:'var(--muted)' }}>© 2025 نخبة. جميع الحقوق محفوظة.</p>
          <div style={{ display:'flex', gap:24 }}>
            {[['سياسة الخصوصية','/privacy'],['الشروط','/terms'],['تواصل معنا','/contact']].map(([l,href]) => (
              <Link key={l} href={href} style={{ fontSize:13, color:'var(--muted)', textDecoration:'none' }}>{l}</Link>
            ))}
          </div>
        </footer>
      </main>
    </>
  )
}