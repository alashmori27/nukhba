'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const C = {
  bg:'#080810', card:'#181828', border:'#252538',
  gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690', success:'#4a9c6e'
}

export default function JobApplied() {
  const router = useRouter()
  const [job, setJob] = useState(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('nukhba_job')
    if (saved) setJob(JSON.parse(saved))
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      <div style={{ fontSize:26, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:36 }}>نخبة</div>

      <div style={{ width:'100%', maxWidth:440, background:C.card, border:`2px solid ${C.success}`, borderRadius:20, padding:'40px 32px', textAlign:'center' }}>

        <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>

        <h2 style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:8 }}>تم إرسال طلبك!</h2>

        {job && (
          <p style={{ fontSize:14, color:C.gold, marginBottom:8, fontWeight:600 }}>
            {job.title} — {job.company_name}
          </p>
        )}

        <p style={{ fontSize:14, color:C.muted, lineHeight:1.85, marginBottom:28 }}>
          تم إرسال طلب تقديمك للشركة. ستتواصل معك مباشرة إذا كنت مناسباً للوظيفة.
        </p>

        <div style={{ background:'#13131f', borderRadius:12, padding:16, marginBottom:28, textAlign:'right' }}>
          {[
            ['✅', 'تم إرسال طلبك للشركة'],
            ['🔔', 'ستتواصل معك الشركة مباشرة'],
            ['📱', 'تابع إشعاراتك في لوحة التحكم'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10, fontSize:13, color:C.text }}>
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <Link href="/candidate/jobs" style={{ display:'block', padding:'12px', borderRadius:10, fontSize:14, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', textDecoration:'none', textAlign:'center' }}>
            تصفح وظائف أخرى ←
          </Link>
          <Link href="/candidate/dashboard" style={{ display:'block', padding:'12px', borderRadius:10, fontSize:13, border:`1px solid ${C.border}`, color:C.muted, textDecoration:'none', textAlign:'center' }}>
            لوحة التحكم
          </Link>
        </div>
      </div>
    </div>
  )
}