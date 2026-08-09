'use client'
import { LogoIcon, LogoText } from '@/components/brand'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function ForCompanies() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@300;400;600&display=swap');

        .co-page {
          font-family: var(--font-sans-ar, 'IBM Plex Sans Arabic', system-ui, sans-serif);
          background: var(--color-background);
          color: var(--color-foreground);
          -webkit-font-smoothing: antialiased;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { opacity: .05; }
          50%       { opacity: .12; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: .3; transform: scale(.8); }
          50%       { opacity: 1;  transform: scale(1); }
        }

        .f1 { animation: fadeUp var(--duration-slow) var(--easing-standard) both .05s; }
        .f2 { animation: fadeUp var(--duration-slow) var(--easing-standard) both .15s; }
        .f3 { animation: fadeUp var(--duration-slow) var(--easing-standard) both .25s; }
        .f4 { animation: fadeUp var(--duration-slow) var(--easing-standard) both .38s; }
        .f5 { animation: fadeUp var(--duration-slow) var(--easing-standard) both .5s; }

        .orb {
          position: absolute; border-radius: 50%;
          pointer-events: none; filter: blur(80px); z-index: 1;
        }

        .hero-video {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; opacity: 0.12; z-index: 0;
        }

        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(8,8,16,0.3) 0%, rgba(8,8,16,0.1) 40%, rgba(8,8,16,0.6) 100%);
          z-index: 1; pointer-events: none;
        }

        .hero-content {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; align-items: center; width: 100%;
        }

        .btn-gold {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--gold-dk), var(--gold));
          color: #06060e; font-size: 15px; font-weight: 700;
          text-decoration: none; font-family: inherit;
          box-shadow: var(--shadow-gold);
          transition: filter var(--duration-fast) var(--easing-standard), transform var(--duration-fast) var(--easing-standard);
          cursor: pointer; border: none;
        }
        .btn-gold:hover { filter: brightness(1.1); transform: translateY(-2px); }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border-radius: var(--radius-md);
          border: 1px solid rgba(255,255,255,0.15);
          color: var(--color-foreground-muted); font-size: 15px; font-weight: 500;
          text-decoration: none; font-family: inherit;
          background: rgba(255,255,255,0.04); backdrop-filter: blur(8px);
          transition: border-color var(--duration-fast), color var(--duration-fast), transform var(--duration-fast);
          cursor: pointer;
        }
        .btn-ghost:hover { border-color: var(--color-primary); color: var(--color-primary); transform: translateY(-2px); }

        .card-base {
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          transition: border-color var(--duration-base), transform var(--duration-base), box-shadow var(--duration-base);
        }
        .card-base:hover { border-color: var(--color-border-strong); transform: translateY(-3px); box-shadow: var(--shadow-gold); }

        .section     { padding: 96px 40px; }
        .section-alt { padding: 96px 40px; background: var(--color-surface); }

        .eyebrow {
          font-family: 'Cormorant Garamond', serif;
          font-size: 11px; letter-spacing: 5px;
          color: var(--color-primary); text-transform: uppercase;
          margin-bottom: 14px; display: block;
        }

        .gold-text {
          background: linear-gradient(135deg, var(--gold-dk), var(--gold), var(--gold-lt));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent);
        }

        .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .pulse-dots { display: flex; gap: 4px; align-items: center; }
        .pulse-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--color-primary);
          animation: pulse-dot 1.4s ease-in-out infinite;
        }
        .pulse-dot:nth-child(2) { animation-delay: .2s; }
        .pulse-dot:nth-child(3) { animation-delay: .4s; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
          .hero-video { display: none; }
        }

        @media (max-width: 768px) {
          .grid-3, .grid-2 { grid-template-columns: 1fr; }
          .section, .section-alt { padding: 64px 20px; }
          .btn-row { flex-direction: column; align-items: stretch; }
          .btn-row a { text-align: center; justify-content: center; }
        }
      `}</style>

      <Navbar />

      <div className="co-page">

        {/* ══ HERO ══ */}
        <section style={{ minHeight: '92vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden', padding: '100px 24px 80px' }}>

          {/* فيديو الخلفية */}
          <video className="hero-video" autoPlay loop muted playsInline>
            <source src="/companies-bg.mp4" type="video/mp4"/>
          </video>
          <div className="hero-overlay"/>

          <div className="orb" style={{ width: 700, height: 700, background: 'rgba(200,160,74,.06)', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'glow 6s ease-in-out infinite' }}/>

          <div className="hero-content">

            <div className="f1" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(200,160,74,.08)', border: '1px solid rgba(200,160,74,.25)', padding: '6px 16px', borderRadius: 24, marginBottom: 32, backdropFilter: 'blur(8px)' }}>
              <div className="pulse-dots">
                <div className="pulse-dot"/><div className="pulse-dot"/><div className="pulse-dot"/>
              </div>
              <span style={{ fontSize: 11, color: 'var(--color-primary)', letterSpacing: 4, fontFamily: "'Cormorant Garamond', serif", textTransform: 'uppercase' }}>
                للشركات · HR Platform
              </span>
            </div>

            <h1 className="f2" style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-1.5px', color: 'var(--color-foreground)', marginBottom: 20, maxWidth: 700 }}>
              وظّف بثقة<br/>
              <span className="gold-text">لا بتخمين</span>
            </h1>

            <p className="f3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(17px, 2.2vw, 22px)', fontWeight: 300, fontStyle: 'italic', color: 'var(--color-foreground-muted)', marginBottom: 16, maxWidth: 500 }}>
              Smart hiring powered by AI interviews
            </p>

            <p className="f3" style={{ maxWidth: 520, fontSize: 15, color: 'var(--color-foreground-muted)', lineHeight: 1.9, marginBottom: 44 }}>
              نخبة تحوّل المتقدمين إلى ملفات عميقة تثق بها — أسئلتك، مقابلاتنا الذكية، واختيارك أنت.
            </p>

            <div className="f4 btn-row" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 72 }}>
              <Link href="/auth/login?role=company" className="btn-gold">ابدأ مجاناً ← انشر وظيفتك</Link>
              <Link href="/auth/login?role=company" className="btn-ghost">تصفح المرشحين</Link>
            </div>

            <div className="f5" style={{ display: 'flex', gap: 56, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[['٦', 'محاور تقييم لكل مرشح'], ['١٠٠٪', 'مقابلات مكتملة فقط'], ['٠', 'CVs عشوائية']].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 600, color: 'var(--color-primary)', lineHeight: 1, marginBottom: 6 }}>{s[0]}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-foreground-muted)', letterSpacing: '.5px' }}>{s[1]}</div>
                </div>
              ))}
            </div>

          </div>
        </section>

        <div className="divider"/>

        {/* ══ كيف يعمل ══ */}
        <section className="section-alt">
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="eyebrow">كيف يعمل</span>
              <h2 style={{ fontSize: 'clamp(22px,4vw,38px)', fontWeight: 700, letterSpacing: '-1px', color: 'var(--color-foreground)' }}>
                ثلاث خطوات — مرشحون تثق بهم
              </h2>
            </div>
            <div className="grid-3">
              {[
                { num: '01', icon: '📝', title: 'حدد وظيفتك', desc: 'صف المنصب وحدد متطلباتك — اكتب أسئلة المقابلة بنفسك أو دع الذكاء الاصطناعي يولّدها لك.' },
                { num: '02', icon: '🤖', title: 'الذكاء الاصطناعي يقابل بدلاً عنك', desc: 'المتقدمون يجرون مقابلات ذكية بأسئلتك — في أي وقت، من أي مكان، بدون جدولة.' },
                { num: '03', icon: '✅', title: 'أنت تختار الأفضل', desc: 'ملفات مرشحين مرتبة حسب التقييم — اضغط واحد لتواصل مباشر مع من يناسبك.' },
              ].map(c => (
                <div key={c.num} className="card-base" style={{ padding: '32px 28px' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: 'var(--color-primary)', opacity: .2, lineHeight: 1, marginBottom: 18 }}>{c.num}</div>
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{c.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 10 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-foreground-muted)', lineHeight: 1.8 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider"/>

        {/* ══ المميزات ══ */}
        <section className="section">
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="eyebrow">المميزات</span>
              <h2 style={{ fontSize: 'clamp(22px,4vw,38px)', fontWeight: 700, letterSpacing: '-1px', color: 'var(--color-foreground)' }}>لماذا نخبة؟</h2>
            </div>
            <div className="grid-3">
              {[
                { icon: '🎯', title: 'أسئلة مخصصة لك', desc: 'كل وظيفة لها أسئلة مقابلة تصممها أنت أو يولّدها الذكاء الاصطناعي بناءً على متطلباتك.' },
                { icon: '📊', title: 'تقييم موضوعي', desc: 'كل مرشح يحصل على تقييم من 100 — لا تحيز، لا تأثير شخصي، فقط الحقيقة.' },
                { icon: '⚡', title: 'توفير الوقت', desc: 'بدل قراءة مئات السير الذاتية — ملفات مرتبة جاهزة حسب الأنسب لوظيفتك.' },
                { icon: '🌐', title: 'ثنائي اللغة', desc: 'المقابلات بالعربي والإنجليزي — المرشح يختار لغته والنظام يفهم.' },
                { icon: '🔒', title: 'خصوصية تامة', desc: 'أسئلتك وبيانات مرشحيك خاصة بك — لا تُشارك مع أي جهة.' },
                { icon: '📱', title: 'من أي جهاز', desc: 'المتقدمون يجرون المقابلة من الجوال أو الكمبيوتر — وصول أوسع لك.' },
              ].map(f => (
                <div key={f.title} className="card-base" style={{ padding: '28px 24px' }}>
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 8 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-foreground-muted)', lineHeight: 1.75 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider"/>

        {/* ══ مقارنة ══ */}
        <section className="section-alt">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="eyebrow">المقارنة</span>
              <h2 style={{ fontSize: 'clamp(22px,4vw,36px)', fontWeight: 700, letterSpacing: '-1px', color: 'var(--color-foreground)' }}>
                نخبة مقابل الطريقة التقليدية
              </h2>
            </div>
            <div className="grid-2">
              <div className="card-base" style={{ padding: '28px 24px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>
                  الطريقة التقليدية
                </div>
                {['مئات السير الذاتية العشوائية', 'أيام في القراءة والمقارنة', 'مقابلات مجدولة تستهلك الوقت', 'تقييم ذاتي متحيز', 'مرشحون جيدون يضيعون'].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 13, color: 'var(--color-foreground-muted)' }}>
                    <span style={{ color: 'var(--color-destructive)', fontSize: 11, flexShrink: 0 }}>✕</span>{i}
                  </div>
                ))}
              </div>
              <div className="card-base" style={{ padding: '28px 24px', borderColor: 'var(--color-border-strong)', background: 'rgba(200,160,74,.03)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--color-border-strong)', textAlign: 'center' }}>
                  نخبة ✨
                </div>
                {['ملفات مرشحين عميقة ودقيقة', 'تقييم فوري بالذكاء الاصطناعي', 'مقابلات تُجرى في أي وقت', 'تقييم موضوعي 100%', 'اكتشاف المواهب الخفية'].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 13, color: 'var(--color-foreground)' }}>
                    <span style={{ color: 'var(--color-success)', fontSize: 11, flexShrink: 0 }}>✓</span>{i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="divider"/>

        {/* ══ التسعير ══ */}
        <section className="section">
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow">التسعير</span>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-1px', color: 'var(--color-foreground)', marginBottom: 12 }}>بسيط وشفاف</h2>
            <p style={{ fontSize: 14, color: 'var(--color-foreground-muted)', maxWidth: 400, margin: '0 auto 52px' }}>ابدأ مجاناً — لا بطاقة ائتمان مطلوبة</p>
            <div className="grid-3" style={{ maxWidth: 860, margin: '0 auto' }}>

              <div className="card-base" style={{ padding: 32, textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: 16 }}>تجريبي</div>
                <div style={{ fontSize: 40, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 4 }}>مجاني</div>
                <div style={{ fontSize: 12, color: 'var(--color-foreground-muted)', marginBottom: 28 }}>للبدء والتجربة</div>
                {['٣ وظائف مجانية', 'تصفح المرشحين', 'مقابلات ذكية لمرشحيك', 'لوحة تحكم كاملة'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 13, color: 'var(--color-foreground)' }}>
                    <span style={{ color: 'var(--color-success)' }}>✓</span>{f}
                  </div>
                ))}
                <Link href="/auth/login?role=company" className="btn-ghost" style={{ display: 'block', marginTop: 24, textAlign: 'center' }}>ابدأ مجاناً</Link>
              </div>

              <div className="card-base" style={{ padding: 32, textAlign: 'right', borderColor: 'var(--color-primary)', background: 'rgba(200,160,74,.04)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -12, right: '50%', transform: 'translateX(50%)', background: 'linear-gradient(135deg,var(--gold-dk),var(--gold))', color: '#06060e', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                  الأكثر شيوعاً
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 16 }}>بالوظيفة</div>
                <div style={{ fontSize: 40, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 4 }}>
                  199<span style={{ fontSize: 16, color: 'var(--color-foreground-muted)' }}> ريال</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-foreground-muted)', marginBottom: 28 }}>لكل وظيفة منشورة</div>
                {['وظائف غير محدودة', 'تقييم ذكي لكل مرشح', 'نص المقابلة كاملاً', 'واتساب وإيميل مباشر', 'إشعارات فورية'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 13, color: 'var(--color-foreground)' }}>
                    <span style={{ color: 'var(--color-success)' }}>✓</span>{f}
                  </div>
                ))}
                <Link href="/auth/login?role=company" className="btn-gold" style={{ display: 'block', marginTop: 24, textAlign: 'center', justifyContent: 'center' }}>ابدأ الآن</Link>
              </div>

              <div className="card-base" style={{ padding: 32, textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: 16 }}>شهري</div>
                <div style={{ fontSize: 40, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 4 }}>
                  499<span style={{ fontSize: 16, color: 'var(--color-foreground-muted)' }}> ريال</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-foreground-muted)', marginBottom: 28 }}>شهرياً — وظائف غير محدودة</div>
                {['كل مميزات الخطة السابقة', 'وظائف غير محدودة', 'أولوية في الدعم', 'تقارير شهرية'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 13, color: 'var(--color-foreground)' }}>
                    <span style={{ color: 'var(--color-success)' }}>✓</span>{f}
                  </div>
                ))}
                <Link href="/auth/login?role=company" className="btn-ghost" style={{ display: 'block', marginTop: 24, textAlign: 'center' }}>اشترك شهرياً</Link>
              </div>

            </div>
          </div>
        </section>

        <div className="divider"/>

        {/* ══ CTA ══ */}
        <section className="section" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden', padding: '120px 40px' }}>
          <div className="orb" style={{ width: 500, height: 500, background: 'rgba(200,160,74,.06)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 0 }}/>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="eyebrow">ابدأ الآن</span>
            <h2 style={{ fontSize: 'clamp(26px,4vw,52px)', fontWeight: 700, letterSpacing: '-1.5px', color: 'var(--color-foreground)', marginBottom: 16 }}>
              جاهز توظّف بثقة؟
            </h2>
            <p style={{ fontSize: 15, color: 'var(--color-foreground-muted)', maxWidth: 420, margin: '0 auto 44px', lineHeight: 1.85 }}>
              انشر وظيفتك الأولى الآن وشوف الفرق بين سيرة ذاتية وملف مرشح حقيقي.
            </p>
            <Link href="/auth/login?role=company" className="btn-gold" style={{ fontSize: 16 }}>
              انشر وظيفتك — مجاناً
            </Link>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer style={{ padding: '28px 36px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, background: 'var(--color-surface)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <LogoIcon size={34}/>
          <div style={{ width: 1, height: 30, background: 'rgba(200,160,74,0.3)' }}/>
          <LogoText size="sm"/>
        </Link>
        <p style={{ fontSize: 11, color: 'var(--color-foreground-muted)' }}>© {new Date().getFullYear()} نخبة. جميع الحقوق محفوظة.</p>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[['سياسة الخصوصية', '/privacy'], ['الشروط', '/terms'], ['تواصل معنا', '/contact']].map(([l, h]) => (
            <Link key={h} href={h} style={{ fontSize: 11, color: 'var(--color-foreground-muted)', textDecoration: 'none', transition: 'color var(--duration-fast)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-foreground-muted)'}>
              {l}
            </Link>
          ))}
        </div>
      </footer>
    </>
  )
}