'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Contact() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@300;400;600&display=swap');
        body { font-family: 'IBM Plex Sans Arabic', sans-serif; }
      `}</style>

      <Navbar/>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'80px 24px', textAlign:'center' }}>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:'var(--color-primary)', textTransform:'uppercase', marginBottom:16 }}>Contact</p>
        <h1 style={{ fontSize:36, fontWeight:800, color:'var(--color-foreground)', marginBottom:16 }}>تواصل معنا</h1>
        <p style={{ fontSize:16, color:'var(--color-foreground-muted)', lineHeight:1.8, marginBottom:56 }}>
          هل لديك استفسار أو اقتراح أو مشكلة تقنية؟<br/>يسعدنا سماعك والرد عليك خلال 24 ساعة.
        </p>

        {/* Contact Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20, marginBottom:56, textAlign:'right' }}>
          {[
            { icon:'📧', title:'الاستفسارات العامة', value:'info@nukhbahr.com', link:'mailto:info@nukhbahr.com', label:'أرسل رسالة' },
            { icon:'🛠️', title:'الدعم الفني', value:'support@nukhbahr.com', link:'mailto:support@nukhbahr.com', label:'أرسل رسالة' },
            { icon:'⏰', title:'وقت الاستجابة', value:'خلال 24 ساعة', link:null, label:null },
          ].map(c => (
            <div key={c.title} style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:14, padding:24 }}>
              <div style={{ fontSize:28, marginBottom:12 }}>{c.icon}</div>
              <div style={{ fontSize:12, color:'var(--color-foreground-muted)', marginBottom:6 }}>{c.title}</div>
              <div style={{ fontSize:14, color:'var(--color-foreground)', fontWeight:600, marginBottom:c.link?12:0, lineHeight:1.5 }}>{c.value}</div>
              {c.link && (
                <a href={c.link} style={{ fontSize:13, color:'var(--color-primary)', textDecoration:'none', fontWeight:700 }}>{c.label} ←</a>
              )}
            </div>
          ))}
        </div>

        {/* Direct email button */}
        <a href="mailto:info@nukhbahr.com?subject=استفسار من نخبة" className="btn-gold" style={{ display:'inline-flex', padding:'14px 40px', fontSize:16 }}>
          📧 راسلنا الآن
        </a>

        <p style={{ marginTop:24, fontSize:13, color:'var(--color-foreground-muted)' }}>
          للدعم الفني راسلنا على:<br/>
          <a href="mailto:support@nukhbahr.com" style={{ color:'var(--color-primary)', textDecoration:'none' }}>support@nukhbahr.com</a>
        </p>

        <p style={{ marginTop:40, fontSize:14, color:'var(--color-foreground-muted)' }}>
          عندك سؤال عام؟ <Link href="/faq" style={{ color:'var(--color-primary)', textDecoration:'none', fontWeight:700 }}>شوف الأسئلة الشائعة ←</Link>
        </p>
      </div>

      <Footer/>
    </>
  )
}