'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
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

        .hero-title  { font-size: clamp(36px, 6vw, 72px); }
        .steps-grid  { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; border-radius: 16px; overflow: hidden; }
        .value-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .comp-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .section-pad { padding: 88px 40px; }
        .stat-num    { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:600; color:var(--gold); line-height:1; }

        @media(max-width:768px){
          .steps-grid  { grid-template-columns: 1fr; gap: 2px; }
          .value-grid  { grid-template-columns: 1fr; }
          .comp-grid   { grid-template-columns: 1fr; }
          .section-pad { padding: 56px 18px !important; }
          .stats-row   { gap: 28px !important; }
          .hide-sm     { display: none !important; }
          .hero-title  { font-size: 34px !important; }
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

          {/* Headline */}
          <h1 className="hero-title" style={{ fontWeight:800, lineHeight:1.1, color:'#f8f5ef', marginBottom:16, animation:'fadeUp .6s ease both .1s' }}>
            وظيفتك لا تبدأ بـ CV<br/>
            <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              بل بملف مهني يثق فيه كل صاحب عمل
            </span>
          </h1>

          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(15px,2vw,19px)', fontWeight:300, fontStyle:'italic', color:'var(--muted)', marginBottom:28, animation:'fadeUp .6s ease both .2s' }}>
            مقابلة ذكية واحدة — تكشف قيمتك وتفتح أبواب الشركات
          </p>

          {/* القيمة المزدوجة */}
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginBottom:20, animation:'fadeUp .6s ease both .25s' }}>
            {[
              { icon:'📄', text:'CV احترافي عربي وإنجليزي', color:'var(--gold)' },
              { icon:'🏢', text:'نشر ملفك للشركات تلقائياً', color:'var(--success)' },
              { icon:'💼', text:'بناء ملفك على LinkedIn', color:'#0077b5' },
            ].map(v => (
              <div key={v.text} style={{ display:'flex', alignItems:'center', gap:7, background:`${v.color}0f`, border:`1px solid ${v.color}33`, padding:'7px 14px', borderRadius:10 }}>
                <span style={{ fontSize:15 }}>{v.icon}</span>
                <span style={{ fontSize:12, fontWeight:600, color:v.color }}>{v.text}</span>
              </div>
            ))}
          </div>

          <p style={{ maxWidth:500, fontSize:14, color:'var(--muted)', lineHeight:1.9, marginBottom:16, animation:'fadeUp .6s ease both .3s' }}>
            أجرِ مقابلة مجانية مع الذكاء الاصطناعي — وبدفعة واحدة <strong style={{ color:'var(--gold)' }}>39 ريال</strong> تحصل على CV احترافي، يُنشر ملفك للشركات، وتحصل على محتوى جاهز لـ LinkedIn.
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
            {[['6','محاور تقييم'],['39','ريال فقط'],['2','لغة'],['100%','مقابلات مكتملة']].map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div className="stat-num">{s[0]}</div>
                <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>{s[1]}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ مقابلة واحدة = 3 مكاسب ══ */}
        <section className="section-pad" style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
          <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:10 }}>بدفعة واحدة 39 ريال</p>
            <h2 style={{ fontSize:'clamp(20px,3.5vw,36px)', fontWeight:800, color:'#f8f5ef', marginBottom:10 }}>مقابلة واحدة — 3 مكاسب</h2>
            <p style={{ fontSize:14, color:'var(--muted)', marginBottom:36 }}>المقابلة مجانية · الدفع بعد انتهائها فقط</p>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, maxWidth:800, margin:'0 auto 32px' }}>
              {[
                { num:'01', icon:'📄', color:'var(--gold)', title:'CV احترافي', desc:'عربي وإنجليزي — PDF و Word جاهزان للتحميل والتقديم الفوري.' },
                { num:'02', icon:'🏢', color:'var(--success)', title:'نشر للشركات', desc:'ملفك يصل للشركات المناسبة في المنصة — تواصل مباشر بدون وسيط.' },
                { num:'03', icon:'💼', color:'#0077b5', title:'محتوى LinkedIn', desc:'نص جاهز للصق في ملفك على LinkedIn — عنوان، نبذة، إنجازات.' },
              ].map(c => (
                <div key={c.num} style={{ background:'var(--card)', border:`1px solid ${c.color}33`, borderRadius:14, padding:'22px 18px', textAlign:'right' }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:300, color:c.color, opacity:.2, lineHeight:1, marginBottom:10 }}>{c.num}</div>
                  <div style={{ fontSize:24, marginBottom:10 }}>{c.icon}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#f8f5ef', marginBottom:6 }}>{c.title}</div>
                  <div style={{ fontSize:12, color:'var(--muted)', lineHeight:1.75 }}>{c.desc}</div>
                </div>
              ))}
            </div>

            <Link href="/auth/login" style={{ display:'inline-flex', padding:'13px 32px', borderRadius:10, fontSize:14, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>
              ابدأ مجاناً — ادفع بعد المقابلة ←
            </Link>
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
                  بعد المقابلة — نخبة تولّد لك نصاً جاهزاً للصقه مباشرة في LinkedIn. عنوان احترافي، نبذة مميزة، وإنجازات موثّقة.
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {['عنوان وظيفي احترافي','نبذة شخصية مؤثرة','إنجازات بأرقام حقيقية','مهارات موثّقة'].map(f => (
                    <div key={f} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--text)' }}>
                      <span style={{ color:'#0077b5' }}>✓</span>{f}
                    </div>
                  ))}
                </div>
              </div>

              {/* مثال LinkedIn */}
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
                      مشرف تعليمي سعودي بخبرة 7 سنوات، رفعت عدد الطالبات من 40 إلى 215 وأدرت 400 مشترك في برامج التطوير...
                    </div>
                  </div>
                  <button
                    onClick={() => copyLinkedIn(`العنوان: مشرف تعليمي | 7 سنوات خبرة\nالنبذة: مشرف تعليمي سعودي بخبرة 7 سنوات...`)}
                    style={{ width:'100%', padding:'9px', borderRadius:9, border:'1px solid rgba(0,119,181,.4)', background: copied?'rgba(0,119,181,.15)':'transparent', color:'#0077b5', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", transition:'all .2s' }}>
                    {copied ? '✓ تم النسخ!' : '📋 انسخ للـ LinkedIn'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ كيف تعمل ══ */}
        <section className="section-pad" style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
          <div style={{ maxWidth:1000, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:44 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:10 }}>كيف تعمل</p>
              <h2 style={{ fontSize:'clamp(20px,3.5vw,34px)', fontWeight:800, color:'#f8f5ef' }}>3 خطوات — نتيجة حقيقية</h2>
            </div>
            <div className="steps-grid" style={{ background:'var(--border)' }}>
              {[
                { num:'01', icon:'🎙️', title:'مقابلة ذكية مجانية', desc:'الذكاء الاصطناعي يسألك في 6 محاور — خبرة، إنجازات، شخصية، مهارات، توقعات، ملاءمة.' },
                { num:'02', icon:'💳', title:'دفعة واحدة 39 ريال', desc:'بعد المقابلة ادفع مرة واحدة وتحصل على CV + نشر ملفك + محتوى LinkedIn.' },
                { num:'03', icon:'🚀', title:'انطلق', desc:'حمّل CV، انتظر الشركات تتواصل معك، والصق محتواك في LinkedIn فوراً.' },
              ].map(c => (
                <div key={c.num} style={{ background:'var(--surface)', padding:'32px 24px' }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:44, fontWeight:300, color:'var(--gold)', opacity:.18, lineHeight:1, marginBottom:16 }}>{c.num}</div>
                  <div style={{ fontSize:26, marginBottom:12 }}>{c.icon}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#f8f5ef', marginBottom:8 }}>{c.title}</div>
                  <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.8 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ مقارنة ══ */}
        <section className="section-pad">
          <div style={{ maxWidth:800, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:36 }}>
              <h2 style={{ fontSize:'clamp(20px,3.5vw,34px)', fontWeight:800, color:'#f8f5ef' }}>نخبة مقابل الطريقة التقليدية</h2>
            </div>
            <div className="comp-grid">
              <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'24px 20px' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--muted)', marginBottom:14, textAlign:'center' }}>الطريقة التقليدية 😓</div>
                {['CV جامد لا يكشف شخصيتك','لا تعرف نقاط قوتك','تقديم أعمى بدون تقييم','LinkedIn فارغ وبلا محتوى','انتظار بدون رد'].map(i => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:9, fontSize:13, color:'var(--muted)' }}>
                    <span style={{ color:'var(--error)', flexShrink:0 }}>✗</span>{i}
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(200,160,74,.04)', border:'1px solid rgba(200,160,74,.22)', borderRadius:14, padding:'24px 20px' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--gold)', marginBottom:14, textAlign:'center' }}>مع نخبة ✨</div>
                {['مقابلة تكشف قيمتك الحقيقية','تقييم موضوعي من 100','CV + نشر وظيفتك معاً','LinkedIn جاهز بنقرة','تواصل مباشر من الشركات'].map(i => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:9, fontSize:13, color:'var(--text)' }}>
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
          <h2 style={{ fontSize:'clamp(22px,4vw,44px)', fontWeight:800, color:'#f8f5ef', marginBottom:12, lineHeight:1.1 }}>
            المقابلة مجانية.<br/>
            <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              CV + وظيفة + LinkedIn بـ 39 ريال.
            </span>
          </h2>
          <p style={{ fontSize:14, color:'var(--muted)', maxWidth:420, margin:'0 auto 32px', lineHeight:1.85 }}>
            ابدأ مجاناً — وبعد المقابلة قرر إذا تبي تنطلق.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/auth/login" style={{ padding:'13px 32px', borderRadius:10, fontSize:14, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>
              ابدأ مقابلتك المجانية ←
            </Link>
            <Link href="/analyze-cv" style={{ padding:'13px 32px', borderRadius:10, fontSize:14, fontWeight:700, border:'1px solid var(--border)', color:'var(--muted)', background:'transparent', textDecoration:'none' }}>
              حلّل سيرتي الذاتية
            </Link>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer style={{ padding:'26px 36px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
          <span style={{ fontSize:16, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</span>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:9, letterSpacing:4, color:'var(--muted)', textTransform:'uppercase' }}>Nukhba</span>
        </div>
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