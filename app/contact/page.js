'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function FAQ() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@300;400;600&display=swap');
        body { font-family: 'IBM Plex Sans Arabic', sans-serif; }
      `}</style>

      <Navbar/>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'80px 24px', textAlign:'center' }}>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:'var(--color-primary)', textTransform:'uppercase', marginBottom:16 }}>FAQ</p>
        <h1 style={{ fontSize:36, fontWeight:800, color:'var(--color-foreground)', marginBottom:16 }}>الأسئلة الشائعة</h1>
        <p style={{ fontSize:16, color:'var(--color-foreground-muted)', lineHeight:1.8, marginBottom:56 }}>
          كل اللي تحتاج تعرفه عن نخبة كباحث عن عمل.<br/>ما لقيت إجابة سؤالك؟ <Link href="/contact" style={{ color:'var(--color-primary)', textDecoration:'none' }}>تواصل معنا مباشرة</Link>
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
            <div key={f.q} style={{ marginBottom:24, padding:20, background:'var(--color-surface)', borderRadius:12, border:'1px solid var(--color-border)' }}>
              <div style={{ fontSize:15, fontWeight:700, color:'var(--color-primary)', marginBottom:8 }}>{f.q}</div>
              <div style={{ fontSize:14, color:'var(--color-foreground-muted)', lineHeight:1.75 }}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>

      <Footer/>
    </>
  )
}