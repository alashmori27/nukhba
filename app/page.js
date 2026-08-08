'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { LogoIcon, LogoText } from '@/components/brand'
import { useState, useEffect } from 'react'

export default function Home() {
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  function copyLinkedIn() {
    navigator.clipboard.writeText('نخبة · nukhbahr.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@300;400;600&display=swap');

        .nukhba-page {
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }

        .f1 { animation: fadeUp var(--duration-slow) var(--easing-standard) both .05s; }
        .f2 { animation: fadeUp var(--duration-slow) var(--easing-standard) both .15s; }
        .f3 { animation: fadeUp var(--duration-slow) var(--easing-standard) both .25s; }
        .f4 { animation: fadeUp var(--duration-slow) var(--easing-standard) both .38s; }
        .f5 { animation: fadeUp var(--duration-slow) var(--easing-standard) both .5s; }

        .orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
          z-index: 1;
        }

        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.12;
          z-index: 0;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(8,8,16,0.3) 0%,
            rgba(8,8,16,0.1) 40%,
            rgba(8,8,16,0.6) 100%
          );
          z-index: 1;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .btn-gold {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--gold-dk), var(--gold));
          color: #06060e; font-size: 15px; font-weight: 700;
          text-decoration: none; font-family: inherit;
          box-shadow: var(--shadow-gold);
          transition: filter var(--duration-fast) var(--easing-standard),
                      transform var(--duration-fast) var(--easing-standard);
          cursor: pointer; border: none;
        }
        .btn-gold:hover  { filter: brightness(1.1); transform: translateY(-2px); }
        .btn-gold:active { transform: translateY(0); }
        .btn-gold:focus-visible { outline: 2px solid var(--color-ring); outline-offset: 3px; }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border-radius: var(--radius-md);
          border: 1px solid rgba(255,255,255,0.15);
          color: var(--color-foreground-muted); font-size: 15px; font-weight: 500;
          text-decoration: none; font-family: inherit; background: rgba(255,255,255,0.04);
          backdrop-filter: blur(8px);
          transition: border-color var(--duration-fast), color var(--duration-fast), transform var(--duration-fast);
          cursor: pointer;
        }
        .btn-ghost:hover { border-color: var(--color-primary); color: var(--color-primary); transform: translateY(-2px); }
        .btn-ghost:focus-visible { outline: 2px solid var(--color-ring); outline-offset: 3px; }

        .card-base {
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          transition: border-color var(--duration-base) var(--easing-standard),
                      transform var(--duration-base) var(--easing-standard),
                      box-shadow var(--duration-base) var(--easing-standard);
        }
        .card-base:hover {
          border-color: var(--color-border-strong);
          transform: translateY(-3px);
          box-shadow: var(--shadow-gold);
        }

        .step-card {
          background: var(--color-surface);
          padding: 28px 20px;
          position: relative;
          transition: background var(--duration-base), transform var(--duration-base);
        }
        .step-card:hover { background: var(--color-surface-elevated); transform: translateY(-2px); }

        .section { padding: 96px 40px; }
        .section-alt { padding: 96px 40px; background: var(--color-surface); }

        .eyebrow {
          font-family: 'Cormorant Garamond', serif;
          font-size: 11px; letter-spacing: 5px;
          color: var(--color-primary); text-transform: uppercase;
          margin-bottom: 14px; display: block;
        }

        .grid-5 { display: grid; grid-template-columns: repeat(5,1fr); gap: 1px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .gold-text {
          background: linear-gradient(135deg, var(--gold-dk), var(--gold), var(--gold-lt));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent);
        }

        .pulse-dots { display: flex; gap: 4px; align-items: center; }
        .pulse-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--color-primary);
          animation: pulse-dot 1.4s ease-in-out infinite;
        }
        .pulse-dot:nth-child(2) { animation-delay: .2s; }
        .pulse-dot:nth-child(3) { animation-delay: .4s; }

        a:focus-visible, button:focus-visible {
          outline: 2px solid var(--color-ring);
          outline-offset: 3px;
          border-radius: 4px;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            transition-duration: 0.001ms !important;
          }
          .hero-video { display: none; }
        }

        @media (max-width: 768px) {
          .grid-5 { grid-template-columns: 1fr; }
          .grid-3 { grid-template-columns: 1fr; }
          .grid-2 { grid-template-columns: 1fr; }
          .section, .section-alt { padding: 64px 20px; }
          .hide-sm { display: none !important; }
          .hero-title { font-size: clamp(34px, 8vw, 56px) !important; }
          .btn-row { flex-direction: column; align-items: stretch; }
          .btn-row a { text-align: center; justify-content: center; }
        }
      `}</style>

      <Navbar />

      <div className="nukhba-page">

        {/* ══ HERO ══ */}
        <section style={{ minHeight: '96vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 24px 80px', position: 'relative', overflow: 'hidden' }}>

          {/* فيديو الخلفية */}
          <video className="hero-video" autoPlay loop muted playsInline>
            <source src="/hero-bg.mp4" type="video/mp4"/>
          </video>

          {/* Overlay لضمان قراءة النص */}
          <div className="hero-overlay"/>

          {/* Orbs فوق الفيديو */}
          <div className="orb" style={{ width: 600, height: 600, background: 'rgba(200,160,74,.06)', top: '20%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'glow 6s ease-in-out infinite' }}/>
          <div className="orb" style={{ width: 280, height: 280, background: 'rgba(200,160,74,.04)', top: '65%', right: '8%', animation: 'float 9s ease-in-out infinite' }}/>

          {/* المحتوى */}
          <div className="hero-content">

            {/* Badge */}
            <div className="f1" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(200,160,74,.08)', border: '1px solid rgba(200,160,74,.25)', padding: '6px 16px', borderRadius: 24, marginBottom: 32, backdropFilter: 'blur(8px)' }}>
              <div className="pulse-dots">
                <div className="pulse-dot"/>
                <div className="pulse-dot"/>
                <div className="pulse-dot"/>
              </div>
              <span style={{ fontSize: 11, color: 'var(--color-primary)', letterSpacing: 4, fontFamily: "'Cormorant Garamond', serif", textTransform: 'uppercase' }}>
                منصة التوظيف الذكي · Saudi Arabia
              </span>
            </div>

            {/* Headline */}
            <h1 className="f2 hero-title" style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-1.5px', color: 'var(--color-foreground)', marginBottom: 24, maxWidth: 800 }}>
              وظيفتك لا تبدأ بـ{' '}
              <span className="gold-text">CV</span>
            </h1>

            {/* Sub */}
            <p className="f3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(17px, 2.5vw, 22px)', fontWeight: 300, fontStyle: 'italic', color: 'var(--color-foreground-muted)', marginBottom: 40, maxWidth: 500, lineHeight: 1.7 }}>
              مقابلة ذكية واحدة تبني ملفك المهني وتفتح أبواب الشركات
            </p>

            {/* CTAs */}
            <div className="f4 btn-row" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
              <Link href="/auth/login" className="btn-gold">ابدأ مقابلتك المجانية ←</Link>
              <Link href="/analyze-cv" className="btn-ghost">حلّل سيرتي الذاتية</Link>
            </div>

            <p className="f4" style={{ fontSize: 12, color: 'var(--color-foreground-muted)', marginBottom: 72 }}>
              المقابلة مجانية · لن تدفع حتى ترى النتيجة
            </p>

            {/* Stats */}
            <div className="f5" style={{ display: 'flex', gap: 56, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[['٦', 'محاور تقييم'], ['٣٩', 'ريال فقط'], ['٢', 'لغة للـ CV']].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 600, color: 'var(--color-primary)', lineHeight: 1, marginBottom: 6 }}>{s[0]}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-foreground-muted)', letterSpacing: '.5px' }}>{s[1]}</div>
                </div>
              ))}
            </div>

          </div>
        </section>

        <div className="divider"/>

        {/* ══ كيف تعمل ══ */}
        <section className="section-alt">
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <span className="eyebrow">كيف تعمل نخبة؟</span>
              <h2 style={{ fontSize: 'clamp(22px, 4vw, 38px)', fontWeight: 700, letterSpacing: '-1px', color: 'var(--color-foreground)', maxWidth: 480 }}>
                من الصفر إلى وظيفة في خمس خطوات
              </h2>
            </div>
            <div className="grid-5" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--color-border)' }}>
              {[
                { num: '01', icon: '🎙️', title: 'مقابلة مجانية', desc: 'الذكاء الاصطناعي يكتشف خبراتك وشخصيتك.' },
                { num: '02', icon: '🧠', title: 'تحليل عميق', desc: 'تقييم موضوعي من 100 لنقاط قوتك.' },
                { num: '03', icon: '📄', title: 'ملفك جاهز', desc: 'CV عربي وإنجليزي + محتوى LinkedIn.' },
                { num: '04', icon: '🏢', title: 'نشر للشركات', desc: 'ملفك يصل تلقائياً بدون وسيط.' },
                { num: '05', icon: '🚀', title: 'الفرص تجيك', desc: 'الشركات تتواصل معك مباشرة.' },
              ].map((c, i) => (
                <div key={c.num} className="step-card">
                  {i < 4 && <div className="hide-sm" style={{ position: 'absolute', top: '50%', right: -1, transform: 'translateY(-50%)', color: 'var(--color-border)', fontSize: 16, zIndex: 1 }}>›</div>}
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: 'var(--color-primary)', opacity: .2, lineHeight: 1, marginBottom: 14 }}>{c.num}</div>
                  <div style={{ fontSize: 24, marginBottom: 12 }}>{c.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 6 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-foreground-muted)', lineHeight: 1.75 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider"/>

        {/* ══ القيمة ══ */}
        <section className="section">
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow">القيمة الكاملة</span>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 38px)', fontWeight: 700, letterSpacing: '-1px', color: 'var(--color-foreground)', marginBottom: 12 }}>
              مقابلة واحدة — ثلاثة مخرجات
            </h2>
            <p style={{ fontSize: 15, color: 'var(--color-foreground-muted)', marginBottom: 12, lineHeight: 1.8 }}>
              ابدأ مجاناً · شاهد النتيجة · ادفع إذا أعجبتك
            </p>
            <p style={{ fontSize: 13, color: 'var(--color-primary)', marginBottom: 56, fontWeight: 600 }}>
              ٣٩ ريال · دفعة واحدة · لا اشتراك
            </p>
            <div className="grid-3" style={{ maxWidth: 800, margin: '0 auto 48px' }}>
              {[
                { icon: '📄', color: 'var(--color-primary)', title: 'CV احترافي', desc: 'عربي وإنجليزي — PDF و Word جاهزان للتحميل الفوري.' },
                { icon: '🏢', color: 'var(--color-success)', title: 'نشر للشركات', desc: 'ملفك يصل للشركات تلقائياً — تواصل مباشر بدون وسيط.' },
                { icon: '💼', color: '#0077b5', title: 'محتوى LinkedIn', desc: 'عنوان احترافي ونبذة مميزة جاهزة للصق فوراً.' },
              ].map(c => (
                <div key={c.title} className="card-base" style={{ padding: '24px 20px', textAlign: 'right' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>{c.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 6 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-foreground-muted)', lineHeight: 1.75 }}>{c.desc}</div>
                </div>
              ))}
            </div>
            <Link href="/auth/login" className="btn-gold">ابدأ مجاناً — ادفع بعد المقابلة ←</Link>
          </div>
        </section>

        <div className="divider"/>

        {/* ══ مقارنة ══ */}
        <section className="section-alt">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="eyebrow">المقارنة</span>
              <h2 style={{ fontSize: 'clamp(22px, 4vw, 38px)', fontWeight: 700, letterSpacing: '-1px', color: 'var(--color-foreground)' }}>
                نخبة مقابل الطريقة التقليدية
              </h2>
            </div>
            <div className="grid-2">
              <div className="card-base" style={{ padding: '28px 24px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--color-border)' }}>
                  الطريقة التقليدية
                </div>
                {['CV لا يعبر عنك', 'تقديم أعمى بدون تقييم', 'لا تعرف سبب الرفض', 'LinkedIn فارغ وبلا محتوى', 'انتظار بدون رد'].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 13, color: 'var(--color-foreground-muted)' }}>
                    <span style={{ color: 'var(--color-destructive)', fontSize: 11, flexShrink: 0 }}>✕</span>{i}
                  </div>
                ))}
              </div>
              <div className="card-base" style={{ padding: '28px 24px', borderColor: 'var(--color-border-strong)', background: 'rgba(200,160,74,.03)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--color-border-strong)' }}>
                  مع نخبة ✨
                </div>
                {['مقابلة تكشف قيمتك الحقيقية', 'تقييم موضوعي من 100', 'تعرف نقاط قوتك بالتفصيل', 'LinkedIn جاهز تلقائياً', 'الشركات تتواصل معك أنت'].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 13, color: 'var(--color-foreground)' }}>
                    <span style={{ color: 'var(--color-success)', fontSize: 11, flexShrink: 0 }}>✓</span>{i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="divider"/>

        {/* ══ CTA النهائي ══ */}
        <section className="section" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden', padding: '120px 40px' }}>
          <div className="orb" style={{ width: 500, height: 500, background: 'rgba(200,160,74,.06)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 0 }}/>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="eyebrow">ابدأ الآن</span>
            <h2 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 700, letterSpacing: '-2px', color: 'var(--color-foreground)', marginBottom: 16, lineHeight: 1.08 }}>
              جاهز لتكتشف قيمتك؟
            </h2>
            <p style={{ fontSize: 16, color: 'var(--color-foreground-muted)', maxWidth: 380, margin: '0 auto 12px', lineHeight: 1.8 }}>
              ابدأ مجاناً — ادفع فقط إذا أعجبك الناتج.
            </p>
            <p style={{ fontSize: 13, color: 'var(--color-primary)', marginBottom: 40, fontWeight: 600 }}>
              ٣٩ ريال · لا اشتراك · لا تجديد تلقائي
            </p>
            <div className="btn-row" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/login" className="btn-gold">ابدأ مقابلتك المجانية ←</Link>
              <Link href="/analyze-cv" className="btn-ghost">حلّل سيرتي الذاتية</Link>
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-foreground-muted)', marginTop: 16 }}>
              المقابلة مجانية تماماً · لا بطاقة ائتمان
            </p>
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
          {[['للشركات', '/for-companies'], ['الخصوصية', '/privacy'], ['الشروط', '/terms'], ['تواصل', '/contact']].map(([l, h]) => (
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