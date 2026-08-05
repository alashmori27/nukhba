'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { LogoIcon, LogoText } from '@/components/brand'
import { useState } from 'react'

export default function Home() {
  const [copied, setCopied] = useState(false)

  function copyLinkedIn(text) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow   { 0%,100%{opacity:.06} 50%{opacity:.13} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        .hero-title  { font-size: clamp(32px, 5.5vw, 66px); }
        .steps-grid  { display: grid; grid-template-columns: repeat(5,1fr); gap: 0; }
        .comp-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .value-grid  { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
        .section-pad { padding: 88px 40px; }
        .stat-num    { font-family:'Cormorant Garamond',serif; font-size:38px; font-weight:600; color:var(--gold); line-height:1; }
        .cta-btn     { display:inline-flex; align-items:center; padding:15px 38px; border-radius:10px; font-size:15px; font-weight:800; background:linear-gradient(135deg,#7a5e28,#c8a04a); color:#06060e; text-decoration:none; transition:transform .2s; }
        .cta-btn:hover { transform:translateY(-2px); }

        @media(max-width:768px){
          .steps-grid  { grid-template-columns: 1fr; }
          .comp-grid   { grid-template-columns: 1fr; }
          .value-grid  { grid-template-columns: 1fr; }
          .section-pad { padding: 56px 18px !important; }
          .stats-row   { gap: 24px !important; }
          .hide-sm     { display: none !important; }
          .hero-title  { font-size: 32px !important; }
        }
      `}</style>

      <Navbar />

      <main>

        {/* ══ HERO ══ */}
        <section style={{ minHeight:'96vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'80px 20px 56px', position:'relative', overflow:'hidden' }}>

          <div style={{ position:'absolute', top:'42%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:800, background:'radial-gradient(ellipse,rgba(200,160,74,.06) 0%,transparent 65%)', pointerEvents:'none', animation:'glow 5s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', top:'42%', left:'50%', transform:'translate(-50%,-50%)', width:500, height:500, border:'1px solid rgba(200,160,74,.04)', borderRadius:'50%', animation:'float 9s ease-in-out infinite', pointerEvents:'none' }}/>

          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(200,160,74,.06)', border:'1px solid rgba(200,160,74,.18)', padding:'6px 18px', borderRadius:22, fontSize:10, color:'var(--gold)', marginBottom:28, fontFamily:"'Cormorant Garamond',serif", letterSpacing:5, textTransform:'uppercase', animation:'fadeUp .6s ease both' }}>
            ✦ منصة التوظيف الذكي · Saudi Arabia
          </div>

          <h1 className="hero-title" style={{ fontWeight:800, lineHeight:1.15, color:'#f8f5ef', marginBottom:20, animation:'fadeUp .6s ease both .1s', maxWidth:800 }}>
            وظيفتك لا تبدأ بـ CV<br/>
            <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              بل بملف مهني يرى فيه كل صاحب عمل قيمتك
            </span>
          </h1>

          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(15px,2vw,20px)', fontWeight:300, fontStyle:'italic', color:'var(--muted)', marginBottom:14, animation:'fadeUp .6s ease both .15s', maxWidth:560 }}>
            ابدأ بمقابلة مجانية مع الذكاء الاصطناعي
          </p>

          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginBottom:28, animation:'fadeUp .6s ease both .2s' }}>
            {[
              { icon:'✓', text:'CV احترافي عربي وإنجليزي', color:'var(--gold)' },
              { icon:'✓', text:'نشر ملفك للشركات تلقائياً', color:'var(--success)' },
              { icon:'✓', text:'محتوى LinkedIn جاهز', color:'#0077b5' },
              { icon:'✓', text:'تحليل نقاط القوة', color:'var(--gold)' },
            ].map(v => (
              <div key={v.text} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:v.color, fontWeight:600 }}>
                <span style={{ fontWeight:800 }}>{v.icon}</span>{v.text}
              </div>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, animation:'fadeUp .6s ease both .25s' }}>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/auth/login" className="cta-btn">ابدأ مقابلتك المجانية ←</Link>
              <Link href="/analyze-cv" style={{ padding:'15px 38px', borderRadius:10, fontSize:15, fontWeight:700, border:'1px solid var(--border)', color:'var(--muted)', background:'transparent', textDecoration:'none' }}>
                حلّل سيرتي الذاتية
              </Link>
            </div>
            <p style={{ fontSize:12, color:'var(--muted)', marginTop:4 }}>
              ✓ المقابلة مجانية تماماً · لن تدفع شيئاً حتى ترى النتيجة
            </p>
          </div>

          <div className="stats-row" style={{ display:'flex', gap:44, justifyContent:'center', marginTop:56, flexWrap:'wrap', animation:'fadeUp .6s ease both .3s' }}>
            {[['6','محاور تقييم'],['39','ريال فقط'],['2','لغة للـ CV'],['100%','مقابلات مكتملة']].map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div className="stat-num">{s[0]}</div>
                <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>{s[1]}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ كيف تعمل ══ */}
        <section className="section-pad" style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:10 }}>كيف تعمل نخبة؟</p>
              <h2 style={{ fontSize:'clamp(20px,3.5vw,36px)', fontWeight:800, color:'#f8f5ef', marginBottom:10 }}>5 خطوات — من الصفر إلى وظيفة</h2>
              <p style={{ fontSize:14, color:'var(--muted)' }}>بدلاً من إرسال مئات الطلبات يدوياً</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:2, borderRadius:16, overflow:'hidden', background:'var(--border)' }}>
              {[
                { num:'01', icon:'🎙️', title:'مقابلة مجانية', desc:'يتحدث معك الذكاء الاصطناعي ويكتشف خبراتك وشخصيتك.' },
                { num:'02', icon:'🧠', title:'تحليل مهاراتك', desc:'تحليل حقيقي لنقاط القوة والضعف وتقييم موضوعي من 100.' },
                { num:'03', icon:'📄', title:'إنشاء ملفك', desc:'CV عربي وإنجليزي + محتوى LinkedIn جاهز بنقرة واحدة.' },
                { num:'04', icon:'🏢', title:'نشر ملفك', desc:'ملفك يصل للشركات المناسبة — بدون أي تقديم يدوي.' },
                { num:'05', icon:'🚀', title:'استقبال الفرص', desc:'الشركات تتواصل معك مباشرة. أنت تختار، لا تنتظر.' },
              ].map((c,i) => (
                <div key={c.num} style={{ background:'var(--surface)', padding:'28px 18px', position:'relative' }}>
                  {i < 4 && <div className="hide-sm" style={{ position:'absolute', top:'50%', right:-1, transform:'translateY(-50%)', color:'var(--border)', fontSize:18, zIndex:1 }}>›</div>}
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:300, color:'var(--gold)', opacity:.15, lineHeight:1, marginBottom:12 }}>{c.num}</div>
                  <div style={{ fontSize:22, marginBottom:10 }}>{c.icon}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#f8f5ef', marginBottom:6 }}>{c.title}</div>
                  <div style={{ fontSize:11, color:'var(--muted)', lineHeight:1.75 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ القيمة ══ */}
        <section className="section-pad">
          <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:10 }}>القيمة الكاملة</p>
            <h2 style={{ fontSize:'clamp(20px,3.5vw,36px)', fontWeight:800, color:'#f8f5ef', marginBottom:8 }}>لماذا 39 ريال فقط؟</h2>
            <p style={{ fontSize:14, color:'var(--muted)', marginBottom:12 }}>لأننا لا نبيع سيرة ذاتية. نبني ملفاً مهنياً كاملاً.</p>
            <p style={{ fontSize:13, color:'var(--muted)', marginBottom:36 }}>
              <strong style={{ color:'var(--gold)' }}>ابدأ مجاناً</strong> → شاهد النتيجة → إذا أعجبتك → احصل على الملف الكامل مقابل 39 ريال
            </p>
            <div className="value-grid" style={{ maxWidth:800, margin:'0 auto 36px' }}>
              {[
                { icon:'📄', color:'var(--gold)', title:'CV احترافي', desc:'عربي وإنجليزي — PDF و Word جاهزان للتحميل والتقديم الفوري.' },
                { icon:'🏢', color:'var(--success)', title:'نشر للشركات', desc:'ملفك يصل للشركات في المنصة — تواصل مباشر بدون وسيط.' },
                { icon:'💼', color:'#0077b5', title:'محتوى LinkedIn', desc:'عنوان احترافي، نبذة مميزة، وإنجازات موثّقة — جاهز للصق.' },
              ].map(c => (
                <div key={c.title} style={{ background:'var(--card)', border:`1px solid ${c.color}33`, borderRadius:14, padding:'24px 18px', textAlign:'right' }}>
                  <div style={{ fontSize:28, marginBottom:10 }}>{c.icon}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#f8f5ef', marginBottom:6 }}>{c.title}</div>
                  <div style={{ fontSize:12, color:'var(--muted)', lineHeight:1.75 }}>{c.desc}</div>
                </div>
              ))}
            </div>
            <Link href="/auth/login" className="cta-btn">ابدأ مجاناً — ادفع بعد المقابلة ←</Link>
          </div>
        </section>

        {/* ══ مقارنة ══ */}
        <section className="section-pad" style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
          <div style={{ maxWidth:800, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:36 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:10 }}>لماذا نخبة؟</p>
              <h2 style={{ fontSize:'clamp(20px,3.5vw,34px)', fontWeight:800, color:'#f8f5ef' }}>نخبة مقابل الطريقة التقليدية</h2>
            </div>
            <div className="comp-grid">
              <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'24px 20px' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--muted)', marginBottom:16, textAlign:'center' }}>الطريقة التقليدية 😓</div>
                {['CV جامد لا يكشف شخصيتك','تقديم أعمى بدون تقييم','لا تعرف سبب الرفض','LinkedIn فارغ وبلا محتوى','انتظار بدون رد','لا يوجد تحليل للمهارات'].map(i => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:10, fontSize:13, color:'var(--muted)' }}>
                    <span style={{ color:'var(--error)', flexShrink:0 }}>✗</span>{i}
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(200,160,74,.04)', border:'1px solid rgba(200,160,74,.22)', borderRadius:14, padding:'24px 20px' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--gold)', marginBottom:16, textAlign:'center' }}>مع نخبة ✨</div>
                {['مقابلة تكشف قيمتك الحقيقية','تقييم موضوعي من 100','تعرف نقاط قوتك وضعفك','LinkedIn جاهز بنقرة واحدة','الشركات تتواصل معك أنت','CV + نشر + تحليل في خطوة واحدة'].map(i => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:10, fontSize:13, color:'var(--text)' }}>
                    <span style={{ color:'var(--success)', flexShrink:0 }}>✓</span>{i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ LinkedIn ══ */}
        <section className="section-pad">
          <div style={{ maxWidth:800, margin:'0 auto' }}>
            <div style={{ display:'flex', gap:32, alignItems:'center', flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:280 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(0,119,181,.08)', border:'1px solid rgba(0,119,181,.25)', padding:'5px 14px', borderRadius:20, fontSize:11, color:'#0077b5', fontWeight:700, marginBottom:16 }}>
                  💼 LinkedIn Integration
                </div>
                <h2 style={{ fontSize:'clamp(20px,3vw,32px)', fontWeight:800, color:'#f8f5ef', marginBottom:12 }}>
                  ابنِ ملفك على LinkedIn<br/>
                  <span style={{ color:'#0077b5' }}>بنقرة واحدة</span>
                </h2>
                <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.85, marginBottom:20 }}>
                  بعد المقابلة — نخبة تولّد لك نصاً جاهزاً للصقه مباشرة في LinkedIn.
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {['عنوان وظيفي احترافي','نبذة شخصية مؤثرة','إنجازات بأرقام حقيقية','مهارات موثّقة'].map(f => (
                    <div key={f} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--text)' }}>
                      <span style={{ color:'#0077b5' }}>✓</span>{f}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex:1, minWidth:280, background:'var(--card)', border:'1px solid rgba(0,119,181,.25)', borderRadius:16, overflow:'hidden' }}>
                <div style={{ background:'rgba(0,119,181,.1)', padding:'14px 18px', borderBottom:'1px solid rgba(0,119,181,.15)', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ fontSize:20 }}>💼</div>
                  <span style={{ fontSize:13, fontWeight:700, color:'#0077b5' }}>محتوى جاهز لـ LinkedIn</span>
                </div>
                <div style={{ padding:'18px' }}>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:10, color:'var(--muted)', marginBottom:5, letterSpacing:2, textTransform:'uppercase' }}>العنوان الوظيفي</div>
                    <div style={{ fontSize:13, color:'var(--text)', background:'var(--surface)', padding:'8px 12px', borderRadius:8, lineHeight:1.6 }}>
                      مشرف تعليمي | 7 سنوات خبرة | خبير تطوير وتحفيز
                    </div>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:10, color:'var(--muted)', marginBottom:5, letterSpacing:2, textTransform:'uppercase' }}>النبذة الشخصية</div>
                    <div style={{ fontSize:12, color:'var(--text)', background:'var(--surface)', padding:'8px 12px', borderRadius:8, lineHeight:1.7 }}>
                      مشرف تعليمي سعودي بخبرة 7 سنوات، رفعت عدد الطالبات من 40 إلى 215...
                    </div>
                  </div>
                  <button
                    onClick={() => copyLinkedIn('العنوان: مشرف تعليمي | 7 سنوات خبرة')}
                    style={{ width:'100%', padding:'9px', borderRadius:9, border:'1px solid rgba(0,119,181,.4)', background: copied?'rgba(0,119,181,.15)':'transparent', color:'#0077b5', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", transition:'all .2s' }}>
                    {copied ? '✓ تم النسخ!' : '📋 انسخ للـ LinkedIn'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA النهائي ══ */}
        <section className="section-pad" style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', textAlign:'center' }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:14 }}>ابدأ الآن</p>
          <h2 style={{ fontSize:'clamp(22px,4vw,44px)', fontWeight:800, color:'#f8f5ef', marginBottom:12, lineHeight:1.2 }}>
            جاهز لتكتشف قيمتك؟<br/>
            <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              ابدأ المقابلة مجاناً.
            </span>
          </h2>
          <p style={{ fontSize:14, color:'var(--muted)', maxWidth:440, margin:'0 auto 10px', lineHeight:1.85 }}>
            ابدأ مجاناً — وادفع فقط إذا أعجبك الناتج.
          </p>
          <p style={{ fontSize:13, color:'var(--gold)', marginBottom:32, fontWeight:600 }}>
            39 ريال فقط · لا اشتراك · لا تجديد تلقائي
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/auth/login" className="cta-btn">ابدأ مقابلتك المجانية ←</Link>
            <Link href="/analyze-cv" style={{ padding:'15px 38px', borderRadius:10, fontSize:15, fontWeight:700, border:'1px solid var(--border)', color:'var(--muted)', background:'transparent', textDecoration:'none' }}>
              حلّل سيرتي الذاتية
            </Link>
          </div>
          <p style={{ fontSize:12, color:'var(--muted)', marginTop:14 }}>
            ✓ المقابلة مجانية تماماً · لا بطاقة ائتمان
          </p>
        </section>

      </main>

      {/* FOOTER */}
      <footer style={{ padding:'26px 36px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <LogoIcon size={34}/>
          <div style={{ width:1, height:30, background:'rgba(200,160,74,0.3)' }}/>
          <LogoText size="sm"/>
        </Link>
        <p style={{ fontSize:11, color:'var(--muted)' }}>© {new Date().getFullYear()} نخبة. جميع الحقوق محفوظة.</p>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
          {[['للشركات','/for-companies'],['سياسة الخصوصية','/privacy'],['الشروط','/terms'],['تواصل معنا','/contact']].map(([l,h]) => (
            <Link key={h} href={h} style={{ fontSize:11, color:'var(--muted)', textDecoration:'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </>
  )
}