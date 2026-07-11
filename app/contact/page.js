import Link from 'next/link'

export default function Contact() {
  return (
    <>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#080810;color:#ede8df;font-family:'Tajawal',sans-serif}`}</style>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 40px', height:60, background:'#0e0e1a', borderBottom:'1px solid #252538' }}>
        <Link href="/" style={{ fontSize:20, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', textDecoration:'none' }}>نخبة</Link>
        <Link href="/" style={{ fontSize:13, color:'#7a7690', textDecoration:'none' }}>← الرئيسية</Link>
      </nav>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'80px 24px', textAlign:'center' }}>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:'#c8a04a', textTransform:'uppercase', marginBottom:16 }}>Contact</p>
        <h1 style={{ fontSize:36, fontWeight:800, color:'#f8f5ef', marginBottom:16 }}>تواصل معنا</h1>
        <p style={{ fontSize:16, color:'#7a7690', lineHeight:1.8, marginBottom:56 }}>
          هل لديك استفسار أو اقتراح أو مشكلة تقنية؟<br/>يسعدنا سماعك والرد عليك خلال 24 ساعة.
        </p>

        {/* Contact Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20, marginBottom:56, textAlign:'right' }}>
          {[
            { icon:'📧', title:'البريد الإلكتروني', value:'soonh127@gmail.com', link:'mailto:soonh127@gmail.com', label:'أرسل رسالة' },
            { icon:'⏰', title:'وقت الاستجابة', value:'خلال 24 ساعة', link:null, label:null },
            { icon:'🌍', title:'نخدم', value:'المملكة العربية السعودية والوطن العربي', link:null, label:null },
          ].map(c => (
            <div key={c.title} style={{ background:'#181828', border:'1px solid #252538', borderRadius:14, padding:24 }}>
              <div style={{ fontSize:28, marginBottom:12 }}>{c.icon}</div>
              <div style={{ fontSize:12, color:'#7a7690', marginBottom:6 }}>{c.title}</div>
              <div style={{ fontSize:14, color:'#ede8df', fontWeight:600, marginBottom:c.link?12:0, lineHeight:1.5 }}>{c.value}</div>
              {c.link && (
                <a href={c.link} style={{ fontSize:13, color:'#c8a04a', textDecoration:'none', fontWeight:700 }}>{c.label} ←</a>
              )}
            </div>
          ))}
        </div>

        {/* Direct email button */}
        <a href="mailto:soonh127@gmail.com?subject=استفسار من نخبة" style={{ display:'inline-flex', padding:'14px 40px', borderRadius:10, fontSize:16, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>
          📧 راسلنا الآن
        </a>

        <p style={{ marginTop:24, fontSize:13, color:'#7a7690' }}>
          أو راسلنا مباشرة على:<br/>
          <a href="mailto:soonh127@gmail.com" style={{ color:'#c8a04a', textDecoration:'none' }}>soonh127@gmail.com</a>
        </p>

        {/* FAQ */}
        <div style={{ marginTop:64, textAlign:'right' }}>
          <h2 style={{ fontSize:22, fontWeight:800, color:'#f8f5ef', marginBottom:32, textAlign:'center' }}>أسئلة شائعة</h2>
          {[
            { q:'كيف أبدأ كباحث عن عمل؟', a:'أنشئ حساباً مجانياً ثم ابدأ مقابلتك الذكية — ما تحتاج CV ولا تحضير مسبق.' },
            { q:'كيف تعمل المقابلة الذكية؟', a:'الذكاء الاصطناعي يسألك أسئلة عميقة عن خبراتك وإنجازاتك ويبني ملفك المهني تلقائياً.' },
            { q:'هل الخدمة مجانية؟', a:'المقابلة العامة مجانية. تحميل CV يتطلب رسوماً رمزية. الشركات لها خطط اشتراك مناسبة.' },
            { q:'هل بياناتي آمنة؟', a:'نعم — بياناتك مشفرة ولا تُشارك مع أي جهة بدون موافقتك الصريحة.' },
          ].map(f => (
            <div key={f.q} style={{ marginBottom:24, padding:20, background:'#13131f', borderRadius:12, border:'1px solid #252538' }}>
              <div style={{ fontSize:15, fontWeight:700, color:'#c8a04a', marginBottom:8 }}>{f.q}</div>
              <div style={{ fontSize:14, color:'#7a7690', lineHeight:1.75 }}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ padding:'32px 40px', borderTop:'1px solid #252538', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div style={{ fontSize:16, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة · Nukhba</div>
        <div style={{ display:'flex', gap:20 }}>
          <Link href="/privacy" style={{ fontSize:13, color:'#7a7690', textDecoration:'none' }}>سياسة الخصوصية</Link>
          <Link href="/terms" style={{ fontSize:13, color:'#7a7690', textDecoration:'none' }}>الشروط</Link>
          <Link href="/contact" style={{ fontSize:13, color:'#c8a04a', textDecoration:'none' }}>تواصل معنا</Link>
        </div>
      </footer>
    </>
  )
}