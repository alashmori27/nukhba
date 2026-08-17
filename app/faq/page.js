import Link from 'next/link'

export default function FAQ() {
  return (
    <>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#080810;color:#ede8df;font-family:'Tajawal',sans-serif}`}</style>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 40px', height:60, background:'#0e0e1a', borderBottom:'1px solid #252538' }}>
        <Link href="/" style={{ fontSize:20, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', textDecoration:'none' }}>نخبة</Link>
        <Link href="/" style={{ fontSize:13, color:'#7a7690', textDecoration:'none' }}>← الرئيسية</Link>
      </nav>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'80px 24px', textAlign:'center' }}>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:'#c8a04a', textTransform:'uppercase', marginBottom:16 }}>FAQ</p>
        <h1 style={{ fontSize:36, fontWeight:800, color:'#f8f5ef', marginBottom:16 }}>الأسئلة الشائعة</h1>
        <p style={{ fontSize:16, color:'#7a7690', lineHeight:1.8, marginBottom:56 }}>
          كل اللي تحتاج تعرفه عن نخبة كباحث عن عمل.<br/>ما لقيت إجابة سؤالك؟ <Link href="/contact" style={{ color:'#c8a04a', textDecoration:'none' }}>تواصل معنا مباشرة</Link>
        </p>

        <div style={{ textAlign:'right' }}>
          {[
            { q:'كيف أبدأ كباحث عن عمل؟', a:'أنشئ حساباً مجانياً ثم ابدأ مقابلتك الذكية — ما تحتاج CV ولا تحضير مسبق.' },
            { q:'كيف تعمل المقابلة الذكية؟', a:'الذكاء الاصطناعي يسألك أسئلة عميقة عن خبراتك وإنجازاتك ويبني ملفك المهني تلقائياً بعد المحادثة مباشرة.' },
            { q:'هل الخدمة مجانية؟', a:'المقابلة العامة مجانية بالكامل. تحميل CV النهائي يتطلب رسوماً رمزية لمرة واحدة فقط.' },
            { q:'كم تستغرق المقابلة؟', a:'عادة بين 5 إلى 10 دقائق حسب تفاصيل إجاباتك — تقدر تاخذ وقتك، ما فيه عداد زمني يضغطك.' },
            { q:'هل أحتاج سيرة ذاتية جاهزة مسبقاً؟', a:'لا إطلاقاً — كل اللي تحتاجه إنك تتكلم عن نفسك وخبراتك بصوتك، ونحن نبني السيرة الذاتية كاملة من إجاباتك.' },
            { q:'هل أقدر أعدّل ملفي بعد ما يصير جاهز؟', a:'نعم، فيه وضع تعديل كامل تقدر تغيّر فيه أي معلومة قبل ما تحمّل نسختك النهائية.' },
            { q:'بأي صيغة أقدر أحمّل سيرتي الذاتية؟', a:'تقدر تحمّلها بصيغة Word، أو نسخة صورة، أو نسخة خاصة متوافقة مع أنظمة الفرز الآلي (ATS) اللي تستخدمها الشركات الكبرى.' },
            { q:'هل ملفي يصل تلقائياً للشركات؟', a:'ملفك يصير متاحاً للشركات المسجّلة بالمنصة بمجرد اكتمال مقابلتك، وتقدر أيضاً تتقدّم بنفسك على وظائف محددة معروضة.' },
            { q:'هل بياناتي آمنة؟', a:'نعم — بياناتك مشفّرة بالكامل ولا تُشارك مع أي جهة خارج المنصة بدون موافقتك الصريحة.' },
            { q:'هل أقدر أسوي أكثر من مقابلة؟', a:'نعم، تقدر تسوي مقابلة عامة لبناء ملفك الأساسي، وكمان مقابلات مخصصة لكل وظيفة تتقدّم عليها.' },
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
          <Link href="/contact" style={{ fontSize:13, color:'#7a7690', textDecoration:'none' }}>تواصل معنا</Link>
        </div>
      </footer>
    </>
  )
}