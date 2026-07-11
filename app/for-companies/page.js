import Link from 'next/link'

export default function ForCompanies() {
  return (
    <>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#080810;color:#ede8df;font-family:'Tajawal',sans-serif}
        .fade-up{animation:fadeUp .7s ease both}
        .card{transition:all .2s;cursor:default}
        .card:hover{border-color:rgba(200,160,74,.4)!important;transform:translateY(-3px)}
        .btn-gold{background:linear-gradient(135deg,#7a5e28,#c8a04a);color:#06060e;transition:filter .2s}
        .btn-gold:hover{filter:brightness(1.1)}
        @media(max-width:700px){
          .hero-title{font-size:36px!important}
          .stats-row{gap:24px!important}
          .grid-2{grid-template-columns:1fr!important}
          .grid-3{grid-template-columns:1fr!important}
          nav{padding:0 20px!important}
          section{padding:60px 20px!important}
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap" rel="stylesheet"/>

      {/* NAV */}
      <nav style={{ position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 40px', height:64, background:'rgba(8,8,16,.95)', backdropFilter:'blur(16px)', borderBottom:'1px solid #252538' }}>
        <Link href="/" style={{ display:'flex', alignItems:'baseline', gap:8, textDecoration:'none' }}>
          <span style={{ fontSize:20, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</span>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, letterSpacing:4, color:'#7a7690', textTransform:'uppercase' }}>Nukhba</span>
        </Link>
        <div style={{ display:'flex', gap:10 }}>
          <Link href="/" style={{ padding:'8px 18px', borderRadius:8, fontSize:13, border:'1px solid #252538', color:'#7a7690', background:'transparent', textDecoration:'none' }}>للباحثين</Link>
          <Link href="/auth/login" className="btn-gold" style={{ padding:'8px 20px', borderRadius:8, fontSize:13, fontWeight:700, textDecoration:'none' }}>دخول الشركات</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:'92vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'80px 24px 60px', position:'relative', overflow:'hidden' }}>

        {/* Glow */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-60%)', width:700, height:700, background:'radial-gradient(ellipse,rgba(200,160,74,.07) 0%,transparent 70%)', pointerEvents:'none' }}/>

        {/* Badge */}
        <div className="fade-up" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(200,160,74,.08)', border:'1px solid rgba(200,160,74,.25)', padding:'7px 18px', borderRadius:24, fontSize:12, color:'#c8a04a', marginBottom:32, fontFamily:"'Cormorant Garamond',serif", letterSpacing:5, textTransform:'uppercase', animationDelay:'.05s' }}>
          للشركات · HR Platform
        </div>

        {/* Headline */}
        <h1 className="fade-up hero-title" style={{ fontSize:'clamp(40px,7vw,76px)', fontWeight:800, lineHeight:1.1, color:'#f8f5ef', marginBottom:16, animationDelay:'.15s' }}>
          وظّف بثقة<br/>
          <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            لا بتخمين
          </span>
        </h1>

        {/* Sub */}
        <p className="fade-up" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(17px,2.2vw,23px)', fontWeight:300, fontStyle:'italic', color:'#7a7690', marginBottom:28, animationDelay:'.25s' }}>
          Smart hiring powered by AI interviews
        </p>

        <p className="fade-up" style={{ maxWidth:520, fontSize:16, color:'#7a7690', lineHeight:1.9, marginBottom:48, animationDelay:'.35s' }}>
          نخبة تحوّل المتقدمين إلى ملفات عميقة تثق بها —
          أسئلتك، مقابلاتنا الذكية، واختيارك أنت.
        </p>

        {/* CTA */}
        <div className="fade-up" style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', animationDelay:'.45s' }}>
          <Link href="/auth/login" className="btn-gold" style={{ padding:'14px 38px', borderRadius:10, fontSize:16, fontWeight:800, textDecoration:'none', display:'inline-flex' }}>
            ابدأ مجاناً ← انشر وظيفتك
          </Link>
          <Link href="/auth/login" style={{ padding:'14px 38px', borderRadius:10, fontSize:16, fontWeight:700, border:'1px solid #252538', color:'#7a7690', background:'transparent', textDecoration:'none' }}>
            تصفح المرشحين
          </Link>
        </div>

        {/* Stats */}
        <div className="fade-up stats-row" style={{ display:'flex', gap:56, justifyContent:'center', marginTop:72, flexWrap:'wrap', animationDelay:'.6s' }}>
          {[
            { num:'٦', label:'محاور تقييم لكل مرشح' },
            { num:'١٠٠٪', label:'مقابلات مكتملة فقط' },
            { num:'٠', label:'CVs عشوائية' },
          ].map((s,i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, fontWeight:600, color:'#c8a04a', lineHeight:1 }}>{s.num}</div>
              <div style={{ fontSize:12, color:'#7a7690', marginTop:6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:'80px 40px', background:'#0e0e1a', borderTop:'1px solid #252538', borderBottom:'1px solid #252538' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:'#c8a04a', textTransform:'uppercase', marginBottom:12 }}>كيف يعمل</p>
            <h2 style={{ fontSize:'clamp(22px,4vw,38px)', fontWeight:800, color:'#f8f5ef' }}>ثلاث خطوات — مرشحون تثق بهم</h2>
          </div>
          <div className="grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {[
              { num:'01', icon:'📝', title:'حدد وظيفتك', desc:'صف المنصب وحدد متطلباتك — اكتب أسئلة المقابلة بنفسك أو دع AI يولّدها لك في ثوانٍ.' },
              { num:'02', icon:'🤖', title:'AI يقابل بدلاً عنك', desc:'المتقدمون يجرون مقابلات ذكية بأسئلتك — في أي وقت، من أي مكان، بدون جدولة.' },
              { num:'03', icon:'✅', title:'أنت تختار الأفضل', desc:'ملفات مرشحين مرتبة حسب التقييم — اضغط واحد لتواصل مباشر مع من يناسبك.' },
            ].map(c => (
              <div key={c.num} className="card" style={{ background:'#181828', border:'1px solid #252538', borderRadius:16, padding:'32px 28px' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:44, fontWeight:300, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', opacity:.35, lineHeight:1, marginBottom:18 }}>{c.num}</div>
                <div style={{ fontSize:28, marginBottom:14 }}>{c.icon}</div>
                <div style={{ fontSize:17, fontWeight:700, color:'#f8f5ef', marginBottom:10 }}>{c.title}</div>
                <div style={{ fontSize:14, color:'#7a7690', lineHeight:1.8 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:'80px 40px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:'#c8a04a', textTransform:'uppercase', marginBottom:12 }}>المميزات</p>
          <h2 style={{ fontSize:'clamp(22px,4vw,38px)', fontWeight:800, color:'#f8f5ef' }}>لماذا نخبة؟</h2>
        </div>
        <div className="grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
          {[
            { icon:'🎯', title:'أسئلة مخصصة لك', desc:'كل وظيفة لها أسئلة مقابلة تصممها أنت أو يولّدها AI بناءً على متطلباتك.' },
            { icon:'📊', title:'تقييم موضوعي', desc:'كل مرشح يحصل على تقييم من 100 — لا تحيز، لا تأثير شخصي، فقط الحقيقة.' },
            { icon:'⚡', title:'توفير الوقت', desc:'بدل قراءة مئات الـ CV — ملفات مرتبة جاهزة حسب الأنسب لوظيفتك.' },
            { icon:'🌐', title:'ثنائي اللغة', desc:'المقابلات بالعربي والإنجليزي — المرشح يختار لغته والنظام يفهم.' },
            { icon:'🔒', title:'خصوصية تامة', desc:'أسئلتك وبيانات مرشحيك خاصة بك — لا تُشارك مع أي جهة.' },
            { icon:'📱', title:'من أي جهاز', desc:'المتقدمون يجرون المقابلة من الجوال أو الكمبيوتر — وصول أوسع لك.' },
          ].map(f => (
            <div key={f.title} className="card" style={{ background:'#13131f', border:'1px solid #252538', borderRadius:14, padding:'28px 24px' }}>
              <div style={{ fontSize:28, marginBottom:14 }}>{f.icon}</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#f8f5ef', marginBottom:8 }}>{f.title}</div>
              <div style={{ fontSize:13, color:'#7a7690', lineHeight:1.75 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{ padding:'80px 40px', background:'#0e0e1a', borderTop:'1px solid #252538', borderBottom:'1px solid #252538' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:'clamp(22px,4vw,36px)', fontWeight:800, color:'#f8f5ef' }}>نخبة مقابل الطريقة التقليدية</h2>
          </div>
          <div className="grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div style={{ background:'#181828', border:'1px solid #252538', borderRadius:14, padding:28 }}>
              <div style={{ fontSize:15, fontWeight:700, color:'#7a7690', marginBottom:20, textAlign:'center' }}>الطريقة التقليدية 😓</div>
              {['مئات CVs عشوائية','أيام في القراءة والمقارنة','مقابلات مجدولة تستهلك الوقت','تقييم ذاتي متحيز','مرشحون جيدون يضيعون في الكومة'].map(i => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, fontSize:13, color:'#7a7690' }}>
                  <span style={{ color:'#c94a4a', fontSize:16, flexShrink:0 }}>✗</span>{i}
                </div>
              ))}
            </div>
            <div style={{ background:'rgba(200,160,74,.05)', border:'1px solid rgba(200,160,74,.3)', borderRadius:14, padding:28 }}>
              <div style={{ fontSize:15, fontWeight:700, color:'#c8a04a', marginBottom:20, textAlign:'center' }}>نخبة ✨</div>
              {['ملفات مرشحين عميقة ودقيقة','تقييم فوري بالذكاء الاصطناعي','مقابلات تُجرى في أي وقت','تقييم موضوعي 100%','اكتشاف المواهب الخفية'].map(i => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, fontSize:13, color:'#ede8df' }}>
                  <span style={{ color:'#4a9c6e', fontSize:16, flexShrink:0 }}>✓</span>{i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'100px 40px', textAlign:'center' }}>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:'#c8a04a', textTransform:'uppercase', marginBottom:14 }}>ابدأ الآن</p>
        <h2 style={{ fontSize:'clamp(26px,4vw,44px)', fontWeight:800, color:'#f8f5ef', marginBottom:16 }}>
          جاهز توظّف بثقة؟
        </h2>
        <p style={{ fontSize:15, color:'#7a7690', maxWidth:420, margin:'0 auto 44px', lineHeight:1.85 }}>
          انشر وظيفتك الأولى الآن وشوف الفرق بين CV وملف مرشح حقيقي.
        </p>
        <Link href="/auth/login" className="btn-gold" style={{ padding:'15px 44px', borderRadius:10, fontSize:17, fontWeight:800, textDecoration:'none', display:'inline-flex' }}>
          انشر وظيفتك — مجاناً
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:'32px 40px', borderTop:'1px solid #252538', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div style={{ fontSize:18, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة · Nukhba</div>
        <p style={{ fontSize:12, color:'#7a7690' }}>© 2025 نخبة. جميع الحقوق محفوظة.</p>
        <div style={{ display:'flex', gap:20 }}>
          <Link href="/privacy" style={{ fontSize:13, color:'#7a7690', textDecoration:'none' }}>سياسة الخصوصية</Link>
          <Link href="/terms" style={{ fontSize:13, color:'#7a7690', textDecoration:'none' }}>الشروط</Link>
          <Link href="/contact" style={{ fontSize:13, color:'#7a7690', textDecoration:'none' }}>تواصل معنا</Link>
        </div>
      </footer>
    </>
  )
}